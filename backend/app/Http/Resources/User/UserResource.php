<?php

namespace App\Http\Resources\User;

use App\Http\Resources\Company\CompanyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'uuid' => $this->unique_id,
            'email' => $this->email,
            'name' => $this->name,
            'slug' => $this->slug,
            'isSetupCompany' => $this->is_setup_company,
            'setupCompanyProgress' => $this->setup_company_process,
            'company' => new CompanyResource($this->company),
            'phone' => $this->mobile_number,
            'status' => $this->status,
            'avatar' => $this->avatar,
            'isAdmin' => $this->is_admin,
        ];
    }
}
