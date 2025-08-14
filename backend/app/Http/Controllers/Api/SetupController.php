<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SetupRequest;
use App\Http\Resources\Company\CompanyResource;
use App\Models\Branch;
use App\Models\City;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Image;

class SetupController extends Controller
{
    private $thumbPath, $uploadPath;

    public function __construct()
    {
        $this->thumbPath = storage_path() . '/app/public/media/thumbnails/';
        $this->uploadPath = storage_path() . '/app/public/media/';
        if (!file_exists($this->uploadPath) || !file_exists($this->thumbPath)) {
            Storage::makeDirectory('public/media/thumbnails');
            Storage::makeDirectory('public/media');
        }
    }

    public function store(Request $request)
    {

        // $pdf = PDF::loadView('pdf.invoice', $data);
        // return $pdf->download('invoice.pdf');

    }

    public function update(SetupRequest $request, $userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;
        $errorMessage = 'An Error occured at our end';
        $company =  Company::find($id);
        $user = User::find(Auth::id());
        $checkNew = false;

        if ($request->companyInfo) {
            $companyInfo = $request->companyInfo;
            $city = City::find($companyInfo['cityId']);
            //
            if ($company) {
                $company->name = $companyInfo['companyName'];
                $company->address = $companyInfo['companyAddress'];
                $company->email = $companyInfo['companyEmail'];
                $company->telephone = $companyInfo['companyTel'];
                $company->website = $companyInfo['companyWebsite'];
                $company->country_id = $companyInfo['countryId'];
                $company->postcode = $companyInfo['postcode'];
                $company->city_name = $city ?  $city->name : null;
                $company->city_id = $city ?  $city->id : null;
                $company->taxno = $companyInfo['taxNo'];
                $company->timezone_id = $companyInfo['timezoneId'];
                $company->update();
            } else {
                try {
                    $company =  new Company();
                    $company->name = $companyInfo['companyName'];
                    $company->address = $companyInfo['companyAddress'];
                    $company->email = $companyInfo['companyEmail'];
                    $company->telephone = $companyInfo['companyTel'];
                    $company->website = $companyInfo['companyWebsite'];
                    $company->country_id = $companyInfo['countryId'];
                    $company->postcode = $companyInfo['postcode'];
                    $company->city_name = $city ?  $city->name : null;
                    $company->city_id = $city ?  $city->id : null;
                    $company->is_client = 1;
                    $company->taxno = $companyInfo['taxNo'];
                    $company->timezone_id = $companyInfo['timezoneId'];
                    $company->save();
                    //
                    $checkNew = true;
                } catch (QueryException $th) {
                    return response()->json(['errors' => $th, 'message' => $errorMessage], 500);
                }

                if ($company->id) {
                    try {
                        $branch = new Branch();
                        $branch->name =  'Head Office';
                        $branch->address = $company->address;
                        $branch->phone = $company->telephone;
                        $branch->email = $user->email;
                        $branch->address = $company->address;
                        $branch->city_id = $company->city_id;
                        $branch->country_id = $company->country_id;
                        $branch->company_id = $company->id;
                        $branch->save();
                        //
                        $user->branch_id = $branch->id;
                        $user->update();
                    } catch (QueryException $th) {
                        return response()->json(['errors' => $th, 'message' => $errorMessage], 500);
                    }
                }
            }
            //user update
            $user->is_setup_company = 1;
            $user->company_id = $company->id;
            $user->is_admin = 1;
            $user->setup_company_process = $companyInfo['steps'];
            $user->slug =  Str::slug($user->name, '-');
            $user->update();
        }

        return response()->json([
            'company' => new CompanyResource($company),
            'steps' => $user->setup_company_process,
            'new' => $checkNew
        ]);
    }

    public function companyPersonnel(Request $request, $userId)
    {
        if (!Auth::user()->unique_id === $userId) return;
        $user = User::find(auth()->user()->id);
        if ($request->companyPersona) {
            $companyPersona = $request->companyPersona;
            $company =  Company::find($companyPersona['companyId']);

            if ($company) {
                $company->persona = $companyPersona['setupPersona'];
                $company->update();
            }
            //
            $user->is_setup_company = 1;
            $user->setup_company_process = $companyPersona['steps'];
            $user->update();

            return response()->json(['steps' => $user->setup_company_process]);
        }
    }

