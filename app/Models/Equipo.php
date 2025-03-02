<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function jugadores()
    {
        return $this->hasMany(JugadorEquipo::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function partidosLocal()
    {
        return $this->hasMany(Partido::class, 'equipo_local_id');
    }

    public function partidosVistante()
    {
        return $this->hasMany(Partido::class, 'equipo_visitante_id');
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }
}
