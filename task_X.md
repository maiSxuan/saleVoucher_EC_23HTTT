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
│ ├── IssuedVoucherController
│ ├── VoucherVerificationController
│ └── VoucherRedemptionController
├── service/
│ ├── IssuedVoucherService
│ ├── VoucherVerificationService
│ ├── VoucherRedemptionService
│ └── VoucherCodeGenerator
├── repository/
│ ├── IssuedVoucherRepository
│ └── VoucherUsageLogRepository
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

## LƯU Ý: tất cả phải được lấy từ data thật, từ supabase

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

BƯỚC 3: THỰC HIỆN TASK BR-ADM-01: quản lý người dùng
các file (có truong src_UI_mau) mã nguồn thực tế liên quan đến chức năng quản lý người dùng của UC-ADM-01 như sau:

- Users.tsx — file chính triển khai màn hình quản lý người dùng: danh sách, lọc, xem chi tiết, khóa/mở khóa tài khoản, cập nhật vai trò, lịch sử quản trị.
- mockData.ts — định nghĩa model User, UserRole, UserStatus và dữ liệu mockUsers dùng cho chức năng này.
- App.tsx — điều hướng từ admin sang trang Users.
- AdminLayout.tsx — menu điều hướng Admin có mục “Người dùng”.
- StatusBadge.tsx — component hiển thị trạng thái và vai trò người dùng.
- ConfirmModal.tsx — modal xác nhận các hành động khóa/mở khóa/cập nhật vai trò.
- SystemLogs.tsx — hiển thị nhật ký hệ thống liên quan đến module users.
  hiện tại nó đang là mockdata, tôi cần bạn thực hiện lấy data thật từ supabase.
  kết nối từ đăng nhập tài khoản admin sau đó từ authenticate --> authorize để xác nhận tài khoản là admin mới cho vào.
  Lưu ý: thực thiện code từng file một + ghi lại giải thích code từng dòng của từng file đó và ghi lại ý nghĩa tại sao phải làm như vậy, sau đó ghi lại vào codeX_done.md

BƯỚC 4: THỰC HIỆN TASK thêm chức năng quên mật khẩu, và trả otp để đăng nhập qua email

BƯỚC 5: HOÀN THIỆN LOGIC HOÀN CHỈNH của BR-ADM-01 Quản lý người dùng:
Khóa/mở khóa.
Phân quyền.
Audit log service cơ bản.
thực hiện đúng logic theo mô tả trong docs/đặc tả hệ thống của admin.pdf

BƯỚC 5.1: CHỈNH SỬA VÀ BỔ SUNG THÊM LOGIC PHÂN QUYỀN VÀ HIỂN THỊ THÔNG TIN NGƯỜI DÙNG
a. hiển thị thông tin người dùng

- Đối với khách hàng: hiển thị các thông tin cá nhân (toàn bộ thông tin ở bảng NGUOIDUNG, trừ mã chi nhánh và ma_hsdn), và lịch sử đã mua voucher (lấy toàn bộ thông tin ở bảng DONHANG với trạng thái hoàn thành)
- Đối với nhân viên quản lý voucher: hiển thị các thông tin cá nhân (NGUOIDUNG), thông tin công ty mà họ đang làm (lấy ở bảng HOSODN, chỉ lấy ma_hs, tenDN, địa chỉ), và lịch sử quản trị
- Đối với nhân viên bán hàng: hiển thị các thông tin cá nhân (NGUOIDUNG), thông tin chi nhánh mà họ đang làm (lấy ở bảng CHINHANH thuộc HOSODN nào), và lịch sử quản trị
- Đối với người đại diện: hiển thị các thông tin cá nhân (NGUOIDUNG), thông tin công ty mà họ đang làm (lấy ở bảng HOSODN), và lịch sử quản trị
  lưu ý cần phân ra theo tab: tab thông tin cá nhân (đối với các nhân viên và người đại diện thông tin doanh nghiệp/chi nhánh cần hiển thị bên dưới thông tin cá nhân), tab lịch sử đã mua voucher, tab lịch sử quản trị

b. bổ sung them logic phân quyền: chỉ cập nhật vai trò khi nhân viên quản lí voucher sang nhân viên bán hàng có kèm hiển thị mã chi nhánh ở dạng combobox để chọn, ngược lại khi chuyển từ nhân viên bán hàng thành nhân viên quản lý cần kèm hiển thị mã đối tác ở dạng combobox để chọn

BƯỚC 6: THỰC HIỆN TASK Khung bảng voucher code và usage log (đọc trong folder docs để hiểu và làm)
các UI liên quan nằm trong src_UI_mau \voucher-code (cần đọc kỹ task để hiểu code)
Optimized tool selectionTôi sẽ rà soát các thành phần liên quan đến voucher và luồng xác nhận sử dụng để chỉ ra các file UI phù hợp.

Searched for regex `voucher code|voucherCode|VoucherCode|confirm.*voucher|use voucher|Xác nhận|lookup` (`**/src/**`), 717 results

Tôi đang mở các màn hình chính để xác định đúng file nào thực hiện luồng tra cứu và xác nhận.

Read [](file:///d%3A/Make_EC/src/app/partner/PartnerVoucherCodeLookup.tsx#1-1), lines 1 to 220

Read [](file:///d%3A/Make_EC/src/app/partner/PartnerDashboard.tsx#1-1), lines 1 to 140

Read [](file:///d%3A/Make_EC/src/app/partner/PartnerLayout.tsx#1-1), lines 1 to 140

Read [](file:///d%3A/Make_EC/src/app/App.tsx#1-1), lines 1 to 140

## File UI liên quan

Các file UI chính cho use case “Tra cứu voucher code” và “Xác nhận sử dụng voucher” là:

- PartnerVoucherCodeLookup.tsx — đây là màn hình chính. Nó chứa:
  - ô nhập mã voucher,
  - trạng thái tra cứu (hợp lệ, đã sử dụng, hết hạn, không hợp lệ),
  - nút xác nhận sử dụng voucher,
  - các trạng thái thành công/lỗi khi xác nhận.

- PartnerDashboard.tsx — có nút thao tác nhanh “Tra cứu Voucher Code” từ dashboard partner.

- PartnerLayout.tsx — menu điều hướng trong portal partner, có mục “Tra cứu mã”.

- App.tsx — nơi kết nối route page “code-lookup” sang component trên.

## File dữ liệu hỗ trợ

- partnerMockData.ts — chứa mock dữ liệu voucher code, trạng thái sử dụng và chi nhánh liên quan.

BƯỚC 7: SỬA LOGIC CẬP NHẬT ROLE
hiện tại khi từ nhân viên bán hàng cập nhật thành nhân viên quản lí voucher có hiện:

- vai trò mới: Nhân viên quản lí voucher (đúng, nhưng bị dư mũi tên combobox --> chỉnh lại)
- đối tác doanh nghiệp: hiện tại đang bị giới hạn --> cần hiện đầy đủ

hiện tại khi từ nhân viên quản lí voucher cập nhật thành nhân viên bán hàng có hiện:

- vai trò mới: Nhân viên bán hàng (đúng, nhưng bị dư mũi tên combobox --> chỉnh lại)
- chi nhánh: ở đây cần hiện đủ và đúng các chi nhánh thuộc sở hữu của doanh nghiệp đó
