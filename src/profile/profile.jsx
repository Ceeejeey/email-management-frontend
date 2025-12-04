import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useUpdateProfile, useDisconnectGoogle } from '../utils/queries';

const ProfilePage = () => {
  const { data: userProfile, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const disconnectGoogleMutation = useDisconnectGoogle();
  
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setUser({ name: userProfile.name || '', email: userProfile.email || '' });
    }
  }, [userProfile]);

  const handleSaveChanges = async () => {
    try {
      await updateProfileMutation.mutateAsync({ name: user.name, email: user.email, password });
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile.');
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const response = await axios.get('/api/auth/google', { withCredentials: true });
  
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      } else {
        console.error('No authUrl provided in the response');
        setMessage('Failed to initiate Google account connection.');
      }
    } catch (error) {
      console.error('Error connecting Google account:', error);
      setMessage('Failed to connect Google account.');
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await disconnectGoogleMutation.mutateAsync();
      setMessage('Google account disconnected successfully.');
    } catch (error) {
      console.error('Error disconnecting Google account:', error);
      setMessage('Failed to disconnect Google account.');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-dark-bg text-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 p-4 md:p-8 flex justify-center">
      <div className="bg-card-bg p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-800">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gold">User Profile</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Name:</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <button 
            type="button" 
            onClick={handleSaveChanges} 
            className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-gold-hover transition-colors shadow-lg"
          >
            Save Changes
          </button>
        </form>

        <hr className="my-8 border-gray-700" />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Google Account Connection</h2>
          <p className="text-gray-400 text-sm">
            Connect your Google account to send emails directly from this application.
          </p>
          
          {userProfile?.isGoogleConnected ? (
            <div className="flex items-center justify-between bg-green-900/20 border border-green-900 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full">
                  <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-5 h-5" />
                </div>
                <span className="text-green-400 font-medium">Connected</span>
              </div>
              <button 
                onClick={handleDisconnectGoogle}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={handleConnectGoogle}
              className="flex items-center justify-center gap-3 w-full bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            >
              <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-5 h-5" />
              Connect with Google
            </button>
          )}
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${message.includes('success') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
