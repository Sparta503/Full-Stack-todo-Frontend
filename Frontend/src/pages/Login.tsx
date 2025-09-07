import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field } from '../components/form/Inputfield';
import SignupForm from './Register';

// Simple text-based icons as fallback
const UserIcon = () => <span className="text-white text-2xl">👤</span>;
const EnvelopeIcon = () => <span className="text-blue-300">✉️</span>;
const LockIcon = () => <span className="text-blue-300">🔒</span>;

type UserType = 'patient' | 'doctor' | 'admin';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [userType, setUserType] = useState<UserType>('patient');
  const [rememberMe, setRememberMe] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // For demo purposes, simulate a failed login with specific credentials
          if (email === 'demo@example.com' && password === 'password123') {
            resolve(true);
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1500);
      });
      
      // On successful login
      navigate(`/dashboard/${userType}`);
    } catch (err) {
      setErrors({
        form: 'Invalid email or password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => setShowSignup(false);
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const borderGradient = `linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6)`;

  if (showSignup) {
    return <SignupForm onBackToLogin={handleBackToLogin} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Welcome to Clinical Laboratories
          </h1>
          <p className="text-white text-lg font-medium">Login to continue</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          
          <div 
            className="relative p-[1px] rounded-2xl"
            style={{
              background: borderGradient,
              backgroundSize: '300% 300%',
              animation: 'gradient 15s ease infinite',
            }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full space-y-6 bg-blue-900 p-8 relative rounded-2xl"
            >
              <div className="flex items-center justify-center mb-6 relative z-10 group">
                <div className="bg-blue-600 p-3 rounded-full transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg">
                  {userType === 'doctor' ? (
                    <UserIcon />
                  ) : userType === 'admin' ? (
                    <UserIcon />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white ml-4 transition-all duration-200 group-hover:text-blue-300">
                  Welcome {userType === 'doctor' ? 'Doctor' : userType === 'admin' ? 'Admin' : 'Patient'}
                </h2>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setUserType('patient')}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 hover:scale-105 hover:shadow-lg ${
                    userType === 'patient' ? 'bg-blue-600 text-white' : 'bg-blue-800 text-blue-300'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('doctor')}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 hover:scale-105 hover:shadow-lg ${
                    userType === 'doctor' ? 'bg-blue-600 text-white' : 'bg-blue-800 text-blue-300'
                  }`}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 hover:scale-105 hover:shadow-lg ${
                    userType === 'admin' ? 'bg-blue-600 text-white' : 'bg-blue-800 text-blue-300'
                  }`}
                >
                  Admin
                </button>
              </div>

              {errors.form && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{errors.form}</span>
                </div>
              )}

              <Field
                id="email"
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                icon={<EnvelopeIcon />}
                isLoading={isLoading}
                error={errors.email}
                onBlur={() => validateForm()}
              />

              <Field
                id="password"
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                icon={<LockIcon />}
                isLoading={isLoading}
                error={errors.password}
                onBlur={() => validateForm()}
              />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-blue-900 text-gray-400">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Create a new account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient {
          0% { 
            background-position: 0% 50%;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% { 
            background-position: 100% 50%;
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.7);
          }
          100% { 
            background-position: 0% 50%;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
