<?php

namespace App\Http\Controllers;

use App\Models\MedicalOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class MedicalOrderController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Log the incoming request data
            Log::info('Medical Order Request Data:', $request->all());

            // Validate the request data
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

            // Create the medical order
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
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create medical order',
                'error' => $e->getMessage(),
                'details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    public function getPatientOrders($patientId)
    {
        try {
            $orders = MedicalOrder::where('patient_id', $patientId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching patient orders:', [
                'message' => $e->getMessage(),
                'patient_id' => $patientId
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch orders'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $order = MedicalOrder::findOrFail($id);
            $order->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Order deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting order:', [
                'message' => $e->getMessage(),
                'order_id' => $id
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete order'
            ], 500);
        }
    }
} 