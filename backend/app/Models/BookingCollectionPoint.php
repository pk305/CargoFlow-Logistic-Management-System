<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingCollectionPoint extends Model
{
    use HasFactory;

    protected $fillable = ['load_date', 'sender_id', 'loader_id', 'load_place_type', 'load_place', 'load_place_id', 'dep_zipcode', 'load_city_id', 'load_country', 'load_custom_id', 'load_customofficer_id', 'check_load_customofficer', 'load_center_id', 'booking_id'];

    protected $dates = ['load_date'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function sender()
    {
        return $this->belongsTo(Company::class, 'sender_id');
    }

    public function loadCustom()
    {
        return $this->belongsTo(Location::class, 'load_custom_id');
    }
}
