<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'userName' =>  'required|unique:users,name',
            'email' =>  'required|email|unique:users,email',
            'phone' =>  'nullable|unique:users,mobile_number',
            'password' => 'nullable|confirmed|min:6',
            'password_confirmation' => 'nullable|min:6',
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
            'email.required' => 'This field is required',
            'userName.required' => 'This field is required',
            'email.unique' => 'User exists with same email.',
            'userName.unique' => 'User exists with same name.',
        ];
    }
}
