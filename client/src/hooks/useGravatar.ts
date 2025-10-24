import { useState, useEffect } from 'react';
import { getGravatarWithFallback, getGravatarWithInitials, checkGravatarExists } from '@/lib/gravatar';

export interface UseGravatarOptions {
  size?: number;
  fallbackUrl?: string;
  useInitials?: boolean;
  name?: string;
}

export interface UseGravatarReturn {
  gravatarUrl: string;
  isLoading: boolean;
  hasGravatar: boolean;
  error: string | null;
}

/**
 * Hook for using Gravatar profile images with fallback options
 * @param email - The user's email address
 * @param options - Configuration options
 * @returns Object with gravatarUrl, loading state, and error handling
 */
export function useGravatar(
  email: string | null | undefined,
  options: UseGravatarOptions = {}
): UseGravatarReturn {
  const [gravatarUrl, setGravatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasGravatar, setHasGravatar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    size = 200,
    fallbackUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300',
    useInitials = false,
    name = ''
  } = options;

  useEffect(() => {
    if (!email) {
      setGravatarUrl(fallbackUrl);
      setIsLoading(false);
      setHasGravatar(false);
      return;
    }

    const fetchGravatar = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if Gravatar exists for this email
        const exists = await checkGravatarExists(email);
        setHasGravatar(exists);

        // Generate Gravatar URL with appropriate fallback
        let url: string;
        if (useInitials && name) {
          url = getGravatarWithInitials(email, name, size);
        } else {
          url = getGravatarWithFallback(email, fallbackUrl, size);
        }

        setGravatarUrl(url);
      } catch (err) {
        console.error('Error fetching Gravatar:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch Gravatar');
        setGravatarUrl(fallbackUrl);
        setHasGravatar(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGravatar();
  }, [email, size, fallbackUrl, useInitials, name]);

  return {
    gravatarUrl,
    isLoading,
    hasGravatar,
    error
  };
}

/**
 * Hook for getting Gravatar URL without async checking
 * Useful when you just need the URL and don't care about existence
 * @param email - The user's email address
 * @param options - Configuration options
 * @returns The Gravatar URL
 */
export function useGravatarUrl(
  email: string | null | undefined,
  options: UseGravatarOptions = {}
): string {
  const {
    size = 200,
    fallbackUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300',
    useInitials = false,
    name = ''
  } = options;

  if (!email) {
    return fallbackUrl;
  }

  if (useInitials && name) {
    return getGravatarWithInitials(email, name, size);
  }

  return getGravatarWithFallback(email, fallbackUrl, size);
}
