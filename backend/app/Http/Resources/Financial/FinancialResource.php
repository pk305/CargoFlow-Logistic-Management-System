<?php

namespace App\Http\Resources\Financial;

use Illuminate\Http\Resources\Json\JsonResource;

class FinancialResource extends JsonResource
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
            'companyCurr' => $this->company_curr,
            'companyTitle' => $this->company_title,
            'financialEmail' => $this->financial_email,
            'paymentNotes' => $this->payment_notes,
            'informationEmail' => $this->information_email,
            'dueDays' => $this->due_days,
            'creditLimit_control' => $this->credit_limit_control,
            'creditLimit' => $this->credit_limit,
            'creditLimitCurr' => $this->credit_limit_curr,
            'financialStatus' => $this->financial_status,
            'remindPayment' => $this->remind_payment,
            'financialNotes' => $this->financial_notes,
            'companyFinancor' => $this->company_financor_id,
        ];
    }
}
