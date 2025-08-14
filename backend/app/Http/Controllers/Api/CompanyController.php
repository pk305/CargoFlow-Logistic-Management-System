<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Resources\Company\CompanyResource;
use App\Models\City;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Financial;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Redis;
use Intervention\Image\Facades\Image;

class CompanyController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $cacheCompanies = Redis::get('get.company');
        // if ($cacheCompanies) {
        //      return response()->json($cacheCompanies);
        // } else {
        $company = Company::with(['saler', 'financial'])->orderBy('id', 'desc')->get();
        //     // Redis::set('get.company', $company);
        return  CompanyResource::collection($company);
        // }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCompanyRequest $request)
    {
        $errorMessage = 'An Error occured at our end';
        $company = null;
        $saler = User::where('unique_id', $request->companySalerId)->first();
        $city = City::find($request->cityId);
        // ALTER TABLE MY_TABLE AUTO_INCREMENT = 111111;
        try {
            $company = new Company();
            $company->name =  ucfirst($request->companyName);
            $company->city_name = ucfirst($city->name);
            $company->city_id = $city ? $city->id : null;
            $company->country_id = $request->countryId;
            $company->district = $request->district;
            $company->postcode = $request->postcode;
            $company->address = $request->address;
            $company->eori_code = $request->eoriCode;
            $company->taxoffice = $request->taxOffice;
            $company->taxno = $request->taxNo;
            $company->telephone = $request->companyTel;
            $company->fax = $request->companyFax;
            $company->email = Str::lower($request->companyEmail);
            $company->website = Str::lower($request->companyWebsite);
            $company->saler_id = $saler ? $saler->unique_id : null;
            $company->saler_name = $saler ? $saler->name : null;
            $company->company_group = $request->companyGroup;
            $company->company_type = $request->companyType;
            $company->company_sector = $request->companySector;
            // $company->tag_names = $request->tagNames;
            $company->notes = $request->notes;
            $company->branch_id = $request->branchId;
            $company->main_branch = $request->branchId ? 1 : 0;
            $company->contact_name = ucfirst($request->contactsAttrName);
            $company->job_title = $request->contactsAttrJobTitle;
            $company->contact_phone =  $request->contactsAttrTel;
            $company->contact_email = Str::lower($request->contactsAttrEmail);
            $company->save();
            // 
            if (!empty($company)) {
                $financial = new Financial();
                $financial->company_title = ucwords($request->companyName);
                $financial->financial_email = Str::lower($request->companyEmail);
                $financial->save();
                $company->financial_id = $financial->id;
                $company->update();
            }
        } catch (QueryException $ex) {
            return response()->json(['errors' => $ex, 'message' => $errorMessage], 500);
        }
        // 
        // if ($request->contactsAttrName !== '') {
        //     try {
        //         Contact::create([
        //             'name' => ucfirst($request->contactsAttrName),
        //             'email' => Str::lower($request->contactsAttrEmail),
        //             'jobtitle' => $request->contactsAttrJobTitle,
        //             'telephone' => $request->contactsAttrTel,
        //             'company_id' => $company->id,
        //         ]);
        //     } catch (QueryException $ex) {
        //         return response()->json(['errors' => $ex, 'message' => $errorMessage], 500);
        //     }
        // }

        return  new CompanyResource($company);
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

        $company = Company::find($id);
        if ($company) {
            return  new CompanyResource($company);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreCompanyRequest $request, $userId, $id)
    {
        if (!Auth::user()->unique_id === $userId) return;
        $errorMessage = 'An Error occured at our end';
        $saler = User::where('unique_id', $request->companySalerId)->first();
        $company = Company::find($id);
        $city = City::find($request->cityId);

        if ($company) {
            $company->name =  ucfirst($request->companyName);
            $company->city_name = ucfirst($city->name);
            $company->city_id = $city ? $city->id : null;
            $company->country_id = $request->countryId;
            $company->district = $request->district;
            $company->postcode = $request->postcode;
            $company->address = $request->address;
            $company->eori_code = $request->eoriCode;
            $company->taxoffice = $request->taxOffice;
            $company->taxno = $request->taxNo;
            $company->telephone = $request->companyTel;
            $company->fax = $request->companyFax;
            $company->email = Str::lower($request->companyEmail);
            $company->website = Str::lower($request->companyWebsite);
            $company->saler_id = $saler ? $saler->unique_id : null;
            $company->saler_name = $saler ? $saler->name : null;
            $company->company_group = $request->companyGroup;
            $company->company_type = $request->companyType;
            $company->company_sector = $request->companySector;
            // $company->tag_names = $request->tagNames;
            $company->notes = $request->notes;
            $company->branch_id = $request->branchId;
            $company->contact_name = ucfirst($request->contactsAttrName);
            $company->job_title = $request->contactsAttrJobTitle;
            $company->contact_phone =  $request->contactsAttrTel;
            $company->contact_email = Str::lower($request->contactsAttrEmail);
            $company->update();

            try {
                $financial =  Financial::find($company->financial_id);
                $financial->company_title = ucwords($request->companyName);
                $financial->financial_email = Str::lower($request->companyEmail);
                $financial->update();
            } catch (QueryException $e) {
                return response()->json(['errors' => $e, 'message' => $errorMessage], 500);
            }

            // try {
            //     $contact =   Contact::find($company->contact_id);
            //     if ($contact) {
            //         $contact->name = ucfirst($request->contactsAttrName);
            //         $contact->email =  Str::lower($request->contactsAttrEmail);
            //         $contact->jobtitle = ucfirst($request->contactsAttrJobTitle);
            //         $contact->telephone = $request->contactsAttrTel;
            //         $contact->update();
            //     }
            // } catch (QueryException $ex) {
            //     return response()->json(['errors' => $ex, 'message' => $errorMessage], 500);
            // }

            return  new CompanyResource($company);
        }
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

        $company = Company::find($id);
        if ($company) {
            $company->delete();

            return new CompanyResource($company);
        }
    }
    public function defOrganization(Request $request)
    {
        $user = Auth::user();
        if (!$user->unique_id === $request->userId) return;

        $company = Company::where(['id' => $user->company_id, 'is_client' => 1])->first();
        if ($company) {
            return  new CompanyResource($company);
        }

        return response()->json($company);
    }

    public function uploadLogo(Request $request)
    {
        if (!Auth::user()->unique_id === $request->userId) return;
        $thumbPath = '/media/thumbnails';
        $uploadPath = '/media';
        if (!file_exists($uploadPath) || !file_exists($thumbPath)) {
            Storage::makeDirectory('public' . $thumbPath);
            Storage::makeDirectory('public' . $uploadPath);
        }
        $user = Auth::user();
        $company = Company::where(['id' => $user->company_id])->first();
        if ($request->currentAvatar !== null) {
            $file = $request->currentAvatar;
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
            Image::make($decodeImg)->resize(50, 50)->save(storage_path() . '/app/public' . $thumbPath . '/' . $filename);
            Image::make($decodeImg)->save(storage_path() . '/app/public' . $uploadPath  . '/' . $filename);
            $url = '/assets/media/' . $filename;

            if ($company) {
                if ($company->logo !== null) {
                    File::delete(storage_path() . '/app/public' . $uploadPath . '/' . $company->logo);
                }
                $company->logo = $filename;
                $company->logo_base64 = $file;
                $company->logo_url = env('APP_URL') . $url;
                $company->update();
            }
        } else {
            if ($company) {
                if ($company->logo !== null) {
                    File::delete(storage_path() . '/app/public' . $uploadPath . '/' . $company->logo);
                }
                $company->logo = null;
                $company->logo_base64 = null;
                $company->logo_url = null;
                $company->update();
            }
        }
        // //favicon
        // if ($request->currentFavicon !== null) {
        //     $file = $request->currentFavicon;
        //     // split base64 data
        //     $splited = explode(',', $file, 2);
        //     $mime = $splited[0];
        //     $base64_data = $splited[1];
        //     // mime split without base64
        //     $mime_ext = explode('/', explode(';', $mime, 2)[0], 2)[1];
        //     // check if is ext
        //     $filename = 'favicon.ico';
        //     // decode base64
        //     $decodeImg = base64_decode($base64_data);
        //     // thumbnail
        //     $path = Storage::putFileAs('public/favicon', $file, $filename);
        //     if ($company) {
        //         File::delete(storage_path() . '/app/public' . $path);
        //         $company->favicon = $filename;
        //         $company->logo_base64 = $file;
        //         $company->favicon_url = env('APP_URL') . $url;
        //         $company->update();
        //     }
        // } else {
        //     if ($company) {
        //         File::delete(storage_path() . '/app/public/favicon/' . $company->favicon);
        //         $company->favicon = null;
        //         $company->logo_base64 = null;
        //         $company->favicon_url = null;
        //         $company->update();
        //     }
        // }

        return  new CompanyResource($company);
    }

    public function logoDataurl()
    {
        $user = User::find(auth()->id())->load('company');

        if ($user) {
            return response()->json(['logoDataUrl' => $user->company->logo_base64, 'companyId' => $user->company->id, 'companyName' => $user->company->name]);
        }
    }
}
