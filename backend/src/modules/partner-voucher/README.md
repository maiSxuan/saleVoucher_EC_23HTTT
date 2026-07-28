# Partner Voucher Module

Purpose:

- Quản lý partner, chi nhánh, voucher, workflow phê duyệt voucher và báo cáo cho đối tác.

Structure:

- presentation/: nhận request HTTP, định nghĩa route, DTO và validator.
- business/services/: chứa logic nghiệp vụ cho partner, branch, approval và report.
- data/repositories/: thao tác dữ liệu cho partner, branch, voucher và approval.
- data/models/: định nghĩa entity/model mẫu cho module.

Main files:

- presentation/controllers/: partner.controller.js, branch.controller.js, partner-approval.controller.js, voucher.controller.js, voucher-approval.controller.js, partner-report.controller.js
- presentation/routes/: partner.routes.js, branch.routes.js, admin-partner.routes.js, voucher.routes.js, admin-voucher.routes.js, partner-report.routes.js
- business/services/: partner.service.js, branch.service.js, partner-approval.service.js, voucher.service.js, voucher-approval.service.js, partner-report.service.js
- data/repositories/: partner.repository.js, branch.repository.js, branch-request.repository.js, voucher.repository.js, voucher-branch.repository.js, voucher-approval.repository.js
- data/models/: partner.model.js, branch.model.js, branch-request.model.js, voucher.model.js, voucher-branch.model.js

Note:

- Đây là scaffold mẫu, chưa nối với database thật.
- Khi triển khai thật, service sẽ gọi repository và dùng validator/DTO ở presentation layer.

Use case chính
BR-PAR-01 đến BR-PAR-04
BR-PAR-07
BR-ADM-02
BR-ADM-03

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
