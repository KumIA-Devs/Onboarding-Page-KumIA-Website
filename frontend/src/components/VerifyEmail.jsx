import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { currentUser, resendVerificationEmail, verifyAndContinue, isNewUser, isEmailVerified } = useAuth();
  const [status, setStatus] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  console.log('VerifyEmail - Current state:', {
    email: currentUser?.email,
    emailVerified: currentUser?.emailVerified,
    isEmailVerified,
    isNewUser
  });

  const handleResend = async () => {
    setStatus('Enviando correo...');
    const res = await resendVerificationEmail();
    setStatus(res.message || '');
  };

  const handleVerified = async () => {
    setIsChecking(true);
    setStatus('Verificando estado del correo...');
    
    try {
      const verified = await verifyAndContinue();
      console.log('Verification result:', verified);
      
      if (verified) {
        setStatus('¡Email verificado correctamente! Redirigiendo...');
        
        // Small delay to show success message
        setTimeout(() => {
          if (isNewUser) {
            console.log('Navigating to onboarding - new user detected');
            navigate('/onboarding', { replace: true });
          } else {
            console.log('Navigating to coming-soon - existing user');
            navigate('/coming-soon', { replace: true });
          }
        }, 1000);
      } else {
        setStatus('El correo aún no aparece como verificado. Revisa tu bandeja de entrada y spam, haz clic en el enlace de verificación, y vuelve a intentar.');
      }
    } catch (error) {
      console.error('Error in handleVerified:', error);
      setStatus('Error al verificar el correo. Inténtalo de nuevo.');
    }
    
    setIsChecking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white/10 border border-white/20 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Verifica tu correo</h1>
        <p className="text-white/80 mb-4">
          Hemos enviado un correo de verificación a:{' '}
          <span className="font-semibold">{currentUser?.email}</span>
        </p>
        <p className="text-white/70 mb-6">
          Por favor, abre el enlace de verificación en tu correo. Luego vuelve aquí y haz clic en "Ya verifiqué".
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={handleResend} 
            disabled={isChecking}
            className="bg-[#9ACD32] hover:bg-green-600 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Reenviar correo
          </button>
          <button 
            onClick={handleVerified}
            disabled={isChecking}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isChecking && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            Ya verifiqué
          </button>
        </div>
        
        {status && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-white/90">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;