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

BƯỚC 8: HỢP NHẤT LAYOUT ADMIN PORTAL & KẾT NỐI NHẬT KÝ HỆ THỐNG (BR-ADM-07)
- Hợp nhất toàn bộ thanh điều hướng Admin Portal về một layout duy nhất tại: `frontend/src/features/core-access/layouts/AdminLayout.jsx`
- Menu sidebar hợp nhất gồm 5 tính năng cốt lõi:
  1. Tổng quan (`/admin/overview`)
  2. Quản lý đối tác (`/admin/partners`)
  3. Duyệt voucher (`/admin/vouchers`)
  4. Quản lý người dùng (`/admin/users`)
  5. Nhật ký hệ thống (`/admin/logs`)
- Đảm bảo cơ chế Outlet của React Router: lồng toàn bộ các route admin vào trong `AdminLayout`, bỏ triệt để việc render lặp header/sidebar ở các trang con (`PartnerManagementPage`, `PartnerDetailPage`, `VoucherApprovalListPage`, `VoucherApprovalDetailPage`, `AuditLogPage`).
- Kết nối API Nhật ký hệ thống thật từ Supabase (`GET /admin/logs`) thông qua `auditLogApi.js`, hiển thị đầy đủ bộ lọc hành động, kết quả và phân trang.

BƯỚC 9: CHẶN ĐẦU KIỂM TRA MÁY CHỦ SMTP / DNS TRƯỚC KHI GỬI EMAIL OTP
- Xây dựng hàm chặn đầu `validateEmailDomain(email)` trong `mailer.js` sử dụng `dns.promises.resolveMx` và `resolve4`:
  - Chặn ngay các domain nội bộ / giả lập như `@ec.local`, `@*.test`, `@*.example`, `localhost`...
  - Kiểm tra sự tồn tại của bản ghi máy chủ nhận thư (MX/A) trên Internet trước khi gọi SMTP gửi mail.
  - Nếu email không thể nhận thư hoặc domain không tồn tại, lập tức trả lỗi HTTP 400 và thông báo rõ ràng cho người dùng thay vì gửi đi hoặc báo thành công ngầm.
- Chuẩn hóa luồng Quên mật khẩu trong `auth.service.js`: Chỉ ghi nhận OTP và lưu nhật ký thành công sau khi gửi email thật thành công qua SMTP; nếu thất bại sẽ ghi nhật ký `THAT_BAI` và trả lỗi trực tiếp về giao diện.

