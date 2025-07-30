import React, { useEffect, useState, useRef } from 'react';
import { PlusIcon, BedIcon, FileTextIcon, ClipboardIcon, UserPlusIcon, XIcon } from 'lucide-react';
interface FloatingActionButtonProps {
  onTabChange: (tab: string) => void;
}
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const actions = [{
    icon: <BedIcon size={16} />,
    label: 'Admit to Ward',
    color: 'bg-blue-500',
    tab: 'ward',
  }, {
    icon: <FileTextIcon size={16} />,
    label: 'Add Surgery Note',
    color: 'bg-green-500',
    tab: 'surgery',
  }, {
    icon: <ClipboardIcon size={16} />,
    label: 'Create Order',
    color: 'bg-purple-500',
    tab: 'orders',
  }, {
    icon: <UserPlusIcon size={16} />,
    label: 'Refer Patient',
    color: 'bg-orange-500',
    tab: 'history',
  }];
  return <div className="fixed bottom-6 right-6" ref={menuRef}>
      {isOpen && <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg overflow-hidden mb-2 w-48 transition-all duration-200 ease-in-out">
          {actions.map((action, index) => <button key={index} className="flex items-center w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors" onClick={() => { onTabChange(action.tab); setIsOpen(false); }}>
              <span className={`${action.color} p-1 rounded text-white mr-3`}>
                {action.icon}
              </span>
              {action.label}
            </button>)}
        </div>}
      <button onClick={toggleMenu} className={`
          h-14 w-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300
          ${isOpen ? 'bg-red-500 rotate-45' : 'bg-blue-500'}
        `}>
        {isOpen ? <XIcon size={24} /> : <PlusIcon size={24} />}
      </button>
    </div>;
};
export default FloatingActionButton;