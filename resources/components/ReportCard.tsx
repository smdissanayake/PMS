import React from 'react';
import { FileIcon, ImageIcon, FileTextIcon, DownloadIcon, EyeIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';
interface ReportCardProps {
  report: {
    id: string;
    name: string;
    type: string;
    date: string;
    status: 'processing' | 'ready';
    thumbnail?: string;
  };
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}
const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onDownload
}) => {
  const getIcon = () => {
    switch (report.type) {
      case 'application/pdf':
        return <FileTextIcon className="w-8 h-8 text-red-500" />;
      case 'image/jpeg':
      case 'image/png':
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      default:
        return <FileIcon className="w-8 h-8 text-gray-500" />;
    }
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {report.thumbnail ? <img src={report.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
              {getIcon()}
            </div>}
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{report.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon size={12} className="mr-1" />
              {report.date}
            </div>
            <div className="flex items-center text-xs">
              {report.status === 'processing' ? <span className="flex items-center text-yellow-600">
                  <ClockIcon size={12} className="mr-1" />
                  Processing
                </span> : <span className="flex items-center text-green-600">
                  <CheckCircleIcon size={12} className="mr-1" />
                  Ready
                </span>}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {report.status === 'ready' && <>
              <button onClick={() => onView(report.id)} className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="View">
                <EyeIcon size={16} />
              </button>
              <button onClick={() => onDownload(report.id)} className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Download">
                <DownloadIcon size={16} />
              </button>
            </>}
        </div>
      </div>
    </div>;
};
export default ReportCard;
