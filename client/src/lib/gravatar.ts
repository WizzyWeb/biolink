import crypto from 'crypto';

/**
 * Gravatar utility functions for fetching profile images
 * Based on https://docs.gravatar.com/sdk/images/
 */

export interface GravatarOptions {
  size?: number;
  default?: string;
  rating?: 'g' | 'pg' | 'r' | 'x';
  forceDefault?: boolean;
}

/**
 * Generates a SHA256 hash of an email address for Gravatar
 * @param email - The email address to hash
 * @returns The SHA256 hash as a lowercase hex string
 */
export function generateGravatarHash(email: string): string {
  const trimmedEmail = email.trim().toLowerCase();
  return crypto.createHash('sha256').update(trimmedEmail).digest('hex');
}

/**
 * Generates a Gravatar URL for a given email address
 * @param email - The email address
 * @param options - Optional parameters for the Gravatar request
 * @returns The complete Gravatar URL
 */
export function getGravatarUrl(email: string, options: GravatarOptions = {}): string {
  const hash = generateGravatarHash(email);
  const baseUrl = 'https://gravatar.com/avatar';
  
  const params = new URLSearchParams();
  
  if (options.size) {
    params.append('s', options.size.toString());
  }
  
  if (options.default) {
    params.append('d', options.default);
  }
  
  if (options.rating) {
    params.append('r', options.rating);
  }
  
  if (options.forceDefault) {
    params.append('f', 'y');
  }
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}/${hash}?${queryString}` : `${baseUrl}/${hash}`;
}

/**
 * Gets a Gravatar URL with a fallback to a default image
 * @param email - The email address
 * @param fallbackUrl - The fallback image URL if Gravatar doesn't have an image
 * @param size - The size of the image (default: 200)
 * @returns The Gravatar URL with fallback
 */
export function getGravatarWithFallback(
  email: string, 
  fallbackUrl: string, 
  size: number = 200
): string {
  return getGravatarUrl(email, {
    size,
    default: fallbackUrl,
    rating: 'g' // Only show G-rated images
  });
}

/**
 * Gets a Gravatar URL with initials fallback
 * @param email - The email address
 * @param name - The user's name for initials
 * @param size - The size of the image (default: 200)
 * @returns The Gravatar URL with initials fallback
 */
export function getGravatarWithInitials(
  email: string, 
  name: string, 
  size: number = 200
): string {
  return getGravatarUrl(email, {
    size,
    default: 'initials',
    rating: 'g'
  });
}

/**
 * Checks if a Gravatar exists for an email address
 * @param email - The email address to check
 * @returns Promise<boolean> - True if Gravatar exists, false otherwise
 */
export async function checkGravatarExists(email: string): Promise<boolean> {
  try {
    const url = getGravatarUrl(email, { default: '404' });
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Error checking Gravatar existence:', error);
    return false;
  }
}
