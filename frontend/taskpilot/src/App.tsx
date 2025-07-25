// src/App.tsx

import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import HealthCheckGate from './components/HealthCheckGate'; // Import the new component

function App() {
  const { theme } = useThemeStore();

  return (
    <div className="font-sans">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
            color: theme === 'dark' ? '#f4f4f4' : '#0a0a0a',
            border: `1px solid ${theme === 'dark' ? '#262626' : '#e5e5e5'}`,
          },
          error: {
            iconTheme: {
                primary: '#ef4444',
                secondary: theme === 'dark' ? '#f4f4f4' : '#ffffff',
            },
          },
        }}
      />
      <HealthCheckGate>
        <AppRouter />
      </HealthCheckGate>
    </div>
  );
}

export default App;