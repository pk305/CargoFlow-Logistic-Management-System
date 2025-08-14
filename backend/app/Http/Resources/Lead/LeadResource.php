<?php

namespace App\Http\Resources\Lead;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
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
            'refNo' => $this->ref_no,
            'dueDate' => $this->due_date,
            'incoterm' => $this->incoterm,
            'leadClass' => $this->lead_class,
            'saler' => $this->saler_id,
            'leadType' => $this->lead_type,
            'status' => $this->status,
            'leadOperation' => $this->lead_operation,
            'linkId' => $this->slug,
            'client' => $this->company ? ['name' => $this->company->name] : null,
            'branch' => $this->branch ? ['name' => $this->branch->name] : null,
            'createdBy' => $this->createdBy ? ['name' => $this->createdBy->name] : null,
        ];
    }
}
