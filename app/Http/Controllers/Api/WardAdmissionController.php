<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WardAdmission;
use App\Models\Patient;
use Illuminate\Support\Facades\Storage;

class WardAdmissionController extends Controller
{
    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $request->validate([
            'clinicRefNo' => 'required|string|exists:patients,clinicRefNo',
            'admission_date' => 'required|date',
            'discharge_date' => 'required|date|after_or_equal:admission_date',
            'icu' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
            'images' => 'nullable|array|min:2', // At least 2 images
            'images.*' => 'image|mimes:jpeg,png,gif|max:10240', // 10MB max per image
        ]);
        
        $patient = Patient::where('clinicRefNo', $request->clinicRefNo)->firstOrFail();
        
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('public/ward_admissions');
                $imagePaths[] = Storage::url($path);
            }
        }
        
        $wardAdmission = WardAdmission::create([
            'patient_id' => $patient->id,
            'clinic_ref_no' => $request->clinicRefNo, // Add this line
            'admission_date' => $request->admission_date,
            'discharge_date' => $request->discharge_date,
            'icu' => $request->icu,
            'ward' => $request->ward,
            'image_paths' => $imagePaths,
        ]);
        
        return response()->json($wardAdmission, 201);
    }
    
    /**
    * Display ward admissions for a specific patient.
    */
    public function getPatientAdmissions($patientId)
    {
        $admissions = WardAdmission::where('patient_id', $patientId)->get();
        
        // The image_paths are already stored as full URLs in the database
        // due to Storage::url() being applied during storage.
        // No further processing is needed here.
        
        return response()->json($admissions);
    }
    
    /**
    * Remove the specified resource from storage.
    */
    public function destroy(string $id)
    {
        $wardAdmission = WardAdmission::findOrFail($id);
        
        // Delete associated images from storage
        if ($wardAdmission->image_paths) {
            foreach ($wardAdmission->image_paths as $path) {
                // Remove '/storage/' prefix to get the actual path in storage
                $storagePath = str_replace('/storage/', 'public/', $path);
                if (Storage::exists($storagePath)) {
                    Storage::delete($storagePath);
                }
            }
        }
        
        $wardAdmission->delete();
        
        return response()->json(['message' => 'Ward admission record deleted successfully'], 200);
    }
}
