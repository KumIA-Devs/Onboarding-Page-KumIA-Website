import React from 'react';
import SignInSignUp from './SignInSignUp';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
      <SignInSignUp
        isVisible={true}
        initialMode="signup"
        language="es"
      />
    </div>
  );
};

export default RegisterPage;
