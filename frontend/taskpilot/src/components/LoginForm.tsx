// src/components/LoginForm.tsx
import { useState, type FormEvent } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-muted flex items-center">
            <Mail className="w-4 h-4 mr-2" /> Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@system.io"
            className="w-full bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-muted flex items-center">
            <Lock className="w-4 h-4 mr-2" /> Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2 transition-colors"
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 text-center font-medium">
           <span className="underline">Error:</span> {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-background bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Authenticating...
            </>
          ) : (
            'Authorize'
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;