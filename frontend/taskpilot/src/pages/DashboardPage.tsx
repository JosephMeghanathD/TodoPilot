// src/pages/DashboardPage.tsx

import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore'; // Import UI store
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import { Loader2, Menu } from 'lucide-react'; // Import Menu icon

const DashboardPage = () => {
  const { tasks, fetchCategories, fetchTasks, isLoading } = useTaskStore();
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useUiStore(); // Get UI store actions

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, [fetchCategories, fetchTasks]);

  return (
    <div className="relative flex h-screen bg-background font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={closeSidebar} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button onClick={toggleSidebar} className="mr-4 p-2 md:hidden">
              <Menu />
            </button>
            <h1 className="text-xl font-bold">
                // Welcome, {user?.firstName || 'User'}
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1 text-sm text-primary-foreground bg-primary rounded-md hover:bg-opacity-80 transition-colors"
          >
            Logout
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading && tasks.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Loading dashboard...</p>
            </div>
          ) : (
            <TaskList />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;