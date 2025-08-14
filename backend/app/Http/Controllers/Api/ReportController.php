<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Invoices\InvoiceResource;
use App\Models\Invoice;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function findSearchReport(Request $request)
    {
        // if (!$request->has('model')) return;
        // $model = (obj) $request->model::all();
        $esp = explode('::', $request->model, 2);
        $invoice = Invoice::whereLike(['name', 'amount', 'invoice_address', 'ref_no'], $request->searchQuery)->get();

        return InvoiceResource::collection($invoice);

        // if ($esp[1] === 'Financor') {
        //     switch ($esp[1]) {
        //         case 'Invoice':
        //             return $this->InvoiceSearchReport($request);

        //         default:
        //             return;
        //     }
        // }
    }
}
