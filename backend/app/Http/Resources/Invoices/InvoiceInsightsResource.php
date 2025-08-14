<?php

namespace App\Http\Resources\Invoices;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceInsightsResource extends JsonResource
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
            'salesInvoices' => [
                'pending' => $this->debit['pending_invoices'],
                'notLedgered' => $this->debit['not_ledgered_invoices'],
            ],
            'purchaseInvoices' => [
                'pending' => $this->credit['pending_invoices'],
                'notLedgered' => $this->credit['not_ledgered_invoices'],
            ],
            'debitNote' => [
                'pending' => 0,
                'notLedgered' => 0,
            ],
            'creditNote' => [
                'pending' => 0,
                'notLedgered' => 0,
            ]
        ];
    }
}
