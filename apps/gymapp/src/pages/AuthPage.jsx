// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService'; 
import parseApiError from '../utils/parseApiError';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ Get both `login` and `setAuthData` from the context
  const { login, setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        navigate(response.data.redirectTo || '/dashboard');
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authService.signup(formData.email, formData.password);
      if (response.success) {
        // ✅ CRITICAL STEP: Update the global auth state first!
        setAuthData(response.data.token);
        
        // Now that the app knows we are authenticated, navigate to the protected route.
        navigate(response.data.redirectTo); // This will be '/select-role'
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6 border-b">
          <button onClick={() => setIsLogin(true)} className={`px-4 py-2 font-semibold ${isLogin ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>Sign In</button>
          <button onClick={() => setIsLogin(false)} className={`px-4 py-2 font-semibold ${!isLogin ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}>Sign Up</button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
          {!isLogin && (
            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
          )}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition">
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
}