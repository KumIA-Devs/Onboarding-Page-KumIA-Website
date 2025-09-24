import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder = true,
  lazy = true,
  onLoad = () => { },
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(!lazy);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || isIntersecting) return;

    // Usar requestIdleCallback para configurar el observer sin bloquear
    const setupObserver = () => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px', // Comenzar a cargar 50px antes de ser visible
          threshold: 0.1
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    };

    if (window.requestIdleCallback) {
      const idleId = window.requestIdleCallback(setupObserver, { timeout: 100 });
      return () => window.cancelIdleCallback(idleId);
    } else {
      return setupObserver();
    }
  }, [lazy, isIntersecting]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setError(true);
  };

  // Placeholder component
  const Placeholder = () => (
    <div
      className={`bg-gradient-to-br from-gray-600 to-gray-700 animate-pulse flex items-center justify-center ${className}`}
      style={{ minHeight: '96px' }} // h-24 = 96px
    >
      {placeholder && (
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      )}
    </div>
  );

  return (
    <div ref={imgRef} className="relative">
      {error ? (
        <Placeholder />
      ) : (
        <>
          {!isLoaded && <Placeholder />}
          {isIntersecting && (
            <img
              src={src}
              alt={alt}
              className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'} transition-opacity duration-300`}
              onLoad={handleLoad}
              onError={handleError}
              loading={lazy ? 'lazy' : 'eager'}
              {...props}
            />
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedImage;
