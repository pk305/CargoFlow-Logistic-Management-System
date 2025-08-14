<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
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
            'code' =>  'required|unique:vehicles,code',
            'vehicleClass' =>  'required',
            'vehicleName' =>  'required',
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
            'code.required' => 'This field is required',
            'vehicleClass.required' => 'This field is required',
            'vehicleName.required' => 'This field is required',
            'code.unique' => 'Vehicle exists with same code.',
        ];
    }
}
