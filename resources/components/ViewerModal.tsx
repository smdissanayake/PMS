import React from 'react';
import { XIcon, DownloadIcon } from 'lucide-react';
interface ViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}
const ViewerModal = ({
  isOpen,
  onClose,
  onDownload,
  fileUrl,
  fileName,
  fileType
}: ViewerModalProps) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{fileName}</h3>
          <div className="flex items-center gap-2">
            <button onClick={onDownload} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
              <DownloadIcon size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <XIcon size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {fileType.startsWith('image/') ? <img src={fileUrl} alt={fileName} className="max-w-full h-auto mx-auto" /> : <iframe src={fileUrl} className="w-full h-full min-h-[60vh]" title={fileName} />}
        </div>
      </div>
    </div>;
};
export default ViewerModal;