<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PatientNote; // Added this line
use App\Models\PatientHistoryExamination; // Added this line
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            'clinicRefNo' => 'required|string|max:255|unique:patients,clinicRefNo',
            'firstName' => 'nullable|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'birthday' => 'nullable|date|date_format:Y/m/d',
            'gender' => 'nullable|string|in:male,female,other',
            'address' => 'nullable|string',
            'nic' => 'nullable|string|max:255',
            'uhid' => 'nullable|string|max:255',
            'chb' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
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
     * Find a patient by CHB Number.
     */
    public function findByChb(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chb' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $patient = Patient::where('chb', $request->chb)->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient not found with the provided CHB Number.'], 404);
        }

        return response()->json($patient);
    }

    /**
     * Find a patient by Name (firstName + lastName).
     */
    public function findByName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $name = $request->name;
        $patient = Patient::where(function($query) use ($name) {
            $query->where('firstName', 'like', '%' . $name . '%')
                  ->orWhere('lastName', 'like', '%' . $name . '%')
                  ->orWhere(DB::raw("CONCAT(firstName, ' ', lastName)"), 'like', '%' . $name . '%');
        })->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient not found with the provided name.'], 404);
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
            'clinicRefNo' => 'sometimes|required|string|max:255|unique:patients,clinicRefNo,' . $patient->id,
            'firstName' => 'nullable|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'birthday' => 'nullable|date|date_format:Y/m/d',
            'gender' => 'nullable|string|in:male,female,other',
            'address' => 'nullable|string',
            'nic' => 'nullable|string|max:255',
            'uhid' => 'nullable|string|max:255',
            'chb' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
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
        $clinicRefNo = $request->query('clinicRefNo');
        
        if (!$clinicRefNo) {
            return response()->json(['message' => 'Clinic Reference Number is required'], 400);
        }

        try {
            $notes = DB::table('patient_notes')
                ->leftJoin('prescriptions', function($join) {
                    $join->on('patient_notes.clinicRefNo', '=', 'prescriptions.clinicRefNo')
                        ->whereRaw('DATE(patient_notes.created_at) = DATE(prescriptions.created_at)');
                })
                ->leftJoin('special_items', function($join) {
                    $join->on('patient_notes.clinicRefNo', '=', 'special_items.clinicRefNo')
                        ->whereRaw('DATE(patient_notes.created_at) = DATE(special_items.created_at)');
                })
                ->where('patient_notes.clinicRefNo', $clinicRefNo)
                ->select(
                    'patient_notes.*',
                    'prescriptions.medications',
                    'prescriptions.next_appointment_date',
                    'special_items.item_name'
                )
                ->orderBy('patient_notes.created_at', 'desc')
                ->get();

            // Process the medications JSON for each note
            $notes->transform(function ($note) {
                if ($note->medications) {
                    try {
                        $note->medications = json_decode($note->medications, true);
                    } catch (\Exception $e) {
                        $note->medications = [];
                    }
                } else {
                    $note->medications = [];
                }
                return $note;
            });

            return response()->json($notes);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching patient notes: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get today's patient visits.
     */
    public function getTodaysVisits()
    {
        try {
            $today = now()->format('Y-m-d');
            
            // Get total patient count
            $totalPatients = DB::table('patients')->count();
            
            // Get today's unique visits
            $visits = DB::table('patient_notes')
                ->join('patients', 'patient_notes.clinicRefNo', '=', 'patients.clinicRefNo')
                ->whereDate('patient_notes.created_at', $today)
                ->select(
                    'patient_notes.*',
                    'patients.firstName',
                    'patients.lastName'
                )
                ->orderBy('patient_notes.created_at', 'desc')
                ->get()
                ->unique('clinicRefNo')
                ->values()
                ->map(function ($visit) {
                    return [
                        'id' => $visit->id,
                        'clinicRefNo' => $visit->clinicRefNo,
                        'type' => $visit->type,
                        'comments' => $visit->comments,
                        'date' => $visit->date,
                        'created_at' => $visit->created_at,
                        'patient' => [
                            'firstName' => $visit->firstName,
                            'lastName' => $visit->lastName
                        ]
                    ];
                });

            return response()->json([
                'visits' => $visits,
                'totalPatients' => $totalPatients
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch today\'s visits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPatientCategoryDistribution()
    {
        try {
            $categories = DB::table('patients')
                ->select('category', DB::raw('count(*) as count'))
                ->whereNotNull('category')  // Only include patients with a category
                ->where('category', '!=', '')  // Exclude empty categories
                ->groupBy('category')
                ->get();

            // If no categories found, return some default data
            if ($categories->isEmpty()) {
                return response()->json([
                    ['category' => 'General', 'count' => 0],
                    ['category' => 'Specialist', 'count' => 0],
                    ['category' => 'Emergency', 'count' => 0]
                ]);
            }

            return response()->json($categories);
        } catch (\Exception $e) {
            Log::error('Error in getPatientCategoryDistribution: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch patient categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
