<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Resources\Contact\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $contact = Contact::all();
        return  ContactResource::collection($contact);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreContactRequest $request)
    {
        $contact = Contact::create([
            'name' => $request->contactName,
            'slug' => Str::slug($request->contactName, '-'),
            'email' => $request->contactEmail,
            'company_id' => $request->companyId,
            'jobtitle' => $request->jobTitle,
            'gsm' => $request->gsm,
            'skype' => $request->skype,
            'telephone' => $request->tel,
            'operation_id' => $request->operationId,
            'road_notify' => $request->roadNotify,
            'sea_notify' => $request->seaNotify,
            'air_notify' => $request->airNotify,
            'rail_notify' => $request->railNotify,
            'custom_notify' => $request->customNotify,
            'depot_notify' => $request->depotNotify,
            'finance_notify' => $request->financeNotify,
            'twitter' => $request->twitter,
            'linkedin' => $request->linkedin,
            'facebook' => $request->facebook,
            'instagram' => $request->instagram,
            'created_by' => Auth::id()
        ]);

        return  new ContactResource($contact);
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
        $id = explode('-', $id, 2)[0];
        $contact = Contact::where('id', $id)->first();

        if ($contact) {
            return new ContactResource($contact);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;
        $contact = Contact::find($id);
        if ($contact) {
            $contact->name = $request->contactName;
            $contact->slug = Str::slug($request->contactName, '-');
            $contact->name = $request->contactName;
            $contact->email = $request->contactEmail;
            $contact->company_id = $request->companyId;
            $contact->jobtitle = $request->jobTitle;
            $contact->gsm = $request->gsm;
            $contact->skype = $request->skype;
            $contact->telephone = $request->tel;
            $contact->operation_id = $request->operationId;
            $contact->road_notify = $request->roadNotify;
            $contact->sea_notify = $request->seaNotify;
            $contact->air_notify = $request->airNotify;
            $contact->rail_notify = $request->railNotify;
            $contact->custom_notify = $request->customNotify;
            $contact->depot_notify = $request->depotNotify;
            $contact->finance_notify = $request->financeNotify;
            $contact->twitter = $request->twitter;
            $contact->linkedin = $request->linkedin;
            $contact->facebook = $request->facebook;
            $contact->instagram = $request->instagram;
            $contact->created_by = Auth::id();
            $contact->update();

            return new ContactResource($contact);
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

        $contact = Contact::find($id);
        if ($contact) {
            $contact->delete();
            return new ContactResource($contact);
        }
    }

    public function loadStatus(Request $request)
    {
        if (!$request->contactId) return;
        $id = explode('-', $request->contactId, 2)[0];
        $contact = Contact::where('id', $id)->first();

        if ($request->savedStatus) {
            if ($contact) {
                $contact->saved = $request->savedStatus ? 1 : 0;
                $contact->update();
            }
        }

        return new ContactResource($contact);
    }
}
