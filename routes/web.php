<?php

use Illuminate\Support\Facades\Route;

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
