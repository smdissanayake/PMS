<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('surgeries', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('ref_no');
            $table->string('uhid');
            $table->string('surgery_name');
            $table->date('date');
            $table->time('time');
            $table->timestamps();

            // Add unique constraint to prevent duplicate surgeries
            $table->unique(['ref_no', 'date', 'time'], 'unique_surgery_schedule');
        });
    }

    public function down()
    {
        Schema::dropIfExists('surgeries');
    }
}; 