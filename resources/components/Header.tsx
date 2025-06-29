import React, { useState, useEffect } from 'react';
import { BellIcon, SearchIcon, MenuIcon } from 'lucide-react';
import { router } from '@inertiajs/react';

interface HeaderProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  user?: {
    name: string;
    email: string;
  };
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
  toggleSidebar,
  user
}: HeaderProps) => {
  const handleLogout = () => {
    router.post('/logout');
  };

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
        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Welcome, <span className="font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>;
};