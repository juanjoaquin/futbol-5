<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lugar extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

}
