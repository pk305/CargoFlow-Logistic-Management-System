<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
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
            'companyName' => 'required|unique:companies,name,' . $this->companyId,
            'companyEmail' => 'nullable|email|unique:companies,email,' . $this->companyId,
            'address' => 'required',
            'cityId' => 'required',
            'contactsAttrName' => 'required',
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
            'companyName.required' => 'This field is required',
            'companyName.unique' => 'Company name already exists.',
            'cityId.required' => 'This field is required',
            'cityId.required' => 'This field is required',
            'contactsAttrName.required' => 'This field is required',
            'companyEmail.unique' => 'This Email already exists.',
            'companyEmail.email' => 'Please insert valid email address',
        ];
    }
}
