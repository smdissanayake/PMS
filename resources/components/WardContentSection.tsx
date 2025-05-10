import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, PillIcon, FileTextIcon, ClipboardIcon } from 'lucide-react';
const WardContentSection = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const toggleSection = (section: string) => {
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };
  const sections = [{
    id: 'medications',
    title: 'Ward Medications',
    icon: <PillIcon className="h-5 w-5" />,
    content: <div className="space-y-4">
          <button className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add New Medication
          </button>
          <p className="text-sm text-gray-500">No medications added yet</p>
        </div>
  }, {
    id: 'reports',
    title: 'Ward Reports',
    icon: <FileTextIcon className="h-5 w-5" />,
    content: <div className="space-y-4">
          <button className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />
            Upload New Report
          </button>
          <p className="text-sm text-gray-500">No reports uploaded yet</p>
        </div>
  }, {
    id: 'notes',
    title: 'Progress Notes',
    icon: <ClipboardIcon className="h-5 w-5" />,
    content: <div className="space-y-4">
          <button className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Progress Note
          </button>
          <p className="text-sm text-gray-500">No progress notes added yet</p>
        </div>
  }];
  return <div className="space-y-4">
      {sections.map(section => <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <button onClick={() => toggleSection(section.id)} className="w-full px-6 py-4 flex items-center justify-between text-left">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">{section.icon}</span>
              <span className="font-medium text-gray-900">{section.title}</span>
            </div>
            {expandedSections.includes(section.id) ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
          </button>
          {expandedSections.includes(section.id) && <div className="px-6 py-4 border-t border-gray-100">
              {section.content}
            </div>}
        </div>)}
    </div>;
};
export default WardContentSection;