<?php

namespace App\Http\Resources\Finpoint;

use Illuminate\Http\Resources\Json\JsonResource;

class FinpointResource extends JsonResource
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
            'accountCode' => $this->account_code,
            'accountType' => $this->account_type,
            'bank' => $this->bank,
            'bankDefinition' => $this->bank_definition_id,
            'bankOfficial' => $this->bank_official,
            'branchCode' => $this->branch_code,
            'companyCode' => $this->company_code,
            'costAccountType' => $this->cost_account_type,
            'costProfitCenter' => $this->cost_profit_center_id,
            'pointType' => $this->point_type,
            'reference' => $this->reference,
            'status' => $this->status,
            'swiftCode' => $this->swift_code,
            'title' => $this->title,
            'uname' => $this->uname,
            'upass' => $this->upass,
            'useOnInvoice' => $this->use_on_invoice,
            'vposId' => $this->vpos_id,
            'branch' => $this->branch ? ['name' => $this->branch->name, 'id' => $this->branch->id] : null,
            'curr' => $this->currency ? ['code' => $this->currency->code, 'id' => $this->currency->id] : null,
            'manager' => $this->manager ? ['name' => $this->manager->name, 'id' => $this->manager->uuid] : null,
        ];
    }
}
