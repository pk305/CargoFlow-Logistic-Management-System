<?php

namespace App\Http\Resources\Findoc;

use App\Http\Resources\Finpoint\FinpointResource;
use Illuminate\Http\Resources\Json\JsonResource;

class FindocResource extends JsonResource
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
            'accountType' => $this->account_type,
            'accounted' => $this->accounted,
            'branch' => $this->branch_id,
            'code' => $this->code,
            'confirm' => $this->confirm,
            'credit' => $this->credit,
            'currency' => $this->curr_id,
            'docDate' => $this->doc_date,
            'docType' => $this->doc_type,
            'notes' => $this->notes,
            'profitCenter' => $this->profit_center_id,
            'relatedAccount' =>  new FinpointResource($this->relatedAccount),
            'relatedAccountType' => $this->related_account_type,
            'account' => new FinpointResource($this->account),
        ];
    }
}
