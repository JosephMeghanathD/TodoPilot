// src/components/HealthCheckGate.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_SERVICE_URL } from '../lib/api';
import { TODO_SERVICE_URL } from '../lib/todoApi';

import { Loader2, Server, ServerCog, WifiOff } from 'lucide-react';
import clsx from 'clsx';

interface HealthCheckGateProps {
  children: React.ReactNode;
}

type ServiceStatus = 'pending' | 'healthy' | 'unhealthy';

// --- UPDATED HEALTH CHECK LOGIC ---
// This function now checks for the specific "UP" status in the response body.
const checkHealth = async (url: string): Promise<boolean> => {
    try {
        const response = await axios.get(url, { timeout: 5000 });
        // Check for both a 200 status and the correct payload
        return response.status === 200 && response.data.status === 'UP';
    } catch (error) {
        // This will catch network errors, timeouts, 5xx errors, etc.
        return false;
    }
};

const StatusIndicator = ({ status, name }: { status: ServiceStatus, name: string }) => {
    return (
        <div className={clsx("flex items-center transition-all duration-500 p-2 rounded-md", {
            "bg-muted/10 text-muted-foreground": status === 'pending',
            "bg-green-900/50 text-green-400": status === 'healthy',
            "bg-red-900/50 text-red-400": status === 'unhealthy',
        })}>
            {status === 'pending' && <Loader2 size={16} className="animate-spin mr-2" />}
            {status === 'healthy' && <Server size={16} className="mr-2" />}
            {status === 'unhealthy' && <ServerCog size={16} className="mr-2" />}
            <span>{name} Status: <span className="font-semibold capitalize">{status}</span></span>
        </div>
    );
};


const HealthCheckGate = ({ children }: HealthCheckGateProps) => {
  const [userServiceStatus, setUserServiceStatus] = useState<ServiceStatus>('pending');
  const [todoServiceStatus, setTodoServiceStatus] = useState<ServiceStatus>('pending');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let userInterval: number | undefined;
    let todoInterval: number | undefined;

    if (isOnline) {
        // --- User Service Polling ---
        if (userServiceStatus !== 'healthy') {
            userInterval = setInterval(async () => {
                const isHealthy = await checkHealth(`${USER_SERVICE_URL}/api/v1/users/health`);
                if (isHealthy) {
                    setUserServiceStatus('healthy');
                    clearInterval(userInterval);
                } else {
                    setUserServiceStatus('unhealthy');
                }
            }, 3000);
        }

        // --- Todo Service Polling ---
        if (todoServiceStatus !== 'healthy') {
            todoInterval = setInterval(async () => {
                // --- CORRECTED TODO SERVICE HEALTH URL ---
                const isHealthy = await checkHealth(`${TODO_SERVICE_URL}/api/v1/tasks/health`);
                if (isHealthy) {
                    setTodoServiceStatus('healthy');
                    clearInterval(todoInterval);
                } else {
                    setTodoServiceStatus('unhealthy');
                }
            }, 3000);
        }
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (userInterval) clearInterval(userInterval);
        if (todoInterval) clearInterval(todoInterval);
    };
  }, [isOnline, userServiceStatus, todoServiceStatus]);

  if (userServiceStatus === 'healthy' && todoServiceStatus === 'healthy') {
    return <>{children}</>;
  }

  // --- Loading Screen JSX (Unchanged) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <h1 className="font-bold text-4xl sm:text-5xl text-primary text-shadow-glow mb-4">
            // TaskPilot
        </h1>
        <p className="text-muted-foreground mb-8">Waking up the backend services...</p>
        
        {!isOnline && (
            <div className="flex items-center text-red-400 mb-4 p-3 border border-red-800 bg-red-900/50 rounded-lg">
                <WifiOff size={20} className="mr-3"/>
                <span className="font-semibold">You are offline. Please check your internet connection.</span>
            </div>
        )}

        <div className="space-y-3 w-full max-w-sm">
            <StatusIndicator status={userServiceStatus} name="User Service" />
            <StatusIndicator status={todoServiceStatus} name="Todo Service" />
        </div>
        <p className="text-xs text-muted-foreground mt-8">
            This may take a moment on the first visit as the services spin up.
        </p>
    </div>
  );
};

export default HealthCheckGate;