<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PatientReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientReportController extends Controller
{
    /**
    * Display a listing of the resource.
    */
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'clinic_ref_no' => 'required|string|exists:patients,clinicRefNo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $reports = PatientReport::where('clinic_ref_no', $request->clinic_ref_no)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($reports);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch patient reports: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'clinic_ref_no' => 'required|string|max:255',
                'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048', // Added jpeg and proper PNG mime type
            ]);
            
            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            
            // Create filename with just the clinic reference number
            $fileName = $request->clinic_ref_no . '.' . $extension;
            
            // Store the file with the new name
            $filePath = $file->storeAs('patient_reports', $fileName, 'public');
            
            if (!$filePath) {
                return response()->json([
                    'message' => 'Failed to store file'
                ], 500);
            }
            
            $patientReport = PatientReport::create([
                'clinic_ref_no' => $request->clinic_ref_no,
                'file_path' => $filePath,
            ]);
            
            return response()->json($patientReport, 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload report: ' . $e->getMessage()
            ], 500);
        }
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

    /**
     * Get patient report statistics for dashboard
     */
    public function statistics()
    {
        try {
            // Get total reports (all time)
            $totalReports = PatientReport::count();
            
            // Get reports from last month
            $lastMonthReports = PatientReport::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count();
            
            // Get reports from current month
            $currentMonthReports = PatientReport::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();
            
            // Calculate change
            $change = $currentMonthReports - $lastMonthReports;
            $changeType = $change >= 0 ? 'increase' : 'decrease';
            $changeValue = abs($change);
            
            return response()->json([
                'totalReports' => $totalReports,
                'currentMonthReports' => $currentMonthReports,
                'lastMonthReports' => $lastMonthReports,
                'change' => $changeType === 'increase' ? '+' . $changeValue : '-' . $changeValue,
                'changeType' => $changeType
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch patient report statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
