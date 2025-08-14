<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Driver\DriverResource;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $drivers = Driver::where(['company_id' => $user->company_id])->orderBy('created_at', 'desc')->get();
        return DriverResource::collection($drivers);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $driver = Driver::create([
            'name' => $request->driverName,
            'refno' => $request->refno,
            'birth_date' => $request->birthDate,
            'birth_place_id' => $request->birthPlaceId,
            'operation_id' => $request->operationId,
            'gsm' => $request->gsm,
            'tel' => $request->tel,
            'work_type' => $request->workType,
            'avatar' => $request->avatar,
            'branch_id' => $request->branchId,
            'company_id' => $request->companyId,
            'address' => $request->address,
            'city_id' => $request->cityId,
            'country_id' => $request->countryid,
            'passport' => $request->passport,
            'slug' =>  (string) mt_rand(9999999, 11111111) . '-' . Str::lower(Str::slug($request->driverName, '-')),
        ]);

        return  new DriverResource($driver);
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
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
