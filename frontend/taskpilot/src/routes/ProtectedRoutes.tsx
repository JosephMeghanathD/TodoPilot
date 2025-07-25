// src/routes/ProtectedRoutes.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ProtectedRoutes = () => {
  const { token, user, fetchUserProfile } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      // If a token exists in our store, but we don't have user data yet,
      // it means this is a fresh page load. We need to verify the token.
      if (token && !user) {
        await fetchUserProfile();
      }
      // Once the check is done (or if no token existed), we stop verifying.
      setIsVerifying(false);
    };

    verifyToken();
  }, []); // <-- The empty array is crucial. This effect runs only ONCE.

  // While we're checking the token, show a loading screen.
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="ml-4">Verifying session...</p>
      </div>
    );
  }

  // After verification, if there's a token and a user, show the content.
  // Otherwise, redirect to login.
  return token && user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;