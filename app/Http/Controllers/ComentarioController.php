<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'No estás autenticado'], 401);
        }

        $validated = $request->validate([
            'contenido' => 'required|string|min:1|max:255',
            'post_id' => 'required|exists:posts,id',
            'parent_id' => 'nullable|exists:comentarios,id'
        ]);

        $comentario = Comentario::create([
            'contenido' => $validated['contenido'],
            'user_id' => $user->id,
            'post_id' => $validated['post_id'],
            'parent_id' => $validated['parent_id'] ?? null
        ]);

        return response()->json([
            'message' => 'Comentario creado con exito',
            'comentario' => $comentario
        ], 201);
    }
}
