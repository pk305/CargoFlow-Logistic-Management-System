<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LedgerAccount extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'english_name', 'partner_account_code', 'ledgerable', 'is_partner', 'curr', 'account_type', 'status', 'mapping_type', 'notes'];
}
