import React, { useEffect, useState } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import LandingPage from '@/pages/LandingPage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

import DashboardPage from '@/pages/dashboard/DashboardPage';
import TransactionsPage from '@/pages/dashboard/TransactionsPage';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';
import GoalsPage from '@/pages/dashboard/GoalsPage';
import BudgetsPage from '@/pages/dashboard/BudgetsPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';

import { useAuthStore } from '@/store/auth.store';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default function App() {
  const { fetchProfile } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    fetchProfile().finally(() => {
      setIsInitializing(false);
    });
  }, [fetchProfile]);

  // Loading Screen
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        Loading FinNewt.bi...
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            path="/transactions"
            element={<TransactionsPage />}
          />

          <Route
            path="/analytics"
            element={
              <ErrorBoundary fallbackTitle="Analytics failed to render">
                <AnalyticsPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="/budgets"
            element={<BudgetsPage />}
          />

          <Route
            path="/goals"
            element={
              <ErrorBoundary fallbackTitle="Goals failed to render">
                <GoalsPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>

        {/* Catch-All Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </HashRouter>
  );
}