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
        Schema::table('surgeries', function (Blueprint $table) {
            $table->string('patient_name')->nullable()->change();
            $table->string('ref_no')->nullable()->change();
            $table->string('uhid')->nullable()->change();
            $table->string('surgery_name')->nullable()->change();
            $table->date('date')->nullable()->change();
            $table->time('time')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->string('patient_name')->nullable(false)->change();
            $table->string('ref_no')->nullable(false)->change();
            $table->string('uhid')->nullable(false)->change();
            $table->string('surgery_name')->nullable(false)->change();
            $table->date('date')->nullable(false)->change();
            $table->time('time')->nullable(false)->change();
        });
    }
};
