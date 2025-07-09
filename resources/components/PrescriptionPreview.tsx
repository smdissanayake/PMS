import React, { useRef } from 'react';
import { XIcon, PrinterIcon } from 'lucide-react';

// Props ලබා ගන්නා interface එක
interface PrescriptionPreviewProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  nextVisit: string;
  onClose: () => void;
}

const PrescriptionPreview = ({
  medications,
  nextVisit,
  onClose
}: PrescriptionPreviewProps) => {
  // Add a ref for the printable content
  const printRef = useRef<HTMLDivElement>(null);

  // Print only the content inside printRef
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            /* Add any additional print styles here */
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    // Modal එක screen එක මැදට ගන්න
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Prescription Preview
          </h3>
          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
            >
              <PrinterIcon size={20} />
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div ref={printRef} className="p-6 space-y-6">
          {/* රෝහල/වෛද්‍ය තොරතුරු */}
          <div className="text-center border-b border-gray-200 pb-4">
            {/* Hospital Logo */}
            <div className="mb-4 flex justify-center">
              <img
                src="/images/logo_asiri.png"
                alt="Asiri Central Hospital Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Asiri Central Hospital
            </h2>
          </div>

          {/* රෝගී තොරතුරු */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Patient: Sarah Johnson</p>
              <p className="text-gray-600">Age: 27</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600">ID: 970123-45-6789</p>
            </div>
          </div>

          {/* Rx Symbol */}
          <div className="text-2xl font-serif text-gray-800 border-b border-gray-200 pb-2">
            ℞
          </div>

          {/* ඖෂධ ලැයිස්තුව */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Dosage</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Frequency</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med, index) => (
                  <tr key={med.id} className="border-b last:border-0">
                    <td className="px-4 py-2 text-gray-700 align-top">{index + 1}</td>
                    <td className="px-4 py-2 text-gray-900 font-medium align-top">{med.name}</td>
                    <td className="px-4 py-2 text-gray-700 align-top">{med.dosage}</td>
                    <td className="px-4 py-2 text-gray-700 align-top">{med.frequency}</td>
                    <td className="px-4 py-2 text-gray-700 align-top">{med.duration}</td>
                    <td className="px-4 py-2 text-gray-700 align-top">{med.instructions || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ඊළඟ හමුවීම */}
          {nextVisit && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <p className="text-sm text-gray-600">
                Next appointment: {new Date(nextVisit).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* වෛද්‍යවරයාගේ අත්සන */}
          <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
            <div className="text-right">
              <div className="h-12 border-b border-gray-300 w-40 mb-1"></div>
              <p className="text-sm text-gray-600">Doctor's Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPreview;