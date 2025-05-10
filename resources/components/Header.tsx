import React from 'react';
import { BellIcon, SearchIcon, MenuIcon } from 'lucide-react';
interface HeaderProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
export const Header: React.FC<HeaderProps> = ({
  isSidebarCollapsed,
  toggleSidebar
}) => {
  return <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <MenuIcon size={20} className="text-gray-600" />
          </button>
          <div className="relative w-64">
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center">
          <button className="relative p-2 mr-4">
            <BellIcon size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
              DR
            </div>
            <span className="text-sm font-medium">Dr. Roberts</span>
          </div>
        </div>
      </div>
    </header>;
};