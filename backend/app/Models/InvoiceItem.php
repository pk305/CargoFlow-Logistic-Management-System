<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $table = 'invoice_items';
    protected $fillable = ['finitem_id', 'name', 'profit_center_id', 'unit_price', 'unit_number', 'vat_id', 'description', 'invoice_id', 'amount_with_vat', 'amount_without_vat', 'vat_amount', 'curr_id', 'add_info'];

    public function invoice()
    {
        return $this->belongsTo(InvoiceItem::class, 'invoice_id');
    }

    public function finitem()
    {
        return $this->belongsTo(Finitem::class);
    }

    public function profitCenter()
    {
        return $this->belongsTo(ProfitCenter::class, 'profit_center_id');
    }

    public function currency()
    {
        return $this->belongsTo(CurrencyList::class, 'curr_id');
    }
}
