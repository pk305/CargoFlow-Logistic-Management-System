<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGldocsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gldocs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamp('doc_date')->nullable();
            $table->string('due_date')->nullable();
            $table->string('ledger_type')->nullable();
            $table->foreignId('operation_id')->references('id')->on('operations')->cascadeOnDelete();
            $table->foreignId('branch_id')->references('id')->on('branches')->cascadeOnDelete();
            $table->foreignId('company_id')->references('id')->on('companies')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gldocs');
    }
}
