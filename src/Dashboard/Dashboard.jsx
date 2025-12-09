import React, { useState, useEffect, useRef } from 'react';
import ContactsManager from '../Contacts/ContactsManager';
import GroupsManager from '../Contacts/GroupManager';
import TemplateManager from '../emailTemplates/TemplateManager';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserProfile } from '../utils/queries';
import { Users, Layers, FileText, User, LogOut, Menu } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [accessToken, setAccessToken] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useUserProfile();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen bg-dark-bg text-gray-100 flex flex-col overflow-hidden">
       <ToastContainer theme="dark" /> 
      {/* Navbar */}
      <nav className="bg-card-bg shadow-md p-4 flex justify-between items-center border-b border-gray-800 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gold">Dashboard</h1>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          {/* Profile Info (Click to Toggle Dropdown) */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors" 
            onClick={toggleDropdown}
          >
            <span className="font-medium hidden sm:block">{userProfile?.name || 'User'}</span>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gold">
              <User size={18} />
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-card-bg rounded-xl shadow-xl py-2 z-50 border border-gray-700">
              <div className="px-4 py-2 border-b border-gray-700 sm:hidden">
                <p className="text-sm font-medium text-white">{userProfile?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{userProfile?.email}</p>
              </div>
              <ul>
                <li 
                  className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors"
                  onClick={() => navigate('/profile')}
                >
                  <User size={18} className="text-gray-400" />
                  <span>Profile</span>
                </li>
                <li 
                  className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </li>
                <li className="px-4 py-3 border-t border-gray-700 text-xs text-gray-400 flex items-center gap-2">
                  {userProfile?.isGoogleConnected ? (
                    <>
                      <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
                        alt="Google Connected" className="w-4 h-4" />
                      <span className="text-green-400 font-medium">Connected</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Not Connected</span>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Component */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full relative">
          {/* Overlay for mobile when sidebar is open */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'contacts' && <ContactsManager />}

            {activeTab === 'groups' && (
              <div>
                <GroupsManager />
              </div>
            )}

            {activeTab === 'templates' && (
              <div>
                <TemplateManager />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