    public function companyLogo(Request $request, $userId)
    {
        if (!Auth::user()->unique_id === $userId) return;
        $user = User::find(Auth::id());
        if ($request->companyLogo) {
            $companyLogo = $request->companyLogo;
            $company =  Company::find($companyLogo['companyId']);
            if ($companyLogo['currentAvatar'] !== null) {
                $file = $companyLogo['currentAvatar'];
                // split base64 data
                $splited = explode(',', $file, 2);
                $mime = $splited[0];
                $base64_data = $splited[1];
                // mime split without base64
                $mime_ext = explode('/', explode(';', $mime, 2)[0], 2)[1];
                // check if is ext
                $filename = Str::random(15) . '.' .  $mime_ext;
                // decode base64
                $decodeImg = base64_decode($base64_data);
                // thumbnail
                Image::make($decodeImg)->resize(50, 50)->save($this->thumbPath . $filename);
                Image::make($decodeImg)->save($this->uploadPath . $filename);
                $url = '/assets/media/' . $filename;

                if ($company->logo !== null) {
                    File::delete($this->uploadPath . $company->logo);
                }
                $company->logo = $filename;
                $company->logo_base64 = $file;
                $company->logo_url = env('APP_URL') . $url;
                $company->update();
                //
                $user->is_setup_company = 1;
                $user->setup_company_process = $companyLogo['steps'];
                $user->update();

                return response()->json(['steps' => $user->setup_company_process]);
            }
        }
    }

    public function companyBranch(SetupRequest $request, $userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;
        // $company =  Company::find($id);
        // $user = User::find(auth()->user()->id);
        // $city = City::find($request->cityId);

        // if ($request->companyInfo) {
        //     $companyInfo = $request->companyInfo;

        //     if ($company) {
        //         $company->name = $companyInfo['companyName'];
        //         $company->address = $companyInfo['companyAddress'];
        //         $company->email = $companyInfo['companyEmail'];
        //         $company->telephone = $companyInfo['companyTel'];
        //         $company->website = $companyInfo['companyWebsite'];
        //         $company->country_id = $companyInfo['countryId'];
        //         $company->postcode = $companyInfo['postcode'];
        //         $company->city_name = $companyInfo['cityName'];
        //         $company->taxno = $companyInfo['taxNo'];
        //         $company->timezone_id = $companyInfo['timezoneId'];
        //         $company->update();
        //     }

        //     $user->is_setup_company = 1;
        //     $user->setup_company_process = $companyInfo['steps'];
        //     $user->update();
        // } else if ($request->companyPersona) {
        //     $companyPersona = $request->companyPersona;

        //     if ($company) {
        //         $company->persona = $companyPersona['setupPersona'];
        //         $company->update();
        //     }
        //     //
        //     $user->is_setup_company = 1;
        //     $user->setup_company_process = $companyPersona['steps'];
        //     $user->update();
        // } elseif ($request->companyLogo) {
        //     $companyLogo = $request->companyLogo;

        //     if ($companyLogo['logo'] !== null) {
        //         $file = $companyLogo['logo'];
        //         // split base64 data
        //         $splited = explode(',', $file, 2);
        //         $mime = $splited[0];
        //         $base64_data = $splited[1];
        //         // mime split without base64
        //         $mime_ext = explode('/', explode(';', $mime, 2)[0], 2)[1];
        //         // check if is ext
        //         $filename = Str::random(15) . '.' .  $mime_ext;
        //         // decode base64
        //         $decodeImg = base64_decode($base64_data);
        //         // thumbnail
        //         Image::make($decodeImg)->resize(50, 50)->save($this->thumbPath . $filename);
        //         Image::make($decodeImg)->save($this->uploadPath . $filename);
        //         $url = '/assets/media/' . $filename;
        //         //
        //         if ($company) {
        //             if ($company->logo !== null) {
        //                 File::delete($this->uploadPath . $company->logo);
        //             }
        //             $company->logo = $filename;
        //             $company->logo_base64 = $file;
        //             $company->logo_url = env('APP_URL') . $url;
        //             $company->update();
        //         }
        //     }
        //     //
        //     $user->is_setup_company = 1;
        //     $user->setup_company_process = $companyLogo['steps'];
        //     $user->update();
        // } elseif ($request->branchInfo) {
        //     $branchInfo = $request->branchInfo;

        //     // if ($branchInfo['logo']) {
        //     // }
        //     //
        //     $user->is_setup_company = 1;
        //     $user->setup_company_process = $branchInfo['steps'];
        //     $user->update();
        // } elseif ($request->operationInfo) {
        //     $operationInfo = $request->operationInfo;

        //     // if ($operationInfo['logo']) {
        //     // }
        //     //
        //     $user->is_setup_company = 0;
        //     $user->setup_company_process = $operationInfo['steps'];
        //     $user->update();
        // }



        return response()->json($request->all());

        // return response()->json(['company' => new CompanyResource($company), 'steps' => $user->setup_company_process]);
    }

    // public function show($userId, $id)
    // {
    //     if (!Auth::user()->unique_id === $userId) return;
    //     $uuid = explode('-', $id, 2)[0];
    //     $user = User::where('unique_id', $uuid)->first();
    //     if ($user) {
    //         return new UserResource($user);
    //     }
    // }
}
