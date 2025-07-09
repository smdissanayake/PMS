import React, { useMemo } from 'react';
import { FileIcon, FileTextIcon, DownloadIcon, EyeIcon } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Report {
  id: number;
  fileName: string;
  uploadDate: string;
  fileType: string;
  thumbnailUrl: string | null;
  status: string;
  notes: string | null;
  orderType: string;
  patientName: string;
}

interface ReportCardProps {
  report: Report;
  viewMode: 'grid' | 'list';
}

export const ReportCardInv: React.FC<ReportCardProps> = ({
  report,
  viewMode
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/investigation-reports/${report.id}/download`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download the file. Please try again.'
      });
    }
  };

  const handleView = () => {
    if (report.fileType === 'pdf') {
      window.open(`/investigation-reports/${report.id}`, '_blank');
    } else if (report.thumbnailUrl) {
      window.open(report.thumbnailUrl, '_blank');
    }
  };

  // Memoize the image URL with cache busting only when report.thumbnailUrl or uploadDate changes
  const imageUrl = useMemo(() => {
    return report.thumbnailUrl ? `${report.thumbnailUrl}?t=${new Date(report.uploadDate).getTime()}` : '/images/pdf-icon.png';
  }, [report.thumbnailUrl, report.uploadDate]);

  if (viewMode === 'list') {
    return (
      <div className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mr-4">
          {report.fileType === 'image' && report.thumbnailUrl ? (
            <>
              
              <img src={imageUrl} alt={report.fileName} className="w-full h-full object-cover" />
            </>
          ) : (
            <FileTextIcon size={24} className="text-blue-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            asdasd
          </p>
          <p className="text-sm font-medium text-gray-800 truncate">
            {report.fileName}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(report.uploadDate)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleView}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <EyeIcon size={18} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <DownloadIcon size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-40 bg-gray-100 relative">
          {report.fileType === 'pdf' ? (
            <div className="w-full h-full flex items-center justify-center">
              <FileIcon size={48} className="text-blue-400" />
            </div>
          ) : (
            // <img
            //   src={imageUrl}
            //   alt={report.fileName}
            //   className="w-full h-full object-cover"
            // />
            <img
            src={imageUrl}
            alt={report.fileName}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = '/images/pdf-icon.png'; }}
          />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
            {report.fileName}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {formatDate(report.uploadDate)}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleView}
              className="flex-1 py-1.5 px-3 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              <EyeIcon size={14} className="mr-1.5" />
              View
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-1.5 px-3 bg-gray-50 text-gray-600 text-xs font-medium rounded hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <DownloadIcon size={14} className="mr-1.5" />
              Download
            </button>
          </div>
        </div>
      </div>
    </>
  );
};