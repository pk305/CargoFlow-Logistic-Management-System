<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingDeliveryPoint extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'unload_date', 'consignee_id', 'delivery_id', 'termin_date', 'unload_place_type', 'unload_place', 'unload_place_id', 'arv_zipcode', 'unload_city_id', 'unload_country', 'unload_custom_id', 'unload_customofficer_id', 'check_load_customofficer', 'unload_center_id'];

    protected $dates = ['unload_date'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function consignee()
    {
        return $this->belongsTo(Company::class, 'consignee_id');
    }

    public function unLoadCustom()
    {
        return $this->belongsTo(Location::class, 'unload_custom_id');
    }
}
