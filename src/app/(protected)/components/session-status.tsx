"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, Clock, LogOut } from 'lucide-react';
import { useMasterPasswordSession } from '@/hooks/useMasterPasswordSession';
import { masterPasswordCache } from '@/utils/master-password-session';
import { MasterPasswordDialog } from './master-password-dialog';

export function SessionStatus() {
  const { isUnlocked, lock } = useMasterPasswordSession();
  const [displayTime, setDisplayTime] = useState('');
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  useEffect(() => {
    const formatTime = (milliseconds: number) => {
      const minutes = Math.floor(milliseconds / (1000 * 60));
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateDisplayTime = () => {
      if (isUnlocked) {
        const remaining = masterPasswordCache.getRemainingTime();
        if (remaining > 0) {
          setDisplayTime(formatTime(remaining));
        } else {
          setDisplayTime('');
        }
      } else {
        setDisplayTime('');
      }
    };

    // Initial update
    updateDisplayTime();

    // Update every second when unlocked
    let interval: NodeJS.Timeout | null = null;
    if (isUnlocked) {
      interval = setInterval(updateDisplayTime, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isUnlocked]);

  const handleLock = () => {
    lock();
  };

  const handleUnlock = () => {
    setShowUnlockDialog(true);
  };

  const handleUnlockSubmit = async (masterPassword: string) => {
    // Esta función solo necesita validar que la contraseña es correcta
    // El MasterPasswordDialog ya maneja el unlock automáticamente
    return Promise.resolve();
  };

  if (!isUnlocked) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUnlock}
          className="h-auto p-0 hover:bg-transparent"
        >
          <Badge className="bg-indigo-700 hover:bg-indigo-600 text-white flex items-center gap-2 text-xs cursor-pointer transition-colors">
            <Lock className="h-4 w-4" />
            <span>Vault Locked - Click to Unlock</span>
          </Badge>
        </Button>
        
        <MasterPasswordDialog
          open={showUnlockDialog}
          onOpenChange={setShowUnlockDialog}
          onSubmit={handleUnlockSubmit}
          title="Unlock Vault"
          description="Enter your master password to unlock the vault and access your passwords."
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Unlock className="h-4 w-4 text-green-600" />
        <Badge variant="outline" className="text-green-600 border-green-200">
          Unlocked
        </Badge>
      </div>
      
      {displayTime && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="h-3 w-3" />
          <span className="font-mono text-xs">{displayTime}</span>
        </div>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLock}
        className="h-8 px-2 text-gray-600 hover:text-gray-900"
        title="Lock vault"
      >
        <LogOut className="h-3 w-3" />
      </Button>
    </div>
  );
}
