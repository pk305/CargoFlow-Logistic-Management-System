<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'city_id',
        'code',
        'city_name',
        'country_name',
        'country_id',
        'lat',
        'lng',
        'place_type',
        'postcode',
        'contact_name',
        'telephone',
        'email',
        'company_id',
        'created_by'
    ];
}
