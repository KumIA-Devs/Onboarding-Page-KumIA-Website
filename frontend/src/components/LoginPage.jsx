import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignInSignUp from './SignInSignUp';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí iría la lógica de autenticación
    console.log('Login successful, redirecting to onboarding...');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
      <SignInSignUp
        isVisible={true}
        onLogin={handleLogin}
        initialMode="signin"
        language="es"
      />
    </div>
  );
};

export default LoginPage;