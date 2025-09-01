export const onboardingData = {
  translations: {
    es: {
      slogan: "El primer ecosistema gastronómico AI del mundo",
      onboardingProgress: "Progreso del Onboarding",
      question: "Pregunta",
      of: "de",
      previous: "Anterior",
      continue: "Continuar",
      finish: "Finalizar",
      steps: {
        basics: "Información Básica",
        basicsDesc: "Nombre, eslogan y especialidad",
        operations: "Operaciones",
        operationsDesc: "Personal, capacidad y volumen",
        feedback: "Reviews y Feedback",
        feedbackDesc: "Plataformas de evaluación",
        experience: "Experiencia del Cliente",
        experienceDesc: "Fidelización y entretenimiento",
        goals: "Objetivos y Menú",
        goalsDesc: "Metas y formato de carta"
      }
    },
    en: {
      slogan: "The world's first AI gastronomic ecosystem",
      onboardingProgress: "Onboarding Progress",
      question: "Question",
      of: "of",
      previous: "Previous",
      continue: "Continue",
      finish: "Finish",
      steps: {
        basics: "Basic Information",
        basicsDesc: "Name, slogan and specialty",
        operations: "Operations",
        operationsDesc: "Staff, capacity and volume",
        feedback: "Reviews & Feedback",
        feedbackDesc: "Review platforms",
        experience: "Customer Experience",
        experienceDesc: "Loyalty and entertainment",
        goals: "Goals & Menu",
        goalsDesc: "Objectives and menu format"
      }
    },
    pt: {
      slogan: "O primeiro ecossistema gastronômico de IA do mundo",
      onboardingProgress: "Progresso do Onboarding",
      question: "Pergunta",
      of: "de",
      previous: "Anterior",
      continue: "Continuar",
      finish: "Finalizar",
      steps: {
        basics: "Informações Básicas",
        basicsDesc: "Nome, slogan e especialidade",
        operations: "Operações",
        operationsDesc: "Pessoal, capacidade e volume",
        feedback: "Avaliações e Feedback",
        feedbackDesc: "Plataformas de avaliação",
        experience: "Experiência do Cliente",
        experienceDesc: "Fidelização e entretenimento",
        goals: "Objetivos e Menu",
        goalsDesc: "Metas e formato do cardápio"
      }
    }
  },
  questions: [
    // Información Básica (Questions 1-3)
    {
      id: 'restaurant_name',
      type: 'text',
      text: {
        es: '¿Cuál es el nombre de tu restaurante?',
        en: 'What is the name of your restaurant?',
        pt: 'Qual é o nome do seu restaurante?'
      },
      placeholder: {
        es: 'Nombre del restaurante',
        en: 'Restaurant name',
        pt: 'Nome do restaurante'
      }
    },
    {
      id: 'restaurant_slogan',
      type: 'textarea',
      optional: true,
      text: {
        es: '¿Tienes un eslogan para tu restaurante? (opcional)',
        en: 'Do you have a slogan for your restaurant? (optional)',
        pt: 'Você tem um slogan para seu restaurante? (opcional)'
      },
      placeholder: {
        es: 'Eslogan del restaurante',
        en: 'Restaurant slogan',
        pt: 'Slogan do restaurante'
      }
    },
    {
      id: 'food_specialty',
      type: 'checkbox',
      text: {
        es: '¿En qué tipo de comida/bebida sois especialistas?',
        en: 'What type of food/drinks do you specialize in?',
        pt: 'Em que tipo de comida/bebida vocês são especialistas?'
      },
      options: [
        {
          value: 'sushi',
          label: { es: 'Sushi', en: 'Sushi', pt: 'Sushi' },
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop'
        },
        {
          value: 'sandwiches',
          label: { es: 'Sándwiches', en: 'Sandwiches', pt: 'Sanduíches' },
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop'
        },
        {
          value: 'pizza',
          label: { es: 'Pizzas', en: 'Pizza', pt: 'Pizza' },
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop'
        },
        {
          value: 'desserts',
          label: { es: 'Postres', en: 'Desserts', pt: 'Sobremesas' },
          image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop'
        },
        {
          value: 'fusion',
          label: { es: 'Fusión', en: 'Fusion', pt: 'Fusão' },
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&h=100&fit=crop'
        },
        {
          value: 'homemade',
          label: { es: 'Casera', en: 'Homemade', pt: 'Caseira' },
          image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=100&h=100&fit=crop'
        },
        {
          value: 'seafood',
          label: { es: 'Pescado', en: 'Seafood', pt: 'Frutos do mar' },
          image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop'
        },
        {
          value: 'meat',
          label: { es: 'Carnes', en: 'Meat', pt: 'Carnes' },
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&h=100&fit=crop'
        }
      ]
    },
    // Operaciones (Questions 4-7)
    {
      id: 'has_staff',
      type: 'radio',
      text: {
        es: '¿Cuentas con colaboradores/mesoneros/garzones?',
        en: 'Do you have staff/waiters/servers?',
        pt: 'Você tem funcionários/garçons/atendentes?'
      },
      options: [
        { value: 'yes', label: { es: 'Sí', en: 'Yes', pt: 'Sim' } },
        { value: 'no', label: { es: 'No', en: 'No', pt: 'Não' } }
      ]
    },
    {
      id: 'staff_count',
      type: 'number',
      text: {
        es: '¿Cuántos empleados tienes?',
        en: 'How many employees do you have?',
        pt: 'Quantos funcionários você tem?'
      }
    },
    {
      id: 'has_bar',
      type: 'radio',
      text: {
        es: '¿Cuentas con barra de líquidos (Bar/Café)?',
        en: 'Do you have a beverage bar (Bar/Café)?',
        pt: 'Você tem um bar de bebidas (Bar/Café)?'
      },
      options: [
        { value: 'yes', label: { es: 'Sí', en: 'Yes', pt: 'Sim' } },
        { value: 'no', label: { es: 'No', en: 'No', pt: 'Não' } }
      ]
    },
    {
      id: 'max_capacity',
      type: 'number',
      text: {
        es: '¿Cuál es tu capacidad máxima de clientes?',
        en: 'What is your maximum customer capacity?',
        pt: 'Qual é sua capacidade máxima de clientes?'
      }
    },
    // Reviews y Feedback (Question 8)
    {
      id: 'review_platforms',
      type: 'checkbox',
      text: {
        es: '¿Qué plataforma utilizas para recolectar reviews de tus clientes?',
        en: 'What platform do you use to collect customer reviews?',
        pt: 'Que plataforma você usa para coletar avaliações dos clientes?'
      },
      options: [
        { value: 'google', label: { es: 'Google Reviews', en: 'Google Reviews', pt: 'Google Reviews' } },
        { value: 'tripadvisor', label: { es: 'TripAdvisor', en: 'TripAdvisor', pt: 'TripAdvisor' } },
        { value: 'trustpilot', label: { es: 'Trustpilot', en: 'Trustpilot', pt: 'Trustpilot' } },
        { value: 'facebook', label: { es: 'Facebook', en: 'Facebook', pt: 'Facebook' } },
        { value: 'other', label: { es: 'Otro', en: 'Other', pt: 'Outro' } }
      ]
    },
    // Experiencia del Cliente (Questions 9-11)
    {
      id: 'loyalty_system',
      type: 'radio',
      text: {
        es: '¿Tienes un sistema de fidelización implementado?',
        en: 'Do you have a loyalty system implemented?',
        pt: 'Você tem um sistema de fidelização implementado?'
      },
      options: [
        { value: 'yes', label: { es: 'Sí', en: 'Yes', pt: 'Sim' } },
        { value: 'no', label: { es: 'No', en: 'No', pt: 'Não' } }
      ]
    },
    {
      id: 'reward_system',
      type: 'radio',
      text: {
        es: '¿Cuentas con un sistema de recompensas para tus clientes?',
        en: 'Do you have a reward system for your customers?',
        pt: 'Você tem um sistema de recompensas para seus clientes?'
      },
      options: [
        { value: 'yes', label: { es: 'Sí', en: 'Yes', pt: 'Sim' } },
        { value: 'no', label: { es: 'No', en: 'No', pt: 'Não' } }
      ]
    },
    {
      id: 'entertainment',
      type: 'checkbox',
      text: {
        es: 'Mientras tus clientes esperan su comida, ¿cómo mejoras su experiencia?',
        en: 'While your customers wait for their food, how do you improve their experience?',
        pt: 'Enquanto seus clientes esperam pela comida, como você melhora a experiência deles?'
      },
      options: [
        { value: 'tv', label: { es: 'TV en tienda', en: 'In-store TV', pt: 'TV na loja' } },
        { value: 'games', label: { es: 'Juegos de mesa', en: 'Board games', pt: 'Jogos de mesa' } },
        { value: 'live_music', label: { es: 'Música en vivo', en: 'Live music', pt: 'Música ao vivo' } },
        { value: 'dances', label: { es: 'Bailes tradicionales', en: 'Traditional dances', pt: 'Danças tradicionais' } },
        { value: 'game_app', label: { es: 'App con juegos', en: 'Gaming app', pt: 'App com jogos' } },
        { value: 'none', label: { es: 'Sin entretenimiento', en: 'No entertainment', pt: 'Sem entretenimento' } }
      ]
    },
    // Objetivos y Menú (Questions 12-15)
    {
      id: 'menu_format',
      type: 'checkbox',
      text: {
        es: '¿Qué formato de carta utilizas?',
        en: 'What menu format do you use?',
        pt: 'Que formato de cardápio você usa?'
      },
      options: [
        { value: 'pdf', label: { es: 'Carta digital (PDF)', en: 'Digital menu (PDF)', pt: 'Cardápio digital (PDF)' } },
        { value: 'printed', label: { es: 'Menú impreso', en: 'Printed menu', pt: 'Cardápio impresso' } },
        { value: 'digital_orders', label: { es: 'Menú digital (pedidos directos)', en: 'Digital menu (direct orders)', pt: 'Cardápio digital (pedidos diretos)' } }
      ]
    },
    {
      id: 'average_ticket',
      type: 'slider',
      min: 5,
      max: 500,
      step: 5,
      text: {
        es: '¿De cuánto es tu ticket promedio?',
        en: 'What is your average ticket amount?',
        pt: 'Qual é o valor médio do seu ticket?'
      }
    },
    {
      id: 'daily_orders',
      type: 'number',
      text: {
        es: '¿Cuánto es tu volumen promedio de órdenes al día?',
        en: 'What is your average daily order volume?',
        pt: 'Qual é seu volume médio de pedidos por dia?'
      }
    },
    {
      id: 'business_goals',
      type: 'checkbox',
      text: {
        es: '¿Cuál es tu meta principal?',
        en: 'What is your main goal?',
        pt: 'Qual é seu objetivo principal?'
      },
      options: [
        { value: 'increase_ticket', label: { es: 'Elevar ticket promedio', en: 'Increase average ticket', pt: 'Aumentar ticket médio' } },
        { value: 'loyalty', label: { es: 'Fidelizar clientes', en: 'Build customer loyalty', pt: 'Fidelizar clientes' } },
        { value: 'reviews', label: { es: 'Obtener más reviews', en: 'Get more reviews', pt: 'Obter mais avaliações' } },
        { value: 'capacity', label: { es: 'Operar a capacidad máxima', en: 'Operate at maximum capacity', pt: 'Operar na capacidade máxima' } },
        { value: 'expand', label: { es: 'Abrir otra sucursal', en: 'Open another location', pt: 'Abrir outra filial' } },
        { value: 'enlarge', label: { es: 'Ampliar el restaurant', en: 'Expand the restaurant', pt: 'Ampliar o restaurante' } },
        { value: 'other', label: { es: 'Otro', en: 'Other', pt: 'Outro' } }
      ]
    }
  ]
};