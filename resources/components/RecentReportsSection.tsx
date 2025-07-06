import React from 'react';
import { FileTextIcon, ClockIcon, CheckCircleIcon, UploadIcon, XIcon } from 'lucide-react';
interface Report {
  id: string;
  name: string;
  date: string;
  status: 'complete' | 'pending' | 're-upload';
  type: string;
  thumbnail?: string;
}
const RecentReportsSection = () => {
  const reports: Report[] = [{
    id: '1',
    name: 'MRI Scanner',
    date: '5 Oct 2023',
    status: 'complete',
    type: 'mri',
    thumbnail: 'https://images.unsplash.com/photo-1516069677018-378515003a6f'
  }, {
    id: '2',
    name: 'CT Scanner',
    date: '5 Oct 2023',
    status: 'pending',
    type: 'ct'
  }, {
    id: '3',
    name: 'X-Ray',
    date: '5 Oct 2023',
    status: 'pending',
    type: 'xray'
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-blue-600 bg-blue-50';
      case 're-upload':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  return <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {reports.map(report => <div key={report.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {report.thumbnail ? <img src={report.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileTextIcon className="h-6 w-6 text-gray-400" />
                  </div>}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {report.name}
                </h4>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <ClockIcon className="w-3.5 h-3.5 mr-1" />
                  {report.date}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status === 'complete' && <CheckCircleIcon className="w-3.5 h-3.5 mr-1 inline-block" />}
                {report.status === 're-upload' && <UploadIcon className="w-3.5 h-3.5 mr-1 inline-block" />}
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
              {report.status === 're-upload' && <button className="p-1 text-gray-400 hover:text-gray-500">
                  <XIcon className="w-4 h-4" />
                </button>}
            </div>
          </div>)}
      </div>
    </div>;
};
export default RecentReportsSection;