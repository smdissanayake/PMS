<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PatientReport;
use Illuminate\Http\Request;

class PatientReportController extends Controller
{
    /**
    * Display a listing of the resource.
    */
    public function index()
    {
        //
    }
    
    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $request->validate([
            'clinic_ref_no' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,jpg,png|max:2048', // Max 2MB
        ]);
        
        $filePath = $request->file('file')->store('patient_reports', 'public');
        
        $patientReport = PatientReport::create([
            'clinic_ref_no' => $request->clinic_ref_no,
            'file_path' => $filePath,
        ]);
        
        return response()->json($patientReport, 201);
    }
    
    /**
    * Display the specified resource.
    */
    public function show(PatientReport $patientReport)
    {
        //
    }
    
    /**
    * Update the specified resource in storage.
    */
    public function update(Request $request, PatientReport $patientReport)
    {
        //
    }
    
    /**
    * Remove the specified resource from storage.
    */
    public function destroy(PatientReport $patientReport)
    {
        //
    }
}
