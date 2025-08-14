<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingPackageDetails extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'in_container', 'commodity', 'total_pack', 'brut_wg', 'volume', 'ladameter', 'price_wg', 'commodity_type', 'hts_no', 'addr_unno', 'optimum_temperature', 'gtip_id', 'tag_names'];


    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
