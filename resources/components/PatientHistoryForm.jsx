import React, { useState } from 'react';
import { SaveIcon, AlertCircleIcon, CheckCircle2Icon } from 'lucide-react'; // Updated icons
import Swal from 'sweetalert2';

const PatientHistoryForm = ({ patientId, patientClinicRefNo, onRecordSaved }) => { // Added props
  // Form States (existing states remain the same)
  const [headacheDuration, setHeadacheDuration] = useState('');
  const [headacheEpisode, setHeadacheEpisode] = useState('');
  const [headacheSite, setHeadacheSite] = useState('');
  const [headacheAura, setHeadacheAura] = useState('');
  const [headacheEnt, setHeadacheEnt] = useState('');
  const [headacheEye, setHeadacheEye] = useState('');
  const [headacheSen, setHeadacheSen] = useState('');
  const [headacheFocalSymptoms, setHeadacheFocalSymptoms] = useState('');

  const [backacheDuration, setBackacheDuration] = useState('');
  const [backacheSite, setBackacheSite] = useState('');
  const [backacheRadiation, setBackacheRadiation] = useState('');
  const [backacheTrauma, setBackacheTrauma] = useState('');
  const [backacheJointsInflamed, setBackacheJointsInflamed] = useState('');

  const [neckacheFocalSymptoms, setNeckacheFocalSymptoms] = useState('');
  const [neckacheSen, setNeckacheSen] = useState('');
  const [neckacheMotor, setNeckacheMotor] = useState('');
  const [neckacheNClaud, setNeckacheNClaud] = useState('');
  const [neckacheJointsInflamed, setNeckacheJointsInflamed] = useState('');

  const [otherTremors, setOtherTremors] = useState('');
  const [otherNumbness, setOtherNumbness] = useState('');
  const [otherWeakness, setOtherWeakness] = useState('');
  const [otherGiddiness, setOtherGiddiness] = useState('');
  const [otherOther, setOtherOther] = useState('');

  // Examination State
  const [neuroHigherFunctions, setNeuroHigherFunctions] = useState('');
  const [neuroGcs, setNeuroGcs] = useState('');
  const [neuroTremors, setNeuroTremors] = useState('');
  const [neuroCranialNerves, setNeuroCranialNerves] = useState('');
  const [neuroFundi, setNeuroFundi] = useState('');

  const [cerebellumNystagmus, setCerebellumNystagmus] = useState(false);
  const [cerebellumAtaxia, setCerebellumAtaxia] = useState(false);
  const [cerebellumDysarthria, setCerebellumDysarthria] = useState(false);
  const [cerebellumDysmetria, setCerebellumDysmetria] = useState(false);
  const [cerebellumDysdiadochokinesia, setCerebellumDysdiadochokinesia] = useState(false);

  const [examMotor, setExamMotor] = useState('');
  const [examSensory, setExamSensory] = useState('');
  const [examReflex, setExamReflex] = useState('');

  const [examGait, setExamGait] = useState('');
  const [examSpDeformity, setExamSpDeformity] = useState('');
  const [examSlr, setExamSlr] = useState('');
  const [examLs, setExamLs] = useState('');

  const [examHipsKnees, setExamHipsKnees] = useState('');

  const [tenderPointsCervical, setTenderPointsCervical] = useState(false);
  const [tenderPointsLumbar, setTenderPointsLumbar] = useState(false);
  const [tenderPointsKnee, setTenderPointsKnee] = useState(false);
  const [tenderPointsHip, setTenderPointsHip] = useState(false);

  const [examWasting, setExamWasting] = useState('');
  const [examEhl, setExamEhl] = useState('');
  const [examFootWeakness, setExamFootWeakness] = useState('');

  const [examSens, setExamSens] = useState('');
  const [examMotor2, setExamMotor2] = useState(''); // Renamed to avoid conflict
  const [examReflexes, setExamReflexes] = useState('');
  const [examOther, setExamOther] = useState('');

  const [pastIllnessDm, setPastIllnessDm] = useState(false);
  const [pastIllnessHtn, setPastIllnessHtn] = useState(false);
  const [pastIllnessDl, setPastIllnessDl] = useState(false);

  const [allergiesFood, setAllergiesFood] = useState(false);
  const [allergiesDrugs, setAllergiesDrugs] = useState(false);
  const [allergiesPlasters, setAllergiesPlasters] = useState(false); // Changed from Pollen
  const [allergensInput, setAllergensInput] = useState(''); // New state for Allergens input

  // New Drugs State
  const [drugsInput, setDrugsInput] = useState('');
  const [drugsAspirin, setDrugsAspirin] = useState(false);
  const [drugsClopidogrel, setDrugsClopidogrel] = useState(false);
  const [drugsWarfarin, setDrugsWarfarin] = useState(false);
  const [drugsAntiplatelets, setDrugsAntiplatelets] = useState(false);
  const [drugsAnticoagulant, setDrugsAnticoagulant] = useState(false);

  // Removed local 'records' state as it's now managed in PatientProfile or fetched
  // const [records, setRecords] = useState([]); 

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});


  const clearFormFields = () => {
    setHeadacheDuration(''); setHeadacheEpisode(''); setHeadacheSite(''); setHeadacheAura(''); setHeadacheEnt(''); setHeadacheEye(''); setHeadacheSen(''); setHeadacheFocalSymptoms('');
    setBackacheDuration(''); setBackacheSite(''); setBackacheRadiation(''); setBackacheTrauma(''); setBackacheJointsInflamed('');
    setNeckacheFocalSymptoms(''); setNeckacheSen(''); setNeckacheMotor(''); setNeckacheNClaud(''); setNeckacheJointsInflamed('');
    setOtherTremors(''); setOtherNumbness(''); setOtherWeakness(''); setOtherGiddiness(''); setOtherOther('');
    setNeuroHigherFunctions(''); setNeuroGcs(''); setNeuroTremors(''); setNeuroCranialNerves(''); setNeuroFundi('');
    setCerebellumNystagmus(false); setCerebellumAtaxia(false); setCerebellumDysarthria(false); setCerebellumDysmetria(false); setCerebellumDysdiadochokinesia(false);
    setExamMotor(''); setExamSensory(''); setExamReflex('');
    setExamGait(''); setExamSpDeformity(''); setExamSlr(''); setExamLs('');
    setExamHipsKnees('');
    setTenderPointsCervical(false); setTenderPointsLumbar(false); setTenderPointsKnee(false); setTenderPointsHip(false);
    setExamWasting(''); setExamEhl(''); setExamFootWeakness('');
    setExamSens(''); setExamMotor2(''); setExamReflexes(''); setExamOther('');
    setPastIllnessDm(false); setPastIllnessHtn(false); setPastIllnessDl(false);
    setAllergiesFood(false); setAllergiesDrugs(false); setAllergiesPlasters(false); setAllergensInput('');
    setDrugsInput(''); setDrugsAspirin(false); setDrugsClopidogrel(false); setDrugsWarfarin(false); setDrugsAntiplatelets(false); setDrugsAnticoagulant(false);
  }

  const handleSaveRecord = async () => {
    if (!patientId || !patientClinicRefNo) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Patient not selected. Please search for a patient first.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    setValidationErrors({});

    // Construct strings for checkbox groups
    const cerebellumSignsList = [
      cerebellumNystagmus && 'Nystagmus',
      cerebellumAtaxia && 'Ataxia',
      cerebellumDysarthria && 'Dysarthria',
      cerebellumDysmetria && 'Dysmetria',
      cerebellumDysdiadochokinesia && 'Dysdiadochokinesia',
    ].filter(Boolean).join(', ');

    const tenderPointsList = [
      tenderPointsCervical && 'Cervical',
      tenderPointsLumbar && 'Lumbar',
      tenderPointsKnee && 'Knee',
      tenderPointsHip && 'Hip',
    ].filter(Boolean).join(', ');

    const pastIllnessList = [
      pastIllnessDm && 'DM',
      pastIllnessHtn && 'HTN',
      pastIllnessDl && 'DL',
    ].filter(Boolean).join(', ');

    const allergiesList = [
      allergiesFood && 'Food',
      allergiesDrugs && 'Drugs',
      allergiesPlasters && 'Plasters',
    ].filter(Boolean).join(', ');

    const drugsTakenList = [
      drugsAspirin && 'Aspirin',
      drugsClopidogrel && 'Clopidogrel',
      drugsWarfarin && 'Warfarin',
      drugsAntiplatelets && 'Antiplatelets',
      drugsAnticoagulant && 'Anticoagulant',
    ].filter(Boolean).join(', ');

    const payload = {
      patient_id: patientId,
      patient_clinic_ref_no: patientClinicRefNo,
      // History fields
      headacheDuration, headacheEpisode, headacheSite, headacheAura, headacheEnt, headacheEye, headacheSen, headacheFocalSymptoms,
      backacheDuration, backacheSite, backacheRadiation, backacheTrauma, backacheJointsInflamed,
      neckacheFocalSymptoms, neckacheSen, neckacheMotor, neckacheNClaud, neckacheJointsInflamed,
      otherTremors, otherNumbness, otherWeakness, otherGiddiness, otherOther,
      // Examination fields
      neuroHigherFunctions, neuroGcs, neuroTremors, neuroCranialNerves, neuroFundi,
      cerebellumSigns: cerebellumSignsList,
      examMotor, examSensory, examReflex,
      examGait, examSpDeformity, examSlr, examLs,
      examHipsKnees,
      tenderPoints: tenderPointsList,
      examWasting, examEhl, examFootWeakness,
      examSens, examMotor2, examReflexes, examOther,
      pastIllness: pastIllnessList,
      allergies: allergiesList,
      allergensInput,
      drugsInput,
      drugsTaken: drugsTakenList,
    };

    try {
      const response = await fetch('/patient-history-examination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]')?.content) || '',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422 && responseData.errors) {
          setValidationErrors(responseData.errors);
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please correct the validation errors.',
            confirmButtonColor: '#3085d6',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: responseData.message || 'Failed to save record.',
            confirmButtonColor: '#3085d6',
          });
        }
        return;
      }

      // Clear form after successful save
      clearFormFields();
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Record saved successfully!',
        confirmButtonColor: '#3085d6',
        timer: 2000,
        timerProgressBar: true,
      });

      // Notify parent component about the new record
      if (onRecordSaved && typeof onRecordSaved === 'function') {
        onRecordSaved(patientId);
      }

    } catch (error) {
      console.error('Error saving record:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving the record.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* History Section */}
      <section>
        <h3 className="text-lg font-medium text-gray-900 mb-2">History</h3>
        <div className="border border-gray-200 rounded-md p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Headache Details */}
            
            <div className="col-span-full text-md font-semibold text-gray-700 mb-2">Headache Details</div>
          <hr className="col-span-full mb-4 border-gray-300" />
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
            <select value={headacheDuration} onChange={(e) => setHeadacheDuration(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Duration</option>
              <option value="Less than 30 minutes">Less than 30 minutes</option>
              <option value="30 minutes to 1 hour">30 minutes to 1 hour</option>
              <option value="More than 1 hour">More than 1 hour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Episode</label>
            <select value={headacheEpisode} onChange={(e) => setHeadacheEpisode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Episode</option>
              <option value="Less than 5 episode per week">Less than 5 episode per week</option>
              <option value="More than 5 episode per week">More than 5 episode per week</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Site</label>
            <select value={headacheSite} onChange={(e) => setHeadacheSite(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Site</option>
              <option value="Frontal">Frontal</option>
              <option value="Occipital">Occipital</option>
              <option value="Temporal">Temporal</option>
              <option value="Parietal">Parietal</option>
              <option value="Diffuse">Diffuse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Aura</label>
            <input type="text" value={headacheAura} onChange={(e) => setHeadacheAura(e.target.value)} placeholder="Describe aura" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ENT</label>
            <input type="text" value={headacheEnt} onChange={(e) => setHeadacheEnt(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Eye</label>
            <input type="text" value={headacheEye} onChange={(e) => setHeadacheEye(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sen</label>
            <input type="text" value={headacheSen} onChange={(e) => setHeadacheSen(e.target.value)} placeholder="Location" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Focal Symptoms</label>
            <input type="text" value={headacheFocalSymptoms} onChange={(e) => setHeadacheFocalSymptoms(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Backache */}
           <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Backache</div>
           <hr className="col-span-full mb-4 border-gray-300" />
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
            <input type="text" value={backacheDuration} onChange={(e) => setBackacheDuration(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Site</label>
            <select value={backacheSite} onChange={(e) => setBackacheSite(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Site</option>
              <option value="Upper lumbar">Upper lumbar</option>
              <option value="Middle lumbar">Middle lumbar</option>
              <option value="Lower lumbar">Lower lumbar</option>
              <option value="Sacroiliac">Sacroiliac</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Radiation</label>
            <select value={backacheRadiation} onChange={(e) => setBackacheRadiation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Radiation</option>
              <option value="Left thigh">Left thigh</option>
              <option value="Right thigh">Right thigh</option>
              <option value="Bilateral thigh">Bilateral thigh</option>
              <option value="Left leg">Left leg </option>
              <option value="Right leg">Right leg</option>
              <option value="Bilateral leg">Bilateral leg</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Trauma</label>
            <input type="text" value={backacheTrauma} onChange={(e) => setBackacheTrauma(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Number of Joints Inflamed</label>
            <select value={backacheJointsInflamed} onChange={(e) => setBackacheJointsInflamed(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Number</option>
              <option value="Less than 5">Less than 5</option>
              <option value="5 to 10">5 to 10</option>
              <option value="More than 10">More than 10</option>
            </select>
          </div>

          {/* Neckache */}
           <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Neckache</div>
            <hr className="col-span-full mb-4 border-gray-300" />
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Focal Symptoms</label>
            <input type="text" value={neckacheFocalSymptoms} onChange={(e) => setNeckacheFocalSymptoms(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sen</label>
            <input type="text" value={neckacheSen} onChange={(e) => setNeckacheSen(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Motor</label>
            <input type="text" value={neckacheMotor} onChange={(e) => setNeckacheMotor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">N.Claud</label>
            <input type="text" value={neckacheNClaud} onChange={(e) => setNeckacheNClaud(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Number of Joints Inflamed</label>
            <select value={neckacheJointsInflamed} onChange={(e) => setNeckacheJointsInflamed(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select Number</option>
              <option value="Less than 5">Less than 5</option>
              <option value="5 to 10">5 to 10</option>
              <option value="More than 10">More than 10</option>
            </select>
          </div>

          {/* Other */}
           <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Other</div>
            <hr className="col-span-full mb-4 border-gray-300" />
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tremors</label>
            <input type="text" value={otherTremors} onChange={(e) => setOtherTremors(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Numbness</label>
            <input type="text" value={otherNumbness} onChange={(e) => setOtherNumbness(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Weakness</label>
            <input type="text" value={otherWeakness} onChange={(e) => setOtherWeakness(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Giddiness</label>
            <input type="text" value={otherGiddiness} onChange={(e) => setOtherGiddiness(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-600 mb-1">Other</label>
            <input type="text" value={otherOther} onChange={(e) => setOtherOther(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          </div>
        </div>
      </section>

      {/* Examination Section */}
      <section>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Examination</h3>
        <div className="border border-gray-200 rounded-md p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Neurological Examination */}
            <div className="col-span-full text-md font-semibold text-gray-700 mb-2">Neurological Examination</div>
            <hr className="col-span-full mb-4 border-gray-300" />
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Higher Functions</label>
            <input type="text" value={neuroHigherFunctions} onChange={(e) => setNeuroHigherFunctions(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">GCS</label>
            <select value={neuroGcs} onChange={(e) => setNeuroGcs(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select GCS Number</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tremors</label>
            <input type="text" value={neuroTremors} onChange={(e) => setNeuroTremors(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cranial Nerves</label>
            <input type="text" value={neuroCranialNerves} onChange={(e) => setNeuroCranialNerves(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Fundi</label>
            <input type="text" value={neuroFundi} onChange={(e) => setNeuroFundi(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Cerebellum */}
          <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Cerebellum</div>
          <div className="col-span-full flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={cerebellumNystagmus} onChange={(e) => setCerebellumNystagmus(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Nystagmus</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={cerebellumAtaxia} onChange={(e) => setCerebellumAtaxia(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Ataxia</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={cerebellumDysarthria} onChange={(e) => setCerebellumDysarthria(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Dysarthria</span>
              </label>
               <label className="flex items-center text-sm">
                  <input type="checkbox" checked={cerebellumDysmetria} onChange={(e) => setCerebellumDysmetria(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Dysmetria</span>
              </label>
               <label className="flex items-center text-sm">
                  <input type="checkbox" checked={cerebellumDysdiadochokinesia} onChange={(e) => setCerebellumDysdiadochokinesia(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Dysdiadochokinesia</span>
              </label>
          </div>

          {/* Motor, Sensory, Reflex */}
           <div className="col-span-1"> {/* Adjust grid span if needed */}
            <label className="block text-sm font-medium text-gray-600 mb-1">Motor</label>
            <input type="text" value={examMotor} onChange={(e) => setExamMotor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Sensory</label>
            <input type="text" value={examSensory} onChange={(e) => setExamSensory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Reflex</label>
            <input type="text" value={examReflex} onChange={(e) => setExamReflex(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="col-span-1"></div> {/* Placeholder for grid alignment */}


          {/* Gait, Sp.Deformity, SLR, L/S */}
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Gait</label>
            <input type="text" value={examGait} onChange={(e) => setExamGait(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sp.Deformity</label>
            <input type="text" value={examSpDeformity} onChange={(e) => setExamSpDeformity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">SLR: R/S</label>
            <input type="text" value={examSlr} onChange={(e) => setExamSlr(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">L/S</label>
            <input type="text" value={examLs} onChange={(e) => setExamLs(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Hips/Knees */}
           <div className="col-span-full"> {/* Span full width */}
            <label className="block text-sm font-medium text-gray-600 mb-1">Hips/Knees</label>
            <input type="text" value={examHipsKnees} onChange={(e) => setExamHipsKnees(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Tender Points */}
          <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Tender Points</div>
          <div className="col-span-full flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={tenderPointsCervical} onChange={(e) => setTenderPointsCervical(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Cervical</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={tenderPointsLumbar} onChange={(e) => setTenderPointsLumbar(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Lumbar</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={tenderPointsKnee} onChange={(e) => setTenderPointsKnee(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Knee</span>
              </label>
               <label className="flex items-center text-sm">
                  <input type="checkbox" checked={tenderPointsHip} onChange={(e) => setTenderPointsHip(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Hip</span>
              </label>
          </div>

          {/* Wasting, EHL, Foot Weakness */}
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Wasting</label>
            <input type="text" value={examWasting} onChange={(e) => setExamWasting(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">EHL</label>
            <input type="text" value={examEhl} onChange={(e) => setExamEhl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Foot Weakness</label>
            <input type="text" value={examFootWeakness} onChange={(e) => setExamFootWeakness(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
           <div className="col-span-1"></div> {/* Placeholder for grid alignment */}


          {/* Sens, Motor, Reflexes, Other */}
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sens</label>
            <input type="text" value={examSens} onChange={(e) => setExamSens(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Motor</label>
            <input type="text" value={examMotor2} onChange={(e) => setExamMotor2(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Reflexes</label>
            <input type="text" value={examReflexes} onChange={(e) => setExamReflexes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Other</label>
            <input type="text" value={examOther} onChange={(e) => setExamOther(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Past Illness */}
          <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Past Illness</div>
          <div className="col-span-full flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={pastIllnessDm} onChange={(e) => setPastIllnessDm(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">DM</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={pastIllnessHtn} onChange={(e) => setPastIllnessHtn(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">HTN</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={pastIllnessDl} onChange={(e) => setPastIllnessDl(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">DL</span>
              </label>
          </div>

          {/* Allergies */}
          <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Allergies</div>
          <div className="col-span-full flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={allergiesFood} onChange={(e) => setAllergiesFood(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Food</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={allergiesDrugs} onChange={(e) => setAllergiesDrugs(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Drugs</span>
              </label>
              <label className="flex items-center text-sm">
                  <input type="checkbox" checked={allergiesPlasters} onChange={(e) => setAllergiesPlasters(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                  <span className="ml-2 text-gray-700">Plasters</span>
              </label>
          </div>
           {/* Allergens Text Input */}
           <div className="col-span-full mt-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Allergens</label>
                <input type="text" value={allergensInput} onChange={(e) => setAllergensInput(e.target.value)} placeholder="Describe allergens" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
        </div>

        {/* Drugs Section - New */}
        <div className="col-span-full text-md font-semibold text-gray-700 mt-4 mb-2">Drugs</div>
         <hr className="col-span-full mb-4 border-gray-300" />
        <div className="col-span-full mb-4">
            <input type="text" value={drugsInput} onChange={(e) => setDrugsInput(e.target.value)} placeholder="Enter drug details" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="col-span-full flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex items-center text-sm">
                <input type="checkbox" checked={drugsAspirin} onChange={(e) => setDrugsAspirin(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                <span className="ml-2 text-gray-700">Aspirin</span>
            </label>
            <label className="flex items-center text-sm">
                <input type="checkbox" checked={drugsClopidogrel} onChange={(e) => setDrugsClopidogrel(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                <span className="ml-2 text-gray-700">Clopidogrel</span>
            </label>
            <label className="flex items-center text-sm">
                <input type="checkbox" checked={drugsWarfarin} onChange={(e) => setDrugsWarfarin(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                <span className="ml-2 text-gray-700">Warfarin</span>
            </label>
             <label className="flex items-center text-sm">
                <input type="checkbox" checked={drugsAntiplatelets} onChange={(e) => setDrugsAntiplatelets(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                <span className="ml-2 text-gray-700">Antiplatelets</span>
            </label>
             <label className="flex items-center text-sm">
                <input type="checkbox" checked={drugsAnticoagulant} onChange={(e) => setDrugsAnticoagulant(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                <span className="ml-2 text-gray-700">Anticoagulant</span>
            </label>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveRecord}
          disabled={isSaving || !patientId}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <SaveIcon size={16} className="mr-1.5" />
          {isSaving ? 'Saving...' : 'Save Record'}
        </button>
      </div>
    </div>
  );
};

export default PatientHistoryForm;
