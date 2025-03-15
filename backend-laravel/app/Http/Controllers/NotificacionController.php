<?php

namespace App\Http\Controllers;

use App\Models\Notificacione;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function getNotificaciones()
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $notificaciones = $user->notificaciones()->get();

        return response()->json([
            'notificaciones' => $notificaciones
        ], 200);
    }

    public function deleteNotificacion($notificacionId)
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $notificacion = Notificacione::where('id', $notificacionId)
        ->where('user_id', $user->id)
        ->first();

        if(!$notificacion) {
            return response()->json([
                'message' => 'No se encontro la notificacion'
            ], 404);
        }

        $notificacion->delete();

        return response()->json([
            'message' => 'Notificacion eliminada correctamente'
        ], 200);
    }

    public function marcarComoLeidas()
    {
        $user = auth()->user();
    
        $user->notificaciones()->where('leida', false)->update(['leida' => true]);
    
        return response()->json(['message' => 'Todas las notificaciones han sido marcadas como leídas']);

    }
}
