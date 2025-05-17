<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientNote extends Model
{
    protected $fillable = [
        'clinicRefNo',
        'type',
        'comments',
        'modifications',
        'date',
    ];
}
