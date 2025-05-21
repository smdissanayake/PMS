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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->string('clinicRefNo');
            // If you have a 'patients' table and 'clinicRefNo' is a unique key there, 
            // you might want to set up a foreign key constraint. Example:
            // $table->foreign('clinicRefNo')->references('clinicRefNo')->on('patients')->onDelete('cascade');
            $table->json('medications'); // Or $table->text('medications'); if your DB doesn't support JSON type well
            $table->date('next_appointment_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
}; 