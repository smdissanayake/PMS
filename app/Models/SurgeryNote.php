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
<<<<<<< HEAD
        'other_reports_path',
=======
>>>>>>> origin/main
    ];
    
    protected $casts = [
        'pathology_report_path' => 'array',
<<<<<<< HEAD
        'other_reports_path' => 'array',
=======
>>>>>>> origin/main
    ];
}
