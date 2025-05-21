<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // Import Log facade
use App\Models\Prescription; 
use App\Models\SpecialItem;
use Illuminate\Support\Facades\DB; // Added for database transactions

class PrescriptionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinicRefNo' => 'required|string|exists:patients,clinicRefNo',
            'medications' => 'required|json',
            'nextAppointmentDate' => 'required|date',
            'specialItems' => 'nullable|array', // Expect an array of special items
            'specialItems.*.itemName' => 'required_with:specialItems|string|max:255', // Validate each item if specialItems is present
            // Align with frontend Medication interface properties
            'medications.*.drugClass' => 'required|string',
            'medications.*.name' => 'required|string', // Was medications.*.drugName
            'medications.*.dosage' => 'required|string', // Was medications.*.dose
            'medications.*.formulation' => 'required|string',
            'medications.*.frequency' => 'required|string',
            'medications.*.duration' => 'required|string',
            // 'medications.*.instructions' => 'nullable|string', // This level of validation might be too much for an optional field here
        ], [
            'medications.*.drugClass.required' => 'The drug class field is required for all medications.',
            'medications.*.name.required' => 'The drug name field is required for all medications.', // Was medications.*.drugName.required
            'medications.*.dosage.required' => 'The dosage field is required for all medications.', // Added for consistency
            // Add custom messages for other medication fields as needed
        ]);

        // Custom validation for the decoded medications JSON
        $medicationsData = json_decode($request->input('medications', '[]'), true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($medicationsData)) {
            return response()->json(['errors' => ['medications' => ['The medications field must be a valid JSON array.']]], 422);
        }

        foreach ($medicationsData as $index => $medication) {
            $medicationValidator = Validator::make($medication, [
                'drugClass' => 'required|string|max:255',
                'name' => 'required|string|max:255', // Was drugName
                'dosage' => 'required|string|max:255', // Was dose
                'formulation' => 'required|string|max:255',
                'frequency' => 'required|string|max:255',
                'duration' => 'required|string|max:255',
                'instructions' => 'nullable|string', // Was specialInstructions
                // 'isSpecialItem' and 'itemName' are not expected in actualMedications objects
            ]);

            if ($medicationValidator->fails()) {
                // Prefix errors with medications[index] to make them more specific
                $prefixedErrors = [];
                foreach ($medicationValidator->errors()->toArray() as $field => $message) {
                    $prefixedErrors["medications[{$index}].{$field}"] = $message;
                }
                return response()->json(['errors' => $prefixedErrors], 422);
            }
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction(); // Start transaction

        try {
            $prescription = Prescription::create([
                'clinicRefNo' => $request->clinicRefNo,
                'medications' => $request->medications, // Storing the original JSON string from actualMedications
                'next_appointment_date' => $request->nextAppointmentDate,
            ]);

            // Save special items if provided
            if ($request->has('specialItems') && is_array($request->specialItems)) {
                foreach ($request->specialItems as $item) {
                    // Ensure itemName exists and is a string before creating SpecialItem
                    if (isset($item['itemName']) && is_string($item['itemName'])) {
                        SpecialItem::create([
                            'clinicRefNo' => $request->clinicRefNo,
                            'item_name' => $item['itemName'],
                        ]);
                    } else {
                        // Optional: Log this issue or handle it more gracefully
                        Log::warning('Special item missing itemName or itemName is not a string.', ['item' => $item]);
                    }
                }
            }

            DB::commit(); // Commit transaction

            return response()->json(['message' => 'Prescription and special items saved successfully!', 'prescription' => $prescription], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on error
            Log::error('Error saving prescription: ' . $e->getMessage() . '\n' . $e->getTraceAsString());
            // Provide a more specific error if possible, or a generic one for production
            $errorMessage = 'Failed to save prescription.';
            if (app()->environment('local', 'development')) { // More detail in dev/local
                $errorMessage .= ' Error: ' . $e->getMessage();
            }
            return response()->json(['message' => $errorMessage], 500);
        }
    }

    // The storeSpecialItem method is no longer needed as it's handled in store
} 