<?php

namespace App\Http\Resources\Branch;

use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
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
            'accountCode' => $this->account_code,
            'address' => $this->address,
            'city' => $this->city,
            'company' => $this->company ? ['name' => $this->company->name, 'id' => $this->company->id] : null,
            'country' => $this->country,
            'email' => $this->email,
            'fax' => $this->fax,
            'manager' => $this->manager,
            'name' => $this->name,
            'phone' => $this->phone,
            'postcode' => $this->postcode,
            'profitCenterCode' => $this->profit_center_code,
            'createdAt' => $this->created_at,
        ];
    }
}
