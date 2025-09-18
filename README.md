# KumIA Onboarding Frontend

Esta es una aplicación de frontend desarrollada en React que presenta un sistema de onboarding interactivo para KumIA.

## Características

- **Interfaz de Onboarding Multi-paso**: Sistema de encuesta dividido en 5 secciones principales
- **Multiidioma**: Soporte para Español, Inglés y Portugués
- **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **Componentes UI Modernos**: Utiliza Radix UI y Tailwind CSS
- **Diferentes Tipos de Pregunta**: 
  - Texto libre y áreas de texto
  - Selección múltiple con tarjetas
  - Botones de radio
  - Sliders para rangos numéricos
  - Campos de ubicación (país, estado, ciudad)

## Tecnologías Utilizadas

- **React 19.0.0**: Framework principal
- **React Router Dom**: Navegación
- **Tailwind CSS**: Estilización
- **Radix UI**: Componentes accesibles
- **Lucide React**: Iconografía

## Estructura del Proyecto

```
/app/
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── data/       # Datos mock y configuración
│   │   ├── hooks/      # Hooks personalizados
│   │   └── lib/        # Utilidades
│   └── public/         # Archivos públicos
└── README.md          # Este archivo
```

## Instalación y Desarrollo

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
yarn install
```

3. Iniciar servidor de desarrollo:
```bash
yarn start
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `yarn start`: Inicia el servidor de desarrollo
- `yarn build`: Crea la versión de producción
- `yarn test`: Ejecuta las pruebas

## Configuración

La aplicación utiliza datos mock definidos en `src/data/mock.js` y no requiere conexión a servicios externos.

