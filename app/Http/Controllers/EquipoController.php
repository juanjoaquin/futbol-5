<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\JugadorEquipo;
use App\Models\Solicitud;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\auth;

class EquipoController extends Controller
{


    public function index()
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'Users not found'
            ], 404);
        }

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function traerEquipos()
    {
        $equipos = Equipo::all();

        if ($equipos->isEmpty()) {
            return response()->json([
                'message' => 'Equipos not found'
            ], 404);
        }

        return response()->json([
            'equipos' => $equipos
        ], 200);
    }


    public function crearEquipo(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['User not authenticated'], 401);
        }

        $request->validate([
            'nombre' => 'required|string|max:50',
            'maximo_jugadores' => 'required|integer|min:1|max:5',
            'path_image' => 'nullable|string|min:1|max:255'
        ]);

        $equipo = Equipo::create([
            'nombre' => $request->nombre,
            'leader_id' => $user->id,
            'maximo_jugadores' => $request->maximo_jugadores,
            'path_image' => $request->path_image
        ]);

        JugadorEquipo::create([
            'user_id' => $user->id,
            'equipo_id' => $equipo->id
        ]);

        $user->update(['role' => 'leader']);

        return response()->json([
            'message' => 'Equipo creado correctamente',
            'equipo' => $equipo
        ], 201);
    }

    public function verSolicitudes($equipoId)
    {
        $equipo = Equipo::find($equipoId);

        // Verificar si el equipo existe y si el usuario es líder
        if (!$equipo || auth()->user()->id !== $equipo->leader_id) {
            return response()->json(['message' => 'Acceso denegado o equipo no encontrado'], 403);
        }

        $solicitudes = Solicitud::where('equipo_id', $equipoId)
            ->where('status', 'pendiente')
            ->get();

        return response()->json(['solicitudes' => $solicitudes]);
    }

    public function gestionarSolicitud(Request $request, $equipoId, $solicitudId)
    {
        $equipo = Equipo::find($equipoId);
        $solicitud = Solicitud::find($solicitudId);

        if (!$equipo || auth()->user()->id !== $equipo->leader_id) {
            return response()->json([
                'message' => 'Acceso denegado, o equipo no encontrado'
            ], 403);
        }

        if (!$solicitud) {
            return response()->json([
                'message' => 'Solicitud no encontrada'
            ], 404);
        }

        $maximoJugadores = JugadorEquipo::where('equipo_id', $equipoId)->count();
        if ($maximoJugadores >= $equipo->maximo_jugadores) {
            return response()->json([
                'message' => 'El equipo ya está completo'
            ], 400);
        }

        $solicitud->status = $request->status;
        $solicitud->save();

        if ($solicitud->status === 'aceptada') {
            JugadorEquipo::create([
                'user_id' => $solicitud->user_id,
                'equipo_id' => $equipoId
            ]);
        }

        return response()->json([
            'message' => 'Solicitud aceptada'
        ], 200);
    }

    public function obtenerEquiposConJugadores()
    {
        $equipos = Equipo::with('jugadores.user')->get();

        if(!$equipos) {
            return response()->json(['message' => 'Equipo sin jugadores'], 404);
        }

        return response()->json([
            'equipos' => $equipos
        ]);
    }

    public function salirDelEquipo($equipoId)
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $equipo = Equipo::find($equipoId);

        if(!$equipo) {
            return response()->json([
                'message' => 'Equipo no encontrado'
            ], 404);
        }

        if($equipo->leader_id === $user->id) {
            return response()->json([
                'message' => 'El líder no puede abandonar el equipo'
            ], 403);
        }

        $jugadorEquipo = JugadorEquipo::where('user_id', $user->id)
        ->where('equipo_id', $equipoId)
        ->first();

        if(!$jugadorEquipo) {
            return response()->json([
                'message' => 'No perteneces a este equipo'
            ], 403);
        }

        $jugadorEquipo->delete();

        return response()->json([
            'message' => 'Abandonaste el grupo correctamente'
        ], 200);
    }
}
