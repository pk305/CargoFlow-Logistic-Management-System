<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'refno',
        'birth_date',
        'phone_os',
        'birth_place_id',
        'operation_id',
        'gsm',
        'tel',
        'work_type',
        'avatar',
        'branch_id',
        'company_id',
        'address',
        'city_id',
        'country_id',
        'passport',
        'slug'
    ];
}
