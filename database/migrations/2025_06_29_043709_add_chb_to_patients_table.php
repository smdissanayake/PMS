<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            // First add the column without unique constraint
            $table->string('chb')->nullable()->after('uhid');
        });

        // Populate existing records with a default CHB value
        DB::table('patients')->whereNull('chb')->update([
            'chb' => DB::raw("CONCAT('CHB', LPAD(id, 6, '0'))")
        ]);

        // Now add unique constraints
        Schema::table('patients', function (Blueprint $table) {
            $table->string('chb')->nullable(false)->change();
            $table->unique('chb');
            $table->unique(['clinicRefNo', 'uhid', 'chb'], 'patients_clinic_uhid_chb_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            // $table->dropUnique('patients_clinic_uhid_chb_unique');
            // $table->dropUnique('patients_chb_unique');
            $table->dropColumn('chb');
        });
    }
};
