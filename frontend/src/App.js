import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PublicRoute, ProtectedRoute, OnboardingRoute, DashboardRoute } from "./components/RouteGuard";

// Pages
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import OnboardingPage from "./components/OnboardingPage";
import ComingSoonPage from "./components/ComingSoonPage";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public routes - redirect if authenticated */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            
            {/* Protected routes - require authentication */}
            <Route
              path="/verify-email"
              element={
                <ProtectedRoute>
                  <VerifyEmail />
                </ProtectedRoute>
              }
            />
            
            {/* Onboarding - require auth + verified email */}
            <Route
              path="/onboarding"
              element={
                <OnboardingRoute>
                  <OnboardingPage />
                </OnboardingRoute>
              }
            />
            
            {/* Dashboard routes - require completed onboarding */}
            <Route
              path="/coming-soon"
              element={
                <DashboardRoute>
                  <ComingSoonPage />
                </DashboardRoute>
              }
            />
            <Route
              path="/dashboard"
              element={<Navigate to="/coming-soon" replace />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;