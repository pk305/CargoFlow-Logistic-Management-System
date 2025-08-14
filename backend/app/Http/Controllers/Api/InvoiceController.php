<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Resources\Company\CompanyResourceMini;
use App\Http\Resources\Invoices\InvoiceInsightsResource;
use App\Http\Resources\Invoices\InvoiceResource;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;



class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        // $cacheInvoices = Redis::get('get.invoices');
        // if ($cacheInvoices) {
        //      return response()->json($cacheInvoices);
        // } else {
        $invoices = Invoice::where('invoice_type', $request->invoiceType)->orderBy('id', 'desc')->get();
        //     // Redis::set('get.invoices', $invoices);
        return  InvoiceResource::collection($invoices);
        // }

    }

    public function checkInvoiceCompany(Request $request)
    {
        $validated = $request->validate([
            'invoiceCompanyId' => 'required',
        ], ['invoiceCompanyId.required' => 'This field is required']);

        if (!$validated) return;
        $message = "Please check company's financial details, you are invoicing this company for the first time or it's financial details are not completed.";

        $company = Company::where('id', '=', $validated['invoiceCompanyId'])
            ->where('address', '!=', null)
            ->first();
        if (empty($company)) {
            return response()->json(['error400' => $message], 400);
        }

        $financial =  $company->financial;
        if (empty($financial)) {
            return response()->json(['error400' => $message], 400);
        }
        return  new CompanyResourceMini($company);
    }

    public function storeInvoice(StoreInvoiceRequest $request)
    {
        $reqErrors = [];
        $errorMessage = 'An Error occured at our end';
        $checkErr = false;
        if ($request->invoiceType === "credit") {

            if (!$request->invoiceName) {
                $checkErr = true;
                $reqErrors[] = ['invoiceName' => ['Invoice No can not be blank']];
            }
            if (!$request->notes) {
                $checkErr = true;
                $reqErrors[] = ['notes' => ['You cannot empty the notes field!']];
            }
        }
        $dataError = (object)[
            'message' => 'The given data was invalid.',
            'errors' => Arr::collapse($reqErrors)
        ];
        if ($checkErr) {
            $checkErr = false;
            return response()->json($dataError, 422);
        }
        //
        $checkDates = Carbon::parse($request->invoiceDate)->gt(Carbon::parse($request->dueDate));
        $message = ' Due date must be greater than invoice date';
        if ($checkDates) {
            return response()->json(['err' => 'dueDate', 'error400' => $message], 400);
        }
        // 
        $invoice = (object) [];
        $totalResults = json_decode($request->totalResults);
        $rateAmount = (int) $request->invoiceCurrRate * (int) $totalResults->netTotal;

        try {
            $padSinv = Invoice::latest()->withTrashed()->first() ? Invoice::latest()->withTrashed()->first()->id : count(Invoice::withTrashed()->get());
            $name = $request->invoiceName !== null ? $request->invoiceName : Str::lower('inv' . Str::padLeft($padSinv + 20, '9', '0'));
            $invoice  = Invoice::create([
                'name' => $name,
                'slug' => (string)  Auth::user()->unique_id . '-' . strval($name),
                'due_date' => $request->dueDate,
                'invoice_date' => $request->invoiceDate,
                'curr_id' => $request->invoiceCurr,
                'branch_id' => $request->branchId,
                'work_type' => $request->workType,
                'operation_id' => $request->operationId,
                'profit_center_id' => $request->profitCenterId,
                'invoice_address' => $request->invoiceAddress,
                'curr_rate' => $request->invoiceCurrRate,
                'notes' => $request->notes,
                'account_type' => $request->accountType,
                'invoice_type' => $request->invoiceType,
                'account' => $request->account,
                'saler_id' => $request->salerId,
                'status' => 'draft',
                'vat_amount' => $totalResults->vatTotal,
                'subtotal_amount' => $totalResults->subTotal,
                'net_amount' => $totalResults->netTotal,
                'amount' => $rateAmount,
                'created_by' => Auth::user()->id,
                'ref_no' => Str::upper(now()->format('M') . '/' . Str::padLeft(random_int(100000, 999999), '6', 0) . '/' . now()->format('y')),
                'company_id' => $request->companyId,
            ]);
        } catch (QueryException $ex) {
            return response()->json(['errors' => $ex, 'message' => $errorMessage], 500);
        }
        // 
        if ($request->checkInvoiceItems === 'true') {
            $invoiceItems = json_decode($request->invoiceItems);
            $processingItems = [];
            $invoiceErrors = [];
            if (count($invoiceItems) > 0) {
                foreach ($invoiceItems as $item) {
                    if ($item->finItemId !== '' || $item->lineName !== '') {
                        //processed invoices
                        if (!(int) $item->unitPrice > 0) {
                            $invoiceErrors[] = ['id' => $item->id, 'unitPrice_' . $item->id => 'Must be greater than 0.'];
                        } else {
                            $processingItems[] = $item;
                        }
                    }
                }
            }
            if (count($invoiceErrors) > 0) {
                $invoice->delete();
                return response()->json(['error400' => ['err' => 'invoiceErrors', 'msg' => $invoiceErrors]], 400);
            }
            if (count($processingItems) > 0) {
                foreach ($processingItems as $itm) {
                    try {
                        InvoiceItem::create([
                            'finitem_id' => $itm->finItemId,
                            'description' => $itm->lineName,
                            'profit_center_id' => $itm->profitCenterId,
                            'unit_number' => $itm->unitNumber,
                            'unit_price' => $itm->unitPrice,
                            'vat_id' => $itm->vatId,
                            'invoice_id' => $invoice->id,
                            'vat_amount' => floatval($itm->vatCalculate),
                            'amount_with_vat' => floatval($itm->totalInvoice),
                            'amount_without_vat' => floatval($itm->unitNumber * $itm->unitPrice),
                            'curr' =>  $request->invoiceCurr,
                            'curr_rate' =>  $request->invoiceCurrRate,
                        ]);
                    } catch (QueryException $ex) {
                        return response()->json(['errors' => $ex, 'message' => $errorMessage], 500);
                    }
                }
            }
        }

        return new InvoiceResource($invoice);
    }

    public function showInvoice($userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $invoice = Invoice::where('slug', $id)->first();
        if ($invoice) {
            return new InvoiceResource($invoice);
        }
    }

    public function confirmStatus(Request $request)
    {
        if (!$request->invIds) return;
        $invIds = json_decode($request->invIds);

        $invoices = Invoice::whereIn('id', $invIds)->get();

        if (count($invoices) > 0) {
            foreach ($invoices as $inv) {
                if ($request->notes !== null) {
                    $inv->notes = $request->notes;
                }
                $inv->status = $request->status;
                $inv->update();
            }
        }
        return  InvoiceResource::collection($invoices);
    }

    public function insights(Request $request)
    {
        // debit
        $pending_invoices_debit = Invoice::where('status', '!=', 'confirmed')
            ->where('invoice_type', 'debit')
            ->orderBy('created_at', 'desc')
            ->get();
        $not_ledgered_invoices_debit = Invoice::where('invoice_type', 'debit')->orderBy('id', 'desc')->get();
        // credit
        $pending_invoices_credit = Invoice::where('status', '!=', 'confirmed')
            ->where('invoice_type', 'credit')
            ->orderBy('created_at', 'desc')
            ->get();
        $not_ledgered_invoices_credit = Invoice::where('invoice_type', 'credit')->orderBy('id', 'desc')->get();


        $data  = (object) [
            'credit' => ['pending_invoices' => count($pending_invoices_credit), 'not_ledgered_invoices' => count($not_ledgered_invoices_credit)],
            'debit' => ['pending_invoices' => count($pending_invoices_debit), 'not_ledgered_invoices' => count($not_ledgered_invoices_debit)],
        ];
        return new InvoiceInsightsResource($data);

        // return response()->json($data);
    }

    public function  destroy($userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $invoice = Invoice::where('id', $id)->first();
        if ($invoice) {
            $invoice->forceDelete();
            return new InvoiceResource($invoice);
        }
    }
}
