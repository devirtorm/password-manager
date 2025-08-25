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

    // Listen for vault unlock events
    const handleVaultUnlocked = () => {
      setIsUnlocked(true);
      setRemainingTime(masterPasswordCache.getRemainingTime());
    };

    // Update remaining time more frequently when close to expiration
    const updateInterval = () => {
      const remaining = masterPasswordCache.getRemainingTime();
      setRemainingTime(remaining);
      
      if (remaining === 0) {
        setIsUnlocked(false);
      }
    };

    // Check every 10 seconds instead of every minute for better UX
    const interval = setInterval(updateInterval, 10000);

    // Listen for custom vault events
    if (typeof window !== 'undefined') {
      window.addEventListener('vault-locked', handleVaultLocked);
      window.addEventListener('vault-unlocked', handleVaultUnlocked);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('vault-locked', handleVaultLocked);
        window.removeEventListener('vault-unlocked', handleVaultUnlocked);
      }
    };
  }, []);

  const unlock = (password: string) => {
    masterPasswordCache.set(password);
    setIsUnlocked(true);
    setRemainingTime(masterPasswordCache.getRemainingTime());
    
    // Dispatch unlock event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vault-unlocked'));
    }
  };

  const lock = () => {
    masterPasswordCache.clear();
    setIsUnlocked(false);
    setRemainingTime(0);
    
    // Dispatch lock event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vault-locked'));
    }
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
