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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card-bg p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-800">
        <h1 className="text-3xl font-bold text-gold mb-4">Welcome</h1>
        <p className="text-gray-300 mb-8">Please sign in to continue</p>
        
        <div className="flex justify-center">
          <button 
            type="button" 
            className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300 flex items-center justify-center gap-3"
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : (
              <>
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        {message && <p className={`mt-6 text-sm ${isLoading ? 'text-gray-400' : 'text-gold'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default SignInPage;
