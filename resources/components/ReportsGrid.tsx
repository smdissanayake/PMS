import React from 'react';
import { ReportCard } from './ReportCard';
interface ReportsGridProps {
  viewMode: 'grid' | 'list';
}
export const ReportsGrid: React.FC<ReportsGridProps> = ({
  viewMode
}) => {
  // Sample report data
  const reports = [{
    id: 1,
    fileName: 'Blood Test Results.pdf',
    uploadDate: '2023-10-15',
    fileType: 'pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWVkaWNhbCUyMHJlcG9ydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
  }, {
    id: 2,
    fileName: 'MRI Scan.jpg',
    uploadDate: '2023-10-10',
    fileType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXJpfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
  }, {
    id: 3,
    fileName: 'X-Ray Results.jpg',
    uploadDate: '2023-10-05',
    fileType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582560475093-ba66accbc953?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8eHJheXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
  }, {
    id: 4,
    fileName: 'Ultrasound Report.pdf',
    uploadDate: '2023-09-28',
    fileType: 'pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHVsdHJhc291bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
  }, {
    id: 5,
    fileName: 'ECG Results.pdf',
    uploadDate: '2023-09-20',
    fileType: 'pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZWNnfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
  }, {
    id: 6,
    fileName: 'CT Scan.jpg',
    uploadDate: '2023-09-15',
    fileType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y3Qgc2NhbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
  }];
  return <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col space-y-3'}>
      {reports.map(report => <ReportCard key={report.id} report={report} viewMode={viewMode} />)}
    </div>;
};