/**
 * Check whether an Error represents an HTTP 401 Unauthorized based on its message.
 *
 * @param error - The Error whose message will be tested for the `^401: .*Unauthorized` pattern
 * @returns `true` if the error message matches the pattern `^401: .*Unauthorized`, `false` otherwise
 */
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}