import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import NewUserRoute from "./components/NewUserRoute";
import LoginPage from "./components/LoginPage";
import OnboardingPage from "./components/OnboardingPage";
import ComingSoonPage from "./components/ComingSoonPage";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/onboarding"
              element={
                <NewUserRoute>
                  <OnboardingPage />
                </NewUserRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <ProtectedRoute>
                  <VerifyEmail />
                </ProtectedRoute>
              }
            />
            {/* Ruta específica para Coming Soon: requiere verificación */}
            <Route
              path="/coming-soon"
              element={
                <ProtectedRoute requireVerified>
                  <ComingSoonPage />
                </ProtectedRoute>
              }
            />
            {/* Dashboard futuro - por ahora redirige a coming-soon */}
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