import { useQuery } from "@tanstack/react-query";
import { type User, type Profile } from "@shared/schema";

export interface AuthUser extends User {
  profile?: Profile;
}

/**
 * Exposes the current authenticated user, loading state, and an authentication flag.
 *
 * @returns An object with `user`, `isLoading`, and `isAuthenticated`.
 * - `user`: the fetched `AuthUser` or `undefined` while not loaded
 * - `isLoading`: `true` when the user request is in progress, `false` otherwise
 * - `isAuthenticated`: `true` if `user` is present, `false` otherwise
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