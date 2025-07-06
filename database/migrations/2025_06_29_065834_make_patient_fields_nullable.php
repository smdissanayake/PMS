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
        Schema::table('patients', function (Blueprint $table) {
            $table->string('firstName')->nullable()->change();
            $table->string('lastName')->nullable()->change();
            $table->date('birthday')->nullable()->change();
            $table->string('gender')->nullable()->change();
            $table->text('address')->nullable()->change();
            $table->string('nic')->nullable()->change();
            $table->string('uhid')->nullable()->change();
            $table->string('category')->nullable()->change();
            // Do NOT make clinicRefNo nullable
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            //
        });
    }
};
