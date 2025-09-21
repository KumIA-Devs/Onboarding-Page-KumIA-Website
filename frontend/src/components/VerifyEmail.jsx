import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { currentUser, resendVerificationEmail, verifyAndContinue, isNewUser } = useAuth();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleResend = async () => {
    const res = await resendVerificationEmail();
    setStatus(res.message || '');
  };

  const handleVerified = async () => {
    const verified = await verifyAndContinue();
    if (verified) {
      if (isNewUser) navigate('/onboarding', { replace: true, state: { newUser: true } });
      else navigate('/coming-soon', { replace: true });
    } else {
      setStatus('Aún no aparece como verificado. Revisa tu correo y vuelve a intentar.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white/10 border border-white/20 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Verifica tu correo</h1>
        <p className="text-white/80 mb-4">Hemos enviado un correo de verificación a: <span className="font-semibold">{currentUser?.email}</span></p>
        <p className="text-white/70 mb-6">Por favor, abre el enlace de verificación. Luego vuelve y continúa.</p>
        <div className="flex gap-3">
          <button onClick={handleResend} className="bg-[#9ACD32] hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg">Reenviar correo</button>
          <button onClick={handleVerified} className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg">Ya verifiqué</button>
        </div>
        {status && <p className="mt-4 text-sm text-white/80">{status}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
