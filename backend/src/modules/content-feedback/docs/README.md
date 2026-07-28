# Content Feedback Module

Module này dùng để quản lý phản hồi và nội dung người dùng gửi lên.

## Mục đích

- Thu thập feedback từ khách hàng hoặc staff
- Dễ mở rộng sang đánh giá, bình luận, báo cáo nội dung

## Cấu trúc

- presentation: controller, route, validator, dto
- business: service chứa logic nghiệp vụ
- data: repository và model

## API mẫu

- GET /content-feedback
- POST /content-feedback

## Ghi chú

- File hiện tại đang dùng mock data để người mới dễ hiểu trước.
- Khi có database thật, chỉ cần đổi repository.

model = cấu trúc dữ liệu / bảng
repository = cách lấy/ghi dữ liệu
