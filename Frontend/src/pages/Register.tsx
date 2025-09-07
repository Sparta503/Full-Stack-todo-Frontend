'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Field } from '../components/form/Inputfield';

// Simple text-based icons as fallback
const UserIcon = () => <span className="text-white text-2xl">👤</span>;
const EnvelopeIcon = () => <span className="text-blue-300">✉️</span>;
const LockIcon = () => <span className="text-blue-300">🔒</span>;
const CheckIcon = () => <span className="text-blue-300">✓</span>;
const BuildingIcon = () => <span className="text-blue-300">🏢</span>;

type SignupFormProps = {
  onBackToLogin: () => void;
  userType?: string; // Made optional since it's not used
};

type UserRole = 'patient' | 'doctor' | 'admin';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  organization: string;
  role: UserRole;
};

export default function SignupForm({ onBackToLogin }: SignupFormProps) {

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization: '',
    role: 'patient',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBlur = () => {
    validateForm();
  };
  
  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if ((formData.role === 'doctor' || formData.role === 'admin') && !formData.organization) {
      newErrors.organization = 'Organization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...(formData.role !== 'patient' && { organization: formData.organization })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      await response.json();
      
      // Redirect to login after successful registration
      onBackToLogin();
    } catch {
      setErrors({
        form: 'Failed to create account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="w-full max-w-md">
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(145deg, rgba(30, 58, 138, 0.9) 0%, rgba(30, 64, 175, 0.9) 100%)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-700 flex items-center justify-center shadow-lg">
                <UserIcon />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Create Account
              </h1>
              <p className="text-blue-200 mt-1">
                Join as a {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </p>
            </div>

            {errors.form && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 text-red-100 rounded-lg text-sm">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <fieldset className="mb-4">
                <legend className="sr-only">Select your role</legend>
                <div className="grid grid-cols-3 gap-3">
                  {(['patient', 'doctor', 'admin'] as const).map((role) => (
                    <label
                      key={role}
                      className={`cursor-pointer py-2 text-center rounded-lg border transition-all ${
                        formData.role === role
                          ? 'bg-blue-700/50 border-blue-500 text-white shadow-lg'
                          : 'border-blue-700 bg-blue-800/30 text-blue-300 hover:bg-blue-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={() => handleRoleChange(role)}
                        className="sr-only"
                        aria-label={role.charAt(0).toUpperCase() + role.slice(1)}
                      />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="space-y-4">
                <Field
                  id="name"
                  name="name"
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<UserIcon />}
                  error={errors.name}
                  onBlur={handleBlur}
                  className="bg-blue-800/50 border-blue-700/50 focus:border-blue-400 focus:ring-blue-400/30"
                />

                {formData.role !== 'patient' && (
                  <Field
                    id="organization"
                    name="organization"
                    label={formData.role === 'doctor' ? 'Hospital/Clinic' : 'Organization'}
                    type="text"
                    placeholder={`Enter your ${formData.role === 'doctor' ? 'hospital/clinic' : 'organization'} name`}
                    value={formData.organization}
                    onChange={handleChange}
                    icon={<BuildingIcon />}
                    error={errors.organization}
                    onBlur={handleBlur}
                    className="bg-blue-800/50 border-blue-700/50 focus:border-blue-400 focus:ring-blue-400/30"
                  />
                )}

                <Field
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<EnvelopeIcon />}
                  error={errors.email}
                  onBlur={handleBlur}
                  className="bg-blue-800/50 border-blue-700/50 focus:border-blue-400 focus:ring-blue-400/30"
                />

                <Field
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  icon={<LockIcon />}
                  error={errors.password}
                  onBlur={handleBlur}
                  className="bg-blue-800/50 border-blue-700/50 focus:border-blue-400 focus:ring-blue-400/30"
                />

                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={<CheckIcon />}
                  error={errors.confirmPassword}
                  onBlur={handleBlur}
                  className="bg-blue-800/50 border-blue-700/50 focus:border-blue-400 focus:ring-blue-400/30"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-blue-200">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-white font-medium hover:underline focus:outline-none"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
