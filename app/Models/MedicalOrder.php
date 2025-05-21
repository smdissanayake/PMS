<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'patient_clinic_ref_no',
        'order_date',
        'type',
        'sub_type',
        'additional_type',
        'consultant_name',
        'status',
        'notes',
        'age'
    ];

    protected $casts = [
        'order_date' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
} 