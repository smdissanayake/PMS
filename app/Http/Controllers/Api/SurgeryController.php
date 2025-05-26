<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SurgeryController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'patient_name' => 'required|string',
                'ref_no' => 'required|string',
                'uhid' => 'required|string',
                'surgery_name' => 'required|string',
                'date' => 'required|date',
                'time' => 'required|date_format:H:i',
            ]);

            // Check for existing surgery
            $existingSurgery = DB::table('surgeries')
                ->where('ref_no', $validated['ref_no'])
                ->where('date', $validated['date'])
                ->where('time', $validated['time'])
                ->first();

            if ($existingSurgery) {
                return response()->json([
                    'message' => 'A surgery is already scheduled for this patient at the selected date and time.',
                    'surgery' => $existingSurgery
                ], 422);
            }

            $surgeryId = DB::table('surgeries')->insertGetId([
                'patient_name' => $validated['patient_name'],
                'ref_no' => $validated['ref_no'],
                'uhid' => $validated['uhid'],
                'surgery_name' => $validated['surgery_name'],
                'date' => $validated['date'],
                'time' => $validated['time'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $surgery = DB::table('surgeries')->find($surgeryId);

            return response()->json([
                'message' => 'Surgery scheduled successfully',
                'surgery' => $surgery
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to schedule surgery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $surgeries = DB::table('surgeries')
                ->join('patients', 'surgeries.ref_no', '=', 'patients.clinicRefNo')
                ->select(
                    'surgeries.id',
                    'surgeries.patient_name as patientName',
                    'surgeries.ref_no as refNo',
                    'surgeries.uhid',
                    'surgeries.surgery_name as surgeryName',
                    'surgeries.date',
                    'surgeries.time',
                    'patients.firstName',
                    'patients.lastName'
                )
                ->orderBy('surgeries.date')
                ->orderBy('surgeries.time')
                ->get();

            return response()->json($surgeries);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch surgeries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $surgery = DB::table('surgeries')->where('id', $id)->first();
            
            if (!$surgery) {
                return response()->json([
                    'message' => 'Surgery not found'
                ], 404);
            }

            DB::table('surgeries')->where('id', $id)->delete();

            return response()->json([
                'message' => 'Surgery deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete surgery',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 