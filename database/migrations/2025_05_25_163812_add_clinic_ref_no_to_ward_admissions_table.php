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
        Schema::table('ward_admissions', function (Blueprint $table) {
            $table->string('clinic_ref_no')->after('patient_id');
        });
    }
    
    /**
    * Reverse the migrations.
    */
    public function down(): void
    {
        Schema::table('ward_admissions', function (Blueprint $table) {
            $table->dropColumn('clinic_ref_no');
        });
    }
};
