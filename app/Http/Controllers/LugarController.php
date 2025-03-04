<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Lugar;
use Illuminate\Http\Request;

class LugarController extends Controller
{
    public function crearLugar(Request $request)
    {
        $user = auth()->user();
    
        if ($user->role !== 'leader') {
            return response()->json([
                'message' => 'No sos el lider del grupo, no podes crear un lugar'
            ], 403);
        }
    
        $request->validate([
            'lugar' => 'required|string|max:200',
            'dia' => 'required|string|max:200',
            'horario' => 'required|string|max:200'
        ]);
    
        $equipo = Equipo::where('leader_id', $user->id)->first();
    
        if (!$equipo) {
            return response()->json([
                'message' => 'El usuario no pertenece a ningún equipo'
            ], 404);
        }
    
        $lugar = Lugar::create([
            'lugar' => $request->lugar,
            'dia' => $request->dia,
            'horario' => $request->horario,
            'leader_id' => $user->id,
            'equipo_id' => $equipo->id  
        ]);
    
        return response()->json([
            'message' => 'Lugar creado correctamente',
            'lugar' => $lugar
        ], 201);
    }

    
    public function getLugaresByEquipoId($equipoId) 
    {
        $equipo = Equipo::find($equipoId);

        if(!$equipo) {
            return response()->json([
                'message' => 'Equipo no encontrado'
            ], 404);
        }

        $lugarByEquipo = Lugar::where('equipo_id', $equipoId)->get();

        if ($lugarByEquipo->isEmpty()) {
            return response()->json([
                'message' => 'No hay lugares asociados a este equipo'
            ], 404);
        }
        return response()->json([
            'lugar' => $lugarByEquipo
        ], 200);
    }
}
