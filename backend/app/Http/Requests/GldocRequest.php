<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GldocRequest extends FormRequest
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
            'title' => 'required',
            'docDate' => 'required',
            'dueDate' => 'required',
            'branchId' => 'required',
            'operationId' => 'required',
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
            'title.required' => 'This field is required',
            'docDate.required' => 'This field is required',
            'dueDate.required' => 'This field is required',
            'branchId.required' => 'This field is required',
            'operationId.required' => 'This field is required',
        ];
    }
}
