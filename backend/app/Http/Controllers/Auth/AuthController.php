<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Auth\AuthResource;
use App\Http\Resources\Auth\UserDetails;
use App\Http\Resources\Company\CompanyResourceMini;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $proxy;

    public function __construct()
    {
        $this->middleware('auth:api')->except(['lookupUser', 'passwordAuth']);
    }

    public function lookupUser(Request $request, $id)
    {
        if (!$id) return;
        $user = null;
        if (filter_var($id, FILTER_VALIDATE_EMAIL)) {
            $user = User::where(['email' => $id])->first();
        } else {
            $loginUser = preg_replace('/([^@]*).*/', '$1', $id); //filter username in email
            $user = User::where('username', $id)->orWhere('mobile_number', $loginUser)->first();
        }
        $userData = [];
        if (empty($user)) {
            $userData = (object)[
                "code" => 401,
                "message" => "User does not exists",
                "localizedMessage" => "This account cannot be found. Please use a different account or contact Administrator to check your account.",
                "resourceName" => "lookup",
                "statusCode" => 400,
                "lookupData" => null
            ];

            return response(new AuthResource($userData), 401);
        }

        $verifier = (string) Str::orderedUuid();
        $userId = $user->id;
        $userData = (object)[
            "code" => 200,
            "message" => "User exists",
            "resourceName" => "lookup",
            "localizedMessage" => null,
            "statusCode" => 201,
            "lookupData" => [
                "df" =>  $verifier,
                "href" => $request->url(),
                "identifier" => $userId,
                "loginId" => $id
            ]
        ];

        return new AuthResource($userData);
    }

    public function passwordAuth(Request $request, $id)
    {
        $validated = $request->validate(['password' => 'required|max:255']);
        if (!$validated)  return;
        $user = User::where('id', $id)->first();

        if (!$user)  return;
        return $this->requestPasswordGrant($request, $user);
    }

    public function requestPasswordGrant($request, $user)
    {
        request()->request->add([
            'client_id' => config('auth.proxy.client_id'),
            'client_secret' => config('auth.proxy.client_secret'),
            'grant_type' => config('auth.proxy.grant_type'),
            'username' => $user->email,
            'password' => $request->password,
            'scopes' => '*'
        ]);

        try {
            $proxy = Request::create('oauth/token', 'POST');
            $response = Route::dispatch($proxy);
            $content = json_decode($response->getContent(), true);
            //
            $userData = [];
            if (!$response->isSuccessful()) {
                // $this->incrementLoginAttempts($request);
                $userData = (object)[
                    "code" => $response->getStatusCode(),
                    "message" => "Error Occured.",
                    "resourceName" => "passwordAuth",
                    "localizedMessage" => "An Error occured, Please try again later!",
                    "statusCode" => 500,
                    "lookupData" => null
                ];
                //
                if ($response->getStatusCode() === 400) {
                    $userData = (object)[
                        "code" => 102,
                        "message" => "Invalid password",
                        "resourceName" => "passwordAuth",
                        "localizedMessage" => "Incorrect password. Please try again.",
                        "statusCode" => 500,
                        "lookupData" => null
                    ];
                }

                return new AuthResource($userData);
            }

            $userData = (object)[
                "code" => $response->getStatusCode(),
                "message" => "Successfully Logged In",
                "resourceName" => "passwordAuth",
                "localizedMessage" => "Successfully Logged In",
                "statusCode" => 200,
                "lookupData" => null,
            ];

            $expirationMinutes = ($content['expires_in'] ?? 3600) / 60;

            $response = response()->json(new AuthResource($userData));
            $token = $content['access_token'];
            $refresh_token = $content['refresh_token'];
            $response->cookie(
                '__ftxn',
                $token,
                $expirationMinutes,
                '/',
                config('app.url') ? parse_url(config('app.url'), PHP_URL_HOST) : null,
                config('app.env') === 'production',
                true,
                false,
                config('app.env') === 'production' ? 'strict' : 'lax'
            );

            if (!empty($content['refresh_token'])) {
                $response->cookie(
                    '__rftuuid',
                    $refresh_token,
                    $expirationMinutes,
                    '/',
                    config('app.url') ? parse_url(config('app.url'), PHP_URL_HOST) : null,
                    config('app.env') === 'production',
                    true,
                    false,
                    config('app.env') === 'production' ? 'strict' : 'lax'
                );
            }

            return $response;
        } catch (QueryException $e) {
            return response($e, 400);
        }
    }

    public function fetchUser(Request $request)
    {
        $user = $request->user();
        if (!empty($user)) {
            $data = (object) [
                'statusCode' => 200,
                'userDetails' => [
                    'uuid' => $user->unique_id,
                    'email' => $user->email,
                    'slug' => $user->slug,
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'isSetupCompany' => $user->is_setup_company,
                    'setupCompanyProgress' => $user->setup_company_process,
                    'company' => new CompanyResourceMini($user->company),
                    'branch' => $user->branch ? ['name' => $user->branch->name, 'id' => $user->branch->id] : null,
                    'operation' => $user->operation ? ['name' => $user->operation->name, 'id' => $user->operation->id] : null,
                    'timezone' => $user->timezone ? ['name' => $user->timezone->name, 'id' => $user->timezone->id, 'code' => $user->timezone->code] : null,
                    'countryId' => $user->country_id,
                ]
            ];

            return new UserDetails($data);
        }

        $data = (object) [
            'statusCode' => 401,
            'userDetails' => null
        ];

        return new UserDetails($data);
    }

    public function checkUser(Request $request)
    {
        $user = Auth::user();
        if (!empty($user)) {
            return new UserResource($user, $request->clientId);
        }
    }

    public function logoutUser(Request $request)
    {
        $user = !empty($request->user()) && $request->isAuth ? $request->user() : null;
        if ($user) {
            $accessToken = $user->token();

            DB::table('oauth_refresh_tokens')
                ->where('access_token_id', $accessToken->id)
                ->delete();
            $accessToken->revoke();

            $data = (object) [
                'statusCode' => 200,
                'revoked' => $accessToken->revoked
            ];

            $response = response()->json($data, 200);

            $response->cookie(Cookie::forget('__ftxn'));

            $response->cookie(Cookie::forget('__rftuuid'));

            return $response;
        }
    }

    /**
     * Helper method to create secure cookies
     */
    private function createSecureCookie($name, $value, $expirationMinutes)
    {
        return Cookie::make(
            $name,
            $value,
            $expirationMinutes,
            '/',
            config('app.url') ? parse_url(config('app.url'), PHP_URL_HOST) : null,
            config('app.env') === 'production',
            true,
            false,
            config('app.env') === 'production' ? 'strict' : 'lax'
        );
    }
}
