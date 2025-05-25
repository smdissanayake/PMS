<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalOrder;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'patient_clinic_ref_no' => 'required|exists:patients,clinicRefNo',
            'orders' => 'required|array',
            'consultant_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Ensure the patient_id and patient_clinic_ref_no match the same patient
        $patient = Patient::where('id', $request->patient_id)
                          ->where('clinicRefNo', $request->patient_clinic_ref_no)
                          ->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient ID and Clinic Reference Number do not match or patient not found.'], 404);
        }

        try {
            $medicalOrder = new MedicalOrder([
                'patient_id' => $request->patient_id,
                'patient_clinic_ref_no' => $request->patient_clinic_ref_no,
                'order_date' => now(),
                'orders' => $request->orders,
                'consultant_name' => $request->consultant_name,
                'status' => 'completed',
                'notes' => $request->notes
            ]);
            
            $medicalOrder->save();

            return response()->json([
                'message' => 'Order saved successfully!',
                'order' => $medicalOrder
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get patient orders by patient ID.
     */
    public function getPatientOrders($patientId)
    {
        $orders = MedicalOrder::where('patient_id', $patientId)
                             ->orderBy('created_at', 'desc')
                             ->get();

        return response()->json($orders);
    }

    /**
     * Get patient orders by clinic reference number.
     */
    public function getOrdersByClinicRefNo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinicRefNo' => 'required|string|exists:patients,clinicRefNo',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $orders = MedicalOrder::where('patient_clinic_ref_no', $request->clinicRefNo)
                             ->orderBy('created_at', 'desc')
                             ->get();

        return response()->json($orders);
    }

    /**
     * Get a specific order by ID.
     */
    public function show($id)
    {
        $order = MedicalOrder::find($id);
        
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        
        return response()->json($order);
    }
} 