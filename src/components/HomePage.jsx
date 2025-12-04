import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card-bg p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-800">
        <h1 className="text-4xl font-bold text-gold mb-4">Welcome Back!</h1>
        <p className="text-gray-300 mb-8 text-lg">Manage your contacts and templates with ease. Sign in to get started.</p>
        <div className="flex justify-center gap-4">
          <button 
            className="bg-gold text-dark-bg px-8 py-3 rounded-full font-bold text-lg hover:bg-gold-hover transition-colors duration-300 shadow-lg hover:shadow-gold/20" 
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>
        <footer className="mt-8 text-sm text-gray-500">
          <p>&copy; 2025 Email Template App. All rights reserved. <a href="#" className="text-gold hover:underline">Privacy Policy</a></p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
