<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LocationRequest;
use App\Http\Resources\Location\LocationResource;
use App\Models\City;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Cache::has('get.locations')) {
            return  LocationResource::collection(Cache::get('get.locations'));
        } else {
            $locations =  Location::orderBy('created_at', 'desc')->get();
            Cache::put('get.locations', $locations);
            return  LocationResource::collection($locations);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LocationRequest $request)
    {
        $city = City::find($request->cityId);

        $location = Location::create([
            'name' => $request->placeName,
            'email' => $request->placeEmail,
            'code' => $request->code,
            'place_type' => $request->placeType,
            'address' => $request->address,
            'postcode' => $request->postcode,
            'telephone' => $request->placeTel,
            'lat' => $request->placeLat,
            'lng' => $request->placeLng,
            'opening_info' => $request->openingInfo,
            'contact_name' => $request->contactName,
            'city_name' =>  ucfirst($city->name),
            'city_id' => $city ? $city->id : null,
            'country_id' => $request->countryId,
            'company_id' => $request->companyId,
            'slug' => (string) $request->countryId . $request->postcode,
            'created_by' => Auth::id()
        ]);

        return  new LocationResource($location);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(LocationRequest $request, $userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;
        $city = City::find($request->cityId);
        $location = Location::find($id);
        if ($location) {
            $location->name = $request->placeName;
            $location->email = $request->placeEmail;
            $location->code = $request->code;
            $location->place_type = $request->placeType;
            $location->address = $request->address;
            $location->postcode = $request->postcode;
            $location->telephone = $request->placeTel;
            $location->lat = $request->placeLat;
            $location->lng = $request->placeLng;
            $location->opening_info = $request->openingInfo;
            $location->contact_name = $request->contactName;
            $location->city_name =  ucfirst($city->name);
            $location->city_id = $city ? $city->id : null;
            $location->country_id = $request->countryId;
            $location->update();

            return new LocationResource($location);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function  destroy($userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $location = Location::find($id);
        if ($location) {
            $location->delete();
            return new LocationResource($location);
        }
    }
}
