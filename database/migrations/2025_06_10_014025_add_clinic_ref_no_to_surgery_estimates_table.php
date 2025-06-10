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
        Schema::table('surgery_estimates', function (Blueprint $table) {
            $table->string('clinic_ref_no')->after('id')->nullable();
        });
    }
    
    /**
    * Reverse the migrations.
    */
    public function down(): void
    {
        Schema::table('surgery_estimates', function (Blueprint $table) {
            $table->dropColumn('clinic_ref_no');
        });
    }
};
