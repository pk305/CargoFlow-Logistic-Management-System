<?php

namespace App\Http\Resources\Invoices;

use App\Http\Resources\Company\CompanyResourceMini;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
            'invoiceName' => $this->name,
            'dueDate' => $this->due_date,
            'invoiceDate' => $this->invoice_date,
            'branch' => $this->branch_id ? ['name' => 'Head Office', 'id' => $this->id] : null,
            'invoiceType' => $this->work_type,
            'operation' => $this->operation ?  ['name' => $this->operation->name, 'id' => $this->operation->id] : null,
            'profitCenter' => $this->profitCenter ? ['name' => $this->profitCenter->name, 'id' => $this->profitCenter->id] : null,
            'invoiceAddress' => $this->invoice_address,
            'invoiceCurrRate' => $this->curr_rate,
            'invoiceCurr' => $this->currency  ? ['code' => $this->currency->code, 'id' => $this->currency->id] : null,
            'notes' => $this->notes,
            'customerRep' => $this->customerRep ?  ['name' => $this->customerRep->name, 'id' => $this->customerRep->id] : null,
            'invoicedCompany' => new CompanyResourceMini($this->company),
            'invoicedCharges' => InvoiceChargeResource::collection($this->charges),
            'refNo' => $this->ref_no,
            'vatTotal' => $this->vat_amount,
            'subTotal' => $this->subtotal_amount,
            'netTotal' => $this->net_amount,
            'rateAmount' => $this->amount,
            'unpaidAmount' => $this->net_amount,
            'amountWithoutVat' => $this->amount_without_vat,
            'status' => $this->status,
            'createdBy' => $this->createdBy ? ['uniqueId' => $this->createdBy->unique_id, 'name' => $this->createdBy->name] : null,
            'invoiceStatus' => $this->status,
            'invoiceCountry' => ['name' => 'Kenya', 'code' => 'KE'],
            'createdAt' => $this->created_at,
            'linkId' => $this->slug,
            'accountCode' => null,
        ];
    }
}
