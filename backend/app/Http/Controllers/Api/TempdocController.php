<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Template\TempdocResource;
use App\Models\Invoice;
use App\Models\Template;
use App\Models\TemplateDoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class TempdocController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $invoice = Invoice::find($request->invoiceId);
        $template = Template::where('ref_code', $request->tempCode)->first();
        if (empty($invoice) || empty($template)) return response()->json(['errors' => 'An Error occured', 'message' => 'Bad Request'], 400);

        $randInt = random_int(100000, 999999);
        $tempdoc = TemplateDoc::create([
            'unique_code' => $randInt,
            'temp_code' => $request->tempCode,
            'doc_data' => json_encode($request->tempdocData),
            'invoice_id' =>  $invoice->id,
            'template_id' =>  $template->id,
            'html_data' => json_encode($request->tempHtml),
            'name' => (string) $randInt . '-' . $template->slug,
            'created_by' => Auth::id()
        ]);

        // return response()->json($tempdoc);
        return new TempdocResource($tempdoc);
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
        $explode = explode('-', $id);
        if (!count($explode) > 0) return;

        $tempdoc = TemplateDoc::where('unique_code', $explode[0])->first();
        if ($tempdoc) {
            return new TempdocResource($tempdoc);
        }

        // return response()->json($id);
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

        $tempdoc = TemplateDoc::where('unique_code', $id)->first();
        if ($tempdoc) {
            $tempdoc->doc_data = json_encode($request->tempdocData);
            $tempdoc->html_data = json_encode($request->tempHtml);
            $tempdoc->update();

            return new TempdocResource($tempdoc);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function pdfDownload(Request $request, $userId)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $tempdoc = TemplateDoc::where('unique_code', $request->tempdocDataId)->first();
        if ($tempdoc) {
            $doc = $tempdoc->html_data ? json_decode(json_decode($tempdoc->html_data)) : null;

            if ($doc) {
                $pdf = App::make('dompdf.wrapper');
                $pdf->loadView('pdf.invoice_freight', ['doc' => $doc]);
                $pdf->render();

                // Log::info($doc);

                // return;
                return response($pdf->stream())->header('Cache-Control', $tempdoc->name);
            }
        }
    }
}
