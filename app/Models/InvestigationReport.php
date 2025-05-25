<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestigationReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'medical_order_id',
        'patient_clinic_ref_no',
        'file_name',
        'file_path',
        'file_type',
        'status',
        'notes'
    ];

    public function medicalOrder()
    {
        return $this->belongsTo(MedicalOrder::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_clinic_ref_no', 'clinicRefNo');
    }
} 