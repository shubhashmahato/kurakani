import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

/**
 * Encrypt a message
 */
export const encryptMessage = (text: string, key: string): string => {
  try {
    if (!text || !key) {
      throw new Error('Text and key are required');
    }

    // Generate random IV
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(key.padEnd(32, '0').slice(0, 32)),
      iv
    );

    // Encrypt
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get auth tag
    const authTag = cipher.getAuthTag();

    // Return combined: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

/**
 * Decrypt a message
 */
export const decryptMessage = (encryptedData: string, key: string): string => {
  try {
    if (!encryptedData || !key) {
      throw new Error('Encrypted data and key are required');
    }

    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format');
    }

    const [ivHex, authTagHex, encrypted] = parts;

    // Create decipher
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key.padEnd(32, '0').slice(0, 32)),
      Buffer.from(ivHex, 'hex')
    );

    // Set auth tag
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    // Decrypt
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

/**
 * Generate random encryption key
 */
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash password
 */
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify password
 */
export const verifyPassword = (password: string, hash: string): boolean => {
  const parts = hash.split(':');
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;
  const newHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return newHash === originalHash;
};