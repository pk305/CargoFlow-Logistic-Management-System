<?php

namespace App\Http\Resources\Vehicle;

use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
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
            'linkId' => $this->slug,
            'vehicleClass' => $this->vehicle_class,
            'vehicleName' => $this->name,
            'code' => $this->code,
            'createdBy' => $this->createdBy ? ['name' => $this->createdBy->name, 'uuid' => $this->createdBy->unique_id,] : null
        ];
    }
}
