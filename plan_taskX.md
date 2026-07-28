# Kế hoạch thực hiện Task X (Core Access)

Phân tích yêu cầu từ `task_X.md`, `plan.md` và source UI mẫu (từ thư mục `src_UI_mau`).

## 1. Vấn đề với UI hiện tại & Đề xuất hợp nhất
- **Hiện trạng:** UI mẫu từ Figma chia ra 3 form độc lập (`AdminAuth.tsx`, `CustomerAuth.tsx`, `PartnerAuth.tsx`).
- **Yêu cầu (task_X.md):** "Một form đăng nhập duy nhất cho tất cả portal".
- **Đề xuất:** Tạo một màn hình `LoginPage.jsx` duy nhất, không đổi tabs như của figma make (vì làm như vậy dễ bị rò rỉ thông tin, khách hàng cũng có thể vào được trang của admin), chỉ nên tạo 1 page duy nhất, 1 màu duy nhất để người dùng tự đăng nhập tài khoản của mình, không cần phải tạo nhiều tabs như của figma make

## 2. Kế hoạch Backend (`modules/core-access`)
- **Middlewares (`backend/src/common/middlewares`):**
  - `authenticate.middleware.js`: Lấy Bearer token từ header, verify bằng `jwt`, gán `req.user`. Nếu lỗi trả 401.
  - `authorize.middleware.js`: Truyền mảng các role (vd: `['ADMIN', 'PARTNER_OWNER']`). Kiểm tra `req.user.role` có nằm trong mảng không. Nếu không, trả 403.
- **Service & Controller (`auth.service.js`, `auth.controller.js`):**
  - Xử lý endpoint `POST /api/access/login`.
  - Nhận `email/phone`, `password`, `role`.
  - Kiểm tra thông tin, mã hóa/so khớp mật khẩu, trả về `accessToken` và thông tin cơ sở.

## 3. Kế hoạch Frontend (`features/core-access` và `shared`)
- **Login Component (`LoginPage.jsx`):** Hợp nhất mã nguồn UI mẫu thành form đăng nhập chung.
- **Protected Route & Session Check (`ProtectedRoute.jsx`):** 
  - Tạo `ProtectedRoute.jsx` bọc các routers.
  - Xử lý các trạng thái: Đang load (kiểm tra token), Chưa đăng nhập (redirect `/login`), Không đủ quyền (hiển thị `Forbidden.jsx`).
- **Dynamic Header:** 
  - Render Badge phân quyền (`Admin`, `Partner Owner`, v.v.).
  - Ẩn/hiện menu dựa theo role người dùng đăng nhập.

## 4. Xác minh (Verification)
- Kiểm tra tính bảo mật của API khi thiếu JWT hoặc gửi JWT hết hạn (đảm bảo ra 401).
- Test truy cập chéo, ví dụ Customer cố truy cập link `/partner/dashboard` (đảm bảo ra 403).
- Kiểm tra hiển thị giao diện tuỳ biến đúng chức năng dựa trên role.

LƯU Ý: tất cả phải được lấy từ data thật, từ supabase