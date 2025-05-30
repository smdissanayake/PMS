import React from 'react';
import { UserIcon, CreditCardIcon, CalendarIcon, MapPinIcon, TagIcon } from 'lucide-react';

// Define a minimal structure for history/examination records relevant to this component
type HistoryExaminationRecord = {
  allergies?: string;
  allergensInput?: string;
  drugsTaken?: string;
  // Add other fields if they become necessary for PatientInfoCard logic
};

interface PatientProps {
  patient: {
    name: string;
    nic: string;
    birthday: string;
    gender: string;
    address: string;
    category: string;
  };
  records: HistoryExaminationRecord[]; // Added records prop
}

const PatientInfoCard = ({ patient, records }: PatientProps) => {
  let iconBgClass = 'bg-blue-100';
  let iconTextClass = 'text-blue-500';

  let hasAllergies = false;
  let hasDrugsTaken = false;

  if (records && records.length > 0) {
    for (const record of records) {
      if (record.allergies || record.allergensInput) {
        hasAllergies = true;
      }
      if (record.drugsTaken) {
        hasDrugsTaken = true;
        break; // Red takes precedence, no need to check further if drugs are found
      }
    }
  }

  if (hasDrugsTaken) {
    iconBgClass = 'bg-red-100';
    iconTextClass = 'text-red-500';
  } else if (hasAllergies) {
    iconBgClass = 'bg-yellow-100';
    iconTextClass = 'text-yellow-500';
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${iconBgClass} ${iconTextClass}`}>
            <UserIcon size={40} />
          </div>
        </div>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {patient.name}
            </h2>
            <div className="flex items-center mt-2 text-gray-600">
              <CreditCardIcon size={16} className="mr-2" />
              <span className="text-sm">NIC: {patient.nic}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <CalendarIcon size={16} className="mr-2" />
              <span className="text-sm">Birthday: {patient.birthday}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <UserIcon size={16} className="mr-2" />
              <span className="text-sm">Gender: {patient.gender}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPinIcon size={16} className="mr-2" />
              <span className="text-sm">Address: {patient.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <TagIcon size={16} className="mr-2" />
              <span className="text-sm">
                Category:{' '}
                <span className="text-blue-500 font-medium">
                  {patient.category}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
