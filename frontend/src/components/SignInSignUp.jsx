import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Eye, EyeOff
} from 'lucide-react';
import useFormValidation from '../hooks/useFormValidation';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInSignUp = memo(({ isVisible, initialMode = 'signin', language = 'es' }) => {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Firebase Auth
  const { signIn, signUp, signInWithGoogle, error, clearError, isNewUser } = useAuth();

  // Clear validation errors when mode changes
  const switchMode = (newMode) => {
    setMode(newMode);
    setValidationErrors({});
    clearError();
  };

  // Form validation hook with security
  const {
    values: formData,
    errors,
    handleChange,
    handleSubmit,
    reset,
    isValid
  } = useFormValidation(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode === 'signup' ? ['email', 'password', 'name'] : ['email', 'password']
  );

  // Handle form submission with Firebase
  const onFormSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (isLoading) return;

    try {
      // Reset validation errors
      setValidationErrors({});
      clearError();
      setIsLoading(true);

      // Get form data directly
      const data = formData;

      // Check for required fields
      const newErrors = {};
      if (!data.email?.trim()) {
        newErrors.email = 'El email es requerido';
      }
      if (!data.password?.trim()) {
        newErrors.password = 'La contraseña es requerida';
      }
      if (mode === 'signup') {
        if (!data.name?.trim()) {
          newErrors.name = 'El nombre es requerido';
        }
        if (!data.confirmPassword?.trim()) {
          newErrors.confirmPassword = 'Confirmar contraseña es requerido';
        }
        if (data.password !== data.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }

      // If there are validation errors, show them and return
      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        setIsLoading(false);
        return;
      }

      let result;

      // Firebase Authentication
      if (mode === 'signup') {
        result = await signUp(data.email, data.password, data.name);
      } else {
        result = await signIn(data.email, data.password);
      }

      if (result.success) {
        // Navigate based on new/existing user WITHOUT flicker
        if (mode === 'signup' || isNewUser) {
          try { sessionStorage.setItem('kumia_new_user', '1'); } catch { }
          navigate('/onboarding', { replace: true, state: { newUser: true } });
        } else {
          try { sessionStorage.removeItem('kumia_new_user'); } catch { }
          navigate('/coming-soon', { replace: true });
        }

        // Reset form
        reset();
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLoading(false);
    }
  }, [formData, reset, mode, signIn, signUp, clearError, isLoading, isNewUser, navigate]);

  const content = {
    es: {
      signin: {
        title: "¡Bienvenido de vuelta!",
        subtitle: "Tu ecosistema KumIA te espera",
        submitText: "Acceder a mi Dashboard",
        switchText: "¿No tienes cuenta?",
        switchAction: "Crear cuenta",
        googleText: "Continuar con Google"
      },
      signup: {
        title: "🚀 ¡Bienvenido a la Evolución!",
        subtitle: "KumIA: El Ecosistema inteligente que Conecta Tu Mundo",
        submitText: "¡Iniciar Mi Transformación!",
        switchText: "¿Ya tienes cuenta?",
        switchAction: "Iniciar sesión",
        googleText: "Continuar con Google",
        epicTitle: "LA CONEXIÓN PERFECTA",
        epicSubtitle: "KumIA crea el vínculo mágico entre tus clientes y tu restaurante",
        client: "Cliente",
        clientStatus: "Hambriento",
        restaurant: "Restaurant",
        restaurantStatus: "Exitoso",
        connectionText: "🌟 KumIA es el puente inteligente",
        connectionSubtext: "Que conecta la experiencia perfecta entre tus clientes y tu restaurante"
      }
    },
    en: {
      signin: {
        title: "Welcome back!",
        subtitle: "Your KumIA ecosystem awaits",
        submitText: "Access my Dashboard",
        switchText: "Don't have an account?",
        switchAction: "Create account",
        googleText: "Continue with Google"
      },
      signup: {
        title: "🚀 Welcome to Evolution!",
        subtitle: "KumIA: The Intelligent Ecosystem that Connects Your World",
        submitText: "Start My Transformation!",
        switchText: "Already have an account?",
        switchAction: "Sign in",
        googleText: "Continue with Google",
        epicTitle: "THE PERFECT CONNECTION",
        epicSubtitle: "KumIA creates the magical link between your customers and your restaurant",
        client: "Client",
        clientStatus: "Hungry",
        restaurant: "Restaurant",
        restaurantStatus: "Successful",
        connectionText: "🌟 KumIA is the intelligent bridge",
        connectionSubtext: "That connects the perfect experience between your customers and your restaurant"
      }
    },
    pt: {
      signin: {
        title: "Bem-vindo de volta!",
        subtitle: "Seu ecossistema KumIA te espera",
        submitText: "Acessar meu Dashboard",
        switchText: "Não tem conta?",
        switchAction: "Criar conta",
        googleText: "Continuar com Google"
      },
      signup: {
        title: "🚀 Bem-vindo à Evolução!",
        subtitle: "KumIA: O Ecossistema inteligente que Conecta Seu Mundo",
        submitText: "Iniciar Minha Transformação!",
        switchText: "Já tem conta?",
        switchAction: "Entrar",
        googleText: "Continuar com Google",
        epicTitle: "A CONEXÃO PERFEITA",
        epicSubtitle: "KumIA cria o vínculo mágico entre seus clientes e seu restaurante",
        client: "Cliente",
        clientStatus: "Com Fome",
        restaurant: "Restaurante",
        restaurantStatus: "Bem-sucedido",
        connectionText: "🌟 KumIA é a ponte inteligente",
        connectionSubtext: "Que conecta a experiência perfeita entre seus clientes e seu restaurante"
      }
    }
  };

  const benefits = {
    es: [
      {
        icon: <span className="text-2xl">⭐</span>,
        title: "Reviews Automáticas",
        description: "Genera 10x más reseñas sin esfuerzo"
      },
      {
        icon: <span className="text-2xl">🤖</span>,
        title: "IA Conversacional",
        description: "Clientes interactúan como con humanos"
      },
      {
        icon: <span className="text-2xl">💰</span>,
        title: "ROI Inmediato",
        description: "Resultados visibles desde día 1"
      },
      {
        icon: <span className="text-2xl">🔒</span>,
        title: "Seguridad Total",
        description: "Datos protegidos nivel bancario"
      }
    ],
    en: [
      {
        icon: <span className="text-2xl">⭐</span>,
        title: "Automatic Reviews",
        description: "Generate 10x more reviews effortlessly"
      },
      {
        icon: <span className="text-2xl">🤖</span>,
        title: "Conversational AI",
        description: "Customers interact like with humans"
      },
      {
        icon: <span className="text-2xl">💰</span>,
        title: "Immediate ROI",
        description: "Visible results from day 1"
      },
      {
        icon: <span className="text-2xl">🔒</span>,
        title: "Total Security",
        description: "Bank-level data protection"
      }
    ],
    pt: [
      {
        icon: <span className="text-2xl">⭐</span>,
        title: "Avaliações Automáticas",
        description: "Gera 10x mais avaliações sem esforço"
      },
      {
        icon: <span className="text-2xl">🤖</span>,
        title: "IA Conversacional",
        description: "Clientes interagem como com humanos"
      },
      {
        icon: <span className="text-2xl">💰</span>,
        title: "ROI Imediato",
        description: "Resultados visíveis desde o dia 1"
      },
      {
        icon: <span className="text-2xl">🔒</span>,
        title: "Segurança Total",
        description: "Dados protegidos nível bancário"
      }
    ]
  };

  const handleGoogleAuth = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      clearError();

      const result = await signInWithGoogle();

      if (result?.success) {
        // Redirect based on whether new google user or existing
        if (result.isNewUser) {
          try { sessionStorage.setItem('kumia_new_user', '1'); } catch { }
          navigate('/onboarding', { replace: true, state: { newUser: true } });
        } else {
          try { sessionStorage.removeItem('kumia_new_user'); } catch { }
          navigate('/coming-soon', { replace: true });
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Google authentication error:', error);
      setIsLoading(false);
    }
  }, [signInWithGoogle, clearError, isLoading, navigate]);

  // Usar logo existente como placeholder
  const kumiaLogo = "https://customer-assets.emergentagent.com/job_01c2df2f-712f-43dc-b607-91e2afc70fe8/artifacts/wbisp6gb_Logo_Oficial_Solo_Verde-NoBackground.png";

  if (!isVisible) return null;

  // SignIn Page (for existing customers)
  const renderSignInPage = () => (
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full mx-4 max-w-5xl max-h-[90vh] overflow-y-auto hide-scrollbar"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Side - Fixed Logo and Connection */}
        <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 2px, transparent 2px),
                               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 2px, transparent 2px)`,
              backgroundSize: '30px 30px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Centered KumIA Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              <img
                src={kumiaLogo}
                alt="KumIA"
                className="w-16 h-16 mb-3 object-contain"
              />
              <div>
                <h1 className="text-3xl font-black text-white">KumIA</h1>
                <p className="text-white/90 font-semibold text-base">Evolución Gastronómica</p>
              </div>
            </div>

            <div className="mb-6 lg:mb-8">
              <div className="bg-white/5 rounded-2xl p-4 lg:p-8 backdrop-blur-sm border border-[#9ACD32]/30">
                <div className="flex flex-col sm:flex-row items-center justify-center mb-4 lg:mb-6 space-y-4 sm:space-y-0">
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#9ACD32]/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl lg:text-3xl">👨‍💼</span>
                    </div>
                    <p className="text-white font-semibold text-xs lg:text-sm">Cliente</p>
                  </div>

                  {/* Connection Lines */}
                  <div className="flex-1 flex items-center justify-center mx-2 sm:mx-6">
                    <div className="relative flex items-center justify-center w-full">
                      {/* Left connection line */}
                      <motion.div
                        className="w-8 h-1 sm:w-12 sm:h-1 bg-gradient-to-r from-transparent to-[#9ACD32]"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Replace Red Heart with KumIA Logo for SignIn */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 3, -3, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="mx-2 sm:mx-3"
                      >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center drop-shadow-lg">
                          <img
                            src={kumiaLogo}
                            alt="KumIA"
                            className="w-full h-full object-contain"
                            style={{
                              filter: 'drop-shadow(0 0 8px rgba(154, 205, 50, 1))'
                            }}
                          />
                        </div>
                      </motion.div>

                      {/* Right connection line */}
                      <motion.div
                        className="w-8 h-1 sm:w-12 sm:h-1 bg-gradient-to-l from-transparent to-[#9ACD32]"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#9ACD32]/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl lg:text-3xl">🍽️</span>
                    </div>
                    <p className="text-white font-semibold text-xs lg:text-sm">Restaurant</p>
                  </div>
                </div>
                <p className="text-center text-white/80 text-xs lg:text-sm">
                  Conexión perfecta a través de KumIA
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits[language].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  {benefit.icon}
                  <div>
                    <h3 className="text-white font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-white/70 text-xs">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-white">

          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                {content[language]?.signin.title}
              </h2>
              <p className="text-gray-600">
                {content[language]?.signin.subtitle}
              </p>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-xl p-4 mb-6 hover:border-[#9ACD32] transition-colors group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium text-gray-700 group-hover:text-[#9ACD32]">
                {content[language]?.signin.googleText}
              </span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o continúa con email</span>
              </div>
            </div>

            <form onSubmit={onFormSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 bg-white ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 bg-white ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>

              {/* Firebase Error Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-[#9ACD32] to-green-600 text-white font-bold py-4 rounded-xl hover:from-green-500 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  content[language]?.signin.submitText
                )}
              </motion.button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                {content[language]?.signin.switchText}{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-[#9ACD32] font-semibold hover:underline"
                >
                  {content[language]?.signin.switchAction}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // SignUp Page (EPIC for new customers)
  const renderSignUpPage = () => (
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full mx-4 max-w-6xl max-h-[90vh] overflow-y-auto hide-scrollbar"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col lg:flex-row min-h-[700px]">
        {/* Left Side - EPIC Connection Visualization */}
        <div className="lg:w-3/5 bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 lg:p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
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
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Epic Title */}
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-black text-white mb-4"
              >
                🚀 ¡Bienvenido a la Evolución!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[#9ACD32] text-lg font-semibold"
              >
                KumIA: El Ecosistema inteligente que Conecta Tu Mundo
              </motion.p>
            </div>

            {/* Epic Connection Visual */}
            <div className="mb-8 lg:mb-12">
              <div className="bg-white/5 rounded-3xl p-6 lg:p-12 backdrop-blur-sm border border-[#9ACD32]/40">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0">
                  {/* Cliente */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-2xl">
                      <span className="text-2xl lg:text-4xl">👨‍💼</span>
                    </div>
                    <p className="text-white font-bold text-base lg:text-lg">{content[language].signup.client}</p>
                    <p className="text-white/70 text-xs lg:text-sm">{content[language].signup.clientStatus}</p>
                  </motion.div>

                  {/* Epic Connection Flow */}
                  <div className="flex-1 flex items-center justify-center mx-4 sm:mx-8">
                    <div className="relative flex flex-col sm:flex-row items-center justify-center w-full space-y-4 sm:space-y-0">
                      {/* Top/Left flowing line */}
                      <motion.div
                        className="w-2 h-12 sm:w-20 sm:h-2 bg-gradient-to-b sm:bg-gradient-to-r from-blue-500 to-[#9ACD32] rounded-full"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scaleY: [0.8, 1.2, 0.8],
                          scaleX: [0.8, 1.2, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* KumIA Logo - Center */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mx-2 sm:mx-6 relative"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            filter: ['drop-shadow(0 0 10px rgba(154, 205, 50, 0.8))', 'drop-shadow(0 0 20px rgba(154, 205, 50, 1))', 'drop-shadow(0 0 10px rgba(154, 205, 50, 0.8))']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center"
                        >
                          <img
                            src={kumiaLogo}
                            alt="KumIA"
                            className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
                            style={{
                              filter: 'drop-shadow(0 0 12px rgba(154, 205, 50, 1))'
                            }}
                          />
                        </motion.div>

                        {/* Animated ring around logo */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-2 border-[#9ACD32] rounded-full opacity-50"
                        />
                      </motion.div>

                      {/* Bottom/Right flowing line */}
                      <motion.div
                        className="w-2 h-12 sm:w-20 sm:h-2 bg-gradient-to-b sm:bg-gradient-to-r from-[#9ACD32] to-orange-500 rounded-full"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scaleY: [0.8, 1.2, 0.8],
                          scaleX: [0.8, 1.2, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </div>

                  {/* Restaurant */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-2xl">
                      <span className="text-2xl lg:text-4xl">🍽️</span>
                    </div>
                    <p className="text-white font-bold text-base lg:text-lg">{content[language].signup.restaurant}</p>
                    <p className="text-white/70 text-xs lg:text-sm">{content[language].signup.restaurantStatus}</p>
                  </motion.div>
                </div>

                {/* Connection Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-center mt-8"
                >
                  <p className="text-white/90 text-lg font-semibold mb-2">
                    {content[language].signup.connectionText}
                  </p>
                  <p className="text-white/70 text-sm">
                    {content[language].signup.connectionSubtext}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Magic Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: "🚀", title: "Evolución", desc: "Inmediata" },
                { icon: "💎", title: "ROI", desc: "Garantizado" },
                { icon: "🎯", title: "Éxito", desc: "Comprobado" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="lg:w-2/5 p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">

          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                {content[language]?.signup.title}
              </h2>
              <p className="text-gray-600">
                {content[language]?.signup.subtitle}
              </p>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-xl p-4 mb-6 hover:border-[#9ACD32] transition-colors group shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium text-gray-700 group-hover:text-[#9ACD32]">
                {content[language]?.signup.googleText}
              </span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o continúa con email</span>
              </div>
            </div>

            <form onSubmit={onFormSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 bg-white ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 bg-white ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 bg-white ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 bg-white ${validationErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Firebase Error Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-[#9ACD32] to-green-600 text-white font-bold py-4 rounded-xl hover:from-green-500 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  content[language]?.signup.submitText
                )}
              </motion.button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                {content[language]?.signup.switchText}{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-[#9ACD32] font-semibold hover:underline"
                >
                  {content[language]?.signup.switchAction}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          {mode === 'signin' ? renderSignInPage() : renderSignUpPage()}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SignInSignUp.displayName = 'SignInSignUp';

SignInSignUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  initialMode: PropTypes.oneOf(['signin', 'signup']),
  language: PropTypes.oneOf(['es', 'en', 'pt'])
};

export default SignInSignUp;