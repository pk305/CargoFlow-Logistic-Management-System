<?php

namespace App\Http\Resources\User;

use App\Http\Resources\Company\CompanyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResourceMini extends JsonResource
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
            'phone' => $this->mobile_number,
            'avatar' => $this->avatar,
        ];
    }
}
