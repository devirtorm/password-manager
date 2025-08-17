import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

// Para hashear la master password (autenticación)
export async function hashMasterPassword(password: string): Promise<{ hash: string, salt: string }> {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
}

// Para verificar la master password
export async function verifyMasterPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate unique salt for the user
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
}

// Derivar clave de cifrado desde la master password
function deriveKey(masterPassword: string, salt: string): string {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
}

// Encrypt individual password with IV
export function encryptPassword(password: string, masterPassword: string, salt: string): { encrypted: string, iv: string } {
  const key = deriveKey(masterPassword, salt);
  
  // Generar IV aleatorio para cada cifrado
  const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV
  
  // Cifrar con el IV
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  
  return {
    encrypted,
    iv: iv.toString(CryptoJS.enc.Hex)
  };
}

// Decrypt individual password with IV
export function decryptPassword(encryptedPassword: string, iv: string, masterPassword: string, salt: string): string {
  const key = deriveKey(masterPassword, salt);
  
  // Convertir IV de hex a WordArray
  const ivWordArray = CryptoJS.enc.Hex.parse(iv);
  
  // Descifrar con el IV
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, key, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Generate secure password
export function generateSecurePassword(length: number = 16): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push("Use at least 8 characters");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Include lowercase letters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Include uppercase letters");

  if (/\d/.test(password)) score += 1;
  else feedback.push("Include numbers");

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  else feedback.push("Include special characters");

  return { score, feedback };
}
