<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDriversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('refno')->nullable();
            $table->timestamp('birth_date')->nullable();
            $table->string('phone_os')->nullable();
            $table->unsignedBigInteger('birth_place_id')->nullable();
            $table->unsignedBigInteger('operation_id')->nullable();
            $table->string('gsm')->nullable();
            $table->string('tel')->nullable();
            $table->string('work_type')->nullable();
            $table->string('avatar')->nullable();
            $table->string('branch_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('address')->nullable();
            $table->string('city_id')->nullable();
            $table->string('country_id')->nullable();
            $table->string('passport')->nullable();
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
        Schema::dropIfExists('drivers');
    }
}
