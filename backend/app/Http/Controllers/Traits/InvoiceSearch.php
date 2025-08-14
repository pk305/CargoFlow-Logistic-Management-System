<?php

namespace App\Http\Controllers\Traits;

use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InvoiceSearch
{
    public static function apply(Request $filters)
    {
        $invoice = (new Invoice())->newQuery();
        //name
        // if ($filters->has('searchQuery') && $filters->input('searchQuery') !== null) {
        //     $invoice->where('name', $filters->input('searchQuery'));
        // }
        // //company
        if ($filters->has('companyId') && $filters->input('companyId') !== null) {
            $invoice->with('company')->whereHas(
                'company',
                function ($query) use ($filters) {
                    $query->where(
                        'id',
                        $filters->input('companyId')
                    );
                }
            );
        }
        //status
        if ($filters->has('status') && $filters->input('status') !== null) {
            $invoice->where('status', $filters->input('status'));
        }
        // invoice_date
        if ($filters->has('invoiceDateSelect') && $filters->input('invoiceDateSelect') !== null) {
            if ($filters->input('invoiceDateSelect') === 'yesterday') {
                $invoice->whereDate('invoice_date', Carbon::yesterday());
            } else if ($filters->input('invoiceDateSelect') === 'today') {
                $invoice->whereDate('invoice_date', Carbon::today());
            } else if ($filters->input('invoiceDateSelect') === 'tomorrow') {
                $invoice->whereDate('invoice_date', Carbon::tomorrow());
            }

            // else if ($filters->input('invoiceDateSelect') === 'last_week') {
            //     $invoice->whereDate('invoice_date', Carbon::);
            // }
        }
        // due_date
        if ($filters->has('dueDateSelect') && $filters->input('dueDateSelect') !== null) {
            if ($filters->input('dueDateSelect') === 'yesterday') {
                $invoice->whereDate('due_date', Carbon::yesterday());
            } else if ($filters->input('dueDateSelect') === 'today') {
                $invoice->whereDate('due_date', Carbon::today());
            } else if ($filters->input('dueDateSelect') === 'tomorrow') {
                $invoice->whereDate('due_date', Carbon::tomorrow());
            }
            // else if ($filters->input('dueDateSelect') === 'last_week') {
            //     $invoice->whereDate('invoice_date', Carbon::);
            // }
        }
        //currency
        if ($filters->has('currId') && $filters->input('currId') !== null) {
            $invoice->where('curr_id', $filters->input('currId'));
        }
        //branch_id
        if ($filters->has('branchId') && $filters->input('branchId') !== null) {
            $invoice->where('branch_id', $filters->input('branchId'));
        }
        //branch_id
        if ($filters->has('userId') && $filters->input('userId') !== null) {
            $invoice->where('created_by', $filters->input('userId'));
        }



        // if ($filters->has('event')) {
        //     $invoice->whereHas(
        //         'rsvp.event',
        //         function ($query) use ($filters) {
        //             $query->where(
        //                 'event.slug',
        //                 $filters->input('event')
        //             );
        //         }
        //     );
        // }



        // // Search for a invoice based on their city.
        // if ($filters->has('status')) {
        //     $invoice->where('city', $filters->input('city'));
        // }



        // // Has an 'event' parameter been provided?


        //     // Only return users who have responded
        //     // to the invitation (with any type of
        //     // response).
        //     if ($filters->has('responded')) {
        //         $invoice->whereHas(
        //             'rsvp',
        //             function ($query) use ($filters) {
        //                 $query->whereNotNull('responded_at');
        //             }
        //         );
        //     }

        //     // Only return users who have responded
        //     // to the invitation with a specific
        //     // response.
        //     if ($filters->has('response')) {
        //         $invoice->whereHas(
        //             'rsvp',
        //             function ($query) use ($filters) {
        //                 $query->where(
        //                     'response',
        //                     'I will be attending'
        //                 );
        //             }
        //         );
        //     }
        // }

        // Get the results and return them.
        return $invoice->get();
    }
}


// search[filter][debit_credit]: 
// search[filter][curr]: 
// search[filter][vat_status]: 
// search[filter][ledger_status]: 
// search[filter][operation_id]: 
// search[filter][branch_id]: 
// search[filter][user_id][]: 
// search[filter][work_type][]: 
// search[filter][trans_method]: 
// search[filter][invoice_type][]: 
// search[filter][profit_center_id]: 
// search[filter][country_type]: 
// search[filter][contract_type]: 
// search[filter][operation_type]: 
// search[filter][vehicle_code]: 
// search[filter][loading_status]: 
// search[filter][invoice_date_select]: 
// search[filter][invoice_date1]: 
// search[filter][invoice_date2]: 
// search[filter][due_date_select]: 
// search[filter][due_date1]: 
// search[filter][due_date2]: 
// search[filter][ledger_date_select]: 
// search[filter][ledger_date1]: 
// search[filter][ledger_date2]: 
// search[filter][approval_date_type]: approval_date
// search[filter][approval_date_select]: 
// search[filter][approval_date1]: 
// search[filter][approval_date2]: 
// search[filter][payment_type]: 
// search[filter][loading_reference]: 
// search[filter][position_reference]: 
// search[filter][all_invoices]: true
// search[filter][reference]: 00
// search[model]: Financor::Invoice
// search[list_partial_file]: mdl_list_detailed
// search[search_form]: 
// search[action_type]: 
// search[related_id]: 
// search[class_method]: 
// search[will_paginate]: true
// search[is_report]: 
// search[title]: Invoices List
// search[orientation]: Landscape
// search[parent_type]: 
// search[parent_id]: 
// search[pref_list_id]: 
// search[perpage]: 10