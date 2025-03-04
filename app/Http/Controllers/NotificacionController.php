<?php

namespace App\Http\Controllers;

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
}
