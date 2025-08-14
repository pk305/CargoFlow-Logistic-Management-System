<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCurrencyListRequest extends FormRequest
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
            'currencyCode' => 'required|unique:currency_lists,code',
            'currencyName' => 'required|unique:currency_lists,name',
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
            'currencyName.required' => 'This field is required',
            'currencyCode.required' => 'This field is required',
            'currencyCode.unique' => 'Code already exists.',
            'currencyName.unique' => 'Name already exists.',
        ];
    }
}
