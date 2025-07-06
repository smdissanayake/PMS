<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurgeryNote extends Model
{
    protected $fillable = [
        'clinic_ref_no',
        'surgery_date',
        'surgery_type',
        'surgery_notes',
        'pathology_report_path',
        'other_reports_path',
    ];
    
    protected $casts = [
        'pathology_report_path' => 'array',
        'other_reports_path' => 'array',
    ];
}
