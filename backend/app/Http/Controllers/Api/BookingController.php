<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\Booking\BookingResource;
use App\Models\Booking;
use App\Models\BookingCollectionPoint;
use App\Models\BookingDeliveryPoint;
use App\Models\BookingOtherDetails;
use App\Models\BookingPackageDetails;
use App\Models\Company;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // if (Cache::has('get.bookings')) {
        //     return  BookingResource::collection(Cache::get('get.bookings'));
        // } else {
        $bookings =  Booking::orderBy('created_at', 'desc')->with(['bookingCollection', 'bookingDelivery', 'bookingPackage', 'bookingOtherDetails'])->get();
        // Cache::put('get.bookings', $bookings);
        return  BookingResource::collection($bookings);
        // }

        // return response()->json($bookings);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBookingRequest $request)
    {
        $validated = $request->validated();
        if (!$validated) return;
        $auth = Auth::user();
        $padBk = Booking::latest()->first() ? Booking::latest()->first()->id : count(Booking::all());
        $comp =  Company::find($auth->unique_id);
        $companyString =  $comp ? Str::lower(Str::substr($comp->name, 0, 3)) : 'nue';
        $recepNo =  $companyString . str_pad($padBk + 1, 7, "20", STR_PAD_LEFT);
        $errorMessage = 'An Error occured at our end';
        $booking = null;

        try {
            $booking =  Booking::create([
                'branch_id' => $request->branchId,
                'company_id' => $request->customerCompany,
                'load_type' => $request->loadType,
                'operation_id' => $request->operationId,
                'saler_id' => $request->salerId,
                'customer_ref' => $request->customerRef,
                'receipt_no' => $recepNo,
                'created_by' => $auth->id,
                'contact_id' => $request->contactId,
                'vagon_no' => $request->vagonNo,
                'hbl_date' => $request->hblDate,
                'talex' => $request->talex,
                'free_time' => $request->freeTime,
                'status' => 'planning',
                'slug' => $auth->unique_id . '-' . $recepNo,

            ]);

            if (empty($booking))  return;

            BookingPackageDetails::create([
                'commodity' => $request->commodity,
                'total_pack' => $request->totalPack,
                'in_container' => $request->inContainer,
                'ladameter' => $request->ladameter,
                'brut_wg' => $request->brutWg,
                'price_wg' => $request->priceWg,
                'volume' => $request->volume,
                'commodity_type' => $request->commodityType,
                'hts_no' => $request->htsNo,
                'addr_unno' => $request->addrUnno,
                'optimum_temperature' => $request->optimumTemperature,
                'gtip_id' => $request->gtpId,
                'tag_names' => $request->tagNames,
                'booking_id' => $booking->id,
            ]);
            BookingCollectionPoint::create([
                'load_date' => $request->loadDate,
                'sender_id' => $request->senderId,
                'loader_id' => $request->loaderId,
                'load_place_type' => $request->loadPlaceType,
                'load_place' => '$request->loadPlace',
                'load_place_id' => 1,
                'dep_zipcode' => $request->depZipCode,
                'load_city_id' => $request->loadCityId,
                'load_country' => $request->htsNo,
                'load_custom_id' => $request->loadCustomId,
                'load_customofficer_id' => $request->loadCustomOfficerId,
                'check_load_customofficer' => $request->gtpId,
                'load_center_id' => $request->loadCenterId,
                'booking_id' => $booking->id,
            ]);
            BookingDeliveryPoint::create([
                'unload_date' => $request->unloadDate,
                'consignee_id' => $request->consigneeId,
                'delivery_id' => $request->deliveryId,
                'termin_date' => $request->terminDate,
                'unload_place_type' => $request->unLoadPlaceType,
                'unload_place' => '',
                'unload_place_id' => $request->unLoadPlaceId,
                'arv_zipcode' => $request->arvZipCode,
                'unload_city_id' => $request->unloadCityId,
                'unload_country' => $request->unloadCountry,
                'unload_custom_id' => $request->unloadCustomId,
                'unload_customofficer_id' => $request->gtpId,
                'check_load_customofficer' => $request->unloadCustomerOfficer,
                'unload_center_id' => '1',
                'booking_id' => $booking->id,
            ]);
            BookingOtherDetails::create([
                'freight_price' => $request->freightPrice,
                'freight_curr' => $request->freightCurr,
                'incoterm' => $request->incoterm,
                'ppcc' => $request->ppcc,
                'agent_id' => $request->agentId,
                'letter_of_credit' => $request->letterOfCredit ? 1 : 0,
                'notes' => $request->notes,
                'agent_ref' => $request->agentRef,
                'notify1_id' => $request->notify1Id,
                'notify2_id' => $request->notify2Id,
                'product_price' => $request->productPrice,
                'product_curr' => $request->productCurr,
                'channel' => $request->channel,
                'document_date' => $request->documentDate,
                'project_id' => $request->projectId,
                'service_type_id' => $request->serviceTypeId,
                'booking_id' => $booking->id,
            ]);
        } catch (QueryException $th) {
            return response()->json(['errors' => $th, 'message' => $errorMessage], 500);
        }

        return new BookingResource($booking);
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

        $booking = Booking::where('slug', $id)->first();
        if ($booking) {
            return new BookingResource($booking);
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

        $booking = Booking::where('id', $id)->first();
        if ($booking) {
            $booking->forceDelete();
            return new BookingResource($booking);
        }
    }

    public function loadStatus(Request $request)
    {
        if (!$request->bookingId) return;
        $receipt_no = explode('-', $request->bookingId, 2)[1];
        $booking = Booking::where('receipt_no', $receipt_no)->first();

        if ($request->calloutInfo) {
            if ($booking) {
                $booking->planning_status = $request->calloutInfo ? 1 : 0;
                $booking->update();
            }
        } else  if ($request->savedStatus) {
            if ($booking) {
                $booking->saved_status = $request->savedStatus ? 1 : 0;
                $booking->update();
            }
        }

        return new BookingResource($booking);
    }
}
