import React, { useState, useEffect, useMemo } from 'react';
import { CalendarIcon, PrinterIcon, PlusIcon, XIcon, AlertCircle } from 'lucide-react';
import PrescriptionPreview from './PrescriptionPreview';

interface Drug {
  id: number;
  drug_class: string | null;
  drug_name: string;
  dose: string | null;
  formulation: string | null;
  frequency: string | null;
  duration: string | null;
}

interface Medication {
  id: string;
  drugClass: string;
  name: string;
  dosage: string;
  formulation: string;
  frequency: string;
  duration: string;
  instructions?: string;
  isSpecialItem?: boolean;
  itemName?: string;
}

interface MedicationFormProps {
  onAdd: (medication: Medication) => void;
  allDrugs: Drug[];
}

const MedicationForm = ({ onAdd, allDrugs }: MedicationFormProps) => {
  const [drugClass, setDrugClass] = useState('');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [customDosage, setCustomDosage] = useState('');
  const [formulation, setFormulation] = useState('');
  const [customFormulation, setCustomFormulation] = useState('');
  const [frequency, setFrequency] = useState('');
  const [customFrequency, setCustomFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const drugsInSelectedClass = useMemo(() => {
    return allDrugs.filter(drug => (drug.drug_class || 'Unspecified') === drugClass);
  }, [drugClass, allDrugs]);

  const availableDrugNames = useMemo(() => {
    const names = new Set(drugsInSelectedClass.map(drug => drug.drug_name));
    return Array.from(names);
  }, [drugsInSelectedClass]);

  const drugsWithSelectedName = useMemo(() => {
    return drugsInSelectedClass.filter(drug => drug.drug_name === name);
  }, [name, drugsInSelectedClass]);

  const availableDosages = useMemo(() => {
    const doses = new Set(drugsWithSelectedName.map(drug => drug.dose).filter(d => d !== null));
    const dosageOptions = Array.from(doses);
    if (dosageOptions.length > 0) {
      dosageOptions.push('Custom');
    }
    return dosageOptions;
  }, [drugsWithSelectedName]);

  const drugsWithSelectedDose = useMemo(() => {
    if (dosage === 'Custom') return drugsWithSelectedName;
    return drugsWithSelectedName.filter(drug => drug.dose === dosage);
  }, [dosage, drugsWithSelectedName]);

  const availableFormulations = useMemo(() => {
    const formulations = new Set(drugsWithSelectedDose.map(drug => drug.formulation).filter(f => f !== null));
    const formulationOptions = Array.from(formulations);
    if (formulationOptions.length > 0) {
      formulationOptions.push('Custom');
    }
    return formulationOptions;
  }, [drugsWithSelectedDose]);

  const drugsWithSelectedFormulation = useMemo(() => {
    if (formulation === 'Custom') return drugsWithSelectedDose;
    return drugsWithSelectedDose.filter(drug => drug.formulation === formulation);
  }, [formulation, drugsWithSelectedDose]);

  const availableFrequencies = useMemo(() => {
    const frequencies = new Set(drugsWithSelectedFormulation.map(drug => drug.frequency).filter(f => f !== null));
    const frequencyOptions = Array.from(frequencies);
    if (frequencyOptions.length > 0) {
      frequencyOptions.push('Custom');
    }
    return frequencyOptions;
  }, [drugsWithSelectedFormulation]);

  const drugsWithSelectedFrequency = useMemo(() => {
    if (frequency === 'Custom') return drugsWithSelectedFormulation;
    return drugsWithSelectedFormulation.filter(drug => drug.frequency === frequency);
  }, [frequency, drugsWithSelectedFormulation]);

  const availableDurations = useMemo(() => {
    const durations = new Set(drugsWithSelectedFrequency.map(drug => drug.duration).filter(d => d !== null));
    const durationOptions = Array.from(durations);
    if (durationOptions.length > 0) {
      durationOptions.push('Custom');
    }
    return durationOptions;
  }, [drugsWithSelectedFrequency]);

  useEffect(() => {
    setName('');
    setDosage('');
    setCustomDosage('');
    setFormulation('');
    setCustomFormulation('');
    setFrequency('');
    setCustomFrequency('');
    setDuration('');
    setCustomDuration('');
  }, [drugClass]);

  useEffect(() => {
    setDosage('');
    setCustomDosage('');
    setFormulation('');
    setCustomFormulation('');
    setFrequency('');
    setCustomFrequency('');
    setDuration('');
    setCustomDuration('');
  }, [name]);

  useEffect(() => {
    setFormulation('');
    setCustomFormulation('');
    setFrequency('');
    setCustomFrequency('');
    setDuration('');
    setCustomDuration('');
  }, [dosage]);

  useEffect(() => {
    setFrequency('');
    setCustomFrequency('');
    setDuration('');
    setCustomDuration('');
  }, [formulation]);

  useEffect(() => {
    setDuration('');
    setCustomDuration('');
  }, [frequency]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!drugClass) newErrors.drugClass = 'Drug Class is required';
    if (!name) newErrors.name = 'Drug Name is required';
    if (!dosage && availableDosages.length > 0) newErrors.dosage = 'Dose is required';
    if (dosage === 'Custom' && !customDosage) newErrors.customDosage = 'Custom dosage is required';
    if (dosage !== 'Custom' && availableDosages.length > 0 && !availableDosages.includes(dosage)) newErrors.dosage = 'Invalid dose selected';
    if (!formulation && availableFormulations.length > 0) newErrors.formulation = 'Formulation is required';
    if (formulation === 'Custom' && !customFormulation) newErrors.customFormulation = 'Custom formulation is required';
    if (formulation !== 'Custom' && availableFormulations.length > 0 && !availableFormulations.includes(formulation)) newErrors.formulation = 'Invalid formulation selected';
    if (!frequency && availableFrequencies.length > 0) newErrors.frequency = 'Frequency is required';
    if (frequency === 'Custom' && !customFrequency) newErrors.customFrequency = 'Custom frequency is required';
    if (frequency !== 'Custom' && availableFrequencies.length > 0 && !availableFrequencies.includes(frequency)) newErrors.frequency = 'Invalid frequency selected';
    if (!duration && availableDurations.length > 0) newErrors.duration = 'Duration is required';
    if (duration === 'Custom' && !customDuration) newErrors.customDuration = 'Custom duration is required';
    if (duration !== 'Custom' && availableDurations.length > 0 && !availableDurations.includes(duration)) newErrors.duration = 'Invalid duration selected';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onAdd({
      id: Date.now().toString(),
      drugClass: drugClass,
      name: name,
      dosage: dosage === 'Custom' ? customDosage : dosage,
      formulation: formulation === 'Custom' ? customFormulation : formulation,
      frequency: frequency === 'Custom' ? customFrequency : frequency,
      duration: duration === 'Custom' ? customDuration : duration,
      instructions: instructions || undefined,
    });
    setDrugClass('');
    setName('');
    setDosage('');
    setCustomDosage('');
    setFormulation('');
    setCustomFormulation('');
    setFrequency('');
    setCustomFrequency('');
    setDuration('');
    setCustomDuration('');
    setInstructions('');
    setErrors({});
  };

  const handleClear = () => {
    setDrugClass('');
    setName('');
    setDosage('');
    setCustomDosage('');
    setFormulation('');
    setCustomFormulation('');
    setFrequency('');
    setCustomFrequency('');
    setDuration('');
    setCustomDuration('');
    setInstructions('');
    setErrors({});
  };

  const availableDrugClasses = useMemo(() => {
    const classes = new Set(allDrugs.map(drug => drug.drug_class || 'Unspecified'));
    return Array.from(classes);
  }, [allDrugs]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Drug Class</label>
          <select
            value={drugClass}
            onChange={(e) => setDrugClass(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.drugClass ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Select Drug Class</option>
            {availableDrugClasses.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          {errors.drugClass && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.drugClass}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={!drugClass || availableDrugNames.length === 0}
          >
            <option value="">Select Drug Name</option>
            {availableDrugNames.map((drugName) => (
              <option key={drugName} value={drugName}>
                {drugName}
              </option>
            ))}
          </select>
          {errors.name && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.name}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dose</label>
          {dosage === 'Custom' ? (
            <input
              type="text"
              value={customDosage}
              onChange={(e) => setCustomDosage(e.target.value)}
              placeholder="Enter custom dosage"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.customDosage ? 'border-red-500' : 'border-gray-300'
                }`}
            />
          ) : (
            <select
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.dosage ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={!name || availableDosages.length === 0}
            >
              <option value="">Select Dose</option>
              {availableDosages.map((doseOption) => (
                <option key={doseOption} value={doseOption}>
                  {doseOption}
                </option>
              ))}
            </select>
          )}
          {errors.dosage && dosage !== 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.dosage}
            </p>
          )}
          {errors.customDosage && dosage === 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.customDosage}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Formulation</label>
          {formulation === 'Custom' ? (
            <input
              type="text"
              value={customFormulation}
              onChange={(e) => setCustomFormulation(e.target.value)}
              placeholder="Enter custom formulation"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.customFormulation ? 'border-red-500' : 'border-gray-300'
                }`}
            />
          ) : (
            <select
              value={formulation}
              onChange={(e) => setFormulation(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.formulation ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={!dosage || availableFormulations.length === 0}
            >
              <option value="">Select Formulation</option>
              {availableFormulations.map((formulationOption) => (
                <option key={formulationOption} value={formulationOption}>
                  {formulationOption}
                </option>
              ))}
            </select>
          )}
          {errors.formulation && formulation !== 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.formulation}
            </p>
          )}
          {errors.customFormulation && formulation === 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.customFormulation}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          {frequency === 'Custom' ? (
            <input
              type="text"
              value={customFrequency}
              onChange={(e) => setCustomFrequency(e.target.value)}
              placeholder="Enter custom frequency"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.customFrequency ? 'border-red-500' : 'border-gray-300'
                }`}
            />
          ) : (
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.frequency ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={!formulation || availableFrequencies.length === 0}
            >
              <option value="">Select Frequency</option>
              {availableFrequencies.map((frequencyOption) => (
                <option key={frequencyOption} value={frequencyOption}>
                  {frequencyOption}
                </option>
              ))}
            </select>
          )}
          {errors.frequency && frequency !== 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.frequency}
            </p>
          )}
          {errors.customFrequency && frequency === 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.customFrequency}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          {duration === 'Custom' ? (
            <input
              type="text"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              placeholder="Enter custom duration"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.customDuration ? 'border-red-500' : 'border-gray-300'
                }`}
            />
          ) : (
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={!frequency || availableDurations.length === 0}
            >
              <option value="">Select Duration</option>
              {availableDurations.map((durationOption) => (
                <option key={durationOption} value={durationOption}>
                  {durationOption}
                </option>
              ))}
            </select>
          )}
          {errors.duration && duration !== 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.duration}
            </p>
          )}
          {errors.customDuration && duration === 'Custom' && (
            <p className="flex items-center text-xs text-red-600 mt-1">
              <AlertCircle size={14} className="mr-1" /> {errors.customDuration}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Optional: Take with food, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          <PlusIcon size={16} className="mr-2" />
          Add Medication
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200 shadow-sm"
        >
          Clear Form
        </button>
      </div>
    </form>
  );
};