BƯỚC 10: CẬP NHẬT THÊM LOGIC CÒN THIẾU TRONG UC-BUS-05 TRONG docs/đặc tả hệ thống cho khách hàng(2).pdf
Luồng cơ bản
Khách hàng chọn chức năng “Quên mật khẩu”.
Hệ thống hiển thị biểu mẫu nhập email đã đăng ký.
Khách hàng nhập email hoặc số điện thoại đã đăng ký.
Hệ thống tiếp nhận thông tin.
Hệ thống đối chiếu email với dữ liệu tài khoản.
Hệ thống phát hành mã xác thực.
Hệ thống gửi mã xác thực đến email đã đăng ký.
Hệ thống hiển thị màn hình nhập mã xác thực.
Khách hàng nhập mã xác thực.
Hệ thống tiếp nhận mã xác thực.
Hệ thống kiểm tra tính hợp lệ của mã xác thực.
Hệ thống hiển thị biểu mẫu thiết lập mật khẩu mới.
Khách hàng nhập mật khẩu mới và xác nhận mật khẩu mới.
Hệ thống tiếp nhận thông tin mật khẩu mới.
Hệ thống cập nhật mật khẩu mới vào tài khoản.
Hệ thống lưu mật khẩu mới vào cơ sở dữ liệu.
Hệ thống hiển thị thông báo đặt lại mật khẩu thành công và yêu cầu khách hàng đăng nhập lại.
Hệ thống kết thúc Use Case.
Luồng thay thế
A5: Không tìm thấy tài khoản  
Hệ thống không tìm thấy tài khoản tương ứng với email hoặc số điện thoại đã cung cấp.
Hệ thống hiển thị thông báo không tìm thấy tài khoản.
Hệ thống hiển thị lại biểu mẫu nhập email hoặc số điện thoại.
Khách hàng nhập lại email hoặc số điện thoại.
Hệ thống tiếp nhận thông tin và quay lại bước 5 của luồng cơ bản.
A11: Mã xác thực không hợp lệ 
Hệ thống phát hiện mã xác thực không hợp lệ.
Hệ thống hiển thị thông báo mã xác thực không hợp lệ.
Hệ thống hiển thị lựa chọn nhập lại mã xác thực hoặc yêu cầu gửi lại mã xác thực.
A11.1: Nhập lại mã xác thực
Khách hàng nhập lại mã xác thực.
Hệ thống tiếp nhận mã xác thực và quay lại bước 11 của luồng cơ bản.
A11.2: Gửi lại mã xác thực
Khách hàng chọn gửi lại mã xác thực.
Hệ thống phát hành và gửi mã xác thực mới, sau đó quay lại bước 8 của luồng cơ bản.
Luồng ngoại lệ
E1: Không thể truy cập dữ liệu tài khoản 
Hệ thống không thể truy cập dữ liệu tài khoản để kiểm tra thông tin. 
Hệ thống hiển thị thông báo không thể thực hiện yêu cầu khôi phục mật khẩu. 
Hệ thống kết thúc Use Case thất bại. 
E2: Không thể gửi mã xác thực 
Hệ thống không thể phát hành hoặc gửi mã xác thực đến Email hoặc Số điện thoại đã đăng ký. 
Hệ thống hiển thị thông báo không thể gửi mã xác thực. 
Hệ thống kết thúc Use Case thất bại. 
E3: Không thể cập nhật mật khẩu mới 
Hệ thống không thể lưu mật khẩu mới vào cơ sở dữ liệu. 
Hệ thống giữ nguyên mật khẩu hiện tại của tài khoản. 
Hệ thống hiển thị thông báo đặt lại mật khẩu thất bại. 
Hệ thống kết thúc Use Case thất bại. 
Yêu cầu phi chức năng
NFR-01 – Hiệu năng
Hệ thống phải phản hồi nhanh khi kiểm tra Email hoặc Số điện thoại đã đăng ký.
Quá trình gửi và xác thực mã xác thực phải được thực hiện liên tục sau khi khách hàng gửi yêu cầu.
Trong thời gian xử lý, hệ thống phải hiển thị trạng thái đang xử lý.

NFR-02 – Bảo mật
Hệ thống chỉ cho phép thiết lập mật khẩu mới sau khi mã xác thực được kiểm tra hợp lệ.
Mật khẩu mới phải được mã hóa trước khi lưu vào cơ sở dữ liệu.
Mã xác thực chỉ được sử dụng cho yêu cầu khôi phục mật khẩu đang thực hiện.
Sau khi cập nhật thành công, mật khẩu cũ không còn được sử dụng để đăng nhập.

NFR-03 – Tính ổn định
Nếu xảy ra lỗi trong quá trình cập nhật mật khẩu, hệ thống phải giữ nguyên mật khẩu hiện tại.
Hệ thống không được cập nhật một phần dữ liệu tài khoản.
Hệ thống không được hiển thị thông báo thành công khi mật khẩu chưa được lưu thành công.

NFR-05 – Khả năng sử dụng
Giao diện phải hiển thị lần lượt:
Biểu mẫu nhập Email hoặc Số điện thoại.
Biểu mẫu nhập mã xác thực.
Biểu mẫu thiết lập mật khẩu mới.
Hệ thống phải hiển thị rõ các thông báo:
Không tìm thấy tài khoản.
Mã xác thực không hợp lệ.
Không thể gửi mã xác thực.
Đặt lại mật khẩu thành công.
Giao diện nhập mã xác thực phải cho phép:
Nhập lại mã xác thực.
Yêu cầu gửi lại mã xác thực.

