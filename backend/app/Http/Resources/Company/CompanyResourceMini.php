<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResourceMini extends JsonResource
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
            'countryId' => $this->country_id,
            'taxno' =>  $this->taxno,
            'text' => $this->name . '-',
            'email' => $this->email,
            'taxOffice' =>  $this->taxoffice,
            'phone' => $this->telephone,
        ];
    }
}