interface PrescriptionGeneratorProps {
  patientClinicRefNo?: string | null;
}

const PrescriptionGenerator = ({ patientClinicRefNo }: PrescriptionGeneratorProps) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [specialItem, setSpecialItem] = useState('');
  const [nextAppointmentDate, setNextAppointmentDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [allDrugs, setAllDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string | string[] }>({});
  const [nextVisitError, setNextVisitError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/drugs', {
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Error fetching drugs: ${response.status}`);
        } else {
          setAllDrugs(data);
          console.log("Fetched drugs:", data);
        }
      } catch (error) {
        console.error("Error fetching drugs:", error);
        setError("An error occurred while fetching drug list.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrugs();
  }, []);

  const drugsGroupedByClass = allDrugs.reduce((acc, drug) => {
    const drugClass = drug.drug_class || 'Unspecified';
    if (!acc[drugClass]) {
      acc[drugClass] = [];
    }
    acc[drugClass].push(drug);
    return acc;
  }, {} as { [key: string]: Drug[] });

  useEffect(() => {
    console.log("Drugs state updated:", allDrugs);
    console.log("Drugs grouped by class:", drugsGroupedByClass);
  }, [allDrugs, drugsGroupedByClass]);

  const getDefaultDateSuggestion = () => {
    const today = new Date('2025-05-18');
    const defaultDate = new Date(today);
    defaultDate.setDate(today.getDate() + 7);
    return defaultDate.toISOString().split('T')[0];
  };

  const validateNextVisit = (date: string) => {
    if (!date) {
      setNextVisitError('Next appointment date is required');
      return false;
    }
    const today = new Date('2025-05-18');
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      setNextVisitError('Next appointment date cannot be in the past');
    } else {
      setNextVisitError('');
    }
    return selectedDate >= today;
  };

  useEffect(() => {
    validateNextVisit(nextAppointmentDate);
  }, [nextAppointmentDate]);

  const handleAddMedication = (medication: Medication) => {
    setMedications([...medications, { ...medication, isSpecialItem: false }]);
  };

  const handleRemoveMedication = (id: string) => {
    if (window.confirm('Are you sure you want to remove this medication?')) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const handleAddSpecialItem = () => {
    if (specialItem.trim() !== '') {
      setMedications([
        ...medications,
        {
          id: Date.now().toString(),
          isSpecialItem: true,
          itemName: specialItem.trim(),
          drugClass: 'N/A',
          name: specialItem.trim(),
          dosage: 'N/A',
          formulation: 'N/A',
          frequency: 'N/A',
          duration: 'N/A',
        },
      ]);
      setSpecialItem('');
      setFormErrors({});
    } else {
      setFormErrors({ specialItem: 'Special item cannot be empty.' });
    }
  };

  const handleGeneratePrescription = async () => {
    if (!validateNextVisit(nextAppointmentDate)) {
      return;
    }
    if (!patientClinicRefNo) {
      setError("Patient's Clinic Ref No is missing. Cannot save prescription.");
      return;
    }
    if (medications.length === 0) {
      setError("Cannot generate an empty prescription. Add medications or special items.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setFormErrors({});
    setSaveSuccessMessage(null);

    const actualMedications = medications
      .filter(med => !med.isSpecialItem)
      .map(({ id, isSpecialItem, itemName, ...med }) => med);

    const specialItemsPayload = medications
      .filter(med => med.isSpecialItem && med.itemName)
      .map(item => ({ itemName: item.itemName! }));

    const prescriptionPayload = {
      clinicRefNo: patientClinicRefNo,
      medications: JSON.stringify(actualMedications),
      nextAppointmentDate: nextAppointmentDate,
      specialItems: specialItemsPayload,
    };

    try {
      const response = await fetch('/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify(prescriptionPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422 && errorData.errors) {
          const backendErrors: { [key: string]: string | string[] } = {};
          for (const key in errorData.errors) {
            backendErrors[key] = Array.isArray(errorData.errors[key]) ? errorData.errors[key].join(', ') : errorData.errors[key];
          }
          setFormErrors(backendErrors);
          setError("Please correct the errors in the form.");
        } else {
          setError(errorData.message || `Failed to save prescription. Status: ${response.status}`);
        }
        throw new Error(errorData.message || 'Failed to save prescription');
      }

      const result = await response.json();
      setSaveSuccessMessage(result.message || 'Prescription saved successfully!');
      setShowPreview(true);
    } catch (err) {
      console.error('Error saving prescription:', err);
      if (!error && !(formErrors && Object.keys(formErrors).length > 0)) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while saving.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Prescription Generator</h3>
        <button
          type="button"
          onClick={handleGeneratePrescription}
          disabled={!nextAppointmentDate || medications.length === 0 || isSaving || !!nextVisitError}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition duration-200 flex items-center justify-center disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <PrinterIcon size={20} className="mr-2" /> Generate Prescription
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {Object.keys(formErrors).length > 0 && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold mb-2 flex items-center"><AlertCircle size={20} className="mr-2" />Please correct the following errors:</p>
          <ul className="list-disc list-inside ml-4">
            {Object.entries(formErrors).map(([field, message]) => (
              <li key={field}>{`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${Array.isArray(message) ? message.join(', ') : message}`}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Medication</h3>
            {isLoading ? (
              <p className="text-gray-500 text-sm">Loading drugs...</p>
            ) : (
              <MedicationForm
                onAdd={handleAddMedication}
                allDrugs={allDrugs}
              />
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Items</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Item</label>
              <input
                type="text"
                value={specialItem}
                onChange={(e) => {
                  setSpecialItem(e.target.value);
                  if (formErrors.specialItem) {
                    const { specialItem, ...rest } = formErrors;
                    setFormErrors(rest);
                  }
                }}
                placeholder="Type special item and add"
                className={`flex-grow px-4 py-2 border rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${formErrors.specialItem ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            <button
              type="button"
              onClick={handleAddSpecialItem}
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm font-semibold transition duration-200 flex items-center disabled:opacity-50"
            >
              <PlusIcon size={16} className="mr-2" />
              Add Special Item
            </button>
          </div>

          {medications.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Current Prescription</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="p-6 flex items-start justify-between hover:bg-gray-50 transition duration-150"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{med.name}</h4>
                        {med.dosage !== 'N/A' && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {med.dosage}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {med.drugClass} | {med.formulation}
                      </p>
                      <p className="text-sm text-gray-600">{med.frequency}</p>
                      {med.instructions && (
                        <p className="text-sm text-gray-500 italic">{med.instructions}</p>
                      )}
                      <p className="text-sm text-gray-500">Duration: {med.duration}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMedication(med.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition duration-200"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Appointment</h3>
            <div className="flex items-center gap-3">
              <CalendarIcon size={18} className="text-gray-500" />
              <input
                type="date"
                value={nextAppointmentDate}
                onChange={(e) => setNextAppointmentDate(e.target.value)}
                placeholder={getDefaultDateSuggestion()}
                className={`flex-grow px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${nextVisitError ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
            </div>
            {nextVisitError && (
              <p className="flex items-center text-xs text-red-600 mt-2">
                <AlertCircle size={14} className="mr-1" /> {nextVisitError}
              </p>
            )}
          </div>
        </div>
      </div>

      {showPreview && (
        <PrescriptionPreview
          medications={medications}
          nextVisit={nextAppointmentDate}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default PrescriptionGenerator;