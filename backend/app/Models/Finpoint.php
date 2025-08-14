<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Finpoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'point_type',
        'account_type',
        'bank',
        'bank_definition_id',
        'bank_official',
        'manager_id',
        'status',
        'use_on_invoice',
        'curr_id',
        'reference',
        'branch_id',
    ];

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id', 'unique_id');
    }

    public function currency()
    {
        return $this->belongsTo(CurrencyList::class, 'curr_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function findoc()
    {
        return $this->hasMany(Findoc::class, 'account_id');
    }
}
