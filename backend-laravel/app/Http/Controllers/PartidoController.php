<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Partido;
use Illuminate\Http\Request;

class PartidoController extends Controller
{
    public function crearDesafio(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        if ($user->role !== 'leader') {
            return response()->json(['message' => 'No sos lider del equipo'], 403);
        }

        $request->validate([
            'equipo_visitante_id' => 'required|exists:equipos,id'
        ]);

        $equipoLocal = Equipo::where('leader_id', $user->id)->first();

        if (!$equipoLocal) {
            return response()->json(['message' => 'No sos el lider de ningún equipo'], 403);
        }

        $equipoVisitante = Equipo::find($request->equipo_visitante_id);

        if (!$equipoVisitante) {
            return response()->json(['message' => 'Equipo visitante no encontrado'], 404);
        }

        //Notificacion -----
        $equipoVisitanteLeader = $equipoVisitante->leader;
        $equipoVisitanteLeader->notificaciones()->create([
            'tipo' => 'desafio',
            'mensaje' => "El equipo {$equipoLocal->nombre} ha desafiado a tu equipo {$equipoVisitante->nombre}.",
            'leida' => false
        ]);

        // -------

        $partido = Partido::create([
            'equipo_local_id' => $equipoLocal->id,
            'equipo_visitante_id' => $equipoVisitante->id,
            'status' => 'pendiente'
        ]);

        return response()->json([
            'message' => 'Desafío creado correctamente',
            'partido' => $partido
        ], 201);
    }

    public function gestionarDesafio(Request $request, $partidoId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        if ($user->role !== 'leader') {
            return response()->json(['message' => 'No sos lider del equipo'], 403);
        }

        $partido = Partido::find($partidoId);

        if (!$partido) {
            return response()->json(['message' => 'Partido no encontrado'], 404);
        }

        if ($user->id !== Equipo::find($partido->equipo_visitante_id)->leader_id) {
            return response()->json(['message' => 'No eres el líder del equipo visitante'], 403);
        }

        $request->validate([
            'status' => 'required|in:aceptado,rechazado'
        ]);

        if ($request->status === "rechazado") {
            $partido->delete();
            return response()->json(['message' => 'Desafío rechazado y eliminado']);
        }

        $partido->status = $request->status;
        $partido->save();

        return response()->json([
            'message' => 'Respondiste la solicitud de partido',
            'partido' => $partido
        ]);
    }

    public function getDesafiosPendientes()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $equipos = $user->equipos()->select('equipos.id')->pluck('id');

        $partidosPendientes = Partido::whereIn('equipo_local_id', $equipos)
            ->orWhereIn('equipo_visitante_id', $equipos)
            ->where('status', 'pendiente')
            ->get();

        return response()->json([
            'partidos' => $partidosPendientes
        ], 200);
    }

    public function getDesafiosAceptados()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $equipos = $user->equipos()->pluck('equipos.id');

        $partidosAceptados = Partido::where(function ($query) use ($equipos) {
            $query->whereIn('equipo_local_id', $equipos)
                ->orWhereIn('equipo_visitante_id', $equipos);
        })
            ->where('status', 'aceptado')
            ->get();

        if ($partidosAceptados->isEmpty()) {
            return response()->json([
                'message' => 'Aún no has aceptado desafíos contra otros equipos'
            ], 404);
        }


        return response()->json([
            'message' => 'Estos son los partidos aceptados',
            'partidos' => $partidosAceptados
        ], 200);
    }
}
