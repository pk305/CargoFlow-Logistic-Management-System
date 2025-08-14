<?php

namespace App\Http\Resources\Invoices;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceChargeResource extends JsonResource
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
            'lineTotal' => $this->line_total,
            'name' => $this->description,
            'saleInvoice' => $this->invoice_id,
            'unitNumber' => $this->unit_number,
            'unitprice' => $this->unit_price,
            'amountWithoutVat' => $this->amount_without_vat,
            'amountWithVat' => $this->amount_with_vat,
            'vatAmount' => $this->vat_amount,
            'unitPrice' => $this->unit_price,
            'vat' => $this->vat_id,
            'addInfo' => $this->add_info,
            'currencyRate' => $this->curr_rate,
            'currency' => $this->currency  ? ['code' => $this->currency->code, 'id' => $this->currency->id] : null,
            'profitCenter' => $this->profitCenter ? ['name' => $this->profitCenter->name, 'id' => $this->profitCenter->id] : null,
            'finitem' => $this->finitem ? ['name' => $this->finitem->name, 'id' => $this->finitem->id] : null,
        ];
    }
}
