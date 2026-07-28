/**\n * Purpose: Hook mẫu để lấy thông tin user và auth status.\n * Dùng trong bất kỳ component nào để truy cập user context.\n */
//import { useAuth } from \"../../app/auth-context\";\n\nexport function useCurrentUser() {\n  const { user } = useAuth();\n  return user;\n}\n
