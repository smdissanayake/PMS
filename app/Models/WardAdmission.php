<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WardAdmission extends Model
{
    /**
    * The attributes that are mass assignable.
    *
    * @var array<int, string>
    */
    protected $fillable = [
        'patient_id',
        'clinic_ref_no', // Add this line
        'admission_date',
        'discharge_date',
        'icu',
        'ward',
        'image_paths',
    ];
    
    /**
    * The attributes that should be cast.
    *
    * @var array<string, string>
    */
    protected $casts = [
        'image_paths' => 'array',
        'admission_date' => 'date',
        'discharge_date' => 'date',
        // 'icu' is now a string, no explicit cast needed
    ];
    
    /**
    * Get the patient that owns the ward admission.
    */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
