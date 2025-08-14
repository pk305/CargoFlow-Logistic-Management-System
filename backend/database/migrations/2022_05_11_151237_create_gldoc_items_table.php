<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGldocItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gldoc_items', function (Blueprint $table) {
            $table->id();
            $table->string('account_type')->nullable();
            $table->timestamp('notes')->nullable();
            $table->double('debit')->nullable();
            $table->double('credit')->nullable();
            $table->string('account_id')->nullable();
            $table->string('curr_id')->nullable();
            $table->double('debit_local')->nullable();
            $table->double('curr_rate')->nullable();
            $table->double('credit_local')->nullable();
            $table->foreignId('gldoc_id')->references('id')->on('gldocs')->cascadeOnDelete();
            $table->foreignId('profit_center_id')->references('id')->on('profit_centers')->cascadeOnDelete();
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
        Schema::dropIfExists('gldoc_items');
    }
}
