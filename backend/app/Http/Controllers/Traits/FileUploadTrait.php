<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;

trait FileUploadTrait
{
    private $thumbPath, $uploadPath;

    public function __construct()
    {
        $this->thumbPath = public_path(env('UPLOAD_PATH') . 'media/thumbnails');
        $this->uploadPath = public_path(env('UPLOAD_PATH') . 'media');
        if (!file_exists($this->uploadPath)) {
            if (!file_exists($this->uploadPath)) {
                Storage::makeDirectory('public/media/thumb');
                Storage::makeDirectory('public/media');
            }
        }
    }



    /**
     * File upload trait used in controllers to upload files
     */
    public function saveUploadFile(Request $request, $previousFile)
    {
        $finalRequest = $request;

        if ($request->has('attachFile')) {
            if ($request->hasFile('attachFile')) {
                foreach ($request->attachFile as $fileData) {
                    $filename = Str::random(15) . '.' . $fileData->getClientOriginalExtension();
                    //     Image::make($fileData)->resize(50, 50)->save($this->thumbPath . $filename);
                    //     Image::make($fileData)->save($this->uploadPath . $filename);
                    $fl = Storage::putFileAs('public/media',  new File($fileData), $filename);
                    if ($fl) {
                        if ($previousFile !== null) {
                            Storage::delete('/public/media/' . $previousFile);
                        }
                    }

                    $finalRequest = new Request(array_merge($finalRequest->all(), ['attachFile' => $filename]));
                }
            }
        }

        return $finalRequest;
    }

    // /**
    //  * File upload trait used in controllers to upload files
    //  */
    // public function saveProductImg(Request $request)
    // {
    //     $finalRequest = $request;

    //     if ($request->has('productImages')) {
    //         if ($request->hasFile('productImages')) {
    //             $files = [];
    //             foreach ($request->productImages as $fileData) {
    //                 $filename = Str::random(32) . '.' . $fileData->getClientOriginalExtension();
    //                 //thumbnail
    //                 Image::make($fileData)->resize(50, 50)->save($this->thumbPath . $filename);
    //                 //image
    //                 $img = Image::make($fileData)->save($this->uploadPath . $filename);
    //                 $url = env('APP_URL') . "/assets/images/" . $filename;

    //                 /////
    //                 // $canvas = Image::canvas(245, 245);
    //                 // $image  = Image::make($fileData)->resize(245, 245, function ($constraint) {
    //                 //     $constraint->aspectRatio();
    //                 // });
    //                 // $canvas->insert($image, 'center');
    //                 // $canvas->save($this->thumbPath . '/245x245/' . $filename);

    //                 $files[] = [
    //                     'filename' => $filename,
    //                     'height' => $img->height(),
    //                     'width' => $img->width(),
    //                     'url' =>  $url
    //                 ];
    //             }

    //             $finalRequest = new Request(array_merge($finalRequest->all(), ['productImages' => $files]));
    //         }
    //     }

    //     return $finalRequest;
    // }
}
