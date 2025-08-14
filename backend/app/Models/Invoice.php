<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'invoices';

    protected $fillable = ['name', 'curr_id', 'curr_rate', 'branch_id', 'work_type', 'invoice_address', 'notes', 'profit_center_id', 'operation_id', 'saler_id', 'company_id', 'ref_no', 'invoice_date', 'due_date', 'status', 'net_amount', 'vat_amount', 'subtotal_amount', 'amount', 'created_by', 'account_type', 'account', 'invoice_type', 'slug'];

    protected $dates = ['invoice_date', 'due_date', 'deleted_at'];

    protected static function boot()
    {
        parent::boot();
        //deleting
        static::deleting(function ($query) {
            $query->charges()->delete();
        });
        //restoring
        static::restoring(function ($query) {
            $query->charges()->withTrashed()->restore();
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function charges()
    {
        return $this->hasMany(InvoiceItem::class, 'invoice_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function currency()
    {
        return $this->belongsTo(CurrencyList::class, 'curr_id');
    }

    public function profitCenter()
    {
        return $this->belongsTo(ProfitCenter::class, 'profit_center_id');
    }

    public function customerRep()
    {
        return $this->belongsTo(User::class, 'saler_id');
    }

    public function operation()
    {
        return $this->belongsTo(Operation::class, 'operation_id');
    }
}
