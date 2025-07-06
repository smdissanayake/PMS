<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DrugController extends Controller
{
    /**
    * Display a listing of the resource.
    */
    public function index()
    {
        $drugs = \App\Models\Drug::all();
        return response()->json($drugs);
    }
    
    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'drugClass' => 'nullable|string|max:255',
            'drugName' => 'required|string|max:255',
            'dose' => 'nullable|string|max:255',
            'formulation' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
        ]);
        
        $drug = \App\Models\Drug::create([
            'drug_class' => $validatedData['drugClass'],
            'drug_name' => $validatedData['drugName'],
            'dose' => $validatedData['dose'],
            'formulation' => $validatedData['formulation'],
            'frequency' => $validatedData['frequency'],
            'duration' => $validatedData['duration'],
        ]);
        
        return response()->json($drug, 201);
    }
    
    /**
    * Display the specified resource.
    */
    public function show(string $id)
    {
        //
    }
    
    /**
    * Update the specified resource in storage.
    */
    public function update(Request $request, string $id)
    {
        //
    }
    
    /**
    * Remove the specified resource from storage.
    */
    public function destroy(string $id)
    {
        //
    }
}
