<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'operation_id',
        'load_type',
        'company_id',
        'customer_ref',
        'status',
        'saler_id',
        'contact_id',
        'branch_id',
        'vagon_no',
        'hbl_date',
        'talex',
        'free_time',
        'receipt_no',
        'created_by',
        'slug'
    ];

    protected $dates = ['deleted_at'];

    protected static function boot()
    {
        parent::boot();
        //deleting
        static::deleting(function ($query) {
            $query->bookingCollection()->delete();
            $query->bookingDelivery()->delete();
            $query->bookingPackage()->delete();
            $query->bookingOtherDetails()->delete();
        });
        //restoring
        static::restoring(function ($query) {
            $query->bookingCollection()->withTrashed()->restore();
            $query->bookingDelivery()->withTrashed()->restore();
            $query->bookingOtherDetails()->withTrashed()->restore();
            $query->bookingPackage()->withTrashed()->restore();
        });
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function branch()
    {
        return $this->belongsTo(Company::class, 'branch_id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function bookingCollection()
    {
        return $this->hasOne(BookingCollectionPoint::class, 'booking_id');
    }

    public function bookingDelivery()
    {
        return $this->hasOne(BookingDeliveryPoint::class, 'booking_id');
    }

    public function bookingPackage()
    {
        return $this->hasOne(BookingPackageDetails::class, 'booking_id');
    }

    public function bookingOtherDetails()
    {
        return $this->hasOne(BookingOtherDetails::class, 'booking_id');
    }
}
