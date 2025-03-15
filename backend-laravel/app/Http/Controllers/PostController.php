<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{

    public function index()
    {
        $posts = Post::with('comentarios.user')->get();

        if($posts->isEmpty()) {
            return response()->json([
                'message' => 'Aun nadie ha publicado nada'
            ], 404);
        }

        return response()->json([
            'posts' => $posts
        ], 200);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'Debes estar autenticado para publicar'
            ], 401);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|min:1|max:150',
            'comentario' => 'required|string|min:1|max:255',
        ]);

        $post = Post::create([
            'titulo' => $validated['titulo'],
            'comentario' => $validated['comentario'],
            'user_id' => auth()->id()
        ]);

        return response()->json($post, 201);
    }

    public function destroy($postId)
    {

        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $findPost = Post::find($postId);

        if($findPost->user_id !== $user->id) {
            return response()->json([
                'message' => 'No tienes permiso al eliminar este post'
            ], 403);
        }

        if(!$findPost) {
            return response()->json([
                'message' => 'No se encuentra el post'
            ], 404);
        }

        $findPost->delete();

        return response()->json([
            'message' => 'Post eliminado correctamente'
        ], 200);
    }
}
