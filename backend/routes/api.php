<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FinancialController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SetupController;
use App\Http\Controllers\Api\TempdocController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CurrencyListController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\FindocController;
use App\Http\Controllers\Api\FinitemController;
use App\Http\Controllers\Api\FinpointController;
use App\Http\Controllers\Api\GldocController;
use App\Http\Controllers\Api\IbanController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\LedgerController;
use App\Http\Controllers\Api\OperationController;
use App\Http\Controllers\Api\ProfitCenterController;
use App\Http\Controllers\Api\TaxcodeController;
use App\Http\Controllers\Api\TimezoneController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => '/signin'], function () {
    Route::controller(AuthController::class)->group(function () {
        Route::post('/lookup/{query}', 'lookupUser');
        Route::post('/primary/{id}', 'passwordAuth');
    });
});

//** authenticated routes */
Route::group(['middleware' => ['auth:api']], function () {
    // auth:api
    Route::get('/api/userdetails', [AuthController::class, 'fetchUser']);
    Route::group(['prefix' => '/adminapi/orgs/{orgId}'], function () {
        Route::post('checkUser', [AuthController::class, 'checkUser']);
        Route::apiResources([
            'loadings' => BookingController::class,
            'contacts' => ContactController::class,
            'companies' => CompanyController::class,
            'locations' => LocationController::class,
            'positions' => PositionController::class,
            'tempdocs' => TempdocController::class,
            'users' => UserController::class,
            'financials' => FinancialController::class,
            'currencies' => CurrencyListController::class,
            'finitems' => FinitemController::class,
            'profit_centers' => ProfitCenterController::class,
            'taxcodes' => TaxcodeController::class,
            'operations' => OperationController::class,
            'branches' => BranchController::class,
            'leads' => LeadController::class,
            'ledgers' => LedgerController::class,
            'ibans' => IbanController::class,
            'finpoints' => FinpointController::class,
            'vehicles' => VehicleController::class,
            'cities' => CityController::class,
            'findocs' => FindocController::class,
            'gldocs' => GldocController::class,
            'drivers' => DriverController::class,
        ]);


        Route::post('loadings/load_status', [BookingController::class, 'loadStatus']);
        Route::post('contacts/load_status', [ContactController::class, 'loadStatus']);

        Route::post('company/logo', [CompanyController::class, 'uploadLogo']);
        Route::post('company/org', [CompanyController::class, 'defOrganization']);
        Route::get('company/logo_dataurl', [CompanyController::class, 'logoDataurl']);

        Route::post('fetch_invoices', [InvoiceController::class, 'index']);
        Route::get('invoices/{invoice}', [InvoiceController::class, 'showInvoice']);
        Route::post('check_invoice_company', [InvoiceController::class, 'checkInvoiceCompany']);
        Route::post('invoices', [InvoiceController::class, 'storeInvoice']);
        Route::post('invoices/confirm_status', [InvoiceController::class, 'confirmStatus']);
        Route::post('invoices/insights', [InvoiceController::class, 'insights']);
        Route::delete('invoices/{invoice}', [InvoiceController::class, 'destroy']);

        Route::post('financials/account', [FinancialController::class, 'fetchAccount']);

        Route::post('tempdocs/pdf', [TempdocController::class, 'pdfDownload']);

        Route::post('setups', [SetupController::class, 'store']);
        Route::put('setups/{setup}', [SetupController::class, 'update']);
        Route::post('setups/company_personnel', [SetupController::class, 'companyPersonnel']);
        Route::post('setups/company_logo', [SetupController::class, 'companyLogo']);

        Route::post('searches', [SearchController::class, 'filter']);

        Route::get('timezones', [TimezoneController::class, 'index']);

        Route::post('templates/{template}', [TemplateController::class, 'findTemplate']);
        Route::post('logout', [AuthController::class, 'logoutUser']);
    });
});
