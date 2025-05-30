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
        Schema::create('surgery_notes', function (Blueprint $table) {
            $table->id();
            $table->string('clinic_ref_no'); // Assuming clinicRefNo is a string
            $table->date('surgery_date');
            $table->string('surgery_type');
            $table->text('surgery_notes');
            $table->string('pathology_report_path')->nullable(); // Path to the uploaded image, can be null
            $table->timestamps();
            
            // Add a foreign key constraint if 'patients' table exists and clinic_ref_no is its primary key
            // $table->foreign('clinic_ref_no')->references('clinicRefNo')->on('patients')->onDelete('cascade');
        });
    }
    
    /**
    * Reverse the migrations.
    */
    public function down(): void
    {
        Schema::dropIfExists('surgery_notes');
    }
};
