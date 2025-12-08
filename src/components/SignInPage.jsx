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

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500">Or continue with email</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-white placeholder-gray-500 transition-colors"
              placeholder="name@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-white placeholder-gray-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-dark-bg font-bold py-3 px-4 rounded-lg hover:bg-gold-hover transition-colors shadow-lg mt-2"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => setIsSignUp(true)} className="text-gold hover:underline font-medium">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
