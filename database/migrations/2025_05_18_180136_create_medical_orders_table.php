<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medical_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->string('patient_clinic_ref_no');
            $table->datetime('order_date');
            $table->string('type');
            $table->string('sub_type')->nullable();
            $table->string('additional_type')->nullable();
            $table->string('consultant_name')->nullable();
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->date('birthday')->nullable();
            $table->timestamps();
            
            // Foreign key relationship with the clinic_ref_no column
            $table->foreign('patient_clinic_ref_no')->references('clinicRefNo')->on('patients');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_orders');
    }
};
