import React from 'react';
import { UserIcon, CreditCardIcon, CalendarIcon, MapPinIcon, TagIcon } from 'lucide-react';
interface PatientProps {
  patient: {
    name: string;
    nic: string;
    age: string;
    gender: string;
    address: string;
    category: string;
  };
}
const PatientInfoCard = ({
  patient
}: PatientProps) => {
  return <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
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
              <span className="text-sm">Age: {patient.age}</span>
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
    </div>;
};
export default PatientInfoCard;