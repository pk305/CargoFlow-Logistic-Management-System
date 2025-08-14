<?php

namespace App\Http\Resources\Iban;

use Illuminate\Http\Resources\Json\JsonResource;

class IbanResource extends JsonResource
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
            'ibanNo' => $this->iban_no,
            'bankId' => $this->bank_id,
            'isDefault' => $this->is_default,
            'bankName' => $this->bank_name,
            'bankCode' => $this->bank_code,
            'branchCode' => $this->branch_code,
            'customerCode' => $this->customer_code,
            'accountCode' => $this->account_code,
            'swiftCode' => $this->swift_code,
            'idNumber' => $this->id_number,
            'title' => $this->title,
            'curr' => $this->currency ? ['name' => $this->currency->name, 'id' => $this->currency->id] : null,
        ];
    }
}
