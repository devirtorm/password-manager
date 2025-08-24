/**
 * Session status component - shows vault lock status and remaining time
 * Similar to Bitwarden's session timeout indicator
 */

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, Clock, LogOut } from 'lucide-react';
import { useMasterPasswordSession } from '@/hooks/useMasterPasswordSession';
import { masterPasswordCache } from '@/utils/master-password-session';

export function SessionStatus() {
  const { isUnlocked, remainingTime, lock } = useMasterPasswordSession();
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    const formatTime = (milliseconds: number) => {
      const minutes = Math.floor(milliseconds / (1000 * 60));
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (remainingTime > 0) {
      setDisplayTime(formatTime(remainingTime));
    } else {
      setDisplayTime('');
    }

    // Update every second when unlocked
    if (isUnlocked) {
      const interval = setInterval(() => {
        const remaining = masterPasswordCache.getRemainingTime();
        setDisplayTime(formatTime(remaining));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isUnlocked, remainingTime]);

  const handleLock = () => {
    lock();
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Lock className="h-4 w-4" />
        <span>Vault Locked</span>
      </div>
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
