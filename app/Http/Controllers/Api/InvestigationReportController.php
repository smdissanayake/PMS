<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestigationReport;
use App\Models\MedicalOrder;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class InvestigationReportController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Starting file upload process', [
                'request_data' => $request->except(['file']),
                'has_file' => $request->hasFile('file')
            ]);

            // Validate the request
            $validator = Validator::make($request->all(), [
                'medical_order_id' => 'required|exists:medical_orders,id',
                'patient_clinic_ref_no' => 'required|exists:patients,clinicRefNo',
                'file' => 'required|file|mimes:pdf,jpg,jpeg,png,heic,heif|max:20480', // 20MB max, allow heic/heif
                'notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                Log::warning('Validation failed', [
                    'errors' => $validator->errors()->toArray()
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get the medical order and patient
            $medicalOrder = MedicalOrder::findOrFail($request->medical_order_id);
            $patient = Patient::where('clinicRefNo', $request->patient_clinic_ref_no)->firstOrFail();

            // Store the file
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            
            // Create filename: type_sub_type_additional_type_timestamp.extension
            $fileName = $medicalOrder->type;
            if ($medicalOrder->sub_type) {
                $fileName .= '_' . $medicalOrder->sub_type;
            }
            if ($medicalOrder->additional_type) {
                $fileName .= '_' . $medicalOrder->additional_type;
            }
            // Add timestamp to ensure uniqueness
            $fileName .= '_' . time() . '.' . $extension;
            
            // Store in Laravel storage
            $filePath = $file->storeAs('investigation_reports/' . $request->patient_clinic_ref_no, $fileName, 'public');

            if (!$filePath) {
                Log::error('Failed to store file in Laravel storage', [
                    'file_name' => $fileName,
                    'patient_clinic_ref_no' => $request->patient_clinic_ref_no
                ]);
                throw new \Exception('Failed to store file in Laravel storage');
            }

            // Create the investigation report record
            $report = InvestigationReport::create([
                'medical_order_id' => $request->medical_order_id,
                'patient_clinic_ref_no' => $request->patient_clinic_ref_no,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_type' => $extension,
                'status' => 'pending',
                'notes' => $request->notes
            ]);

            if (!$report) {
                Log::error('Failed to create investigation report record', [
                    'data' => [
                        'medical_order_id' => $request->medical_order_id,
                        'patient_clinic_ref_no' => $request->patient_clinic_ref_no,
                        'file_name' => $fileName,
                        'file_path' => $filePath
                    ]
                ]);
                throw new \Exception('Failed to create investigation report record');
            }

            // Update the medical order status
            $medicalOrder->update(['status' => 'completed']);

            Log::info('File upload completed successfully', [
                'report_id' => $report->id,
                'file_path' => $filePath
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Report uploaded successfully',
                'data' => $report
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error uploading investigation report:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['file']),
                'has_file' => $request->hasFile('file')
            ]);

            // Clean up any partially uploaded files
            if (isset($filePath) && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload report: ' . $e->getMessage()
            ], 500);
        }
    }

    public function download($id)
    {
        try {
            $report = InvestigationReport::findOrFail($id);
            $filePath = storage_path('app/public/' . $report->file_path);

            if (!file_exists($filePath)) {
                return response()->json([
                    'message' => 'File not found'
                ], 404);
            }

            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $mimeType = match($extension) {
                'pdf' => 'application/pdf',
                'jpg', 'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'heic', 'heif' => 'image/heic',
                default => 'application/octet-stream',
            };

            return response()->download($filePath, $report->file_name, ['Content-Type' => $mimeType]);
        } catch (\Exception $e) {
            Log::error('Error downloading investigation report:', [
                'message' => $e->getMessage(),
                'report_id' => $id
            ]);

            return response()->json([
                'message' => 'Failed to download report'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $report = InvestigationReport::findOrFail($id);
            
            // Delete the file from Laravel storage
            Storage::disk('public')->delete($report->file_path);
            
            // Delete the record
            $report->delete();

            return response()->json([
                'message' => 'Report deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting investigation report:', [
                'message' => $e->getMessage(),
                'report_id' => $id
            ]);

            return response()->json([
                'message' => 'Failed to delete report'
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'patient_clinic_ref_no' => 'required|exists:patients,clinicRefNo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $reports = InvestigationReport::with(['medicalOrder', 'patient'])
                ->where('patient_clinic_ref_no', $request->patient_clinic_ref_no)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($report) {
                    // Always use Laravel asset() helper for URLs
                    $baseUrl = asset('storage/' . $report->file_path);

                    $thumbnailUrl = null;
                    if (in_array($report->file_type, ['jpg', 'jpeg', 'png'])) {
                        $thumbnailUrl = $baseUrl;
                    } elseif ($report->file_type === 'pdf') {
                        $thumbnailUrl = asset('images/pdf-icon.png'); // Make sure this icon exists in your public folder
                    }

                    return [
                        'id' => $report->id,
                        'fileName' => $report->file_name,
                        'uploadDate' => $report->created_at,
                        'fileType' => $report->file_type,
                        'status' => $report->status,
                        'notes' => $report->notes,
                        'orderType' => $report->medicalOrder ? $report->medicalOrder->type : null,
                        'patientName' => $report->patient ? $report->patient->firstName . ' ' . $report->patient->lastName : null,
                        'thumbnailUrl' => $thumbnailUrl,
                        'fileUrl' => $baseUrl
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $reports
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching investigation reports:', [
                'message' => $e->getMessage(),
                'patient_clinic_ref_no' => $request->patient_clinic_ref_no
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch investigation reports'
            ], 500);
        }
    }
} 