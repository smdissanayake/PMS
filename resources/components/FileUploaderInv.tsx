import React, { useCallback, useState } from 'react';
import { UploadCloudIcon, FileIcon, XIcon } from 'lucide-react';
export const FileUploaderInv: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  }, []);
  const removeFile = useCallback(() => {
    setSelectedFile(null);
  }, []);
  return <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Upload New Report
      </h2>
      <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => document.getElementById('file-input')?.click()}>
        <input id="file-input" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        <UploadCloudIcon size={36} className="text-blue-500 mb-2" />
        <p className="text-gray-700 font-medium mb-1">
          Drag and drop files here
        </p>
        <p className="text-sm text-gray-500 mb-4">or click to browse</p>
        <p className="text-xs text-gray-400">
          Supported formats: PDF, JPG, PNG
        </p>
      </div>
      {selectedFile && <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <FileIcon size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="text-blue-600 text-sm font-medium mr-4" onClick={() => alert('Uploading file...')}>
              Upload
            </button>
            <button className="text-gray-500 hover:text-gray-700" onClick={removeFile}>
              <XIcon size={18} />
            </button>
          </div>
        </div>}
    </div>;
};