NFR-06 – Toàn vẹn dữ liệu
Hệ thống chỉ cập nhật mật khẩu sau khi hoàn thành toàn bộ quy trình xác thực.
Mật khẩu mới phải được lưu toàn vẹn; nếu xảy ra lỗi, hệ thống phải giữ nguyên mật khẩu cũ.
Sau khi khôi phục mật khẩu thành công, khách hàng phải sử dụng mật khẩu mới trong các lần đăng nhập tiếp theo.

BƯỚC 11: THÊM CODE USECASE UC-BUS-07 TRONG docs/đặc tả hệ thống cho khách hàng(2).pdf (USECASE này xảy ra khi khách hàng mua voucher thành công, đơn hàng có trạng thái thanh toán thành công và ngay lập tức sinh mã code liền cho khách hàng. Hãy thêm vào code phần code này nhé.)
Tên UC
Nhận voucher đã mua 
Use case ID
BR_CUS_07
Mô tả
Hệ thống thực hiện phát hành voucher code điện tử sau khi đơn hàng được thanh toán thành công, hiển thị thông tin voucher và cho phép khách hàng xem lại voucher, trạng thái sử dụng và lịch sử đơn hàng. 
Actor
Khách hàng
Độ ưu tiên
Cao
Trigger
BR_CUS_07 – Nhận voucher đã mua
Tiền điều kiện
Đơn hàng của khách hàng đã được thanh toán thành công.
Giao dịch thanh toán đã được hệ thống xác nhận hợp lệ.
Hệ thống có khả năng xử lý phát hành voucher code.
Hậu điều kiện
Trường hợp thành công
Voucher code được sinh và gắn với đơn hàng.
Hệ thống hiển thị:
Mã voucher;
Mã QR mô phỏng;
Thời hạn sử dụng;
Chi nhánh áp dụng.
Voucher được lưu trong hệ thống để khách hàng có thể truy cập lại.
Khách hàng có thể xem:
Trạng thái sử dụng;
Lịch sử đơn hàng.
Trường hợp phát hành chưa hoàn tất
Đơn hàng được giữ ở trạng thái “Chờ phát hành mã”.
Voucher code chưa được tạo.
Hệ thống ghi nhận lỗi phát hành.
Luồng cơ bản
Hệ thống nhận xác nhận đơn hàng đã thanh toán thành công.
Hệ thống kiểm tra trạng thái thanh toán của đơn hàng.
Hệ thống xác nhận đơn hàng hợp lệ để phát hành voucher.
Hệ thống Sinh voucher code duy nhất gắn với đơn hàng.
Hệ thống Tạo mã QR mô phỏng tương ứng với voucher code.
Hệ thống Lưu voucher code và thông tin liên quan vào hệ thống.
Hệ thống Hiển thị trang xác nhận đơn hàng.
Hệ thống Hiển thị thông tin voucher gồm: mã voucher, mã QR mô phỏng, thời hạn sử dụng, chi nhánh áp dụng, tên đối tác, điều kiện sử dụng
khách hàng Xem thông tin voucher được hiển thị.
Khách hàng Truy cập mục “Voucher của tôi”.
Hệ thống Truy xuất danh sách voucher của khách hàng.
Hệ thống Hiển thị danh sách voucher cùng trạng thái sử dụng.
Hệ thống Hiển thị lịch sử đơn hàng liên quan đến voucher.
Hệ thống Kết thúc Use Case.
Luồng thay thế
A4 – Không sinh được voucher code
A4.1 Hệ thống Không thể sinh voucher code.
A4.2 Hệ thống Ghi nhận lỗi phát hành voucher.
A4.3 Hệ thống Cập nhật trạng thái đơn hàng thành “Lỗi sinh mã”.
A4.4 Hệ thống Hiển thị thông báo cho khách hàng về việc chưa thể phát hành voucher.
A4.5 Hệ thống Thông báo cho Quản trị viên để xử lý thủ công.
A4.6 Hệ thống Kết thúc Use Case.
A7 – Trang xác nhận không tải được
A7.1 Hệ thống Không thể hiển thị trang xác nhận đơn hàng.
A7.2 Hệ thống Không hiển thị thông tin voucher tại trang xác nhận.
A7.3 Hệ thống Hiển thị hướng dẫn truy cập mục “Đơn hàng của tôi”.
A7.4 Khách hàng Truy cập mục “Đơn hàng của tôi”.
A7.5 Hệ thống Truy xuất thông tin đơn hàng đã thanh toán.
A7.6 Hệ thống Hiển thị voucher code đã được phát hành.
A7.7 Hệ thống Kết thúc Use Case.
Luồng ngoại lệ
E1 – Không thể lưu voucher vào hệ thống
E1.1 Hệ thống Không thể lưu voucher code sau khi sinh.
E1.2 Hệ thống Không hiển thị thông tin voucher như một kết quả thành công.
E1.3 Hệ thống Ghi nhận lỗi hệ thống.
E1.4 Hệ thống Hiển thị thông báo: “Không thể phát hành voucher. Vui lòng thử lại.”
E1.5 Hệ thống Giữ trạng thái đơn hàng chưa hoàn tất phát hành voucher.
E1.6 Hệ thống Kết thúc Use Case thất bại.
E2 – Không thể truy xuất danh sách voucher
E2.1 Hệ thống Không thể truy xuất danh sách voucher tại bước 11.
E2.2 Hệ thống Không hiển thị danh sách voucher.
E2.3 Hệ thống Hiển thị thông báo: “Không thể tải danh sách voucher.”
E2.4 Hệ thống  Kết thúc Use Case thất bại.
YC Phi chức năng
NFR-01 – Hiệu năng
Hệ thống phải tự động phát hành voucher ngay sau khi thanh toán thành công.
Thời gian hiển thị trang xác nhận và thông tin voucher phải đảm bảo không gây gián đoạn trải nghiệm người dùng.
Hệ thống phải thể hiện trạng thái xử lý khi đang sinh voucher.
NFR-02 – Bảo mật
Voucher code phải là duy nhất và gắn với đúng đơn hàng.
Hệ thống chỉ cho phép khách hàng truy cập voucher thuộc về tài khoản của mình.
Hệ thống không hiển thị voucher của khách hàng khác.
NFR-03 – Tính ổn định
Hệ thống không được phát hành trùng voucher code.
Hệ thống phải đảm bảo dữ liệu voucher không bị mất sau khi sinh.
Khi xảy ra lỗi phát hành, hệ thống phải giữ trạng thái đơn hàng phù hợp.
NFR-05 – Khả năng sử dụng
Hệ thống phải hiển thị rõ:
Mã voucher;
Mã QR mô phỏng;
Thời hạn sử dụng;
Chi nhánh áp dụng.
Khách hàng có thể dễ dàng truy cập:
“Voucher của tôi”;
“Đơn hàng của tôi”.Thông báo lỗi phải rõ ràng và dễ hiểu.
NFR-06 – Khả năng kiểm toán
Hệ thống phải ghi nhận việc phát hành voucher.
Ghi nhận phải bao gồm:
Thời gian phát hành;
Đơn hàng liên quan;
Trạng thái phát hành.
Các lỗi phát hành phải được ghi nhận để xử lý.

