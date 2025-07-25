// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoutes from './ProtectedRoutes';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage />} />
        {/* All other protected routes will go here */}
      </Route>
    </Routes>
  );
};

export default AppRouter;