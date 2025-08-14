<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'trans_method',
        'name',
        'extref',
        'contract_type',
        'status',
        'slug'
    ];
}
