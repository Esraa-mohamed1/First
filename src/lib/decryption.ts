import CryptoJS from 'crypto-js';

const APP_KEY = 'ahmed&essra';

function aesKey(): CryptoJS.lib.WordArray {
  return CryptoJS.SHA256(APP_KEY);
}

function tryParseLaravelEnvelope(
  trimmed: string
): { ciphertextB64: string; iv: CryptoJS.lib.WordArray } | null {
  if (!/^[A-Za-z0-9+/=\s]+$/.test(trimmed)) return null;
  try {
    const utf8 = CryptoJS.enc.Base64.parse(trimmed).toString(CryptoJS.enc.Utf8);
    if (!utf8.startsWith('{')) return null;
    const parsed = JSON.parse(utf8) as { iv?: string; value?: string };
    if (parsed?.iv && parsed?.value && typeof parsed.iv === 'string' && typeof parsed.value === 'string') {
      return {
        ciphertextB64: parsed.value,
        iv: CryptoJS.enc.Base64.parse(parsed.iv),
      };
    }
  } catch {
    /* not Laravel JSON-in-base64 */
  }
  return null;
}

function decryptAesCbc(
  ciphertextWords: CryptoJS.lib.WordArray,
  iv: CryptoJS.lib.WordArray,
  key: CryptoJS.lib.WordArray
): string {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertextWords,
  });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function tryDecryptWordArray(
  fullParsed: CryptoJS.lib.WordArray,
  key: CryptoJS.lib.WordArray
): string | null {
  const zeroIv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

  // IV prepended: first 16 bytes, rest ciphertext (common PHP / OpenSSL pattern)
  if (fullParsed.sigBytes > 16) {
    const iv = CryptoJS.lib.WordArray.create(fullParsed.words.slice(0, 4), 16);
    const ciphertext = CryptoJS.lib.WordArray.create(
      fullParsed.words.slice(4),
      fullParsed.sigBytes - 16
    );
    try {
      const out = decryptAesCbc(ciphertext, iv, key);
      if (out) return out;
    } catch {
      /* continue */
    }
  }

  // Whole payload is ciphertext, zero IV
  try {
    const out = decryptAesCbc(fullParsed, zeroIv, key);
    if (out) return out;
  } catch {
    /* continue */
  }

  return null;
}

/**
 * Decrypts base64 payloads: Laravel-style {"iv","value"} envelope, IV-prefixed blob, or raw CBC + zero IV.
 * Key matches backend: SHA256('ahmed&essra') for AES-256.
 */
export function decryptResponse(encryptedData: unknown): unknown {
  if (typeof encryptedData !== 'string') return encryptedData;

  const trimmed = encryptedData.trim();
  if (!trimmed) return encryptedData;

  const key = aesKey();

  try {
    const laravel = tryParseLaravelEnvelope(trimmed);
    if (laravel) {
      const ct = CryptoJS.enc.Base64.parse(laravel.ciphertextB64);
      const text = decryptAesCbc(ct, laravel.iv, key);
      if (text) {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      }
    }

    const fullParsed = CryptoJS.enc.Base64.parse(trimmed);
    const text = tryDecryptWordArray(fullParsed, key);
    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
  } catch (e) {
    console.error('Decryption failed:', e);
  }

  return encryptedData;
}

/** Normalize axios `response.data` when the server returns encrypted strings or `{ encrypted }`. */
export function unwrapEncryptedResponseData(data: unknown): unknown {
  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    const enc = (data as { encrypted?: unknown }).encrypted;
    if (typeof enc === 'string') {
      return decryptResponse(enc);
    }
  }

  if (typeof data === 'string') {
    const t = data.trim();
    if (!t) return data;
    if (t.startsWith('{') || t.startsWith('[')) {
      try {
        return JSON.parse(t);
      } catch {
        return decryptResponse(t);
      }
    }
    return decryptResponse(t);
  }

  return data;
}
