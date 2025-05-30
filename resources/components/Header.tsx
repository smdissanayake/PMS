import React, { useState, useEffect } from 'react';
import { BellIcon, SearchIcon, MenuIcon } from 'lucide-react';
import asiriLogo from '../images/asiri.png';

interface HeaderProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-gray-700">
      <div className="text-sm">
        {dateTime.toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric'
        })}
      </div>
      <div className="text-base font-medium">
        {dateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}
      </div>
    </div>
  );
};

export const Header = ({
  isSidebarCollapsed,
  toggleSidebar
}: HeaderProps) => {
  return <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <MenuIcon size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <DateTimeDisplay />
        </div>
      </div>
    </header>;
};