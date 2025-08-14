<?php

namespace App\Http\Resources\Location;

use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'cityId' => $this->city_id,
            'cityName' => $this->city_name,
            'code' => $this->code,
            'countryId' => $this->country_id,
            'countryName' => $this->country_name,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'placeType' => $this->place_type,
            'postcode' => $this->postcode,
            'openingInfo' => $this->opening_info,
            'telephone' => $this->telephone,
            'email' => $this->email,
            'slug' => $this->slug,
        ];
    }
}
