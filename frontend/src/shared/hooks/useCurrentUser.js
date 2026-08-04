/**
 * Hook dùng chung để lấy người dùng hiện tại từ AuthContext.
 */
import { useAuth } from '../../app/auth-context';

export function useCurrentUser() {
  return useAuth()?.user ?? null;
}
