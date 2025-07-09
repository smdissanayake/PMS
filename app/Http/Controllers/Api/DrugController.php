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
    
    /**
     * Get drug statistics for dashboard
     */
    public function statistics()
    {
        try {
            $totalDrugs = \App\Models\Drug::count();
            $uniqueDrugClasses = \App\Models\Drug::whereNotNull('drug_class')
                ->distinct('drug_class')
                ->count('drug_class');
            
            // Get unique formulations as another category
            $uniqueFormulations = \App\Models\Drug::whereNotNull('formulation')
                ->distinct('formulation')
                ->count('formulation');
            
            return response()->json([
                'totalDrugs' => $totalDrugs,
                'uniqueDrugClasses' => $uniqueDrugClasses,
                'uniqueFormulations' => $uniqueFormulations,
                'totalCategories' => $uniqueDrugClasses + $uniqueFormulations, // Combined categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch drug statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
