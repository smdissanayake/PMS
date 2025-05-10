import React, { useState } from 'react';
import { UploadCloudIcon, XIcon } from 'lucide-react';
interface UploadedFile {
  id: string;
  name: string;
  progress: number;
}
const ReportUploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };
  const handleFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      progress: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => f.id === file.id ? {
          ...f,
          progress: Math.min(f.progress + 20, 100)
        } : f));
      }, 500);
      setTimeout(() => clearInterval(interval), 2500);
    });
  };
  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };
  return <div className="space-y-6">
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-8 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
        <div className="text-center">
          <UploadCloudIcon className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                Upload a file
              </span>
              <input type="file" className="sr-only" multiple onChange={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png,.dcm" />
            </label>
            <p className="mt-1 text-sm text-gray-500">
              or drag and drop your files here
            </p>
            <p className="mt-2 text-xs text-gray-500">
              PDF, JPG, PNG or DICOM up to 50MB
            </p>
          </div>
        </div>
      </div>
      {uploadedFiles.length > 0 && <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">
              Uploading {uploadedFiles.length}{' '}
              {uploadedFiles.length === 1 ? 'file' : 'files'}
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {uploadedFiles.map(file => <div key={file.id} className="flex items-center justify-between p-4">
                <div className="flex-1 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">{file.name}</span>
                    <button onClick={() => removeFile(file.id)} className="text-gray-400 hover:text-gray-500">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{
                width: `${file.progress}%`
              }} />
                  </div>
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
};
export default ReportUploadSection;