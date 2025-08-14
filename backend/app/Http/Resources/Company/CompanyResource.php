<?php

namespace App\Http\Resources\Company;

use App\Http\Resources\City\CityResource;
use App\Http\Resources\Contact\ContactResourceMini;
use App\Http\Resources\Financial\FinancialResourceMini;
use App\Http\Resources\Iban\IbanResource;
use App\Http\Resources\Location\LocationResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;


class CompanyResource extends JsonResource
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
            'address' => $this->address,
            'city' => new CityResource($this->city),
            'countryId' => $this->country_id,
            'dueDay' =>  $this->due_day,
            'email' => $this->email,
            'eoriCode' => $this->eori_code,
            'id' => $this->id,
            'lat' =>  $this->lat,
            'lng' =>  $this->lng,
            'website' => $this->website,
            'fax' => $this->fax,
            'name' => $this->name,
            'notes' => $this->notes,
            'postcode' => $this->postcode,
            'saler' =>  $this->saler ? ['name' => $this->saler->name, 'id' => $this->saler->unique_id] : null,
            'branch' =>  $this->branch ? ['name' => $this->branch->name, 'id' => $this->branch->id] : null,
            'taxno' =>  $this->taxno,
            'taxOffice' => $this->taxoffice,
            'text' => $this->name ? $this->name . '-' : null,
            'phone' => $this->telephone,
            'logo' => $this->logo,
            'logoUrl' => $this->logo_url,
            'favicon' => $this->favicon,
            'district' => $this->district,
            'tagNames' => $this->tag_names,
            'companySector' => $this->company_sector,
            'companyType' => $this->company_type,
            'companyGroup' => $this->company_group,
            'notes' => $this->notes,
            'locations' => LocationResource::collection($this->locations),
            'faviconUrl' => $this->favicon_url,
            'ibans' =>  IbanResource::collection($this->ibans),
            'contacts' =>  ContactResourceMini::collection($this->contacts),
            'financial' => new FinancialResourceMini($this->financial),
            'linkId' => $this->id . '-' . Str::slug($this->name, '-'),
            'createdAt' => $this->created_at,
            'status' => $this->status,
            'contact' => (object) [
                'name' => $this->contact_name,
                'jobTitle' => $this->job_title,
                'phone' => $this->contact_phone,
                'email' => $this->contact_email,
                'fax' => $this->contactFax,
            ]
        ];
    }
}
