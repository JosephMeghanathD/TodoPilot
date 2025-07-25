// src/pages/LoginPage.tsx

import { useState, useRef, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import { useTypewriter } from '../hooks/useTypewriter';
import clsx from 'clsx';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);

  const fullTitle = "// TaskPilot";
  const typedTitle = useTypewriter(fullTitle, 100);
  
  useEffect(() => {
    if (formContainerRef.current && formContentRef.current) {
      const contentHeight = formContentRef.current.scrollHeight;
      formContainerRef.current.style.height = `${contentHeight}px`;
    }
  }, [isRegistering]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-12 h-28">
          <h1 className="font-bold text-4xl sm:text-5xl text-primary text-shadow-glow">
            {typedTitle}
            {/* The cursor is always rendered and animated by CSS */}
            <span className="w-0.5 h-10 sm:h-12 bg-primary ml-1 align-bottom inline-block animate-blink-cursor" aria-hidden="true"></span>
          </h1>
          <p className="text-muted-foreground mt-4 animate-fade-in-delayed">A terminal for your tasks.</p>
        </div>

        <div className="border border-border rounded-lg bg-background/30 backdrop-blur-sm overflow-hidden">
            <div className="flex border-b border-border">
                <button 
                    onClick={() => setIsRegistering(false)} 
                    className={clsx(
                        'w-1/2 p-3 font-medium transition-colors border-r border-border focus:outline-none',
                        {
                            'bg-background text-primary mb-[-1px]': !isRegistering,
                            'text-muted-foreground hover:text-primary': isRegistering,
                        }
                    )}
                >
                    Login
                </button>
                <button 
                    onClick={() => setIsRegistering(true)} 
                    className={clsx(
                        'w-1/2 p-3 font-medium transition-colors focus:outline-none',
                        {
                            'bg-background text-primary mb-[-1px]': isRegistering,
                            'text-muted-foreground hover:text-primary': !isRegistering,
                        }
                    )}
                >
                    Register
                </button>
            </div>
            
            <div
              ref={formContainerRef}
              className="transition-height duration-500 ease-in-out"
            >
              <div ref={formContentRef} className="p-6 md:p-8 bg-background">
                {isRegistering ? (
                  <RegistrationForm onSuccess={() => setIsRegistering(false)} />
                ) : (
                  <LoginForm />
                )}
              </div>
            </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-4 animate-fade-in-delayed">
          {'>'} {isRegistering 
            ? "Already have an account? Switch to the login tab." 
            : "No account? Switch to the register tab to create one."
          }
        </p>
      </div>
    </div>
  );
};

export default LoginPage;