BƯỚC 12:  THÊM CODE USECASE UC-ADM-06 TRONG docs/đặc tả hệ thống cho admin.pdf. code xong thì ghi lại luồng code (thứ tự mà bạn đã code) vào codeX_done.md
Tên UC
Hiển thị dashboard tổng quan hệ thống 
Use case ID
BR_ADM_06
Mô tả
Hệ thống tổng hợp và hiển thị các chỉ số tổng quan về người dùng, đối tác, voucher, đơn hàng và doanh thu; đồng thời hiển thị các mục cần xử lý để Quản trị viên nắm bắt tình trạng vận hành và truy cập nhanh vào các màn hình quản lý tương ứng.
Actor
Admin
Độ ưu tiên
Cao
Trigger
Quản trị viên đăng nhập vào hệ thống và truy cập giao diện Admin Dashboard
Tiền điều kiện
Quản trị viên đã đăng nhập vào hệ thống.
Tài khoản có vai trò Quản trị viên.
Phiên đăng nhập còn hiệu lực.
Hệ thống có quyền truy xuất dữ liệu tổng hợp 
Hậu điều kiện
3.1. Trường hợp hiển thị thành công
Hệ thống hiển thị đầy đủ các chỉ số tổng quan:
Tổng người dùng
Tổng đối tác đang hoạt động 
Tổng đối tác chờ duyệt
Số lượng voucher đang bán
Số lượng voucher chờ duyệt
Tổng đơn hàng chờ xử lí (hoàn tiền, lỗi)
Doanh thu tổng
3.2. Trường hợp dữ liệu trống
Hệ thống hiển thị các khu vực dữ liệu với trạng thái trống.
Không hiển thị dữ liệu không tồn tại như một kết quả hợp lệ.
3.3. Trường hợp dữ liệu chưa tải được
Hệ thống hiển thị trạng thái đang tải.
Không hiển thị dữ liệu chưa xác định.
Luồng cơ bản
1  Quản trị viên  Đăng nhập vào hệ thống và truy cập giao diện Admin Dashboard.
2  Hệ thống  Kiểm tra phiên đăng nhập và quyền truy cập của tài khoản.
3  Hệ thống  Khởi tạo quá trình tải dữ liệu dashboard.
4  Hệ thống  Truy xuất dữ liệu tổng hợp từ các module: người dùng, đối tác, voucher, đơn hàng và doanh thu.
5  Hệ thống  Tính toán và truy xuất các chỉ số tổng quan gồm: Tổng người dùng, , Tổng đối tác đang hoạt động, Tổng đối tác chờ duyệt, Số lượng voucher đang bán, Số lượng voucher chờ duyệt, Tổng đơn hàng chờ xử lí (hoàn tiền, lỗi), Doanh thu tổng
6  Hệ thống  Hiển thị dashboard với các chỉ số tổng quan.
7  Hệ thống  Kết thúc Use Case.
Luồng thay thế
A1a – Dữ liệu dashboard chưa tải được 
A1a.1  Hệ thống  Không thể hoàn tất việc truy xuất dữ liệu dashboard trong thời gian chờ.
A1a.2  Hệ thống  Hiển thị trạng thái đang tải dữ liệu.
A1a.3  Hệ thống  Khi vượt quá thời gian chờ, hiển thị thông báo lỗi tải dữ liệu.
A1a.4  Hệ thống  Hiển thị lựa chọn cho phép tải lại dashboard.
A1a.5  Quản trị viên  Chọn tải lại dashboard.
A1a.6  Hệ thống  Thực hiện lại quá trình tải dữ liệu từ bước 3 của Basic Flow.
A1a.7  Hệ thống  Kết thúc Use Case nếu không tiếp tục thao tác.
A1b – Không có dữ liệu  
A1b.1  Hệ thống  Không có dữ liệu cho một hoặc nhiều chỉ số dashboard.
A1b.2  Hệ thống  Hiển thị các khu vực dữ liệu tương ứng với trạng thái trống.
A1b.3  Hệ thống  Không hiển thị dữ liệu không tồn tại như kết quả hợp lệ.
A1b.4  Hệ thống  Cho phép Quản trị viên tiếp tục xem các phần còn lại của dashboard.
A1b.5  Hệ thống  Kết thúc Use Case.
Luồng ngoại lệ
E1 – Không có quyền truy cập
E1.1  Hệ thống  Phát hiện tài khoản không có vai trò Quản trị viên.
E1.2  Hệ thống  Từ chối truy cập dashboard quản trị.
E1.3  Hệ thống  Hiển thị thông báo: “Bạn không có quyền truy cập.”
E1.4  Hệ thống  Kết thúc Use Case thất bại.
E2 – Dữ liệu trả về không hợp lệ 
E2.1  Hệ thống  Phát hiện phiên đăng nhập không còn hiệu lực.
E2.2  Hệ thống  Không thực hiện truy xuất dữ liệu dashboard.
E2.3  Hệ thống  Hiển thị yêu cầu đăng nhập lại.
E2.4  Hệ thống  Kết thúc Use Case thất bại.
E3 – Không thể truy xuất dữ liệu dashboard
E3.1  Hệ thống  Không thể truy xuất dữ liệu từ một hoặc nhiều module.
E3.2  Hệ thống  Không hiển thị dữ liệu không đầy đủ như kết quả hợp lệ.
E3.3  Hệ thống  Hiển thị thông báo lỗi tải dữ liệu.
E3.4  Hệ thống  Cho phép thực hiện lại thao tác tải dữ liệu.
E3.5  Hệ thống  Kết thúc Use Case nếu không thể khôi phục dữ liệu.
YC Phi chức năng
NFR-01 – Hiệu năng
Dashboard phải hiển thị trong thời gian hợp lý sau khi Quản trị viên truy cập.
Các chỉ số tổng quan phải được tính toán nhanh để không làm gián đoạn trải nghiệm.
Hệ thống phải thể hiện trạng thái đang tải trong quá trình truy xuất dữ liệu.
NFR-02 – Bảo mật
Chỉ tài khoản có vai trò Quản trị viên mới được truy cập dashboard.
Hệ thống phải kiểm tra quyền trước khi truy xuất dữ liệu tổng hợp.
Không hiển thị dữ liệu dashboard cho tài khoản không có quyền.
NFR-03 – Tính ổn định
Hệ thống phải xử lý lỗi khi không thể truy xuất dữ liệu từ các module.
Không được hiển thị dữ liệu sai hoặc chưa hoàn chỉnh như dữ liệu hợp lệ.
Dashboard không được gây lỗi toàn bộ hệ thống nếu một phần dữ liệu bị lỗi.
NFR-05 – Khả năng sử dụng
Các chỉ số tổng quan phải được hiển thị rõ ràng và dễ phân biệt.
Các mục cần xử lý phải được hiển thị riêng biệt.
Hệ thống phải cho phép chọn trực tiếp vào từng chỉ số hoặc mục để chuyển sang màn hình quản lý tương ứng.
Trạng thái giao diện phải rõ ràng:
Đang tải
Có dữ liệu
Không có dữ liệu
Lỗi tải dữ liệu
NFR-06 – Khả năng kiểm toán
Dashboard phải phản ánh dữ liệu tổng hợp chính xác tại thời điểm truy xuất.
Không hiển thị dữ liệu không xác định hoặc chưa được hệ thống xác nhận.
Các chỉ số hiển thị phải có nguồn dữ liệu rõ ràng từ các module tương ứng.

