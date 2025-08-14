<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'vehicle_class',
        'brand',
        'model',
        'model_year',
        'vehicle_type',
        'covehicle_id',
        'name',
        'owner_type',
        'driver_id',
        'company_id',
        'country_id',
        'branch_id',
        'operation_id',
        'operator_id',
        'profit_center_id',
        'slug',
        'created_by'
    ];


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'unique_id');
    }
}
