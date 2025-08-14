<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLedgerRequest;
use App\Http\Resources\Ledger\LedgerResource;
use App\Models\LedgerAccount;
use Illuminate\Http\Request;

class LedgerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $ledgers = Redis::get('get.invoices');
        // if ($ledgers) {
        //      return response()->json($ledgers);
        // } else {
        $ledgers = LedgerAccount::latest()->get();
        //     // Redis::set('get.ledgers', $ledgers);
        return  LedgerResource::collection($ledgers);
        // }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreLedgerRequest $request)
    {
        $ledger  = LedgerAccount::create([
            'name' => $request->ledgerName,
            'code' => $request->code,
            'english_name' => $request->englishName,
            'partner_account_code' => $request->partnerAccountCode,
            'ledgerable' => $request->ledgerable,
            'is_partner' => $request->isPartner,
            'curr' => $request->curr,
            'account_type' => $request->accountType,
            'status' => $request->status,
            'mapping_type' => $request->mappingType,
            'notes' => $request->notes,
        ]);

        return new LedgerResource($ledger);
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
