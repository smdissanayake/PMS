import React, { useState, useEffect } from "react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"; // Add ChevronDownIcon and ChevronUpIcon

import PatientInfoCard from "./PatientInfoCard";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";
import FloatingActionButton from "./FloatingActionButton";

// Define the structure of a single history/examination record
// This should match the columns in your patient_history_and_examination table
type HistoryExaminationRecord = {
    id: number;
    created_at: string; // Or a Date object if you parse it
    updated_at: string; // Or a Date object if you parse it
    // Add all other fields from the patient_history_and_examination table
    headacheDuration?: string;
    headacheEpisode?: string;
    headacheSite?: string;
    headacheAura?: string;
    headacheEnt?: string;
    headacheEye?: string;
    headacheSen?: string;
    headacheFocalSymptoms?: string;
    backacheDuration?: string;
    backacheSite?: string;
    backacheRadiation?: string;
    backacheTrauma?: string;
    backacheJointsInflamed?: string;
    neckacheFocalSymptoms?: string;
    neckacheSen?: string;
    neckacheMotor?: string;
    neckacheNClaud?: string;
    neckacheJointsInflamed?: string;
    otherTremors?: string;
    otherNumbness?: string;
    otherWeakness?: string;
    otherGiddiness?: string;
    otherOther?: string;
    neuroHigherFunctions?: string;
    neuroGcs?: string;
    neuroTremors?: string;
    neuroCranialNerves?: string;
    neuroFundi?: string;
    cerebellumSigns?: string;
    examMotor?: string;
    examSensory?: string;
    examReflex?: string;
    examGait?: string;
    examSpDeformity?: string;
    examSlr?: string;
    examLs?: string;
    examHipsKnees?: string;
    tenderPoints?: string;
    examWasting?: string;
    examEhl?: string;
    examFootWeakness?: string;
    examSens?: string;
    examMotor2?: string;
    examReflexes?: string;
    examOther?: string;
    pastIllness?: string;
    allergies?: string;
    allergensInput?: string;
    drugsInput?: string;
    drugsTaken?: string;
    // ... any other fields from that table
};

// Define the structure for the patient data itself
type PatientData = {
    id: number;
    clinicRefNo: string;
    firstName: string;
    lastName: string;
    name: string; // Combined name
    birthday: string;
    gender: string;
    address: string;
    nic: string;
    uhid: string;
    chb: string;
    category: string;
    // ... any other fields from the patients table
};

