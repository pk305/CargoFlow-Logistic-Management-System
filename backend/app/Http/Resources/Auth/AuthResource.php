<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $isError = ($this->code !== 200) ? true : false;

        return  [
            "errors" => $this->when($isError, [["code" => $this->code, "message" => $this->message]]),
            "lookup" => $this->when(isset($this->lookupData), $this->lookupData),
            "localizedMessage" => $this->when(isset($this->localizedMessage), $this->localizedMessage),
            "code" => $this->when(!$isError, $this->code),
            "message" => $this->message,
            "resourceName" => $this->resourceName,
            "statusCode" => $this->statusCode,
            "accessToken" => $this->accessToken ?? null
        ];
    }
}
