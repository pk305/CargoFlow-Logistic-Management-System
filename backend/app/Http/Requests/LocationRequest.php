<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LocationRequest extends FormRequest
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
            'placeName' => 'required|unique:locations,name,' . $this->id,
            'placeType' => 'required',
            'address' => 'required',
            'cityId' => 'required',
            'countryId' => 'required',
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
            'placeName.required' => 'This field is required',
            'placeName.unique' => 'Address name already exists.',
            'placeType.required' => 'This field is required',
            'address.required' => 'This field is required',
            'cityId.required' => 'This field is required',
            'countryId.required' => 'This field is required',
        ];
    }
}
