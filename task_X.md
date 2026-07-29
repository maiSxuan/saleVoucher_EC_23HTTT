Khối 1 — Core Platform và vòng đời Voucher Code
Người phụ trách: X
liên quan phân quyền, voucher code và tính toàn vẹn dữ liệu.
Use case thuộc khối
BR-ADM-01 — Quản lý người dùng.
BR-CUS-07 — Nhận voucher đã mua.
BR-PAR-05 — Kiểm tra voucher code.
BR-PAR-06 — Xác nhận sử dụng voucher.
BR-ADM-06 — Dashboard quản trị.
BR-ADM-07 — Nhật ký hệ thống.

Thành phần dùng chung X phải xây
- Đăng nhập dùng chung.
- Phân quyền theo vai trò.
- Middleware kiểm tra quyền.
- Audit log service.
- Chuẩn response API.
- Exception handler.
- Cấu hình transaction.
- Các enum và trạng thái dùng chung.

Backend
modules/
└── voucher-code/
    ├── controller/
    │   ├── IssuedVoucherController
    │   ├── VoucherVerificationController
    │   └── VoucherRedemptionController
    ├── service/
    │   ├── IssuedVoucherService
    │   ├── VoucherVerificationService
    │   ├── VoucherRedemptionService
    │   └── VoucherCodeGenerator
    ├── repository/
    │   ├── IssuedVoucherRepository
    │   └── VoucherUsageLogRepository
    ├── dto/
    ├── entity/
    └── routes/

frontend
Khách hàng:
- Voucher của tôi
- Chi tiết voucher đã mua
- QR mô phỏng
- Trạng thái chưa dùng/đã dùng/hết hạn

Đối tác:
- Form nhập voucher code
- Kết quả kiểm tra
- Xác nhận sử dụng

Admin:
- Quản lý người dùng
- Dashboard
- Nhật ký hệ thống

LƯU Ý: tất cả phải được lấy từ data thật, từ supabase
---
BƯỚC 1 HOÀN THÀNH TASK Đăng nhập dùng chung, Middleware xác thực, Phân quyền theo vai trò
Để hoàn thành 3 task Đăng nhập dùng chung, Middleware xác thực, Phân quyền theo vai trò, bạn cần tập trung vào 5 nhóm UI sau:

- Màn hình đăng nhập dùng chung
Một form đăng nhập duy nhất cho tất cả portal: Admin, Partner, Customer.
Có trường email/số điện thoại, mật khẩu, nút đăng nhập, trạng thái loading, lỗi đăng nhập.
Có thể thêm chọn portal/role ở đầu form để xác định vai trò sau khi đăng nhập.
- Màn hình kiểm tra session / middleware
Một màn hình chờ ban đầu như “Đang kiểm tra đăng nhập...”.
Nếu chưa đăng nhập: chuyển về màn hình login.
Nếu đã đăng nhập nhưng không đủ quyền: hiển thị màn hình “Không có quyền truy cập”.
- UI phân quyền theo vai trò
Admin:
thấy toàn bộ chức năng quản trị.
Partner owner:
thấy quản lý voucher, chi nhánh, nhân viên, báo cáo.
Partner staff:
chỉ thấy các chức năng giới hạn, ví dụ tra cứu mã voucher, tài khoản cá nhân.
Customer:
thấy trang mua hàng, giỏ hàng, đơn hàng, hồ sơ.
- Header / navigation theo role
Thêm badge vai trò ở header, ví dụ: Admin, Owner, Staff, Customer.
Thêm nút đăng xuất.
Ẩn/hiện menu theo quyền để người dùng không thấy chức năng không được phép.
- Màn hình quản lý vai trò (nếu cần test đầy đủ)
Một màn hình cho Admin để gán role cho user.
Ví dụ: chọn role Admin / Partner / Customer, lưu lại.

- Trong dự án hiện tại, bạn nên ưu tiên chỉnh ở các phần sau (từ src_UI_mau):
App.tsx để chèn logic chặn màn hình theo auth và role.
AdminAuth.tsx
PartnerAuth.tsx
CustomerAuth.tsx

BƯỚC 2: HOÀN THÀNH TASK:
- Audit log service.
- Chuẩn response API.
- Exception handler.
- Cấu hình transaction.
- Các enum và trạng thái dùng chung.

sau đó bạn hãy ghi lại nội dung đã hoàn thành task (bước 2) vào file codeX_done.md để người ngu code nhất vẫn có thể hiểu được