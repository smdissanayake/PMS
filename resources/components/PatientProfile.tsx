import React, { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react"; // Import SearchIcon

import PatientInfoCard from "./PatientInfoCard";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";
import FloatingActionButton from "./FloatingActionButton";

const PatientProfile = () => {
    const [activeTab, setActiveTab] = React.useState("history"); // Using React.useState
    const [searchQuery, setSearchQuery] = React.useState(""); // Using React.useState
    const [patientData, setPatientData] = React.useState(null); // Initialize with null, removed <any | null>
    const [searchError, setSearchError] = React.useState(null); // Initialize with null, removed <string | null>
    const [isLoadingSearch, setIsLoadingSearch] = React.useState(false); // Using React.useState


    // Define a simplified type for the records for now
    // This should ideally match the structure from PatientHistoryForm or be imported
    type RecordItem = {
        id: number;
        timestamp: string;
        history?: { [key: string]: any };
        examination?: { [key: string]: any };
    };

    const [records, setRecords] = React.useState([]); // Removed <RecordItem[]> generic

    // Placeholder: In a real app, you'd fetch these records or pass them as props
    // For demonstration, let's add a dummy record if you want to see the structure populated
    useEffect(() => {
        // Example of adding a dummy record:
        // setRecords([
        //   {
        //     id: 1,
        //     timestamp: new Date().toLocaleString(),
        //     history: { headacheDuration: "30 mins", otherOther: "Feeling tired" },
        //     examination: { neuroHigherFunctions: "Alert", examGait: "Normal" }
        //   }
        // ]);
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchError("Please enter a Clinic Reference Number.");
            setPatientData(null);
            return;
        }
        setIsLoadingSearch(true);
        setSearchError(null);
        setPatientData(null);

        try {
            const response = await fetch(`/patients/search-by-clinic-ref?clinicRefNo=${encodeURIComponent(searchQuery)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setSearchError(data.message || `Error: ${response.status}`);
                setPatientData(null);
            } else {
                // Construct the name field before setting patientData
                const formattedPatientData = {
                    ...data,
                    name: `${data.firstName} ${data.lastName}`
                };
                setPatientData(formattedPatientData);
                // Potentially clear records or fetch new records for this patient
                setRecords([]); // Clear previous patient's records
            }
        } catch (error) {
            console.error("Search failed:", error);
            setSearchError("An error occurred while searching. Please try again.");
            setPatientData(null);
        } finally {
            setIsLoadingSearch(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setPatientData(null);
        setSearchError(null);
        setRecords([]); // Clear records as well
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Patient Profile
                </h1>
                {/* Search Bar with Buttons */}
                <div className="flex items-center space-x-2 w-full max-w-md">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by Clinic Ref No..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isLoadingSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
                    >
                        {isLoadingSearch ? "Searching..." : "Search"}
                    </button>
                    <button
                        onClick={handleClearSearch}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {searchError && (
                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-300 text-red-700">
                    {searchError}
                </div>
            )}

            {patientData && <PatientInfoCard patient={patientData} />}


            {/* Patient Records Section */}
      <section className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Records</h3>
        <div className="bg-white p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto border border-gray-200">
          {records.length === 0 ? (
            <p className="text-gray-500 text-sm">No records saved yet.</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="border-b border-gray-200 py-3 mb-3 last:border-b-0 last:mb-0">
                <p className="text-xs text-gray-500 mb-2">Recorded on: {record.timestamp}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 text-sm text-gray-700">
                   <div>
                      <p className="font-semibold text-gray-800 mb-1">History:</p>
                      {/* Display History fields */}
                      {record.history?.headacheDuration && <p>Headache Duration: {record.history.headacheDuration}</p>}
                      {record.history?.headacheEpisode && <p>Headache Episode: {record.history.headacheEpisode}</p>}
                      {record.history?.headacheSite && <p>Headache Site: {record.history.headacheSite}</p>}
                      {record.history?.headacheAura && <p>Headache Aura: {record.history.headacheAura}</p>}
                      {record.history?.headacheEnt && <p>Headache ENT: {record.history.headacheEnt}</p>}
                      {record.history?.headacheEye && <p>Headache Eye: {record.history.headacheEye}</p>}
                      {record.history?.headacheSen && <p>Headache Sen: {record.history.headacheSen}</p>}
                      {record.history?.headacheFocalSymptoms && <p>Headache Focal Symptoms: {record.history.headacheFocalSymptoms}</p>}

                      {record.history?.backacheDuration && <p>Backache Duration: {record.history.backacheDuration}</p>}
                      {record.history?.backacheSite && <p>Backache Site: {record.history.backacheSite}</p>}
                      {record.history?.backacheRadiation && <p>Backache Radiation: {record.history.backacheRadiation}</p>}
                      {record.history?.backacheTrauma && <p>Backache Trauma: {record.history.backacheTrauma}</p>}
                      {record.history?.backacheJointsInflamed && <p>Backache Joints Inflamed: {record.history.backacheJointsInflamed}</p>}

                      {record.history?.neckacheFocalSymptoms && <p>Neckache Focal Symptoms: {record.history.neckacheFocalSymptoms}</p>}
                      {record.history?.neckacheSen && <p>Neckache Sen: {record.history.neckacheSen}</p>}
                      {record.history?.neckacheMotor && <p>Neckache Motor: {record.history.neckacheMotor}</p>}
                      {record.history?.neckacheNClaud && <p>Neckache N.Claud: {record.history.neckacheNClaud}</p>}
                      {record.history?.neckacheJointsInflamed && <p>Neckache Joints Inflamed: {record.history.neckacheJointsInflamed}</p>}

                      {record.history?.otherTremors && <p>Other Tremors: {record.history.otherTremors}</p>}
                      {record.history?.otherNumbness && <p>Other Numbness: {record.history.otherNumbness}</p>}
                      {record.history?.otherWeakness && <p>Other Weakness: {record.history.otherWeakness}</p>}
                      {record.history?.otherGiddiness && <p>Other Giddiness: {record.history.otherGiddiness}</p>}
                      {record.history?.otherOther && <p>Other Other: {record.history.otherOther}</p>}
                   </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Examination:</p>
                      {/* Display Examination fields */}
                      {record.examination?.neuroHigherFunctions && <p>Higher Functions: {record.examination.neuroHigherFunctions}</p>}
                      {record.examination?.neuroGcs && <p>GCS: {record.examination.neuroGcs}</p>}
                      {record.examination?.neuroTremors && <p>Tremors: {record.examination.neuroTremors}</p>}
                      {record.examination?.neuroCranialNerves && <p>Cranial Nerves: {record.examination.neuroCranialNerves}</p>}
                      {record.examination?.neuroFundi && <p>Fundi: {record.examination.neuroFundi}</p>}

                      <p>Cerebellum: {
                          [
                              record.examination?.cerebellumNystagmus && 'Nystagmus',
                              record.examination?.cerebellumAtaxia && 'Ataxia',
                              record.examination?.cerebellumDysarthria && 'Dysarthria',
                              record.examination?.cerebellumDysmetria && 'Dysmetria',
                              record.examination?.cerebellumDysdiadochokinesia && 'Dysdiadochokinesia'
                          ].filter(Boolean).join(', ') || 'None'
                      }</p>

                      {record.examination?.examMotor && <p>Motor: {record.examination.examMotor}</p>}
                      {record.examination?.examSensory && <p>Sensory: {record.examination.examSensory}</p>}
                      {record.examination?.examReflex && <p>Reflex: {record.examination.examReflex}</p>}
                      {record.examination?.examGait && <p>Gait: {record.examination.examGait}</p>}
                      {record.examination?.examSpDeformity && <p>Sp.Deformity: {record.examination.examSpDeformity}</p>}
                      {record.examination?.examSlr && <p>SLR: R/S: {record.examination.examSlr}</p>}
                      {record.examination?.examLs && <p>L/S: {record.examination.examLs}</p>}
                      {record.examination?.examHipsKnees && <p>Hips/Knees: {record.examination.examHipsKnees}</p>}

                       <p>Tender Points: {
                          [
                              record.examination?.tenderPointsCervical && 'Cervical',
                              record.examination?.tenderPointsLumbar && 'Lumbar',
                              record.examination?.tenderPointsKnee && 'Knee',
                              record.examination?.tenderPointsHip && 'Hip'
                          ].filter(Boolean).join(', ') || 'None'
                      }</p>

                      {record.examination?.examWasting && <p>Wasting: {record.examination.examWasting}</p>}
                      {record.examination?.examEhl && <p>EHL: {record.examination.examEhl}</p>}
                      {record.examination?.examFootWeakness && <p>Foot Weakness: {record.examination.examFootWeakness}</p>}
                      {record.examination?.examSens && <p>Sens: {record.examination.examSens}</p>}
                      {record.examination?.examMotor2 && <p>Motor (Lower): {record.examination.examMotor2}</p>}
                      {record.examination?.examReflexes && <p>Reflexes: {record.examination.examReflexes}</p>}
                      {record.examination?.examOther && <p>Other (Exam): {record.examination.examOther}</p>}

                      <p>Past Illness: {
                          [
                              record.examination?.pastIllnessDm && 'DM',
                              record.examination?.pastIllnessHtn && 'HTN',
                              record.examination?.pastIllnessDl && 'DL'
                          ].filter(Boolean).join(', ') || 'None'
                      }</p>

                      <p>Allergies: {
                          [
                              record.examination?.allergiesFood && 'Food',
                              record.examination?.allergiesDrugs && 'Drugs',
                              record.examination?.allergiesPlasters && 'Plasters', // Updated allergy display
                          ].filter(Boolean).join(', ') || 'None'
                      }
                      {record.examination?.allergensInput && <p>Allergens Details: {record.examination.allergensInput}</p>}
                      </p>


                      {/* Display Drugs */}
                      {record.examination?.drugsInput && <p>Drugs Details: {record.examination.drugsInput}</p>}
                      <p>Drugs Taken: {
                          [
                              record.examination?.drugsAspirin && 'Aspirin',
                              record.examination?.drugsClopidogrel && 'Clopidogrel',
                              record.examination?.drugsWarfarin && 'Warfarin',
                              record.examination?.drugsAntiplatelets && 'Antiplatelets',
                              record.examination?.drugsAnticoagulant && 'Anticoagulant'
                          ].filter(Boolean).join(', ') || 'None'
                      }</p>

                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
            

            <div className="mt-8 bg-white rounded-lg shadow-sm">
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <TabContent activeTab={activeTab} />
            </div>
            <FloatingActionButton />
        </div>
    );
};
export default PatientProfile;
