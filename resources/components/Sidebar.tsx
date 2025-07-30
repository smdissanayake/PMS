import React from "react";
import {
  UsersIcon,
  CalendarIcon,
  MessageSquareIcon,
  ClipboardMinus,
  SettingsIcon,
  LogOutIcon,
  LayoutDashboard,
  Search,
} from "lucide-react";
// import asiriLogo from '../images/asiri.png';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
}

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
}: SidebarProps) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "registerpatient",
      label: "Register Patient",
      icon: <UsersIcon size={20} />,
    },
    {
      id: "search",
      label: "Search",
      icon: <Search size={20} />,
    },
    {
      id: "sergerycalendar",
      label: "Surgery Calendar",
      icon: <CalendarIcon size={20} />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <ClipboardMinus size={20} />,
    },
  ];

  return (
    <div
      className={`bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      <div className="p-5 border-gray-200">
        {/* Company Logo */}
        {!isCollapsed && (
          <div className="flex justify-center items-center">
            <img
              src="/images/logo_asiri.png"
              alt="Company Logo"
              style={{ maxWidth: '120px', height: 'auto' }}
            />
          </div>
        )}
        <div className={`text-xl font-semibold text-blue-600 h-fit truncate ${isCollapsed ? "text-center" : ""
          }`}>
          {/* Logo removed due to missing file */}
        </div>
      </div>
      <nav className="flex-1 pt-5">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-5 py-3 text-left ${activeTab === item.id
                    ? "text-blue-600 bg-blue-50 border-r-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                <span
                  className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
                    }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
    </div>
  );
};

export default Sidebar;
