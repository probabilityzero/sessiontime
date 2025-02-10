import React, { useEffect, Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase';
import { Header } from './components/layout/Header';

// Lazy load pages
const Auth = lazy(() => import('./pages/Auth'));
const HomePage = lazy(() => import('./pages/Home'));
const CalendarPage = lazy(() => import('./pages/Calendar'));
const AnalyticsPage = lazy(() => import('./pages/Report'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const TasksPage = lazy(() => import('./pages/Tasks'));

function App() {
  const { user, loading, setUser } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPageTitle, setCurrentPageTitle] = useState('');

  useEffect(() => {
    async function getSession() {
      setAuthLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        setUser(null);
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    }

    getSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setUser(session?.user || null);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, [setUser]);

  const ProtectedRoute = ({ element, pageTitle }: { element: React.ReactElement, pageTitle: string }) => {
    useEffect(() => {
      setCurrentPageTitle(pageTitle);
    }, [pageTitle]);

    if (authLoading) {
      return (
        <div>
          <Header pageTitle="Loading..." isCompact={false} toggleCompactMenu={() => {}} />
        </div>
      );
    }

    return isAuthenticated ? element : <Navigate to="/auth" />;
  };

  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute pageTitle="Home" element={<Layout pageTitle="Home"><HomePage /></Layout>} />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute pageTitle="Profile" element={<Layout pageTitle="Profile"><ProfilePage /></Layout>} />
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute pageTitle="Calendar" element={<Layout pageTitle="Calendar"><CalendarPage /></Layout>} />
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute pageTitle="History" element={<Layout pageTitle="History"><AnalyticsPage /></Layout>} />
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute pageTitle="Tasks" element={<Layout pageTitle="Tasks"><TasksPage /></Layout>} />
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute pageTitle="Settings" element={<Layout pageTitle="Settings"><SettingsPage /></Layout>} />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
