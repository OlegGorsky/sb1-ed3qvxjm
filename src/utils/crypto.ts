import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key-here';
const TOKEN_EXPIRATION_MS = 3000; // 3 seconds

export const encryptUrl = (url: string, userId: string): string => {
  const timestamp = Date.now();
  // Generate a shorter random ID (8 characters)
  const shortId = CryptoJS.lib.WordArray.random(4).toString().substring(0, 8);
  
  const data = JSON.stringify({
    url,
    userId,
    source: 'telegram-webapp',
    timestamp,
    shortId
  });
  
  const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  // Create a shorter hash (first 8 characters)
  const hash = CryptoJS.SHA256(encrypted + shortId).toString().substring(0, 8);
  
  // Combine shortId and hash for a shorter token
  return encodeURIComponent(`${shortId}.${hash}`);
};

export const decryptUrl = (token: string): {
  url: string;
  userId: string;
  source: string;
  timestamp: number;
  shortId: string;
  isValid: boolean;
} | null => {
  try {
    const [shortId, hash] = decodeURIComponent(token).split('.');
    
    // Retrieve from storage
    const storageKey = `video_token_${shortId}`;
    const storedData = sessionStorage.getItem(storageKey);
    
    if (!storedData) {
      return null;
    }
    
    const encrypted = JSON.parse(storedData);
    const calculatedHash = CryptoJS.SHA256(encrypted + shortId).toString().substring(0, 8);
    
    if (calculatedHash !== hash) {
      return null;
    }

    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decrypted);
    
    // Check if the link has expired (3 seconds)
    const isValid = Date.now() - data.timestamp < TOKEN_EXPIRATION_MS;
    
    // Remove from storage if expired
    if (!isValid) {
      sessionStorage.removeItem(storageKey);
    }
    
    return { ...data, isValid };
  } catch (error) {
    console.error('Failed to decrypt URL:', error);
    return null;
  }
};

// Store encrypted data in session storage
export const storeEncryptedData = (shortId: string, encrypted: string) => {
  const storageKey = `video_token_${shortId}`;
  sessionStorage.setItem(storageKey, JSON.stringify(encrypted));
};