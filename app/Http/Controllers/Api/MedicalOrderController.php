<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class MedicalOrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'patient_clinic_ref_no' => 'required|exists:patients,clinicRefNo',
                'status' => 'nullable|string|in:pending,completed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = MedicalOrder::where('patient_clinic_ref_no', $request->patient_clinic_ref_no);

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $orders = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'type' => $order->type,
                        'sub_type' => $order->sub_type,
                        'additional_type' => $order->additional_type,
                        'status' => $order->status,
                        'created_at' => $order->created_at,
                        'notes' => $order->notes
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching medical orders:', [
                'message' => $e->getMessage(),
                'patient_clinic_ref_no' => $request->patient_clinic_ref_no
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch medical orders'
            ], 500);
        }
    }

    public function getPatientOrders($patientClinicRefNo)
    {
        try {
            $orders = MedicalOrder::where('patient_clinic_ref_no', $patientClinicRefNo)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'type' => $order->type,
                        'sub_type' => $order->sub_type,
                        'additional_type' => $order->additional_type,
                        'status' => $order->status,
                        'created_at' => $order->created_at,
                        'notes' => $order->notes
                    ];
                });

            return response()->json($orders);
        } catch (\Exception $e) {
            Log::error('Error fetching patient orders:', [
                'message' => $e->getMessage(),
                'patient_clinic_ref_no' => $patientClinicRefNo
            ]);

            return response()->json([
                'message' => 'Failed to fetch patient orders'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Medical Order Request Data:', $request->all());

            $validator = Validator::make($request->all(), [
                'patient_id' => 'required|exists:patients,id',
                'patient_clinic_ref_no' => 'required|exists:patients,clinicRefNo',
                'type' => 'required|string',
                'sub_type' => 'nullable|string',
                'additional_type' => 'nullable|string',
                'consultant_name' => 'nullable|string',
                'notes' => 'nullable|string',
                'order_date' => 'required|date',
                'age' => 'nullable|integer|min:0|max:150'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $medicalOrder = MedicalOrder::create($request->all());
            
            Log::info('Medical Order created successfully:', ['id' => $medicalOrder->id]);

            return response()->json([
                'status' => 'success',
                'message' => 'Medical order created successfully',
                'data' => $medicalOrder
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating medical order:', [
                'message' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create medical order'
            ], 500);
        }
    }

    public function getPendingReportsCount()
    {
        try {
            $count = MedicalOrder::where('status', 'pending')->count();
            return response()->json(['pending_reports_count' => $count]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch pending reports count'
            ], 500);
        }
    }
} 