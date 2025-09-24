import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Rocket, Star, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage = () => {
  const { currentUser, logout, isNewUser } = useAuth();
  const navigate = useNavigate();

  // This redirection is now handled directly in SignInSignUp based on onboardingComplete
  // No need for useEffect guard here anymore

  console.log('ComingSoonPage rendering - User:', currentUser?.email, 'isNewUser:', isNewUser);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // KumIA logo
  const kumiaLogo = "https://customer-assets.emergentagent.com/job_01c2df2f-712f-43dc-b607-91e2afc70fe8/artifacts/wbisp6gb_Logo_Oficial_Solo_Verde-NoBackground.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(154, 205, 50, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, rgba(154, 205, 50, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 40% 40%, rgba(154, 205, 50, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 30px 30px, 20px 20px'
          }}
        />
      </div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors duration-300 shadow-lg z-10"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <p className="text-[#9ACD32] text-lg font-medium mb-2">
            ¡Hola, {currentUser?.displayName || currentUser?.email}! 👋
          </p>
        </motion.div>

        {/* KumIA Logo with Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              filter: ['drop-shadow(0 0 20px rgba(154, 205, 50, 0.8))', 'drop-shadow(0 0 30px rgba(154, 205, 50, 1))', 'drop-shadow(0 0 20px rgba(154, 205, 50, 0.8))']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <img
              src={kumiaLogo}
              alt="KumIA"
              className="w-20 h-20 md:w-32 md:h-32 object-contain mx-auto"
            />
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl font-black text-white mb-6"
        >
          <span className="bg-gradient-to-r from-[#9ACD32] to-green-400 bg-clip-text text-transparent">
            Dashboard KumIA
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl md:text-4xl font-bold text-white mb-4"
        >
          Próximamente
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Estamos construyendo algo increíble para ti. El futuro de la gestión gastronómica inteligente está llegando.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: <Rocket className="w-8 h-8" />,
              title: "IA Avanzada",
              description: "Análisis inteligente de tu restaurante"
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "Reviews Automáticas",
              description: "Genera 10x más reseñas sin esfuerzo"
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "ROI Inmediato",
              description: "Resultados visibles desde día 1"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-[#9ACD32]/30 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-[#9ACD32] mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="inline-block"
        >
          <div className="bg-gradient-to-r from-[#9ACD32] to-green-600 text-black font-bold px-8 py-3 rounded-full text-lg shadow-lg">
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚧 En Desarrollo 🚧
            </motion.span>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-gray-500 text-sm">
            © 2025 KumIA. El futuro de la gastronomía inteligente.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
