<?php

namespace App\Http\Resources\Booking;

use App\Http\Resources\Company\CompanyResourceMini;
use App\Http\Resources\Contact\ContactResourceMini;
use App\Http\Resources\Location\LocationResourceMini;
// use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $loadDate = '';
        if ($this->bookingCollection) {
            if ($this->bookingCollection->load_date) {
                $loadDate = $this->bookingCollection->load_date;
            }
        }
        $unloadDate = '';
        if ($this->bookingDelivery) {
            if ($this->bookingDelivery->unload_date) {
                $unloadDate = $this->bookingDelivery->unload_date;
            }
        }

        return [
            'id' => $this->id,
            'customerRef' => $this->customer_ref,
            'receiptNo' => $this->receipt_no,
            'status' => $this->status,
            'trackingStatus' => '',
            'debit' => '',
            'credit' => '',
            'operation' => $this->operation_id,
            'linkId' => $this->slug,
            'customer' => $this->company ? new CompanyResourceMini($this->company)  : null,
            'consignor' => $this->bookingCollection ? new CompanyResourceMini($this->bookingCollection->sender)  : null,
            'consignee' => $this->bookingDelivery ? new CompanyResourceMini($this->bookingDelivery->consignee)  : null,
            'unloadDate' => $unloadDate,
            'loadDate' => $loadDate,
            'totalPack' => $this->bookingPackage ? $this->bookingPackage->total_pack : null,
            'brutWg' => $this->bookingPackage ? $this->bookingPackage->brut_wg : null,
            'loadCountry' => $this->bookingCollection ? $this->bookingCollection->load_country : null,
            'loadZipCode' => $this->bookingCollection ? $this->bookingCollection->dep_zipcode : null,
            'loadCustom' => $this->bookingCollection ? new LocationResourceMini($this->bookingCollection->loadCustom) : null,
            'unloadCountry' => $this->bookingDelivery ? $this->bookingDelivery->unload_country : null,
            'unloadCustom' => $this->bookingDelivery ? new LocationResourceMini($this->bookingDelivery->unLoadCustom) : null,
            'loadType' => $this->load_type,
            'unLoadZipCode' => $this->bookingDelivery ? $this->bookingDelivery->arv_zipcode : null,
            'commodity' => $this->bookingPackage ? $this->bookingPackage->commodity : null,
            'commodityType' => $this->bookingPackage ? $this->bookingPackage->commodity_type : null,
            'volume' => $this->bookingPackage ? $this->bookingPackage->volume : null,
            'ladameter' => $this->bookingPackage ? $this->bookingPackage->ladameter : null,
            'freightCurr' => $this->bookingOtherDetails ? $this->bookingOtherDetails->freight_curr : null,
            'freightPrice' => $this->bookingOtherDetails ? $this->bookingOtherDetails->freight_price : null,
            'notes' => $this->bookingOtherDetails ? $this->bookingOtherDetails->notes : null,
        ];
    }
}
