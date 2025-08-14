<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class SetupRequest extends FormRequest
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
        if ($this->companyInfo) {
            return [
                'companyInfo.companyName' => 'required|unique:companies,name,' . $this->companyInfo['companyId'],
                'companyInfo.companyEmail' => 'nullable|email|unique:companies,email,' . $this->companyInfo['companyId'],
                'companyInfo.companyAddress' => 'required',
                'companyInfo.cityId' => 'required',
                'companyInfo.postcode' => 'nullable',
                'companyInfo.companyTel' => 'nullable',
                'companyInfo.companyWebsite' => 'nullable',
            ];
        }

        return [];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'companyInfo.companyName.required' => 'This field is required',
            'companyInfo.companyName.unique' => 'Company name already exists.',
            'companyInfo.companyAddress.required' => 'This field is required',
            'companyInfo.cityId.required' => 'This field is required',
            'companyInfo.postcode.required' => 'This field is required',
            'companyInfo.companyTel.required' => 'This field is required',
            'companyInfo.companyEmail.required' => 'This field is required',
            'companyInfo.companyEmail.unique' => 'This Email already exists.',
            'companyInfo.companyWebsite.required' => 'This field is required',
            'companyInfo.companyEmail.email' => 'Please insert valid email address',
        ];
    }
}
