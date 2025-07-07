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
        Schema::table('surgery_notes', function (Blueprint $table) {
            $table->text('other_reports_path')->nullable()->after('pathology_report_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surgery_notes', function (Blueprint $table) {
            $table->dropColumn('other_reports_path');
        });
    }
};
