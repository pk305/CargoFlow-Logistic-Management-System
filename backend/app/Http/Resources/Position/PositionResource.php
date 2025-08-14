<?php

namespace App\Http\Resources\Position;

use Illuminate\Http\Resources\Json\JsonResource;

class PositionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'branch' => $this->branch_id,
            'transMethod' => $this->trans_method,
            'company' => $this->company_id,
            'name' => $this->name,
            'linkId' => $this->slug,
        ];
    }
}

// : 1
// : 3
// : null
// created_at: "2022-04-27T07:41:10.000000Z"
// created_by: 1
// customer_ref: null
// deleted_at: null
// free_time: null
// hbl_date: null
// id: 27
// load_type: "KP"
// operation_id: "1"
// planning_status: 0
// receipt_no: "nue2020227"
// saler_id: 9835373726
// saved_status: 1
// status: null
// talex: null
// updated_at: "2022-04-27T07:41:11.000000Z"
// vagon_no: null