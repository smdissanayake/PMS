<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investigation_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_order_id')->constrained('medical_orders')->onDelete('cascade');
            $table->string('patient_clinic_ref_no');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Foreign key relationship with the clinic_ref_no column
            $table->foreign('patient_clinic_ref_no')->references('clinicRefNo')->on('patients');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investigation_reports');
    }
}; 