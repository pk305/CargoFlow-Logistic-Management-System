<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'email', 'jobtitle', 'telephone', 'company_id', 'gsm', 'skype', 'operation_id', 'road_notify', 'tel', 'sea_notify', 'air_notify', 'rail_notify', 'custom_notify', 'depot_notify', 'finance_notify', 'twitter', 'linkedin', 'facebook', 'instagram', 'created_by'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function operation()
    {
        return $this->belongsTo(Operation::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}
