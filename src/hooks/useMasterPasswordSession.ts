"use client";

import { useState, useCallback } from 'react';

// Variable global para mantener la master password durante la sesión
let globalMasterPassword: string | null = null;

export function useMasterPasswordSession() {
  const [hasCachedPassword, setHasCachedPassword] = useState(false);

  // Guardar master password en memoria durante la sesión
  const cachePassword = useCallback((password: string) => {
    globalMasterPassword = password;
    setHasCachedPassword(true);
  }, []);

  // Obtener master password desde cache
  const getCachedPassword = useCallback((): string | null => {
    return globalMasterPassword;
  }, []);

  // Limpiar cache (cuando se refresca la página se limpia automáticamente)
  const clearCache = useCallback(() => {
    globalMasterPassword = null;
    setHasCachedPassword(false);
  }, []);

  // Verificar si hay password en cache
  const hasPassword = useCallback((): boolean => {
    return globalMasterPassword !== null && globalMasterPassword.length > 0;
  }, []);

  return {
    cachePassword,
    getCachedPassword,
    clearCache,
    hasPassword: hasPassword(),
    hasCachedPassword
  };
}
