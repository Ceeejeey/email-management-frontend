import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gold mb-4 animate-fade-in-down">
          Welcome to Email Manager
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Streamline your communication with our powerful email template and contact management system.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-6 bg-card-bg rounded-xl border border-gray-800 hover:border-gold transition-colors shadow-lg">
            <h3 className="text-xl font-bold text-gold mb-2">Manage Contacts</h3>
            <p className="text-gray-400">Organize your contacts and groups efficiently.</p>
          </div>
          <div className="p-6 bg-card-bg rounded-xl border border-gray-800 hover:border-gold transition-colors shadow-lg">
            <h3 className="text-xl font-bold text-gold mb-2">Email Templates</h3>
            <p className="text-gray-400">Create and customize professional email templates.</p>
          </div>
          <div className="p-6 bg-card-bg rounded-xl border border-gray-800 hover:border-gold transition-colors shadow-lg">
            <h3 className="text-xl font-bold text-gold mb-2">Bulk Sending</h3>
            <p className="text-gray-400">Send emails to multiple recipients with ease.</p>
          </div>
        </div>

        <div className="mt-12">
          <button 
            onClick={() => navigate('/signin')}
            className="bg-gold text-dark-bg font-bold py-3 px-8 rounded-full text-lg hover:bg-gold-hover transition-transform transform hover:scale-105 shadow-xl"
          >
            Get Started
          </button>
        </div>
        
        <footer className="mt-16 text-sm text-gray-500">
          <p>&copy; 2025 Email Template App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
