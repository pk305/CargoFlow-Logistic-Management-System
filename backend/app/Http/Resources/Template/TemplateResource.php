<?php

namespace App\Http\Resources\Template;

use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
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
            'refCode' => $this->ref_code,
            'type' => $this->type,
            'isDefault' => $this->is_default,
            'templateDocs' =>  TemplatedocMiniResource::collection($this->templatedocs)
        ];
    }
}
