import React from 'react';
import { PillIcon, FileTextIcon, ClipboardIcon, EyeIcon, DownloadIcon, Trash2Icon, ImageOffIcon } from 'lucide-react';

// Define type for individual admission record (should match WardAdmission.tsx)
interface AdmissionRecord {
  id: number;
  admission_date: string;
  discharge_date: string;
  icu: string;
  ward: string;
  image_paths: string[];
  created_at: string;
}

interface WardContentSectionProps {
  admissions: AdmissionRecord[];
}

// Helper function to format dates (basic example)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date';
  }
};

const WardContentSection = ({ admissions }: WardContentSectionProps) => {
  if (!admissions || admissions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
        <p className="text-sm text-gray-500">No active ward admissions to display.</p>
      </div>
    );
  }

  const handleDeleteAdmission = async (admissionId: number) => {
    if (window.confirm('Are you sure you want to delete this admission record?')) {
      try {
        // Assuming your API endpoint for deleting is /api/ward-admissions/{id}
        const response = await fetch(`/api/ward-admissions/${admissionId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete admission record');
        }
        // TODO: Add logic to refresh the admissions list or notify parent component
        alert('Admission record deleted successfully.');
        // For now, we'll just log. Ideally, you'd update the state.
        console.log(`Admission ${admissionId} deleted.`);
        // You might want to call a prop function here to refetch admissions in WardAdmission.tsx
      } catch (error) {
        console.error('Error deleting admission:', error);
        alert('Error deleting admission record.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {admissions.map((admission) => (
        <div key={admission.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Admission ID: {admission.id}</h3>
                <p className="text-xs text-gray-500">{formatDate(admission.created_at)}</p>
              </div>
              <button
                onClick={() => handleDeleteAdmission(admission.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete Admission"
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {admission.image_paths && admission.image_paths.length > 0 ? (
                admission.image_paths.slice(0, 3).map((path, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={path}
                      alt={`Admission Image ${index}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback for broken images
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const icon = parent.querySelector('.fallback-icon');
                          if (icon) (icon as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="fallback-icon hidden items-center justify-center w-full h-full">
                      <ImageOffIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-sm text-gray-400 italic">No images uploaded for this admission.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-4">
              <p className="text-gray-600 font-medium">Admission:</p>
              <p className="text-gray-800">{formatDate(admission.admission_date)}</p>
              <p className="text-gray-600 font-medium">Discharge:</p>
              <p className="text-gray-800">{formatDate(admission.discharge_date)}</p>
              <p className="text-gray-600 font-medium">ICU:</p>
              <p className="text-gray-800">{admission.icu || 'N/A'}</p>
              <p className="text-gray-600 font-medium">Ward:</p>
              <p className="text-gray-800">{admission.ward || 'N/A'}</p>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
                <EyeIcon className="h-4 w-4 mr-2" /> View
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors">
                <DownloadIcon className="h-4 w-4 mr-2" /> Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WardContentSection;