<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
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
}
