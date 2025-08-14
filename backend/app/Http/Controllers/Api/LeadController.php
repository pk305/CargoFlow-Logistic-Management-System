<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Resources\Lead\LeadResource;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $contact = Lead::latest()->get();
        return  LeadResource::collection($contact);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreLeadRequest $request)
    {
        $padLd = Lead::latest()->first() ? Lead::latest()->first()->id : count(Lead::all());
        $lead = new Lead();
        $lead->branch_id = $request->branchId;
        $lead->ref_no =  Str::lower('OFR') . str_pad($padLd + 1, 7, "22", STR_PAD_LEFT);
        $lead->due_date = $request->dueDate;
        $lead->company_id = $request->companyId;
        $lead->slug = Auth::user()->unique_id . '-' . $lead->ref_no;
        $lead->incoterm = $request->incoterm;
        $lead->lead_class = $request->leadClass;
        $lead->saler_id = $request->salerId;
        $lead->lead_type = $request->leadType;
        $lead->status = 'draft';
        $lead->lead_operation = $request->leadOperation;
        $lead->created_by = Auth::id();
        $lead->save();

        return  new LeadResource($lead);
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

        $lead = Lead::where('slug', $id)->first();
        if ($lead) {
            return new LeadResource($lead);
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

        $lead = Lead::find($id);
        if ($lead) {
            $lead->delete();

            return new LeadResource($lead);
        }
    }
}
