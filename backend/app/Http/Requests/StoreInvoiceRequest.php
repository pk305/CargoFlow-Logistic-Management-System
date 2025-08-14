<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'invoiceCurr' => 'bail|required',
            'invoiceDate' => 'required',
            'dueDate' => 'required',
            'branchId' => 'required',
            'workType' => 'required',
            'operationId' => 'required',
            'profitCenterId' => 'required',
            'invoiceAddress' => 'required',
            'invoiceName' =>  'nullable|unique:invoices,name',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'invoiceCurr.required' => 'This field is required',
            'invoiceDate.required' => 'This field is required',
            'dueDate.required' => 'This field is required',
            'countryId.required' => 'This field is required',
            'invoiceName.unique' => 'Invoice exists with same number.',
        ];
    }
}
