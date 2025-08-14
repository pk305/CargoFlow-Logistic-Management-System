<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIbanRequest;
use App\Http\Resources\Iban\IbanResource;
use App\Models\Iban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IbanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $ibans = Iban::latest()->get();
        return  IbanResource::collection($ibans);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreIbanRequest $request)
    {
        $iban  = Iban::create([
            'iban_no' => $request->ibanNo,
            'bank_id' => $request->bankId,
            'curr' => $request->curr,
            'is_default' => $request->isDefault,
            'bank_name' => $request->bankName,
            'bank_code' => $request->bankCode,
            'branch_code' => $request->branchCode,
            'customer_code' => $request->customerCode,
            'account_code' => $request->accountCode,
            'swift_code' => $request->swiftCode,
            'id_number' => $request->idNumber,
            'title' => $request->title,
            'company_id' => $request->companyId
        ]);

        return new IbanResource($iban);
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

        $ibans = Iban::find($id)->first();
        if ($ibans) {
            return new IbanResource($ibans);
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
    public function destroy($userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $iban = Iban::find($id);
        if ($iban) {
            $iban->delete();
            return new IbanResource($iban);
        }
    }
}
