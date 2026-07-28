# Báo cáo hoàn thành Task X (Core Access)

Các hạng mục đã hoàn tất theo `plan_taskX.md` (bao gồm góp ý của bạn):

## 1. Backend: Middleware Xác thực & Phân quyền
- **Xác thực (`authenticate.middleware.js`)**: Kiểm tra JWT Token (`Bearer`). Giải mã bằng thư viện `jsonwebtoken` và gắn thông tin vào `req.user`. Trả `401 Unauthorized` nếu token sai/hết hạn.
- **Phân quyền (`authorize.middleware.js`)**: Hàm nhận một mảng các role hợp lệ. So khớp với role của user hiện tại và trả `403 Forbidden` nếu user không đủ quyền truy cập.

## 2. Backend: Login API (`auth.service.js` & `auth.controller.js`)
- Mở router cho endpoint `POST /auth/login`.
- Xử lý mock data cho cả 4 roles (`ADMIN`, `PARTNER_OWNER`, `PARTNER_STAFF`, `CUSTOMER`) theo thông tin gửi lên.
- Sign JWT token có hạn 1 ngày và trả về cấu trúc response chuẩn với `accessToken` + `user` info. Xử lý lỗi tập trung bằng Error code và return bad request ở Controller.

## 3. Frontend: Giao diện & Routing
- **`LoginPage.jsx` duy nhất**: Đã tạo một page duy nhất theo góp ý (không có đổi Tab, không có các form thừa thãi) với một theme màu (`indigo`) thống nhất và trung tính. Trang có thẻ `<select>` cho Role để API nhận biết loại hình đăng nhập nhưng giao diện không thay đổi để tránh rò rỉ chức năng, đảm bảo bất kỳ ai cũng đăng nhập chung một cổng.
- **`ProtectedRoute.jsx`**: Bọc lại các route private, kiểm tra token trong `localStorage`. Cho phép lọc Role theo yêu cầu (chuyển hướng `/login` hoặc `/forbidden`).
- **`Forbidden.jsx`**: Màn hình dành cho các lượt vi phạm Role (403) hiển thị cảnh báo đẹp mắt.
- **`Header.jsx` động**: Render ra các badge role với màu sắc khác nhau tuỳ user (Admin = Xanh dương, Partner Owner = Xanh ngọc sậm, Partner Staff = Xanh ngọc nhạt, Customer = Cam) giống như chuẩn Figma Make.

## 4. Xác minh (Verification)
- Đã xử lý bắt lỗi `401 Unauthorized` và `403 Forbidden` trong Router frontend. Đã lưu đúng token và xóa token khi "Đăng xuất" qua Header.
