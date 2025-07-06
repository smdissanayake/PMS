<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurgeryEstimate extends Model
{
    protected $fillable = [
        'clinic_ref_no',
        'patient_name',
        'surgery',
        'time_for_surgery',
        'stay_in_icu',
        'stay_in_wards',
        'implants_general',
        'date',
        'contact',
        'whatsapp',
        'surgery_estimate_range',
        'presidential_fund',
        'presidential_fund_date',
        'presidential_fund_diagnosis',
        'presidential_fund_diagnosis_date',
        'nitf_agrahara',
        'nitf_agrahara_date',
        'nitf_agrahara_diagnosis',
        'nitf_agrahara_diagnosis_date',
        'open_quotations',
        'open_quotations_date',
        'check_on_drugs',
        'implant_prescription',
        'admission_letter',
        'investigation_sheet',
        'initial_deposit',
        'temp_admission_date',
        'anesthetist_consultation_date',
        'guardian_name',
        'guardian_contact',
        'medical_coordinator',
        'implant_request_data',
    ];
    
    protected $casts = [
        'date' => 'date',
        'presidential_fund_date' => 'date',
        'presidential_fund_diagnosis_date' => 'date',
        'nitf_agrahara_date' => 'date',
        'nitf_agrahara_diagnosis_date' => 'date',
        'open_quotations_date' => 'date',
        'anesthetist_consultation_date' => 'date',
        'implant_request_data' => 'array', // Cast JSON column to array
    ];
}
