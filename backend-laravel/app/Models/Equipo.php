<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    use HasFactory;

    protected $guarded = [];

    
    public function jugadores()
    {
        return $this->belongsToMany(User::class, 'jugador_equipos', 'equipo_id', 'user_id')
            ->select(['users.id', 'users.name', 'users.email']); // Select only the fields you need
    }
    
    public function jugadorEquipos()
    {
        return $this->hasMany(JugadorEquipo::class, 'equipo_id');
    }


    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
