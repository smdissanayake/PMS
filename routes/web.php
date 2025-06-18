<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\DrugController;
use App\Http\Controllers\Api\PrescriptionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\MedicalOrderController;
use App\Http\Controllers\Api\WardAdmissionController;
use App\Http\Controllers\Api\SurgeryController;
use App\Http\Controllers\Api\InvestigationReportController;
use App\Http\Controllers\Api\PatientReportController;
use App\Http\Controllers\Api\SurgeryNoteController;
use Inertia\Inertia;
use App\Http\Controllers\Api\SurgeryEstimateController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\ForgotPasswordController;

// Authentication Routes (public)
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Redirect root to dashboard if authenticated, else to login
Route::get('/', function () {
    return Auth::check() ? redirect('/dashboard') : redirect('/login');
});

// Protected Routes - Require Authentication
Route::middleware(['auth'])->group(function () {
    // Home page (tab switching)
    Route::get('/home', function () {
        return Inertia::render('Home');
    })->name('home');

    // Dashboard (legacy, still renders Home for compatibility)
    Route::get('/dashboard', [LoginController::class, 'dashboard'])->name('dashboard');

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

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);

    // API route to get all patients (for searchable dropdown)
    Route::get('/api/patients', [PatientController::class, 'index']);
    Route::get('/patients', [PatientController::class, 'index']); // Keep existing route for potential Inertia usage
    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients/search-by-clinic-ref', [PatientController::class, 'findByClinicRefNo']);
    Route::post('/patient-history-examination', [PatientController::class, 'storeHistoryExamination']);
    Route::get('/patient-history-examination/{patient_id}', [PatientController::class, 'getHistoryExaminationRecords']);

    Route::get('/drugs', [DrugController::class, 'index']);
    Route::post('/drugs', [DrugController::class, 'store']);

    // Routes for Prescriptions and Special Items
    Route::post('/prescriptions', [PrescriptionController::class, 'store']);

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

    // Medical Orders Routes
    Route::prefix('medical-orders')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\MedicalOrderController::class, 'index']);
        Route::post('/', [App\Http\Controllers\Api\MedicalOrderController::class, 'store']);
        Route::get('/patient/{patientClinicRefNo}', [App\Http\Controllers\Api\MedicalOrderController::class, 'getPatientOrders']);
        Route::get('/{id}', [MedicalOrderController::class, 'show']);
        Route::delete('/{id}', [MedicalOrderController::class, 'destroy']);
    });

    // Investigation Reports Routes
    Route::prefix('investigation-reports')->group(function () {
        Route::get('/', [InvestigationReportController::class, 'index']);
        Route::post('/', [InvestigationReportController::class, 'store']);
        Route::get('/{id}/download', [InvestigationReportController::class, 'download']);
        Route::delete('/{id}', [InvestigationReportController::class, 'destroy']);
    });

    // Surgery Routes
    Route::prefix('surgeries')->group(function () {
        Route::get('/', [SurgeryController::class, 'index']);
        Route::post('/', [SurgeryController::class, 'store']);
        Route::delete('/{id}', [SurgeryController::class, 'destroy']);    
    });

    // Patient Reports Routes (Moved here for clarity and consistency)
    Route::post('/api/patient-reports', [PatientReportController::class, 'store']);
    Route::get('/api/patient-reports', [PatientReportController::class, 'index']);

    // Surgery Notes Routes (Moved here for clarity and consistency)
    Route::post('/api/surgery-notes', [SurgeryNoteController::class, 'store']);
    Route::get('/api/surgery-notes', [SurgeryNoteController::class, 'index']);

    Route::get('/patient-details', function () {
        return inertia('PatientDetails');
    });

    Route::get('/api/patient-notes/today', [PatientController::class, 'getTodaysVisits']);

    Route::get('/todays-visits', function () {
        return Inertia::render('TodaysVisits');
    })->name('todays-visits');

    Route::get('/api/patient-categories', [PatientController::class, 'getPatientCategoryDistribution']);

    // Ward Admission Routes
    Route::get('/api/patients/{patientId}/ward-admissions', [WardAdmissionController::class, 'getPatientAdmissions']);
    Route::post('/api/ward-admissions', [WardAdmissionController::class, 'store']);
    Route::delete('/api/ward-admissions/{id}', [WardAdmissionController::class, 'destroy']);

    // Surgery Estimate Routes
    Route::post('/api/surgery-estimates', [SurgeryEstimateController::class, 'store']);
    Route::get('/api/surgery-estimates/{clinicRefNo}', [SurgeryEstimateController::class, 'indexByClinicRefNo']);
    Route::put('/api/surgery-estimates/{id}', [SurgeryEstimateController::class, 'update']);
    Route::delete('/api/surgery-estimates/{id}', [SurgeryEstimateController::class, 'destroy']);
});

// Forgot Password API routes
Route::post('/forgot-password/send-code', [ForgotPasswordController::class, 'sendCode']);
Route::post('/forgot-password/verify-code', [ForgotPasswordController::class, 'verifyCode']);
Route::post('/forgot-password/reset', [ForgotPasswordController::class, 'resetPassword']);

Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
});