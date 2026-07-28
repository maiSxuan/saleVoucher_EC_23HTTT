# Customer Commerce Module

Purpose:

- Xử lý luồng mua hàng, giỏ hàng, thanh toán, catalog voucher và quản lý đơn hàng cho khách hàng.

Structure:

- presentation/: nhận request HTTP, định nghĩa route, DTO và validator.
- business/services/: chứa logic nghiệp vụ cho customer, catalog, cart, order, payment và admin-order.
- data/repositories/: thao tác dữ liệu cho customer, cart, order và payment.
- data/models/: định nghĩa entity/model mẫu cho module.

Main files:

- presentation/controllers/: customer.controller.js, catalog.controller.js, cart.controller.js, order.controller.js, payment.controller.js, admin-order.controller.js
- presentation/routes/: customer.routes.js, catalog.routes.js, cart.routes.js, order.routes.js, payment.routes.js, admin-order.routes.js
- business/services/: customer.service.js, catalog-query.service.js, cart.service.js, order.service.js, payment.service.js, admin-order.service.js
- data/repositories/: customer.repository.js, cart.repository.js, cart-item.repository.js, order.repository.js, order-item.repository.js, payment.repository.js
- data/models/: customer.model.js, cart.model.js, cart-item.model.js, order.model.js, order-item.model.js, payment.model.js

Use case chính:

- BR-CUS-01 đến BR-CUS-06
- BR-ADM-04

Note:

- Đây là scaffold mẫu, chưa nối với database thật.
- Khi triển khai thật, service sẽ gọi repository và dùng validator/DTO ở presentation layer.

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
