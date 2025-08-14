<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Resources\Vehicle\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $vehicles =  Vehicle::orderBy('created_at', 'desc')->with(['createdBy'])->get();
        return  VehicleResource::collection($vehicles);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreVehicleRequest $request)
    {
        $vehicle = Vehicle::create([
            'name' => $request->vehicleName,
            'slug' => (string) Auth::user()->unique_id . '-' . Str::slug($request->vehicleName, '-'),
            'code' => $request->code,
            'vehicle_class' => $request->vehicleClass,
            'created_by' =>  Auth::user()->id,
            // 'brand',
            // 'model',
            // 'model_year',
            // 'vehicle_type',
            // 'covehicle_id',
            // 'name',
            // 'owner_type',
            // 'driver_id',
            // 'company_id',
            // 'country_id',
            // 'branch_id',
            // 'operation_id',
            // 'operator_id',
            // 'profit_center_id',
        ]);

        return  new VehicleResource($vehicle);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $vehicle = Vehicle::where('slug', $id)->first();
        if ($vehicle) {
            return new VehicleResource($vehicle);
        }
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
