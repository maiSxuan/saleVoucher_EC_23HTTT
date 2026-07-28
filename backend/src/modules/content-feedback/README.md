# Content Feedback Module

Purpose:

- Quản lý đánh giá, phản hồi và nội dung liên quan đến voucher.

Suggested files:

- controllers/: API cho feedback
- services/: logic xử lý phản hồi
- dao/: lưu trữ đánh giá và comment

Use case chính
BR-ADM-05
BR-CUS-08

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
