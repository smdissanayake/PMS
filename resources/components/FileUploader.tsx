import React, { useCallback, useState } from 'react';
import { UploadCloudIcon, XIcon } from 'lucide-react';
interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}
const FileUploader = ({
  onFileSelect
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);
  const validateFiles = (files: File[]) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/dicom'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError('Please upload only PDF, JPEG, PNG, or DICOM files');
      return false;
    }
    const maxSize = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Files must be less than 50MB');
      return false;
    }
    setError(null);
    return true;
  };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const {
      files
    } = e.dataTransfer;
    const fileList = Array.from(files);
    if (validateFiles(fileList)) {
      onFileSelect(fileList);
    }
  }, [onFileSelect]);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (validateFiles(files)) {
      onFileSelect(files);
    }
  };
  return <div className="w-full">
      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-colors duration-200 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}>
        <input type="file" onChange={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png,.dcm" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple />
        <div className="space-y-4">
          <div className="flex justify-center">
            <UploadCloudIcon className={`w-12 h-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drop your files here, or{' '}
              <span className="text-blue-500">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PDF, JPEG, PNG, and DICOM files (max 50MB)
            </p>
          </div>
        </div>
      </div>
      {error && <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 px-3 py-2 rounded-md">
          <XIcon size={16} />
          <span className="text-sm">{error}</span>
        </div>}
    </div>;
};
export default FileUploader;