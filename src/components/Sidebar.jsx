import React from 'react';
import { Users, Layers, FileText, ChevronLeft, ChevronRight, Mail, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, toggleSidebar, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'groups', label: 'Groups', icon: Layers },
    { id: 'templates', label: 'Templates', icon: FileText },
  ];

  return (
    <>
      <aside 
        className={`
          bg-card-bg border-r border-gray-800 transition-all duration-300 ease-in-out flex flex-col 
          fixed md:relative inset-y-0 left-0 z-40 h-full shadow-xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-72'}
          w-72
        `}
      >
        {/* Header / Logo */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6 justify-between'} border-b border-gray-800 shrink-0`}>
          <div className="flex items-center gap-3 text-gold">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Mail size={24} />
            </div>
            {(!isCollapsed || isMobileMenuOpen) && (
              <span className="font-bold text-xl tracking-wide text-gray-100">EmailManager</span>
            )}
          </div>
          
          {/* Mobile Close Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
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
                
                {(!isCollapsed || isMobileMenuOpen) && (
                  <span className={`font-medium tracking-wide ${isActive ? 'text-gray-100' : ''}`}>
                    {item.label}
                  </span>
                )}
                
                {/* Tooltip for collapsed state (Desktop only) */}
                {isCollapsed && !isMobileMenuOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-gray-700">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Collapse Button (Desktop Only) */}
        <div className="p-4 border-t border-gray-800 hidden md:flex justify-end">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
