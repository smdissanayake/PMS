import React, { useCallback, useState, useEffect } from 'react';
import { UploadCloudIcon, FileIcon, XIcon, PlusIcon } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface FileUploaderInvProps {
  patientClinicRefNo: string;
  patientId: string;
  patientName: string | null;
}

interface MedicalOrder {
  id: number;
  type: string;
  sub_type: string | null;
  additional_type: string | null;
  status: string;
  created_at: string;
  notes: string | null;
}

export const FileUploaderInv: React.FC<FileUploaderInvProps> = ({ patientClinicRefNo, patientId, patientName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [types, setTypes] = useState<MedicalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imaging, setImaging] = useState('');
  const [modality, setModality] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

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
      // Accept only allowed types: pdf, jpg, jpeg, png, heic
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/heic',
        'image/heif'
      ];
      let isAllowed = allowedTypes.includes(file.type);
      if (!isAllowed && file.type === 'application/octet-stream') {
        // Fallback: check extension (case-insensitive)
        const ext = file.name.split('.').pop();
        if (ext && ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif'].includes(ext.toLowerCase())) {
          isAllowed = true;
        }
      }
      if (!isAllowed) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Only PDF, JPG, PNG, HEIC, or HEIF files are allowed.'
        });
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a file to upload.'
      });
      return;
    }

    if (!selectedOption) {
      Swal.fire({
        icon: 'error',
        title: 'No Medical Order Selected',
        text: 'Please select a medical order for this report.'
      });
      return;
    }

    // Check file size before upload (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (selectedFile.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'The file size must be less than 20MB. Please choose a smaller file.'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('medical_order_id', selectedOption);
      formData.append('patient_clinic_ref_no', patientClinicRefNo);
      formData.append('imaging', imaging);
      formData.append('modality', modality);

      const response = await axios.post('/investigation-reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Report uploaded successfully.'
        });
        setSelectedFile(null);
        setSelectedOption('');
        setImaging('');
        setModality('');
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload report. Please try again.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 413) {
          errorMessage = 'The file is too large. Maximum file size is 20MB.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: errorMessage
      });
    }
  };

  useEffect(() => {
    const fetchMedicalOrderTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get('/medical-orders', {
          params: {
            patient_clinic_ref_no: patientClinicRefNo,
            status: 'pending'
          },
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.data.status === 'success') {
          setTypes(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch medical orders');
        }
      } catch (error) {
        console.error('Error details:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch medical orders');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch medical orders. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (patientClinicRefNo) {
      fetchMedicalOrderTypes();
    }
  }, [patientClinicRefNo]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Upload New Report
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="relative my-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="h-5 w-5 text-gray-400" />
        </div>

        <select
          onChange={handleChange}
          value={selectedOption}
          className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={isLoading}
        >
          <option value="">{isLoading ? 'Loading...' : 'Select Medical Order'}</option>
          {types.map((order) => (
            <option key={order.id} value={order.id}>
              {order.type}
              {order.sub_type ? ` - ${order.sub_type}` : ''}
              {order.additional_type ? ` (${order.additional_type})` : ''}
              {' - '}
              {new Date(order.created_at).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {selectedOption && (
        <div className="my-3">
          <div className="text-sm text-gray-500 mb-4 ">
            <p className="text-sm font-medium text-gray-700 mb-2 pl-2">Fill the details below to upload the report</p>
            <div className="flex flex-row">
              <div className="basis-1/2 mx-2 my-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imaging</label>
                <input
                  type="text"
                  value={imaging}
                  onChange={(e) => setImaging(e.target.value)}
                  placeholder="Enter Imaging number"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="basis-1/2 mx-2 my-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Modality</label>
                <input
                  type="text"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  placeholder="Enter Modality"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-inv')?.click()}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
          className="hidden"
          id="file-upload-inv"
        />
        <UploadCloudIcon size={36} className="text-blue-500 mb-2" />
        <p className="text-gray-700 font-medium mb-1">
          Drag and drop files here
        </p>
        <p className="text-sm text-gray-500 mb-4">or click to browse</p>
        <p className="text-xs text-gray-400">
          Supported formats: PDF, JPG, PNG
        </p>
      </div>

      {selectedFile && (
        <>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
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
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={removeFile}
              >
                <XIcon size={18} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="end-flex items-center my-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200 shadow-sm"
            onClick={handleUpload}
          >
            Upload Report
          </button>
        </>
      )}
    </div>
  );
};