<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingOtherDetails extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'freight_price', 'freight_curr', 'incoterm', 'ppcc', 'agent_id', 'letter_of_credit', 'notes', 'agent_ref', 'agent_ref', 'notify1_id', 'notify2_id', 'service_type_id', 'product_price', 'product_curr', 'product_curr', 'channel', 'document_date', 'project_id'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
