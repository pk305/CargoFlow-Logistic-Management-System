<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Template\TemplateResource;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TemplateController extends Controller
{
    public function findTemplate(Request $request, $userId)
    {
        if (!Auth::user()->unique_id === $userId) return;

        $template = Template::where('type',  $request->type)->with('templatedocs')->orderBy('id', 'desc')->get();
        return  TemplateResource::collection($template);
    }
}
