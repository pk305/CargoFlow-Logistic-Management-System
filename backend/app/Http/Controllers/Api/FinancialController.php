<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Company\CompanyResource;
use App\Http\Resources\Financial\AccountResource;
use App\Http\Resources\Financial\FinancialResource;
use App\Http\Resources\Ledger\LedgerResource;
use App\Models\Company;
use App\Models\Financial;
use App\Models\LedgerAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use function PHPSTORM_META\map;

class FinancialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required',
        ], ['address.required' => 'This field can not be blank']);

        if (!$validated) return;

        $financial = Financial::find($request->financialId);
        if ($financial) {
            $company = Company::where('financial_id',  $financial->id)->first();
            $company->address = $request->address;
            $company->city_id = null;
            $company->city_name = $request->cityName;
            $company->district = $request->district;
            $company->country_id = $request->countryId;
            $company->taxno = $request->taxNo;
            $company->taxoffice = $request->taxOffice;
            $company->postcode = $request->postcode;
            $company->eori_code = $request->companyNo;
            $company->update();
            //
            $financial->company_title = $request->companyName;
            $financial->financial_email = $request->financialEmail;
            $financial->payment_notes = $request->paymentNotes;
            $financial->information_email = $request->informationEmail;
            $financial->invoice_notes = $request->invoiceNotes;
            $financial->due_days = $request->dueDays;
            $financial->company_curr = $request->companyCurr;
            $financial->credit_limit_control = $request->creditLimitControl;
            $financial->credit_limit = $request->creditLimit;
            $financial->credit_limit_curr = $request->companyCreditLimitCurr;
            $financial->financial_status = $request->financialStatus;
            $financial->remind_payment = $request->companyRemindPayment;
            $financial->financial_notes = $request->financialNotes;
            $financial->company_financor_id = $request->companyFinancorId;
            $financial->update();

            return new FinancialResource($company);
        }
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

        $company = Company::find($id);
        if ($company) {
            $compFin = $company->load('financial');
            return  new CompanyResource($compFin);
        }
    }


    public function fetchAccount(Request $request)
    {
        $results = [];
        $user = Auth::user();
        $c = $request->accountType;

        if ($c === 'ledgerAccount') {
            $data = LedgerAccount::where(['branch_id' => $user->branch_id, 'ledgerable' => 1])->get();
            $results = count($data) > 0 ? collect($data)->map(function ($query) {
                return [
                    "id" => $query->id,
                    "name" => $query->name,
                ];
            }) : [];
        }


        $arr = (object)  [
            'results' => $results
        ];
        return new AccountResource($arr);
    }
}
