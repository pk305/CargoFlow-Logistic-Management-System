<?php

namespace App\Http\Resources\Gldoc;

use Illuminate\Http\Resources\Json\JsonResource;

class GldocResource extends JsonResource
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
            'title' => $this->title,
            'docDate' => $this->doc_date,
            'dueDate' => $this->due_date,
            'ledgerType' => $this->ledger_type,
            'branch' => $this->branch ? ['name' => $this->branch->name, 'id' => $this->branch->id] : null,
            'operation' => $this->operation ? ['name' => $this->operation->name, 'id' => $this->operation->id] : null,
            'createdBy' => $this->createdBy ? ['name' => $this->createdBy->name, 'id' => $this->createdBy->uuid] : null,
            'linkId' => $this->slug,
            'status' => $this->status,
            'createdAt' => $this->created_at,
        ];
    }
}
