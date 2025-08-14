<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'main_branch', 'city_name', 'country_id', 'district', 'postcode', 'address', 'company_group', 'branch_id', 'email', 'eori_code', 'saler_id', 'taxno', 'saler_name', 'taxoffice', 'lat', 'website', 'city_id', 'lng', 'text', 'telephone', 'fax', 'notes', 'company_type', 'tag_names', 'company_sector', 'due_day', 'financial_id', 'logo_base64'];

    protected $dates = ['deleted_at'];

    protected static function boot()
    {
        parent::boot();
        //deleting
        static::deleting(function ($query) {
            $query->contacts()->delete();
            $query->financial()->delete();
            $query->iban()->delete();
        });
        //restoring
        static::restoring(function ($query) {
            $query->contacts()->withTrashed()->restore();
            $query->financial()->withTrashed()->restore();
            $query->iban()->withTrashed()->restore();
        });
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'company_id');
    }

    public function financial()
    {
        return $this->belongsTo(Financial::class);
    }

    public function saler()
    {
        return $this->belongsTo(User::class, 'saler_id', 'unique_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function ibans()
    {
        return $this->hasMany(Iban::class, 'company_id');
    }

    public function locations()
    {
        return $this->hasMany(Location::class, 'company_id');
    }
}
