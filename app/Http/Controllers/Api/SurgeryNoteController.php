<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SurgeryNote; // Import the SurgeryNote model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // Import Validator

class SurgeryNoteController extends Controller
{
    /**
    * Display a listing of the resource.
    * Fetches all surgery notes, or notes for a specific patient if clinic_ref_no is provided.
    */
    public function index(Request $request)
    {
        $query = SurgeryNote::query();
        
        if ($request->has('clinic_ref_no')) {
            $query->where('clinic_ref_no', $request->input('clinic_ref_no'));
        }
        
        $surgeryNotes = $query->orderBy('surgery_date', 'desc')->get();
        
        return response()->json($surgeryNotes);
    }
    
    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinic_ref_no' => 'required|string|max:255',
            'surgery_date' => 'required|date',
            'surgery_type' => 'required|string|max:255',
            'surgery_notes' => 'required|string',
            'pathology_report_path' => 'nullable|string|max:255', // Assuming path is stored as string
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $surgeryNote = SurgeryNote::create($request->all());
        
        return response()->json($surgeryNote, 201);
    }
    
    /**
    * Display the specified resource.
    * In this context, 'show' might be used to get a single note by ID,
    * or we can adapt it to get notes for a specific patient if 'id' refers to clinic_ref_no.
    * For now, let's assume 'id' is the primary key of the surgery_notes table.
    * If you need to fetch by clinic_ref_no, use the index method with a query parameter.
    */
    public function show(string $id)
    {
        $surgeryNote = SurgeryNote::find($id);
        
        if (!$surgeryNote) {
            return response()->json(['message' => 'Surgery note not found'], 404);
        }
        
        return response()->json($surgeryNote);
    }
    
    /**
    * Update the specified resource in storage.
    */
    public function update(Request $request, string $id)
    {
        $surgeryNote = SurgeryNote::find($id);
        
        if (!$surgeryNote) {
            return response()->json(['message' => 'Surgery note not found'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'clinic_ref_no' => 'sometimes|required|string|max:255',
            'surgery_date' => 'sometimes|required|date',
            'surgery_type' => 'sometimes|required|string|max:255',
            'surgery_notes' => 'sometimes|required|string',
            'pathology_report_path' => 'nullable|string|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $surgeryNote->update($request->all());
        
        return response()->json($surgeryNote);
    }
    
    /**
    * Remove the specified resource from storage.
    */
    public function destroy(string $id)
    {
        $surgeryNote = SurgeryNote::find($id);
        
        if (!$surgeryNote) {
            return response()->json(['message' => 'Surgery note not found'], 404);
        }
        
        $surgeryNote->delete();
        
        return response()->json(['message' => 'Surgery note deleted successfully']);
    }
}
