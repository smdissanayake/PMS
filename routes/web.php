<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return inertia('Home');
});
Route::get('/add-user', function () {
    return inertia('AddUser');
});

Route::get('/add', function () {
    return inertia('OrderForm');
});

Route::get('/test-data', function () {
    return response()->json([
        ['id' => 1, 'name' => 'Apple'],
        ['id' => 2, 'name' => 'Banana'],
        ['id' => 3, 'name' => 'Cherry'],
    ]);
});

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PatientController;

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);

Route::post('/patients', [PatientController::class, 'store']);
Route::get('/patients/search-by-clinic-ref', [PatientController::class, 'findByClinicRefNo']);
Route::post('/patient-history-examination', [PatientController::class, 'storeHistoryExamination']);
Route::get('/patient-history-examination/{patient_id}', [PatientController::class, 'getHistoryExaminationRecords']);
Route::post('/patient-notes', [PatientController::class, 'storeNote']);
Route::get('/patient-notes', [PatientController::class, 'getPatientNotes']);
Route::get('/order-summary', function () {
    return inertia('OrderSummary');
});

Route::get('/patients/search-suggestions', function (Request $request) {
    $query = $request->get('query');
    
    if (empty($query)) {
        return response()->json([]);
    }

    $patients = DB::table('patients')
        ->where('clinicRefNo', 'like', '%' . $query . '%')
        ->select('id', 'clinicRefNo', 'firstName', 'lastName')
        ->orderByRaw('CASE 
            WHEN clinicRefNo = ? THEN 1
            WHEN clinicRefNo LIKE ? THEN 2
            ELSE 3
        END', [$query, $query . '%'])
        ->limit(5)
        ->get()
        ->map(function ($patient) {
            return [
                'id' => $patient->id,
                'clinicRefNo' => $patient->clinicRefNo,
                'name' => $patient->firstName . ' ' . $patient->lastName
            ];
        });

    return response()->json($patients);
});