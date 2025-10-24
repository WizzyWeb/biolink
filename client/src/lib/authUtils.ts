/**
 * Checks whether an Error represents an HTTP 401 Unauthorized error based on its message.
 *
 * @param error - The Error whose message will be tested for the pattern `^401: .*Unauthorized`.
 * @returns `true` if the error message starts with `401: ` and contains `Unauthorized`, `false` otherwise.
 */
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}