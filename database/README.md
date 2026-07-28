# Database Guide

## Mục đích

- Chứa schema, migration và seed dữ liệu cho hệ thống.
- Hỗ trợ tạo bảng trên Supabase một cách rõ ràng và dễ chạy.
- Không phải thay thế Supabase. Repo chỉ lưu các lệnh SQL để team chia sẻ và version lại, còn Supabase mới là nơi thực sự tạo bảng và lưu dữ liệu.

## Cấu trúc

- migrations/: các file SQL migrate theo phiên bản
- seeds/: dữ liệu mẫu để test
- create_tables.sql: file SQL dùng để tạo bảng nhanh trên Supabase

## Cách tạo bảng trên Supabase

### 1. Tạo project Supabase

- Vào https://supabase.com
- Tạo project mới
- Chọn database region phù hợp

### 2. Mở SQL Editor

- Vào Supabase Dashboard
- Chọn Database -> SQL Editor
- Chọn New Query

### 3. Chạy file tạo bảng

- File [create_tables.sql](create_tables.sql) chỉ là bản SQL mẫu nằm trong repo.
- Bạn phải copy nội dung của file đó rồi dán vào Supabase SQL Editor.
- Nhấn Run để Supabase tạo bảng thật.

### 4. Chạy dữ liệu mẫu (nếu cần)

- File [seeds/001_seed.sql](seeds/001_seed.sql) cũng là file SQL mẫu trong repo.
- Bạn copy rồi dán vào Supabase SQL Editor.
- Nhấn Run để đổ dữ liệu mẫu vào database thật.

### 5. Kiểm tra kết quả

- Vào Table Editor để xem các bảng vừa tạo
- Nếu cần, vào Database -> Logs để kiểm tra lỗi SQL

## Cách dùng với dự án này

Sau khi tạo bảng, hãy cấu hình biến môi trường cho backend:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Sau đó backend có thể kết nối vào Supabase thông qua [backend/src/config/supabase.js](../backend/src/config/supabase.js).

## Lưu ý quan trọng

- Supabase dùng PostgreSQL, nên SQL phải đúng cú pháp PostgreSQL.
- Nếu chạy nhiều lần, nên dùng `IF NOT EXISTS` để tránh lỗi bảng đã tồn tại.
- Với dữ liệu mẫu, nên dùng seed riêng để tránh làm lẫn dữ liệu thật.
