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
        Schema::create('surgery_estimates', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('surgery');
            $table->string('time_for_surgery')->nullable();
            $table->string('stay_in_icu')->nullable();
            $table->string('stay_in_wards')->nullable();
            $table->string('implants_general')->nullable(); // Renamed to avoid conflict with implantRequest.implants
            $table->date('date');
            $table->string('contact')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('surgery_estimate_range');
            $table->string('presidential_fund')->default('NO');
            $table->date('presidential_fund_date')->nullable();
            $table->string('presidential_fund_diagnosis')->default('NO');
            $table->date('presidential_fund_diagnosis_date')->nullable();
            $table->string('nitf_agrahara')->default('NO');
            $table->date('nitf_agrahara_date')->nullable();
            $table->string('nitf_agrahara_diagnosis')->default('NO');
            $table->date('nitf_agrahara_diagnosis_date')->nullable();
            $table->string('open_quotations')->default('NO');
            $table->date('open_quotations_date')->nullable();
            $table->string('check_on_drugs')->default('NO');
            $table->string('implant_prescription')->default('NO');
            $table->string('admission_letter')->default('NO');
            $table->string('investigation_sheet')->default('NO');
            $table->string('initial_deposit')->nullable();
            $table->string('temp_admission_date')->nullable();
            $table->date('anesthetist_consultation_date')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_contact')->nullable();
            $table->string('medical_coordinator')->nullable();
            $table->json('implant_request_data'); // To store the nested implantRequest object as JSON
            $table->timestamps();
        });
    }
    
    /**
    * Reverse the migrations.
    */
    public function down(): void
    {
        Schema::dropIfExists('surgery_estimates');
    }
};
