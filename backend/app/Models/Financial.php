<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Financial extends Model
{
    use HasFactory;

    protected $fillable = ['company_title', 'financial_email'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
