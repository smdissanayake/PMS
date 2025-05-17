<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PatientNote; // Added this line
use App\Models\PatientHistoryExamination; // Added this line
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Patient::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'gender' => 'required|string|in:male,female,other',
            'address' => 'required|string',
            'clinicRefNo' => 'required|string|max:255|unique:patients,clinicRefNo',
            'nic' => 'required|string|max:255|unique:patients,nic',
            'uhid' => 'required|string|max:255|unique:patients,uhid',
            'category' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $patient = Patient::create($request->all());

        return response()->json(['message' => 'Patient registered successfully!', 'patient' => $patient], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        return response()->json($patient);
    }

    /**
     * Find a patient by Clinic Reference Number.
     */
    public function findByClinicRefNo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinicRefNo' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $patient = Patient::where('clinicRefNo', $request->clinicRefNo)->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient not found with the provided Clinic Reference Number.'], 404);
        }

        return response()->json($patient);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'firstName' => 'sometimes|required|string|max:255',
            'lastName' => 'sometimes|required|string|max:255',
            'age' => 'sometimes|required|integer|min:0',
            'gender' => 'sometimes|required|string|in:male,female,other',
            'address' => 'sometimes|required|string',
            'clinicRefNo' => 'sometimes|required|string|max:255|unique:patients,clinicRefNo,' . $patient->id,
            'nic' => 'sometimes|required|string|max:255|unique:patients,nic,' . $patient->id,
            'uhid' => 'sometimes|required|string|max:255|unique:patients,uhid,' . $patient->id,
            'category' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $patient->update($request->all());

        return response()->json(['message' => 'Patient updated successfully!', 'patient' => $patient]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }

    /**
     * Store a newly created patient history and examination resource in storage.
     */
    public function storeHistoryExamination(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'patient_clinic_ref_no' => 'required|string|exists:patients,clinicRefNo',
            // Add validation rules for all other fields from PatientHistoryForm.jsx
            // For brevity, I'm omitting them here, but they should be comprehensive
            // Example for a few fields:
            'headacheDuration' => 'nullable|string|max:255',
            'headacheEpisode' => 'nullable|string|max:255',
            // ... add all individual string/text/numeric fields ...

            // Consolidated checkbox group fields
            'cerebellumSigns' => 'nullable|string',
            'tenderPoints' => 'nullable|string',
            'pastIllness' => 'nullable|string',
            'allergies' => 'nullable|string',
            'drugsTaken' => 'nullable|string',
            
            // Other text inputs
            'allergensInput' => 'nullable|string',
            'drugsInput' => 'nullable|string',
            // ... ensure all other fields from the $fillable array in the model are covered
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
        
        // Prepare data for updateOrCreate, excluding patient_id from the values to be updated if it's part of the search criteria
        $updateData = $request->except(['patient_id', 'patient_clinic_ref_no']);
        // Add patient_clinic_ref_no to the data being saved/updated, as it's part of the table but not a primary search key for updateOrCreate if patient_id is used.
        $updateData['patient_clinic_ref_no'] = $request->patient_clinic_ref_no;


        $historyExamination = PatientHistoryExamination::updateOrCreate(
            ['patient_id' => $request->patient_id], // Criteria to find existing record
            $updateData // Data to insert or update with
        );

        $message = $historyExamination->wasRecentlyCreated ? 
            'Patient history and examination record saved successfully!' : 
            'Patient history and examination record updated successfully!';

        return response()->json(['message' => $message, 'data' => $historyExamination], $historyExamination->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Get history and examination records for a specific patient.
     */
    public function getHistoryExaminationRecords(Request $request, $patient_id)
    {
        $patient = Patient::find($patient_id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found.'], 404);
        }

        // It's possible a patient might not have history records yet.
        $records = PatientHistoryExamination::where('patient_id', $patient_id)
                                            ->orderBy('created_at', 'desc') // Or 'updated_at'
                                            ->get();

        return response()->json($records);
    }

    /**
     * Store a newly created patient note in storage.
     */
    public function storeNote(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinicRefNo' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'comments' => 'required|string',
            'modifications' => 'required|string',
            'date' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $patientNote = PatientNote::create($request->all());
            return response()->json([
                'message' => 'Patient note created successfully!',
                'patientNote' => $patientNote
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create patient note',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get patient notes by clinic reference number.
     */
    public function getPatientNotes(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinicRefNo' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notes = PatientNote::where('clinicRefNo', $request->clinicRefNo)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notes);
    }
}
