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
            // Make fields nullable
            $table->date('admission_date')->nullable()->change();
            $table->date('discharge_date')->nullable()->change();
            $table->string('icu')->nullable()->change(); // Change from integer to string and make nullable
            $table->string('ward')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ward_admissions', function (Blueprint $table) {
            // Revert fields back to required
            $table->date('admission_date')->nullable(false)->change();
            $table->date('discharge_date')->nullable(false)->change();
            $table->integer('icu')->nullable(false)->change(); // Revert to integer
            $table->string('ward')->nullable(false)->change();
        });
    }
};
