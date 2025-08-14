<?php

namespace App\Http\Resources\Contact;

use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'email' => $this->email,
            'jobTitle' => $this->jobtitle,
            'telephone' => $this->telephone,
            'slug' => $this->slug,
            'companyId' => $this->company_id,
            'gsm' => $this->gsm,
            'skype' => $this->skype,
            'operationId' => $this->operation_id,
            'roadNotify' => $this->road_notify,
            'seaNotify' => $this->sea_notify,
            'airNotify' => $this->air_notify,
            'railNotify' => $this->rail_notify,
            'customNotify' => $this->custom_notify,
            'depotNotify' => $this->depot_notify,
            'financeNotify' => $this->finance_notify,
            'twitter' => $this->twitter,
            'linkedin' => $this->linkedin,
            'facebook' => $this->facebook,
            'instagram' => $this->instagram,
            'savedStatus' => $this->saved,
            'company' => $this->company ? ['name' => $this->company->name] : null,
            'branch' => $this->branch ? ['name' => $this->branch->name] : null,
            'createdBy' => $this->createdBy ? ['name' => $this->createdBy->name] : null,
            'linkId' => $this->id . '-' . $this->slug,
            'createdAt' => $this->created_at,
        ];
    }
}
