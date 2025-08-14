<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\FileUploadTrait;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use FileUploadTrait;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = User::where(['company_id' => Auth::user()->company_id])->orderBy('created_at', 'desc')->get();
        return  UserResource::collection($user);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $auth = Auth::user();
        $r = $this->saveUploadFile($request, null);

        $user = new User();
        $user->name = ucwords($r->userName);
        $user->email = $r->email;
        $user->mobile_number = $r->phone;
        $user->access_level = 1;
        $user->country_code = '254';
        $user->company_id =  $auth->company_id;
        $user->unique_id = mt_rand(999999999, 1111111111);
        $user->is_setup_company = 0;
        $user->setup_company_process = 1;
        $user->language = $r->language;
        $user->office_tel = $r->officeTel;
        $user->avatar = $r->attachFile;
        $user->timezone = $r->userTimeZone;
        $user->slug = (string) Str::lower(Str::slug($r->userName, '-')) . '-' . $user->unique_id;
        $user->status = 1;
        $user->password = $r->password ? Hash::make($r->password) : null;
        $user->save();

        return new UserResource($user);
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
        $uuid = explode('-', $id, 2)[0];
        $user = User::where('unique_id', $uuid)->first();
        if ($user) {
            return new UserResource($user);
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

        $userIds = [];
        if (count(json_decode($id)) > 0) {
            foreach (json_decode($id) as $item) {
                $userIds[] = $item->Id;
            }
        }

        $users = User::whereIn('unique_id', $userIds)->get();

        return response()->json($users);
    }
}
