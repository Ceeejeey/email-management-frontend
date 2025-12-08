import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig';
import axios from '../utils/axiosConfig';

const SignInPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const accessToken = await user.getIdToken();

      console.log('Google User signed in:', user);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      // Sync user with backend
      await axios.post('/api/google-login', {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      setMessage('Sign-in successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Google Sign-in error:', error);
      setMessage(
        error.message || 'Failed to sign in with Google. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white p-4">
      <div className="w-full max-w-md bg-card-bg p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-gold mb-8">Sign In</h2>
        
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md mb-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>

        {message && <p className={`mt-6 text-center text-sm ${isLoading ? 'text-gray-400' : 'text-gold'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default SignInPage;
