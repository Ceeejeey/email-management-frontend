import React from 'react';
import { Users, Layers, FileText, ChevronLeft, ChevronRight, Mail } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, toggleSidebar }) => {
  const navItems = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'groups', label: 'Groups', icon: Layers },
    { id: 'templates', label: 'Templates', icon: FileText },
  ];

  return (
    <aside 
      className={`bg-card-bg border-r border-gray-800 transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      } hidden md:flex h-full shadow-xl z-10`}
    >
      {/* Header / Logo */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-800 shrink-0`}>
        <div className="flex items-center gap-3 text-gold">
          <div className="p-2 bg-gold/10 rounded-lg">
            <Mail size={24} />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl tracking-wide text-gray-100">EmailManager</span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-gold/20 to-transparent text-gold border-l-4 border-gold' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className={`${isActive ? 'text-gold' : 'text-gray-400 group-hover:text-gray-200'} transition-colors`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {!isCollapsed && (
                <span className={`font-medium whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              )}
              
              {/* Hover Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-gray-700">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <button 
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : (
            <div className="flex items-center gap-2 text-sm font-medium">
              <ChevronLeft size={16} />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
