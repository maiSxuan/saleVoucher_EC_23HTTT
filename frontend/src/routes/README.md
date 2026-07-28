# Routes

Purpose:
- Định nghĩa các route riêng theo vai trò người dùng.
- Mỗi file routes tương ứng với một role (public, customer, partner, admin).

Files:
- **public.routes.jsx**: route công khai (không cần xác thực)
- **customer.routes.jsx**: route cho khách hàng
- **partner.routes.jsx**: route cho đối tác/người bán
- **admin.routes.jsx**: route cho quản trị viên

Usage:
```javascript
// Import và gom route vào router.jsx
import { publicRoutes } from "./routes/public.routes";
import { customerRoutes } from "./routes/customer.routes";
```
