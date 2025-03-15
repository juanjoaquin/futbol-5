<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Solicitud;
use Illuminate\Http\Request;

class SolicitudController extends Controller
{
    public function getSolicitudes()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado'
            ], 401);
        }

        $solicitudes = Solicitud::where('user_id', $user->id)
            ->where('status', 'pendiente')
            ->with('equipo')
            ->get(['id', 'equipo_id', 'created_at']);


        $solicitudes->each(function ($solicitud) {
            $solicitud->equipo_nombre = $solicitud->equipo->nombre;
            unset($solicitud->equipo);
        });

        if ($solicitudes->isEmpty()) {
            return response()->json([
                'message' => 'No tienes solicitudes'
            ], 404);
        }

        return response()->json([
            'solicitudes' => $solicitudes
        ], 200);
    }

    public function getSolicitudesRecibidas()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Debes estar autenticado'], 401);
        }

        $equipos = Equipo::where('leader_id', $user->id)->pluck('id');


        $solicitudes = Solicitud::whereIn('equipo_id', $equipos)
            ->where('status', 'pendiente')
            ->with('user') 
            ->get();

        $solicitudes->each(function ($solicitud) {
            $solicitud->equipo_nombre = $solicitud->equipo->nombre;
            unset($solicitud->equipo);
        });

        if ($solicitudes->isEmpty()) {
            return response()->json(['message' => 'No tienes solicitudes pendientes'], 404);
        }

        return response()->json([
            'solicitudes' => $solicitudes
        ], 200);
    }
}
