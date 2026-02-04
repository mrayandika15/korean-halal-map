/**
 * Device ID Management
 *
 * Generates and persists a unique device identifier using localStorage.
 * This is used for anonymous device-based tracking of favorites and ratings.
 */

const DEVICE_ID_KEY = 'halal_korea_device_id';

/**
 * Gets the existing device ID from localStorage or creates a new one.
 *
 * @returns The device ID (UUID string), or empty string if running on server
 *
 * @example
 * ```typescript
 * const deviceId = getOrCreateDeviceId();
 * // First call: generates new UUID and stores in localStorage
 * // Subsequent calls: returns stored UUID
 * ```
 */
export function getOrCreateDeviceId(): string {
  // Return empty string if running on server (SSR)
  if (typeof window === 'undefined') {
    return '';
  }

  // Try to get existing device ID from localStorage
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  // If no device ID exists, generate a new UUID and store it
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

/**
 * Gets the current device ID without creating one if it doesn't exist.
 *
 * @returns The device ID if it exists, null otherwise
 */
export function getDeviceId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(DEVICE_ID_KEY);
}

/**
 * Clears the stored device ID.
 * Useful for testing or resetting user data.
 */
export function clearDeviceId(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(DEVICE_ID_KEY);
}

/**
 * The localStorage key used to store the device ID.
 * Exported for testing purposes.
 */
export const STORAGE_KEY = DEVICE_ID_KEY;
