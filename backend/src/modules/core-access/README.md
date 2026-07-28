# Core Access Module

Purpose:

- Quản lý đăng nhập, đăng ký, xác thực, phát hành voucher, xác thực voucher, redemption và dashboard admin.

Structure:

- presentation/: nhận request HTTP, định nghĩa route, DTO và validator.
- business/services/: chứa logic nghiệp vụ chính của module.
- data/repositories/: xử lý truy vấn dữ liệu và thao tác persistence.
- data/models/: định nghĩa entity/model mẫu cho module.

Main files:

- presentation/controllers/: auth.controller.js, user.controller.js, issued-voucher.controller.js, redemption.controller.js, audit-log.controller.js, admin-dashboard.controller.js
- presentation/routes/: auth.routes.js, user.routes.js, issued-voucher.routes.js, redemption.routes.js, audit-log.routes.js, dashboard.routes.js
- business/services/: auth.service.js, user.service.js, voucher-issuance.service.js, voucher-verification.service.js, voucher-redemption.service.js, audit-log.service.js, admin-dashboard.service.js
- data/repositories/: user.repository.js, issued-voucher.repository.js, usage-log.repository.js, audit-log.repository.js
- data/models/: user.model.js, issued-voucher.model.js, usage-log.model.js, audit-log.model.js

Use case chính:

- BR-ADM-01
- BR-CUS-07
- BR-PAR-05
- BR-PAR-06
- BR-ADM-06
- BR-ADM-07

Note:

- Đây là scaffold mẫu, chưa nối với database thật.
- Khi phát triển thật, các service sẽ gọi repository thay vì trả placeholder.

model = cấu trúc dữ liệu / bảng
repository = cách lấy/ghi dữ liệu

- DTOs dùng để làm gì?
  DTO = Data Transfer Object
  Để định dạng dữ liệu trước khi gửi đi hoặc nhận vào
  Mục đích:
  chuẩn hóa dữ liệu
  tránh controller/service nhận dữ liệu bừa bãi
  dễ kiểm soát input/output
  Ví dụ: frontend gửi { email, password }
  controller dùng DTO để chuẩn hóa và kiểm tra trước khi xử lý
- Validators dùng để làm gì?
  Validator dùng để kiểm tra dữ liệu đầu vào có đúng không.
  Ví dụ trong auth.validator.js:
  kiểm tra email/password có tồn tại không
  nếu thiếu thì báo lỗi sớm
