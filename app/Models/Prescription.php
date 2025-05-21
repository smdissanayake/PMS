<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinicRefNo',
        'medications',
        'next_appointment_date',
    ];

    protected $casts = [
        'medications' => 'array', // Automatically cast JSON to array and vice-versa
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'clinicRefNo', 'clinicRefNo');
    }
} 