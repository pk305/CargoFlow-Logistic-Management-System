<?php

namespace App\Http\Resources\Ledger;

use Illuminate\Http\Resources\Json\JsonResource;

class LedgerResource extends JsonResource
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
            'ledgerName' => $this->name,
            'code' => $this->code,
            'englishName' => $this->english_name,
            'partnerAccountCode' => $this->partner_account_code,
            'ledgerable' => $this->ledgerable,
            'isPartner' => $this->is_partner,
            'accountType' => $this->account_type,
            'status' => $this->status,
            'mappingType' => $this->mapping_type,
            'notes' => $this->notes,
        ];
    }
}
