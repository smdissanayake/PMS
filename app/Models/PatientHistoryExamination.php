<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientHistoryExamination extends Model
{
    use HasFactory;

    protected $table = 'patient_history_and_examination'; // Explicitly define table name

    protected $fillable = [
        'patient_id',
        'patient_clinic_ref_no',
        'headacheDuration',
        'headacheEpisode',
        'headacheSite',
        'headacheAura',
        'headacheEnt',
        'headacheEye',
        'headacheSen',
        'headacheFocalSymptoms',
        'backacheDuration',
        'backacheSite',
        'backacheRadiation',
        'backacheTrauma',
        'backacheJointsInflamed',
        'neckacheFocalSymptoms',
        'neckacheSen',
        'neckacheMotor',
        'neckacheNClaud',
        'neckacheJointsInflamed',
        'otherTremors',
        'otherNumbness',
        'otherWeakness',
        'otherGiddiness',
        'otherOther',
        'neuroHigherFunctions',
        'neuroGcs',
        'neuroTremors',
        'neuroCranialNerves',
        'neuroFundi',
        'cerebellumSigns', // Updated
        'examMotor',
        'examSensory',
        'examReflex',
        'examGait',
        'examSpDeformity',
        'examSlr',
        'examLs',
        'examHipsKnees',
        'tenderPoints', // Updated
        'examWasting',
        'examEhl',
        'examFootWeakness',
        'examSens',
        'examMotor2',
        'examReflexes',
        'examOther',
        'pastIllness', // Updated
        'allergies', // Updated
        'allergensInput',
        'drugsInput',
        'drugsTaken', // Updated
    ];

    /**
     * Get the patient that owns the history and examination record.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
