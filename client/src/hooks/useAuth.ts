import { useQuery } from "@tanstack/react-query";
import { type User, type Profile } from "@shared/schema";

export interface AuthUser extends User {
  profile?: Profile;
}

/**
 * Provides authentication state for the current client user.
 *
 * @returns An object containing:
 * - `user`: the authenticated `AuthUser` or `undefined` if not authenticated,
 * - `isLoading`: `true` while the user fetch is in progress, `false` otherwise,
 * - `isAuthenticated`: `true` if `user` is present, `false` otherwise.
 */
export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}