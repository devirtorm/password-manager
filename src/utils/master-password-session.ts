/**
 * Auto-expires after inactivity timeout
 */

class MasterPasswordSession {
  private static instance: MasterPasswordSession;
  private masterPassword: string | null = null;
  private lastActivity: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  
  // Configuration (like Bitwarden)
  private readonly TIMEOUT_MINUTES = 15; // Auto-lock after 15 minutes
  private readonly TIMEOUT_MS = this.TIMEOUT_MINUTES * 60 * 1000;

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): MasterPasswordSession {
    if (!MasterPasswordSession.instance) {
      MasterPasswordSession.instance = new MasterPasswordSession();
    }
    return MasterPasswordSession.instance;
  }

  /**
   * Cache master password in memory and start timeout
   */
  setMasterPassword(password: string): void {
    this.masterPassword = password;
    this.updateActivity();
    this.startTimeout();
  }

  /**
   * Get cached master password if still valid
   */
  getMasterPassword(): string | null {
    if (this.isExpired()) {
      this.clear();
      return null;
    }
    
    this.updateActivity(); // Extend session on access
    this.startTimeout(); // Reset timeout
    return this.masterPassword;
  }

  /**
   * Check if master password is cached and valid
   */
  isUnlocked(): boolean {
    return this.getMasterPassword() !== null;
  }

  /**
   * Clear master password from memory (lock vault)
   */
  clear(): void {
    this.masterPassword = null;
    this.lastActivity = 0;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Update last activity timestamp
   */
  private updateActivity(): void {
    this.lastActivity = Date.now();
  }

  /**
   * Check if session has expired
   */
  private isExpired(): boolean {
    if (this.lastActivity === 0) return true;
    return Date.now() - this.lastActivity > this.TIMEOUT_MS;
  }

  /**
   * Start/restart the auto-lock timeout
   */
  private startTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.clear();
      console.log('🔒 Vault auto-locked due to inactivity');
      
      // Optional: Dispatch event for UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vault-locked'));
      }
    }, this.TIMEOUT_MS);
  }

  /**
   * Get remaining time until auto-lock (for UI)
   */
  getRemainingTime(): number {
    if (this.lastActivity === 0) return 0;
    const elapsed = Date.now() - this.lastActivity;
    const remaining = this.TIMEOUT_MS - elapsed;
    return Math.max(0, remaining);
  }

  /**
   * Extend session (call on user activity)
   */
  extendSession(): void {
    if (this.isUnlocked()) {
      this.updateActivity();
      this.startTimeout();
    }
  }
}

// Export singleton instance
export const masterPasswordSession = MasterPasswordSession.getInstance();

// Utility functions for easier usage
export const masterPasswordCache = {
  set: (password: string) => masterPasswordSession.setMasterPassword(password),
  get: () => masterPasswordSession.getMasterPassword(),
  clear: () => masterPasswordSession.clear(),
  isUnlocked: () => masterPasswordSession.isUnlocked(),
  extendSession: () => masterPasswordSession.extendSession(),
  getRemainingTime: () => masterPasswordSession.getRemainingTime(),
};
