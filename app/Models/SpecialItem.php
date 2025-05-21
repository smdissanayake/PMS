<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpecialItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinicRefNo',
        'item_name',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'clinicRefNo', 'clinicRefNo');
    }
} 