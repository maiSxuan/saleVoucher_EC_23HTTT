/**
 * Purpose: Cấu hình client cho dữ liệu từ API.
 * Mẫu này chuẩn bị cho việc dùng React Query hoặc TanStack Query sau này.
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
};
