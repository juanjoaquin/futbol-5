<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\JugadorEquipo;
use App\Models\Solicitud;
use App\Models\User;
use Illuminate\Http\Request;

class JugadorController extends Controller
{
    public function solicitarUnirse(Request $request, $equipoId)
    {
        $user = auth()->user();
    
        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }
    
        $equipo = EquipO::find($equipoId);
    
        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }
    
        $jugadoresCount = JugadorEquipo::where('equipo_id', $equipoId)->count();
    
        if ($jugadoresCount >= $equipo->maximo_jugadores) {
            $equipo->update(['status' => 'no disponible']);
    
            return response()->json(['message' => 'El equipo ha alcanzado su máximo de jugadores y ya no está disponible'], 400);
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
    
        $equipoLeader = $equipo->leader;
        $equipoLeader->notificaciones()->create([
            'tipo' => 'solicitud_unirse',
            'mensaje' => "El usuario {$user->name} ha solicitado unirse a tu equipo {$equipo->nombre}.",
            'leida' => false
        ]);
    
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

    public function responderInvitacion(Request $request, $solicitudId)
{
    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'Usuario no autenticado'], 401);
    }

    $solicitud = Solicitud::find($solicitudId);

    if (!$solicitud) {
        return response()->json(['message' => 'Solicitud no encontrada'], 404);
    }

    if ($solicitud->user_id !== $user->id) {
        return response()->json(['message' => 'No tienes permiso para responder esta invitación'], 403);
    }

    if (!in_array($request->status, ['aceptada', 'rechazada'])) {
        return response()->json(['message' => 'Estado inválido'], 400);
    }

    $solicitud->status = $request->status;
    $solicitud->save();

    if ($request->status === 'aceptada') {
        $equipo = Equipo::find($solicitud->equipo_id);

        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }

        $totalJugadores = JugadorEquipo::where('equipo_id', $equipo->id)->count();

        if ($totalJugadores >= $equipo->maximo_jugadores) {
            return response()->json(['message' => 'El equipo ya está completo'], 400);
        }

        JugadorEquipo::create([
            'user_id' => $solicitud->user_id,
            'equipo_id' => $solicitud->equipo_id
        ]);

        return response()->json(['message' => 'Te has unido al equipo exitosamente'], 200);
    }

    if ($request->status === 'rechazada') {
        $solicitud->delete();
        return response()->json(['message' => 'Has rechazado la invitación'], 200);
    }

    return response()->json(['message' => 'Solicitud procesada correctamente'], 200);
}
    

    // public function responderInvitacion(Request $request, $solicitudId)
    // {
    //     $user = auth()->user();

    //     if (!$user) {
    //         return response()->json(['message' => 'User not authenticated'], 401);
    //     }

    //     $solicitud = Solicitud::find($solicitudId);

    //     if (!$solicitud) {
    //         return response()->json(['message' => 'Solicitud no encontrada'], 404);
    //     }

    //     $equipo = Equipo::find($solicitud->equipo_id);

    //     if ($equipo->leader_id !== $user->id) {
    //         return response()->json(['message' => 'No eres el líder del equipo'], 403);
    //     }

    //     if (!in_array($request->status, ['aceptada', 'rechazada'])) {
    //         return response()->json(['message' => 'Estado inválido'], 400);
    //     }

    //     $solicitud->status = $request->status;
    //     $solicitud->save();

    //     if ($solicitud->status === 'aceptada') {
    //         $totalJugadores = JugadorEquipo::where('equipo_id', $equipo->id)->count();
    //         if ($totalJugadores >= $equipo->maximo_jugadores) {
    //             return response()->json(['message' => 'El equipo ya está completo'], 400);
    //         }

    //         JugadorEquipo::create([
    //             'user_id' => $solicitud->user_id,
    //             'equipo_id' => $solicitud->equipo_id
    //         ]);
    //     }

    //     if ($solicitud->status === 'rechazada') {
    //         $solicitud->delete();
    //         return response()->json(['message' => 'Solicitud rechazada y eliminada'], 200);
    //     }

    //     return response()->json(['message' => 'Solicitud procesada correctamente'], 200);
    // }



    public function listarJugadoresLibres()
    {
        $jugadoresLibres = User::whereDoesntHave('jugadorEquipos')->get();

        if ($jugadoresLibres->isEmpty()) {
            return response()->json(['message' => 'No se encuentran jugadores libres'], 404);
        }

        return response()->json([
            'jugadores_libres' => $jugadoresLibres
        ], 200);
    }
}
