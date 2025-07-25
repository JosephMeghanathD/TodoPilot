// src/components/RegistrationForm.tsx
import { useState, type FormEvent } from 'react';
import { User, Mail, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../lib/api';
import type { UserRegistrationRequest } from '../api/types';

interface RegistrationFormProps {
  onSuccess: () => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<UserRegistrationRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/users/register', formData);
      setSuccess("Account created successfully! Please log in.");
      setTimeout(() => {
        onSuccess();
      }, 2000); // Switch back to login form after 2 seconds
    } catch (err: any) {
      const errorMessage = err.response?.data || "Registration failed. The email might already be in use.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="text-sm font-medium text-muted flex items-center">
              <User className="w-4 h-4 mr-2" /> First Name
          </label>
          <input name="firstName" required onChange={handleChange} placeholder="John" className="mt-1 w-full bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2"/>
        </div>
        <div className="w-1/2">
          <label className="text-sm font-medium text-muted flex items-center">
             <User className="w-4 h-4 mr-2" /> Last Name
          </label>
          <input name="lastName" required onChange={handleChange} placeholder="Doe" className="mt-1 w-full bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2"/>
        </div>
       </div>

      <div>
        <label className="text-sm font-medium text-muted flex items-center">
            <Mail className="w-4 h-4 mr-2" /> Email
        </label>
        <input name="email" type="email" required onChange={handleChange} placeholder="user@system.io" className="mt-1 w-full bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2"/>
      </div>
      
      <div>
        <label className="text-sm font-medium text-muted flex items-center">
            <Lock className="w-4 h-4 mr-2" /> Password
        </label>
        <input name="password" type="password" required onChange={handleChange} placeholder="••••••••" className="mt-1 w-full bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2"/>
      </div>

      <div>
        <label className="text-sm font-medium text-muted flex items-center">
            <Lock className="w-4 h-4 mr-2" /> Confirm Password
        </label>
        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2"/>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 font-medium flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-2" /> {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-500 font-medium flex items-center justify-center">
          <CheckCircle className="w-4 h-4 mr-2" /> {success}
        </p>
      )}

      <div>
        <button type="submit" disabled={isLoading || !!success} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-background bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;