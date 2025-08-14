<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'branchId' => 'required',
            'customerCompany' => 'required',
            'loadType' => 'required',
            'loadingCountry' => 'required',
            'operationId' => 'required',
            'salerId' => 'required',
            'unLoadingCountry' => 'required',
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
            'branchId.required' => 'This field is required',
            'customerCompany.required' => 'This field is required',
            'loadType.required' => 'This field is required',
            'loadingCountry.required' => 'This field is required',
            'operationId.required' => 'This field is required',
            'salerId.required' => 'This field is required',
            'unLoadingCountry.required' => 'This field is required',
        ];
    }
}
