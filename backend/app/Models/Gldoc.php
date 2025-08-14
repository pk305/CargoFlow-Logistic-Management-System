<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gldoc extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'doc_date',
        'due_date',
        'ledger_type',
        'operation_id',
        'branch_id',
        'slug',
        'company_id',
        'created_by'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function operation()
    {
        return $this->belongsTo(Operation::class, 'operation_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'unique_id');
    }
}
