import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import SiteLayout from '@/components/SiteLayout';
// Add page imports here
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Home from '@/pages/Home';
import Apply from '@/pages/Apply';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminAuth from '@/pages/AdminAuth';
import Explore from '@/pages/Explore';
import VolunteerPortal from '@/pages/VolunteerPortal';
import Community from '@/pages/Community';
import Studio from '@/pages/Studio';
import CreateProject from '@/pages/CreateProject';
import MyImpact from '@/pages/MyImpact';
import StudioProfile from '@/pages/StudioProfile';
import ProjectRoom from '@/pages/ProjectRoom';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/portal" element={<VolunteerPortal />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/volunteer" element={<Apply />} />
        <Route path="/community" element={<Community />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/studio/create" element={<CreateProject />} />
          <Route path="/studio/impact" element={<MyImpact />} />
          <Route path="/studio/profile" element={<StudioProfile />} />
          <Route path="/studio/:id" element={<ProjectRoom />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App