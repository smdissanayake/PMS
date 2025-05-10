import React, { useState } from 'react';
import { UploadCloudIcon, XIcon, FileTextIcon } from 'lucide-react';
interface PathologyReport {
  id: string;
  name: string;
  date: string;
}
const PathologyUploader = () => {
  const [reports, setReports] = useState<PathologyReport[]>([]);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newReports = files.map(file => ({
      id: Date.now().toString(),
      name: file.name,
      date: new Date().toLocaleDateString()
    }));
    setReports([...reports, ...newReports]);
  };
  const handleRemoveReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h4 className="font-medium text-gray-900">Pathology Reports</h4>
      </div>
      <div className="p-6 space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                  Upload pathology reports
                </span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png" />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                PDF, JPG, PNG up to 10MB each
              </p>
            </div>
          </div>
        </div>
        {/* Uploaded Files List */}
        {reports.length > 0 && <div className="mt-6 divide-y divide-gray-100">
            {reports.map(report => <div key={report.id} className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <FileTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {report.name}
                    </p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
                <button onClick={() => handleRemoveReport(report.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <XIcon size={16} />
                </button>
              </div>)}
          </div>}
      </div>
    </div>;
};
export default PathologyUploader;