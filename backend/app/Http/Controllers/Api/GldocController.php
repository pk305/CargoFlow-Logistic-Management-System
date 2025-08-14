<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GldocRequest;
use App\Http\Resources\Gldoc\GldocResource;
use App\Models\Gldoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GldocController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $gldoc = Gldoc::latest()->get();
        return  GldocResource::collection($gldoc);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(GldocRequest $request)
    {
        $gldoc = Gldoc::create([
            'title' => $request->title,
            'doc_date' => $request->docDate,
            'due_date' => $request->dueDate,
            'ledger_type' => $request->ledgerType,
            'operation_id' => $request->operationId,
            'branch_id' => $request->branchId,
            'slug' => mt_rand(1000000, 9999999),
            'created_by' => Auth::user()->unique_id,
            'company_id' => Auth::user()->company_id
        ]);

        return new GldocResource($gldoc);
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

        $gldoc = Gldoc::where('slug', $id)->first();
        if ($gldoc) {
            return new GldocResource($gldoc);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(GldocRequest $request, $userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $gldoc = Gldoc::find($id);
        if ($gldoc) {
            $gldoc->title = $request->title;
            $gldoc->doc_date = $request->docDate;
            $gldoc->due_date = $request->dueDate;
            $gldoc->ledger_type = $request->ledgerType;
            $gldoc->operation_id = $request->operationId;
            $gldoc->branch_id = $request->branchId;
            $gldoc->update();

            return new GldocResource($gldoc);
        }
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function  destroy($userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $gldoc = Gldoc::find($id);
        if ($gldoc) {
            $gldoc->delete();
            return new GldocResource($gldoc);
        }
    }
}
