import { useEffect, useState, useRef, useCallback } from 'react';

const useImagePreloader = (imageUrls, shouldPreload = true) => {
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [isPreloading, setIsPreloading] = useState(false);
  const timeoutRef = useRef(null);
  const preloadIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const pauseTimeoutRef = useRef(null);

  useEffect(() => {
    if (!shouldPreload || !imageUrls?.length) return;

    // Cleanup previous timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    const newPreloadedImages = new Set();

    // Detector de actividad de escritura para pausar precarga
    const handleUserActivity = () => {
      isPausedRef.current = true;

      // Clear existing pause timeout
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      // Resume after 2 seconds of inactivity
      pauseTimeoutRef.current = setTimeout(() => {
        isPausedRef.current = false;
      }, 2000);
    };

    // Agregar listeners para detectar escritura
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('input', handleUserActivity);

    // Función para precargar imágenes de forma no bloqueante
    const preloadNextImage = () => {
      // Si está pausado, reintentar en 500ms
      if (isPausedRef.current) {
        timeoutRef.current = setTimeout(preloadNextImage, 500);
        return;
      }

      const currentIndex = preloadIndexRef.current;

      if (currentIndex >= imageUrls.length) {
        setPreloadedImages(newPreloadedImages);
        setIsPreloading(false);
        console.log(`✅ Preloaded ${newPreloadedImages.size} specialty images silently`);
        // Cleanup listeners
        document.removeEventListener('keydown', handleUserActivity);
        document.removeEventListener('input', handleUserActivity);
        return;
      }

      const url = imageUrls[currentIndex];
      const img = new Image();

      img.onload = img.onerror = () => {
        if (img.complete) {
          newPreloadedImages.add(url);
        }

        preloadIndexRef.current += 1;

        // Usar requestIdleCallback si está disponible, sino setTimeout
        const scheduleNext = () => {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(preloadNextImage, { timeout: 200 });
          } else {
            timeoutRef.current = setTimeout(preloadNextImage, 100); // Delay más conservador
          }
        };

        scheduleNext();
      };

      img.src = url;
    };

    // Iniciar precarga con delay inicial más largo para evitar interferir
    setIsPreloading(true);
    preloadIndexRef.current = 0;

    timeoutRef.current = setTimeout(() => {
      preloadNextImage();
    }, 2000); // Delay inicial de 2 segundos

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('input', handleUserActivity);
    };
  }, [imageUrls, shouldPreload]);

  return {
    preloadedImages,
    isPreloading: false, // Siempre false para UI
    preloadProgress: 0, // No usado más
    isImagePreloaded: (url) => preloadedImages.has(url)
  };
};

// Hook específico para imágenes de especialidades
export const useSpecialtyImagesPreloader = (currentQuestion, questions) => {
  // Buscar la pregunta de especialidades de comida
  const specialtyQuestion = questions.find(q => q.id === 'food_specialty');
  const specialtyImageUrls = specialtyQuestion?.options
    ?.filter(opt => opt.image)
    ?.map(opt => opt.image) || [];

  // Precargar cuando estemos en las primeras 2 preguntas (antes de llegar a especialidades)
  const shouldPreload = currentQuestion <= 1 && specialtyImageUrls.length > 0;

  return useImagePreloader(specialtyImageUrls, shouldPreload);
};

export default useImagePreloader;
