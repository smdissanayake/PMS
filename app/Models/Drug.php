<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drug extends Model
{
    use HasFactory;

    protected $fillable = [
        'drug_name',
        'dose',
        'formulation',
        'frequency',
        'duration',
        'drug_class',
    ];
}
