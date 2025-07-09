<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SurgeryEstimate;
use Illuminate\Support\Facades\Validator;

class SurgeryEstimateController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinic_ref_no' => 'required|string|max:255', // Add validation for clinic_ref_no
            'patientName' => 'required|string|max:255',
            'surgery' => 'required|string|max:255',
            'timeForSurgery' => 'nullable|string|max:255',
            'stayInICU' => 'nullable|string|max:255',
            'stayInWards' => 'nullable|string|max:255',
            'implants' => 'nullable|string|max:255',
            'date' => 'required|date',
            'contact' => 'nullable|string|max:255',
            'whatsapp' => 'nullable|string|max:255',
            'surgeryEstimateRange' => 'required|string|max:255',
            'presidentialFund' => 'required|string|in:YES,NO',
            'presidentialFundDate' => 'nullable|date',
            'presidentialFundDiagnosis' => 'required|string|in:YES,NO',
            'presidentialFundDiagnosisDate' => 'nullable|date',
            'nitfAgrahara' => 'required|string|in:YES,NO',
            'nitfAgraharaDate' => 'nullable|date',
            'nitfAgraharaDiagnosis' => 'required|string|in:YES,NO',
            'nitfAgraharaDiagnosisDate' => 'nullable|date',
            'openQuotations' => 'required|string|in:YES,NO',
            'openQuotationsDate' => 'nullable|date',
            'checkOnDrugs' => 'required|string|in:YES,NO',
            'implantPrescription' => 'required|string|in:YES,NO',
            'admissionLetter' => 'required|string|in:YES,NO',
            'investigationSheet' => 'required|string|in:YES,NO',
            'initialDeposit' => 'nullable|string|max:255',
            'tempAdmissionDate' => 'nullable|string|max:255',
            'anesthetistConsultationDate' => 'nullable|date',
            'guardianName' => 'nullable|string|max:255',
            'guardianContact' => 'nullable|string|max:255',
            'medicalCoordinator' => 'nullable|string|max:255',
            // 'implantRequest' => 'required|array',
            // 'implantRequest.patientName' => 'required|string|max:255',
            // 'implantRequest.age' => 'nullable|string|max:255',
            // 'implantRequest.nicPassport' => 'nullable|string|max:255',
            // 'implantRequest.address' => 'nullable|string|max:255',
            // 'implantRequest.contact' => 'nullable|string|max:255',
            // 'implantRequest.surgeryDate' => 'nullable|date',
            // 'implantRequest.implants' => 'required|array',
            // 'implantRequest.implants.*.description' => 'required|string|max:255',
            // 'implantRequest.implants.*.quantity' => 'nullable|string|max:255',
            // 'implantRequest.remarks' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Debugging: Dump the request data to see what's being received
        // dd($request->all()); 
        
        try {
            \Log::info('SurgeryEstimateController.store: Attempting to create surgery estimate', $request->all());
            $surgeryEstimate = SurgeryEstimate::create([
                'clinic_ref_no' => $request->input('clinic_ref_no'),
                'patient_name' => $request->input('patientName'),
                'surgery' => $request->input('surgery'),
                'time_for_surgery' => $request->input('timeForSurgery'),
                'stay_in_icu' => $request->input('stayInICU'),
                'stay_in_wards' => $request->input('stayInWards'),
                'implants_general' => $request->input('implants'),
                'date' => $request->input('date'),
                'contact' => $request->input('contact'),
                'whatsapp' => $request->input('whatsapp'),
                'surgery_estimate_range' => $request->input('surgeryEstimateRange'),
                'presidential_fund' => $request->input('presidentialFund'),
                'presidential_fund_date' => $request->input('presidentialFundDate'),
                'presidential_fund_diagnosis' => $request->input('presidentialFundDiagnosis'),
                'presidential_fund_diagnosis_date' => $request->input('presidentialFundDiagnosisDate'),
                'nitf_agrahara' => $request->input('nitfAgrahara'),
                'nitf_agrahara_date' => $request->input('nitfAgraharaDate'),
                'nitf_agrahara_diagnosis' => $request->input('nitfAgraharaDiagnosis'),
                'nitf_agrahara_diagnosis_date' => $request->input('nitfAgraharaDiagnosisDate'),
                'open_quotations' => $request->input('openQuotations'),
                'open_quotations_date' => $request->input('openQuotationsDate'),
                'check_on_drugs' => $request->input('checkOnDrugs'),
                'implant_prescription' => $request->input('implantPrescription'),
                'admission_letter' => $request->input('admissionLetter'),
                'investigation_sheet' => $request->input('investigationSheet'),
                'initial_deposit' => $request->input('initialDeposit'),
                'temp_admission_date' => $request->input('tempAdmissionDate'),
                'anesthetist_consultation_date' => $request->input('anesthetistConsultationDate'),
                'guardian_name' => $request->input('guardianName'),
                'guardian_contact' => $request->input('guardianContact'),
                'medical_coordinator' => $request->input('medicalCoordinator'),
                'implant_request_data' => json_encode($request->input('implantRequest')),
            ]);
            
            return response()->json(['message' => 'Surgery estimate saved successfully', 'data' => $surgeryEstimate], 201);
        } catch (\Exception $e) {
            \Log::error('SurgeryEstimateController.store: Failed to save surgery estimate', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to save surgery estimate', 'details' => $e->getMessage()], 500);
        }
    }
    
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'clinic_ref_no' => 'required|string|max:255',
            'patientName' => 'required|string|max:255',
            'surgery' => 'required|string|max:255',
            'timeForSurgery' => 'nullable|string|max:255',
            'stayInICU' => 'nullable|string|max:255',
            'stayInWards' => 'nullable|string|max:255',
            'implants' => 'nullable|string|max:255',
            'date' => 'required|date',
            'contact' => 'nullable|string|max:255',
            'whatsapp' => 'nullable|string|max:255',
            'surgeryEstimateRange' => 'required|string|max:255',
            'presidentialFund' => 'required|string|in:YES,NO',
            'presidentialFundDate' => 'nullable|date',
            'presidentialFundDiagnosis' => 'required|string|in:YES,NO',
            'presidentialFundDiagnosisDate' => 'nullable|date',
            'nitfAgrahara' => 'required|string|in:YES,NO',
            'nitfAgraharaDate' => 'nullable|date',
            'nitfAgraharaDiagnosis' => 'required|string|in:YES,NO',
            'nitfAgraharaDiagnosisDate' => 'nullable|date',
            'openQuotations' => 'required|string|in:YES,NO',
            'openQuotationsDate' => 'nullable|date',
            'checkOnDrugs' => 'required|string|in:YES,NO',
            'implantPrescription' => 'required|string|in:YES,NO',
            'admissionLetter' => 'required|string|in:YES,NO',
            'investigationSheet' => 'required|string|in:YES,NO',
            'initialDeposit' => 'nullable|string|max:255',
            'tempAdmissionDate' => 'nullable|string|max:255',
            'anesthetistConsultationDate' => 'nullable|date',
            'guardianName' => 'nullable|string|max:255',
            'guardianContact' => 'nullable|string|max:255',
            'medicalCoordinator' => 'nullable|string|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        try {
            $surgeryEstimate = SurgeryEstimate::findOrFail($id);
            $surgeryEstimate->update([
                'clinic_ref_no' => $request->input('clinic_ref_no'),
                'patient_name' => $request->input('patientName'),
                'surgery' => $request->input('surgery'),
                'time_for_surgery' => $request->input('timeForSurgery'),
                'stay_in_icu' => $request->input('stayInICU'),
                'stay_in_wards' => $request->input('stayInWards'),
                'implants_general' => $request->input('implants'),
                'date' => $request->input('date'),
                'contact' => $request->input('contact'),
                'whatsapp' => $request->input('whatsapp'),
                'surgery_estimate_range' => $request->input('surgeryEstimateRange'),
                'presidential_fund' => $request->input('presidentialFund'),
                'presidential_fund_date' => $request->input('presidentialFundDate'),
                'presidential_fund_diagnosis' => $request->input('presidentialFundDiagnosis'),
                'presidential_fund_diagnosis_date' => $request->input('presidentialFundDiagnosisDate'),
                'nitf_agrahara' => $request->input('nitfAgrahara'),
                'nitf_agrahara_date' => $request->input('nitfAgraharaDate'),
                'nitf_agrahara_diagnosis' => $request->input('nitfAgraharaDiagnosis'),
                'nitf_agrahara_diagnosis_date' => $request->input('nitfAgraharaDiagnosisDate'),
                'open_quotations' => $request->input('openQuotations'),
                'open_quotations_date' => $request->input('openQuotationsDate'),
                'check_on_drugs' => $request->input('checkOnDrugs'),
                'implant_prescription' => $request->input('implantPrescription'),
                'admission_letter' => $request->input('admissionLetter'),
                'investigation_sheet' => $request->input('investigationSheet'),
                'initial_deposit' => $request->input('initialDeposit'),
                'temp_admission_date' => $request->input('tempAdmissionDate'),
                'anesthetist_consultation_date' => $request->input('anesthetistConsultationDate'),
                'guardian_name' => $request->input('guardianName'),
                'guardian_contact' => $request->input('guardianContact'),
                'medical_coordinator' => $request->input('medicalCoordinator'),
                'implant_request_data' => json_encode($request->input('implantRequest')),
            ]);
            
            return response()->json(['message' => 'Surgery estimate updated successfully', 'data' => $surgeryEstimate], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update surgery estimate', 'details' => $e->getMessage()], 500);
        }
    }
    
    public function destroy($id)
    {
        try {
            $surgeryEstimate = SurgeryEstimate::findOrFail($id);
            $surgeryEstimate->delete();
            
            return response()->json(['message' => 'Surgery estimate deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete surgery estimate', 'details' => $e->getMessage()], 500);
        }
    }
    
    public function indexByClinicRefNo($clinicRefNo)
    {
        try {
            $estimates = SurgeryEstimate::where('clinic_ref_no', $clinicRefNo)->get();
            return response()->json($estimates);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch surgery estimates', 'details' => $e->getMessage()], 500);
        }
    }
}
