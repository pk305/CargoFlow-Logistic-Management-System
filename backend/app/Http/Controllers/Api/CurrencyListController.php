<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCurrencyListRequest;
use App\Http\Resources\Currency\CurrencyListResource;
use App\Models\CurrencyList;
use Illuminate\Http\Request;

class CurrencyListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $curr_list = CurrencyList::orderBy('id', 'desc')->get();
        return  CurrencyListResource::collection($curr_list);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCurrencyListRequest $request)
    {
        $curr_list = CurrencyList::create([
            'code' => $request->currencyCode,
            'name' => $request->currencyName,
            'symbol' => $request->currencySymbol,
            'multiplier' => $request->multiplier,
        ]);

        return new CurrencyListResource($curr_list);
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
