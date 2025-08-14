<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePositionRequest;
use App\Http\Resources\Position\PositionResource;
use App\Models\Booking;
use App\Models\Company;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $poss =  Position::orderBy('created_at', 'desc')->get();
        return  PositionResource::collection($poss);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $auth = Auth::user();
        $padBk = Position::latest()->first() ? Position::latest()->first()->id : count(Position::all());
        $name =  'TPS' . str_pad($padBk + 1, 9, "30", STR_PAD_LEFT);
        $pos = Position::create([
            'name' =>  $name,
            'extref' => $request->extref,
            'status' => $request->status,
            'contract_type' => $request->contractType,
            'trans_method' => $request->transMethod,
            'slug' => $auth->unique_id . '-' . $name,
        ]);
        // $booking = Booking::where('slug', $request->loadingId)->first();
        // if ($booking) {
        //     return response()->json($request->loadingId);
        // }

        return new PositionResource($pos);
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