NOTE: Khách hàng "Thanh toán hụt" (Bỏ dở giữa chừng): Nếu khách hàng được chuyển hướng sang trang VNPay, nhưng sau đó tắt trình duyệt, bấm nút Hủy, hoặc để quá hạn thanh toán mà không nhập mã OTP trả tiền, thì cổng thanh toán sẽ không ghi nhận thành công. Lúc này, trong payment.service.js (dòng 92), hệ thống được thiết kế chủ đích là giữ nguyên trạng thái đơn hàng là "Cho thanh toan" chứ không xóa đi (để khách hàng có thể thanh toán lại sau nếu muốn).

=> Kết luận: 3 đơn hàng "Chờ thanh toán" ngày 6/8 mà bạn thấy trong ảnh chính là 3 lần bấm "Thanh toán" nhưng bỏ dở (không trả tiền) của tài khoản mytran trong quá trình test hệ thống. Hệ thống ghi nhận đúng lịch sử thao tác chứ không hề lưu sai tài khoản.

Lưu ý thêm: Trong thực tế, để dọn dẹp các đơn "Chờ thanh toán" rác do khách hàng bỏ dở, các hệ thống thường sẽ có một tác vụ chạy ngầm (cron job) tự động chuyển trạng thái sang "Đã hủy" sau 15-30 phút không thanh toán. Nếu hiện tại hệ thống chưa có tính năng cron job này, các đơn "Chờ thanh toán" sẽ nằm đó mãi mãi.