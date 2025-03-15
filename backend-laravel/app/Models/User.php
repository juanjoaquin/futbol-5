<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */



    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    public function equipos()
    {
        return $this->belongsToMany(Equipo::class, 'jugador_equipos', 'user_id', 'equipo_id');
    }

    public function jugadorEquipos()
    {
        return $this->hasOne(JugadorEquipo::class, 'user_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }

    public function lugares()
    {
        return $this->hasMany(Lugar::class, 'leader_id');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    public function notificaciones(): HasMany
    {
        return $this->hasMany(Notificacione::class);
    }

    public function isLeader()
    {
        return $this->role === 'leader';
    }

    public function isPlayer()
    {
        return $this->role === 'player';
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
