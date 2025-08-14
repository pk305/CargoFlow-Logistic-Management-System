<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TemplateDoc extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'temp_code', 'invoice_id', 'template_id', 'doc_data', 'unique_code', 'html_data', 'created_by'];

    protected $dates = ['deleted_at'];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function saleInvoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

    public function template()
    {
        return $this->belongsTo(Template::class, 'template_id');
    }
}
