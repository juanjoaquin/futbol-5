<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\JugadorEquipo;
use App\Models\Solicitud;
use Illuminate\Http\Request;

class JugadorController extends Controller
{
    public function solicitarUnirse(Request $request, $equipoId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $equipo = Equipo::find($equipoId);

        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }

        $existeJugador = JugadorEquipo::where('user_id', $user->id)
            ->where('equipo_id', $equipoId)
            ->exists();

        if ($existeJugador) {
            return response()->json(['message' => 'Ya eres miembro de este equipo'], 400);
        }

        $existeSolicitudPendiente = Solicitud::where('user_id', $user->id)
            ->where('equipo_id', $equipoId)
            ->where('status', 'pendiente')
            ->exists();


        if ($existeSolicitudPendiente) {
            return response()->json(['message' => 'Ya has solicitado unirte a este equipo'], 400);
        }

        //Notificacion ------
        $equipoLeader = $equipo->leader;
        $equipoLeader->notificaciones()->create([
            'tipo' => 'solicitud_unirse',
            'mensaje' => "El usuario {$user->name} ha solicitado unirse a tu equipo {$equipo->nombre}."
        ]);

        // -------

        $solicitud = Solicitud::create([
            'user_id' => $user->id,
            'equipo_id' => $equipoId,
            'status' => 'pendiente'
        ]);

        return response()->json([
            'message' => 'Solicitud enviada correctamente',
            'solicitud' => $solicitud
        ], 201);
    }
}
