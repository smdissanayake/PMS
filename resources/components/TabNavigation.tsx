import React from 'react';
import { HistoryIcon, FileTextIcon, ClipboardListIcon, PillIcon, BedIcon } from 'lucide-react';
interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
const TabNavigation = ({
  activeTab,
  onTabChange
}: TabNavigationProps) => {
  const tabs = [{
    id: 'history',
    label: 'History',
    icon: <HistoryIcon size={16} />
  }, {
    id: 'investigations',
    label: 'Investigations',
    icon: <FileTextIcon size={16} />
  }, {
    id: 'orders',
    label: 'Orders',
    icon: <ClipboardListIcon size={16} />
  }, {
    id: 'drugs',
    label: 'Drugs',
    icon: <PillIcon size={16} />
  }, {
    id: 'ward',
    label: 'Ward',
    icon: <BedIcon size={16} />
  }, {
    id: 'surgery',
    label: 'Surgery',
    icon: <div size={16} />
  }];
  return <div className="border-b border-gray-200">
      <nav className="flex overflow-x-auto">
        {tabs.map(tab => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`
              flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200
              ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}>
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>)}
      </nav>
    </div>;
};
export default TabNavigation;