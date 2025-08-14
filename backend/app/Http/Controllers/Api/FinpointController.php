<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFinpointRequest;
use App\Http\Resources\Finpoint\FinpointResource;
use App\Models\Finpoint;
use Illuminate\Http\Request;

class FinpointController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $finpoints = Finpoint::orderBy('id', 'desc')->get();
        return  FinpointResource::collection($finpoints);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFinpointRequest $request)
    {
        $finpoint = Finpoint::create([
            'title' => $request->title,
            'point_type' => $request->pointType,
            'account_type' => $request->accountType,
            'bank' => $request->bank,
            'bank_definition_id' => $request->bankDefinitionId,
            'bank_official' => $request->bankOfficial,
            'manager_id' => $request->managerId,
            'status' => $request->status,
            'use_on_invoice' => $request->useOnInvoice,
            'curr_id' => $request->curr,
            'reference' => $request->reference,
            'branch_id' => $request->branchId,
        ]);

        return new FinpointResource($finpoint);
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
