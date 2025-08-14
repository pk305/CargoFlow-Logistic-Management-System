<?php

namespace App\Http\Resources\Taxcode;

use Illuminate\Http\Resources\Json\JsonResource;

class TaxcodeResource extends JsonResource
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
            'code' => $this->code,
            'rate' => $this->rate,
            'ratePerc' => $this->rate_percantage,
            'name' => $this->name,
            'status' => $this->status,
        ];
    }
}
