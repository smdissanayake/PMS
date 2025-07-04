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
        Schema::create('special_items', function (Blueprint $table) {
            $table->id();
            $table->string('clinicRefNo');
            // Optional: Foreign key to patients table
            // $table->foreign('clinicRefNo')->references('clinicRefNo')->on('patients')->onDelete('cascade');
            $table->string('item_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('special_items');
    }
}; 