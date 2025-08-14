<?php

namespace App\Http\Resources\Finitem;

use Illuminate\Http\Resources\Json\JsonResource;

class FinitemResource extends JsonResource
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
            'itemType' => $this->item_type,
            'name' => $this->name,
        ];
    }
}
