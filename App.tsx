import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import VolunteerLogin from './pages/auth/VolunteerLogin';
import VolunteerSignUp from './pages/auth/VolunteerSignUp';
import AdminLogin from './pages/auth/AdminLogin';
import AdminSignUp from './pages/auth/AdminSignUp';
import Dashboard from './pages/admin/Dashboard';
import EventManager from './pages/admin/EventManager';
import Roster from './pages/admin/Roster';
import CollegeEvents from './pages/admin/CollegeEvents';
import BrowseEvents from './pages/volunteer/BrowseEvents';
import MySchedule from './pages/volunteer/MySchedule';
import MyCertificates from './pages/volunteer/MyCertificates';
import Statistics from './pages/volunteer/Statistics';
import Profile from './pages/volunteer/Profile';
import Leaderboard from './pages/volunteer/Leaderboard';
import Recommended from './pages/volunteer/Recommended';
import { UserRole } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventsProvider } from './contexts/EventsContext';
import { supabase } from './services/supabaseClient';
import Reports from './pages/admin/Reports';
import AttendeeInsights from './pages/admin/AttendeeInsights';
import Settings from './pages/admin/Settings';
import AllEvents from './pages/admin/AllEvents';

const AppContent: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout = async () => {
    const currentRole = userRole;
    await signOut();
    if (currentRole === UserRole.ADMIN) {
      navigate('/login/admin');
    } else {
      navigate('/login/volunteer');
    }
  };

  // Check local storage for theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Fetch user role when user changes
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        setRoleLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserRole(data.role as UserRole);
        } else {
          console.error("Could not fetch role", error);
        }
        setRoleLoading(false);
      } else {
        setUserRole(null);
      }
    };

    fetchRole();
  }, [user]);

  // Handle Dark Mode Toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Public Routes (Login/Signup)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login/volunteer" element={<VolunteerLogin />} />
        <Route path="/signup/volunteer" element={<VolunteerSignUp />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/signup/admin" element={<AdminSignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Protected Routes
  return (
    <div className={darkMode ? 'dark' : ''}>
      <Layout
        role={userRole || UserRole.VOLUNTEER}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        currentPath={location.pathname}
        onNavigate={(path) => window.location.hash = path}
      >
        <Routes>
          {userRole === UserRole.ADMIN ? (
            <>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/events" element={<AllEvents />} />
              <Route path="/admin/college-events" element={<CollegeEvents />} />
              <Route path="/admin/create" element={<EventManager />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/insights" element={<AttendeeInsights />} />
              <Route path="/admin/roster" element={<Roster />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
          ) : (
            <>
              <Route path="/volunteer" element={<BrowseEvents />} />
              <Route path="/volunteer/browse" element={<BrowseEvents />} />
              <Route path="/volunteer/recommended" element={<Recommended />} />
              <Route path="/volunteer/schedule" element={<MySchedule />} />
              <Route path="/volunteer/certificates" element={<MyCertificates />} />
              <Route path="/volunteer/stats" element={<Statistics />} />
              <Route path="/volunteer/leaderboard" element={<Leaderboard />} />
              <Route path="/volunteer/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/volunteer" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EventsProvider>
        <Router>
          <AppContent />
        </Router>
      </EventsProvider>
    </AuthProvider>
  );
};

export default App;