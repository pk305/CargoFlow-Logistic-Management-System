<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\InvoiceSearch;
use App\Http\Resources\Invoices\InvoiceResource;
use App\Models\Invoice;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function filter(Request $request)
    {
        if (!$request->has('model')) return;
        if ($request->req === 'Financor') {
            switch ($request->model) {
                case 'Invoicelist':
                    $filterd = [];
                    $curr_rate = [0];
                    $total_amount = [0];
                    $vat_total = [0];
                    $subtotal_amount = [0];
                    $taxed_amount = [0];
                    if ($request->has('searchBar')) {
                        $fil_items = ['name',  'work_type', 'invoice_address', 'notes', 'ref_no'];
                        $filterd = Invoice::whereLike($fil_items, $request->searchQuery)->get();
                    } else {
                        $filterd = InvoiceSearch::apply($request);
                    }

                    if (count($filterd) > 0) {
                        // $grouped = collect($filterd)->groupBy(['curr_id', function ($item, $key) {
                        //     return $item->
                        // }]);
                        foreach ($filterd as $item) {
                            $total_amount[] = $item->net_amount;
                            $vat_total[] = $item->vat_amount;
                            $taxed_amount[] = $item->amount;
                            $subtotal_amount[] = $item->subtotal_amount;
                            $curr_rate[] = $item->curr_rate;
                        }
                    }
                    $totalReport =  (object) [
                        'taxFreeAmount' =>  array_sum($subtotal_amount),
                        'taxedAmount' => array_sum($taxed_amount),
                        'vatAmount' => array_sum($vat_total),
                        'netTotal' => array_sum($total_amount),
                        'currency' => 'USD',
                        'totalAmount' => array_sum($total_amount),
                        'totalUSD' =>  array_sum($total_amount),
                        'totalEUR' => array_sum($total_amount) * 113,
                        'vatTotal' => array_sum($vat_total),
                    ];
                    return response()->json(['filterd' => InvoiceResource::collection($filterd), 'total' => $totalReport]);
                default:
                    return;
            }
        }
    }
}
// companyId: "1"
// model: "Invoicelist"
// req: "Financor"
// searchBar: "true"
// searchQuery: "0"