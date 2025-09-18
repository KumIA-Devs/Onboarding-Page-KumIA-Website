import { useState, useCallback } from 'react';

const useFormValidation = (initialValues, requiredFields = []) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    const fieldErrors = {};

    // Required field validation
    if (requiredFields.includes(name) && (!value || value.toString().trim() === '')) {
      fieldErrors[name] = 'Este campo es requerido';
      return fieldErrors;
    }

    // Email validation
    if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        fieldErrors[name] = 'Por favor ingresa un email válido';
      }
    }

    // Password validation
    if (name === 'password' && value) {
      if (value.length < 6) {
        fieldErrors[name] = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    // Confirm password validation
    if (name === 'confirmPassword' && value) {
      if (value !== values.password) {
        fieldErrors[name] = 'Las contraseñas no coinciden';
      }
    }

    // Name validation
    if (name === 'name' && value) {
      if (value.length < 2) {
        fieldErrors[name] = 'El nombre debe tener al menos 2 caracteres';
      }
    }

    return fieldErrors;
  };

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const fieldErrors = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      ...fieldErrors,
      [name]: fieldErrors[name] || undefined
    }));
  }, [values.password, requiredFields]);

  // Validate all fields
  const validateAll = useCallback(() => {
    let allErrors = {};
    
    requiredFields.forEach(field => {
      const fieldErrors = validateField(field, values[field]);
      allErrors = { ...allErrors, ...fieldErrors };
    });

    // Validate confirm password if it exists
    if (values.confirmPassword !== undefined) {
      const confirmErrors = validateField('confirmPassword', values.confirmPassword);
      allErrors = { ...allErrors, ...confirmErrors };
    }

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [values, requiredFields]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      if (validateAll()) {
        onSubmit(values);
      }
    };
  }, [values, validateAll]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && 
    requiredFields.every(field => values[field] && values[field].toString().trim() !== '');

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    isValid,
    validateAll
  };
};

export default useFormValidation;