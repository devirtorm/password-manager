import { useState, useEffect } from 'react';
import { masterPasswordCache } from '@/utils/master-password-session';

export function useMasterPasswordSession() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Initial state
    setIsUnlocked(masterPasswordCache.isUnlocked());
    setRemainingTime(masterPasswordCache.getRemainingTime());

    // Listen for vault lock events
    const handleVaultLocked = () => {
      setIsUnlocked(false);
      setRemainingTime(0);
    };

    // Update remaining time every minute
    const interval = setInterval(() => {
      const remaining = masterPasswordCache.getRemainingTime();
      setRemainingTime(remaining);
      
      if (remaining === 0) {
        setIsUnlocked(false);
      }
    }, 60000); // Update every minute

    // Listen for custom vault lock event
    if (typeof window !== 'undefined') {
      window.addEventListener('vault-locked', handleVaultLocked);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('vault-locked', handleVaultLocked);
      }
    };
  }, []);

  const unlock = (password: string) => {
    masterPasswordCache.set(password);
    setIsUnlocked(true);
    setRemainingTime(masterPasswordCache.getRemainingTime());
  };

  const lock = () => {
    masterPasswordCache.clear();
    setIsUnlocked(false);
    setRemainingTime(0);
  };

  const extendSession = () => {
    masterPasswordCache.extendSession();
    setRemainingTime(masterPasswordCache.getRemainingTime());
  };

  return {
    isUnlocked,
    remainingTime,
    unlock,
    lock,
    extendSession,
    getCachedPassword: masterPasswordCache.get,
  };
}
