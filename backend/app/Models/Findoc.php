<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Findoc extends Model
{
    use HasFactory;

    protected $fillable = [
        'doc_date',
        'doc_type',
        'code',
        'account_type',
        'account_id',
        'credit',
        'curr_id',
        'curr_rate',
        'curr_type',
        'related_account_type',
        'related_account_id',
        'branch_id',
        'operation_id',
        'profit_center_id',
        'notes',
        'confirm',
        'accounted',
        'doc_date',
        'doc_date',
        'financial_email'
    ];

    public function account()
    {
        return $this->belongsTo(Finpoint::class, 'account_id');
    }

    public function relatedAccount()
    {
        return $this->belongsTo(Finpoint::class, 'related_account_id');
    }
}
