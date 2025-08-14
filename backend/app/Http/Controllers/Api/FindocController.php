<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFindocRequest;
use App\Http\Resources\Findoc\FindocResource;
use App\Models\Findoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FindocController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $findoc =  Findoc::orderBy('created_at', 'desc')->get();
        return  FindocResource::collection($findoc);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFindocRequest $request)
    {
        $findoc = Findoc::create([
            'doc_date' => $request->docDate,
            'doc_type' => $request->docType,
            'code' => $request->code,
            'account_type' => $request->accountType,
            'account_id' => $request->accountId,
            'credit' => $request->credit,
            'curr_id' => $request->transferCurr,
            'curr_rate' => $request->currRate,
            'curr_type' => $request->currType,
            'related_account_type' => $request->relatedAccountType,
            'related_account_id' => $request->relatedAccountId,
            'branch_id' => $request->branchId,
            'operation_id' => $request->operationId,
            'profit_center_id' => $request->profitCenterId,
            'notes' => $request->notes,
            'confirm' => $request->confirm,
            'accounted' => $request->accounted,
        ]);

        return  new FindocResource($findoc);
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