const PatientProfile = () => {
    const [activeTab, setActiveTab] = useState("history");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("clinicRefNo"); // Add search type state
    const [suggestions, setSuggestions] = useState<
        Array<{ id: number; clinicRefNo: string; chb: string; name: string }>
    >([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [patientData, setPatientData] = useState(null as PatientData | null);
    const [searchError, setSearchError] = useState(null as string | null);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [records, setRecords] = useState([] as HistoryExaminationRecord[]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [isRecordsExpanded, setIsRecordsExpanded] = useState(false);
    const [patientReport, setPatientReport] = useState<{ file_path: string } | null>(null);

    // Add debounce function
    const debounce = (func: Function, wait: number) => {
        let timeout: number;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Add fetchSuggestions function
    const fetchSuggestions = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `/patients/search-suggestions?query=${encodeURIComponent(
                    query
                )}&type=${encodeURIComponent(searchType)}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            (
                                document.querySelector(
                                    'meta[name="csrf-token"]'
                                ) as HTMLMetaElement
                            )?.content || "",
                    },
                }
            );

            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    };

    // Create debounced version of fetchSuggestions
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    const fetchHistoryExaminationRecords = async (patientId: number) => {
        if (!patientId) return;
        setIsLoadingRecords(true);
        try {
            const response = await fetch(
                `/patient-history-examination/${patientId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            (
                                document.querySelector(
                                    'meta[name="csrf-token"]'
                                ) as HTMLMetaElement
                            )?.content || "",
                    },
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setSearchError(
                    data.message || `Error fetching records: ${response.status}`
                );
            } else {
                setRecords(data);
            }
        } catch (error) {
            console.error(
                "Failed to fetch history/examination records:",
                error
            );
            setSearchError("An error occurred while fetching patient records.");
        } finally {
            setIsLoadingRecords(false);
        }
    };

    const handleRecordSaved = async (patientId: number) => {
        // Refresh the records immediately after a new record is saved
        await fetchHistoryExaminationRecords(patientId);
    };

    // Add fetchPatientReport function
    const fetchPatientReport = async (clinicRefNo: string) => {
        try {
            const response = await fetch(`/api/patient-reports?clinic_ref_no=${encodeURIComponent(clinicRefNo)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            const data = await response.json();
            if (response.ok && data.length > 0) {
                setPatientReport(data[0]);
            } else {
                setPatientReport(null);
            }
        } catch (error) {
            console.error('Error fetching patient report:', error);
            setPatientReport(null);
        }
    };

    // Update handleSearch to also fetch patient report
    const handleSearch = async (selectedClinicRefNo?: string) => {
        const searchValue = selectedClinicRefNo || searchQuery;

        if (!searchValue.trim()) {
            setSearchError(`Please enter a ${searchType === 'clinicRefNo' ? 'Clinic Reference Number' : searchType === 'chb' ? 'CHB Number' : 'Patient Name'}.`);
            setPatientData(null);
            setRecords([]);
            setPatientReport(null);
            return;
        }

        setIsLoadingSearch(true);
        setSearchError(null);
        setPatientData(null);
        setRecords([]);
        setPatientReport(null);
        setShowSuggestions(false);

        try {
            let endpoint = '';
            let paramName = '';
            
            // Determine endpoint and parameter name based on search type
            switch (searchType) {
                case 'chb':
                    endpoint = '/patients/search-by-chb';
                    paramName = 'chb';
                    break;
                case 'name':
                    endpoint = '/patients/search-by-name';
                    paramName = 'name';
                    break;
                case 'clinicRefNo':
                default:
                    endpoint = '/patients/search-by-clinic-ref';
                    paramName = 'clinicRefNo';
                    break;
            }

            const patientResponse = await fetch(
                `${endpoint}?${paramName}=${encodeURIComponent(searchValue)}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                    },
                }
            );

            const patientResult = await patientResponse.json();

            if (!patientResponse.ok) {
                setSearchError(patientResult.message || `Error: ${patientResponse.status}`);
                setPatientData(null);
            } else {
                const formattedPatientData: PatientData = {
                    ...patientResult,
                    name: `${patientResult.firstName} ${patientResult.lastName}`,
                };
                setPatientData(formattedPatientData);
                setSearchQuery(selectedClinicRefNo || searchQuery);

                if (formattedPatientData.id) {
                    fetchHistoryExaminationRecords(formattedPatientData.id);
                    fetchPatientReport(formattedPatientData.clinicRefNo);
                }
            }
        } catch (error) {
            console.error("Search failed:", error);
            setSearchError("An error occurred while searching. Please try again.");
            setPatientData(null);
        } finally {
            setIsLoadingSearch(false);
        }
    };

    // Add handleSuggestionClick function
    const handleSuggestionClick = (suggestion: {
        id: number;
        clinicRefNo: string;
        chb: string;
        name: string;
    }) => {
        // Use the appropriate field based on search type
        let searchValue = '';
        switch (searchType) {
            case 'chb':
                searchValue = suggestion.chb;
                break;
            case 'name':
                searchValue = suggestion.name;
                break;
            case 'clinicRefNo':
            default:
                searchValue = suggestion.clinicRefNo;
                break;
        }
        setSearchQuery(searchValue);
        handleSearch(searchValue);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setPatientData(null);
        setSearchError(null);
        setRecords([]);
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Patient Profile
                </h1>
                <div className="flex items-center space-x-2 w-full max-w-lg">
                    {/* Search Type Dropdown */}
                    <select
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                            setSearchQuery("");
                            setSuggestions([]);
                            setShowSuggestions(false);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                        <option value="clinicRefNo">Clinic Ref No</option>
                        <option value="chb">CHB</option>
                        <option value="name">Name</option>
                    </select>
                    
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                debouncedFetchSuggestions(e.target.value);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder={`Search by ${searchType === 'clinicRefNo' ? 'Clinic Ref No' : searchType === 'chb' ? 'CHB' : 'Patient Name'}...`}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Suggestions dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                {suggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        onClick={() =>
                                            handleSuggestionClick(suggestion)
                                        }
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        <div className="font-medium text-gray-900">
                                            {searchType === 'clinicRefNo' && suggestion.clinicRefNo}
                                            {searchType === 'chb' && suggestion.chb}
                                            {searchType === 'name' && suggestion.name}
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            {searchType !== 'clinicRefNo' && `Clinic Ref: ${suggestion.clinicRefNo}`}
                                            {searchType !== 'chb' && `CHB: ${suggestion.chb}`}
                                            {searchType !== 'name' && `Name: ${suggestion.name}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleSearch()}
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
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{searchError}</p>
                </div>
            )}

            {!patientData && !searchError && (
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                            <SearchIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Search for a Patient
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Enter a Clinic Reference Number, CHB Number, or Patient Name to view patient
                            details, medical history, and examination records.
                            You can also add new notes, update patient
                            information, and manage their care plan.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                View Patient History
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                Add Medical Notes
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                                Track Examinations
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {patientData && (
                <>
                    <PatientInfoCard patient={patientData} records={records} />

                    <section className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Patient Records
                            </h3>
                            <button
                                onClick={() => setIsRecordsExpanded(!isRecordsExpanded)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isRecordsExpanded ? (
                                    <>
                                        <span>Collapse Records</span>
                                        <ChevronUpIcon className="ml-2 h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        <span>Expand Records</span>
                                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div
                            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 ease-in-out ${
                                isRecordsExpanded ? "block" : "hidden"
                            }`}
                        >
                            {isLoadingRecords && (
                                <p className="text-gray-500 text-sm">
                                    Loading records...
                                </p>
                            )}
                            {!isLoadingRecords && records.length === 0 && patientReport ? (
                                <div className="text-center">
                                    <p className="text-gray-500 mb-4">No records found. Displaying patient report:</p>
                                    <img 
                                        src={`/storage/${patientReport.file_path}`} 
                                        alt="Patient Report" 
                                        className="max-w-full h-auto mx-auto"
                                    />
                                </div>
                            ) : !isLoadingRecords && records.length === 0 && !patientReport ? (
                                <p className="text-gray-500 text-sm">
                                    No history/examination records or reports found for this patient.
                                </p>
                            ) : !isLoadingRecords && records.map((record) => (
                                <div
                                    key={record.id}
                                    className="mb-6 pb-4 border-b last:border-b-0 last:mb-0"
                                >
                                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                                        <p>
                                            <span className="font-semibold">
                                                Record Date:
                                            </span>{" "}
                                            {new Date(record.created_at).toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Last Updated:
                                            </span>{" "}
                                            {new Date(record.updated_at).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* History Section Display */}
                                    <div className="mb-4 p-4 border border-gray-100 rounded-md bg-gray-50/50 space-y-4">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                                            History
                                        </h4>

                                        {/* Headache Details */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Headache Details
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.headacheDuration && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Duration:
                                                        </span>{" "}
                                                        {record.headacheDuration}
                                                    </p>
                                                )}
                                                {record.headacheEpisode && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Episode:
                                                        </span>{" "}
                                                        {record.headacheEpisode}
                                                    </p>
                                                )}
                                                {record.headacheSite && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Site:
                                                        </span>{" "}
                                                        {record.headacheSite}
                                                    </p>
                                                )}
                                                {record.headacheAura && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Aura:
                                                        </span>{" "}
                                                        {record.headacheAura}
                                                    </p>
                                                )}
                                                {record.headacheEnt && (
                                                    <p>
                                                        <span className="font-medium">
                                                            ENT:
                                                        </span>{" "}
                                                        {record.headacheEnt}
                                                    </p>
                                                )}
                                                {record.headacheEye && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Eye:
                                                        </span>{" "}
                                                        {record.headacheEye}
                                                    </p>
                                                )}
                                                {record.headacheSen && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Sen:
                                                        </span>{" "}
                                                        {record.headacheSen}
                                                    </p>
                                                )}
                                                {record.headacheFocalSymptoms && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Focal Symptoms:
                                                        </span>{" "}
                                                        {record.headacheFocalSymptoms}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="my-3 border-gray-200" />

                                        {/* Backache Details */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Backache
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.backacheDuration && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Duration:
                                                        </span>{" "}
                                                        {record.backacheDuration}
                                                    </p>
                                                )}
                                                {record.backacheSite && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Site:
                                                        </span>{" "}
                                                        {record.backacheSite}
                                                    </p>
                                                )}
                                                {record.backacheRadiation && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Radiation:
                                                        </span>{" "}
                                                        {record.backacheRadiation}
                                                    </p>
                                                )}
                                                {record.backacheTrauma && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Trauma:
                                                        </span>{" "}
                                                        {record.backacheTrauma}
                                                    </p>
                                                )}
                                                {record.backacheJointsInflamed && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Joints Inflamed:
                                                        </span>{" "}
                                                        {record.backacheJointsInflamed}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="my-3 border-gray-200" />

                                        {/* Neckache Details */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Neckache
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.neckacheFocalSymptoms && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Focal Symptoms:
                                                        </span>{" "}
                                                        {record.neckacheFocalSymptoms}
                                                    </p>
                                                )}
                                                {record.neckacheSen && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Sen:
                                                        </span>{" "}
                                                        {record.neckacheSen}
                                                    </p>
                                                )}
                                                {record.neckacheMotor && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Motor:
                                                        </span>{" "}
                                                        {record.neckacheMotor}
                                                    </p>
                                                )}
                                                {record.neckacheNClaud && (
                                                    <p>
                                                        <span className="font-medium">
                                                            N.Claud:
                                                        </span>{" "}
                                                        {record.neckacheNClaud}
                                                    </p>
                                                )}
                                                {record.neckacheJointsInflamed && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Joints Inflamed:
                                                        </span>{" "}
                                                        {record.neckacheJointsInflamed}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="my-3 border-gray-200" />

                                        {/* Other History Details */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Other (History)
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.otherTremors && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Tremors:
                                                        </span>{" "}
                                                        {record.otherTremors}
                                                    </p>
                                                )}
                                                {record.otherNumbness && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Numbness:
                                                        </span>{" "}
                                                        {record.otherNumbness}
                                                    </p>
                                                )}
                                                {record.otherWeakness && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Weakness:
                                                        </span>{" "}
                                                        {record.otherWeakness}
                                                    </p>
                                                )}
                                                {record.otherGiddiness && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Giddiness:
                                                        </span>{" "}
                                                        {record.otherGiddiness}
                                                    </p>
                                                )}
                                                {record.otherOther && (
                                                    <p className="md:col-span-2 lg:col-span-3">
                                                        <span className="font-medium">
                                                            Other Details:
                                                        </span>{" "}
                                                        {record.otherOther}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Examination Section Display */}
                                    <div className="p-4 border border-gray-100 rounded-md bg-gray-50/50 space-y-4">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                                            Examination
                                        </h4>

                                        {/* Neurological Examination */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Neurological Examination
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.neuroHigherFunctions && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Higher Functions:
                                                        </span>{" "}
                                                        {record.neuroHigherFunctions}
                                                    </p>
                                                )}
                                                {record.neuroGcs && (
                                                    <p>
                                                        <span className="font-medium">
                                                            GCS:
                                                        </span>{" "}
                                                        {record.neuroGcs}
                                                    </p>
                                                )}
                                                {record.neuroTremors && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Tremors:
                                                        </span>{" "}
                                                        {record.neuroTremors}
                                                    </p>
                                                )}
                                                {record.neuroCranialNerves && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Cranial Nerves:
                                                        </span>{" "}
                                                        {record.neuroCranialNerves}
                                                    </p>
                                                )}
                                                {record.neuroFundi && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Fundi:
                                                        </span>{" "}
                                                        {record.neuroFundi}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="my-3 border-gray-200" />

                                        {/* Cerebellum */}
                                        {record.cerebellumSigns && (
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-700 mb-1">
                                                    Cerebellum
                                                </h5>
                                                <p className="text-sm">
                                                    {record.cerebellumSigns}
                                                </p>
                                            </div>
                                        )}
                                        {record.cerebellumSigns && (
                                            <hr className="my-3 border-gray-200" />
                                        )}

                                        {/* Motor, Sensory, Reflex (Main) */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Motor, Sensory, Reflex
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.examMotor && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Motor:
                                                        </span>{" "}
                                                        {record.examMotor}
                                                    </p>
                                                )}
                                                {record.examSensory && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Sensory:
                                                        </span>{" "}
                                                        {record.examSensory}
                                                    </p>
                                                )}
                                                {record.examReflex && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Reflex:
                                                        </span>{" "}
                                                        {record.examReflex}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="my-3 border-gray-200" />

                                        {/* Gait, Sp.Deformity, SLR, L/S */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Gait & Spine
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.examGait && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Gait:
                                                        </span>{" "}
                                                        {record.examGait}
                                                    </p>
                                                )}
                                                {record.examSpDeformity && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Sp. Deformity:
                                                        </span>{" "}
                                                        {record.examSpDeformity}
                                                    </p>
                                                )}
                                                {record.examSlr && (
                                                    <p>
                                                        <span className="font-medium">
                                                            SLR:
                                                        </span>{" "}
                                                        {record.examSlr}
                                                    </p>
                                                )}
                                                {record.examLs && (
                                                    <p>
                                                        <span className="font-medium">
                                                            L/S:
                                                        </span>{" "}
                                                        {record.examLs}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {record.examHipsKnees && (
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-700 mt-2 mb-1">
                                                    Hips/Knees
                                                </h5>
                                                <p className="text-sm">
                                                    {record.examHipsKnees}
                                                </p>
                                            </div>
                                        )}
                                        <hr className="my-3 border-gray-200" />

                                        {/* Tender Points */}
                                        {record.tenderPoints && (
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-700 mb-1">
                                                    Tender Points
                                                </h5>
                                                <p className="text-sm">
                                                    {record.tenderPoints}
                                                </p>
                                            </div>
                                        )}
                                        {record.tenderPoints && (
                                            <hr className="my-3 border-gray-200" />
                                        )}

                                        {/* Wasting, EHL, Foot Weakness & Lower Limb Sens, Motor, Reflexes */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-2">
                                                Lower Limb Examination
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                {record.examWasting && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Wasting:
                                                        </span>{" "}
                                                        {record.examWasting}
                                                    </p>
                                                )}
                                                {record.examEhl && (
                                                    <p>
                                                        <span className="font-medium">
                                                            EHL:
                                                        </span>{" "}
                                                        {record.examEhl}
                                                    </p>
                                                )}
                                                {record.examFootWeakness && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Foot Weakness:
                                                        </span>{" "}
                                                        {record.examFootWeakness}
                                                    </p>
                                                )}
                                                {record.examSens && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Sens (Lower):
                                                        </span>{" "}
                                                        {record.examSens}
                                                    </p>
                                                )}
                                                {record.examMotor2 && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Motor (Lower):
                                                        </span>{" "}
                                                        {record.examMotor2}
                                                    </p>
                                                )}
                                                {record.examReflexes && (
                                                    <p>
                                                        <span className="font-medium">
                                                            Reflexes (Lower):
                                                        </span>{" "}
                                                        {record.examReflexes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {record.examOther && (
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-700 mt-2 mb-1">
                                                    Other Exam Details
                                                </h5>
                                                <p className="text-sm">
                                                    {record.examOther}
                                                </p>
                                            </div>
                                        )}
                                        <hr className="my-3 border-gray-200" />

                                        {/* Past Illness */}
                                        {record.pastIllness && (
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-700 mb-1">
                                                    Past Illness
                                                </h5>
                                                <p className="text-sm">
                                                    {record.pastIllness}
                                                </p>
                                            </div>
                                        )}
                                        {record.pastIllness && (
                                            <hr className="my-3 border-gray-200" />
                                        )}

                                        {/* Allergies */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-1">
                                                Allergies
                                            </h5>
                                            {record.allergies && (
                                                <p
                                                    className={`text-sm ${
                                                        record.allergies
                                                            ? "text-yellow-700 bg-yellow-50 p-1 rounded-md"
                                                            : ""
                                                    }`}
                                                >
                                                    {record.allergies}
                                                </p>
                                            )}
                                            {record.allergensInput && (
                                                <p
                                                    className={`text-sm ${
                                                        record.allergensInput
                                                            ? "text-yellow-700 bg-yellow-50 p-1 rounded-md"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-medium">
                                                        Details:
                                                    </span>{" "}
                                                    {record.allergensInput}
                                                </p>
                                            )}
                                        </div>
                                        <hr className="my-3 border-gray-200" />

                                        {/* Drugs */}
                                        <div>
                                            <h5 className="text-md font-semibold text-gray-700 mb-1">
                                                Drugs
                                            </h5>
                                            {record.drugsInput && (
                                                <p className="text-sm">
                                                    <span className="font-medium">
                                                        Details:
                                                    </span>{" "}
                                                    {record.drugsInput}
                                                </p>
                                            )}
                                            {record.drugsTaken && (
                                                <p
                                                    className={`text-sm ${
                                                        record.drugsTaken
                                                            ? "text-red-700 bg-red-50 p-1 rounded-md"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-medium">
                                                        Specific Drugs Taken:
                                                    </span>{" "}
                                                    {record.drugsTaken}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="mt-6">
                        <TabNavigation
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                        <TabContent
                            activeTab={activeTab}
                            patientData={patientData}
                            patientId={patientData.id}
                            patientClinicRefNo={patientData.clinicRefNo}
                            onRecordSaved={handleRecordSaved}
                        />
                    </div>
                </>
            )}

            <FloatingActionButton />
        </div>
    );
};

export default PatientProfile;
