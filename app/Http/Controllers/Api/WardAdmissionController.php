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
            'admission_date' => 'nullable|date',
            'discharge_date' => 'nullable|date',
            'icu' => 'nullable|string|max:255',
            'ward' => 'nullable|string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,gif|max:10240', // 10MB max per image
        ]);
        
        $patient = Patient::where('clinicRefNo', $request->clinicRefNo)->firstOrFail();
        
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('ward_admissions', 'public');
                $imagePaths[] = Storage::url($path);
            }
        }
        
        $wardAdmission = WardAdmission::create([
            'patient_id' => $patient->id,
            'clinic_ref_no' => $request->clinicRefNo,
            'admission_date' => $request->admission_date ?: null,
            'discharge_date' => $request->discharge_date ?: null,
            'icu' => $request->icu ?: null,
            'ward' => $request->ward ?: null,
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
    
    /**
     * Get ward admission statistics for dashboard
     */
    public function statistics()
    {
        try {
            // Get total admitted patients (all time)
            $totalAdmittedPatients = WardAdmission::count();
            
            // Get admitted patients from last month
            $lastMonthAdmitted = WardAdmission::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count();
            
            // Get admitted patients from current month
            $currentMonthAdmitted = WardAdmission::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();
            
            // Calculate change
            $change = $currentMonthAdmitted - $lastMonthAdmitted;
            $changeType = $change >= 0 ? 'increase' : 'decrease';
            $changeValue = abs($change);
            
            return response()->json([
                'totalAdmittedPatients' => $totalAdmittedPatients,
                'currentMonthAdmitted' => $currentMonthAdmitted,
                'lastMonthAdmitted' => $lastMonthAdmitted,
                'change' => $changeType === 'increase' ? '+' . $changeValue : '-' . $changeValue,
                'changeType' => $changeType
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch ward admission statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
