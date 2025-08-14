<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Iban extends Model
{
    use HasFactory;

    protected $fillable = ['iban_no', 'bank_id', 'curr', 'is_default', 'bank_name', 'bank_code', 'branch_code', 'customer_code', 'account_code', 'swift_code', 'id_number', 'title', 'company_id'];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function currency()
    {
        return $this->belongsTo(CurrencyList::class, 'curr');
    }
}
