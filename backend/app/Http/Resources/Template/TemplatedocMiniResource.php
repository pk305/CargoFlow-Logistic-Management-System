<?php

namespace App\Http\Resources\Template;

use Illuminate\Http\Resources\Json\JsonResource;

class TemplatedocMiniResource extends JsonResource
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
            'name' => $this->name,
            'uniqueCode' => $this->unique_code,
            'tempCode' => $this->temp_code,
            'docSaleInvoice' =>  $this->invoice_id ?  ['id' => $this->invoice_id, 'name' => null,] : null,
        ];
    }
}
