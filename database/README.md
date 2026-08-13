# Database Guide

## Mục đích

- Chứa schema, migration và seed dữ liệu cho hệ thống.
- Hỗ trợ tạo bảng trên Supabase một cách rõ ràng và dễ chạy.
- Không phải thay thế Supabase. Repo chỉ lưu các lệnh SQL để team chia sẻ và version lại, còn Supabase mới là nơi thực sự tạo bảng và lưu dữ liệu.

## Cấu trúc

- `migrations/`: các file SQL nâng cấp database hiện có theo phiên bản.
- `seeds.sql`: dữ liệu mẫu để test.
- `create_tables.sql`: file SQL dùng để tạo mới toàn bộ schema trên Supabase; đã bao gồm các index hiệu năng hiện tại.

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

- File [seeds.sql](seeds.sql) cũng là file SQL mẫu trong repo.
- Bạn copy rồi dán vào Supabase SQL Editor.
- Nhấn Run để đổ dữ liệu mẫu vào database thật.

### 5. Kiểm tra kết quả

- Vào Table Editor để xem các bảng vừa tạo
- Nếu cần, vào Database -> Logs để kiểm tra lỗi SQL

## Nâng cấp database đang có và thêm index

Không chạy lại `create_tables.sql` trên database đang có dữ liệu vì đầu file có các lệnh `DROP TABLE`.

Trong Supabase Dashboard, mở **SQL Editor -> New query**, rồi chạy lần lượt các migration cần thiết:

1. [20260812_admin_order_workflow.sql](migrations/20260812_admin_order_workflow.sql) để bổ sung schema cho luồng xử lý đơn hàng Admin.
2. [20260812_query_performance_indexes.sql](migrations/20260812_query_performance_indexes.sql) để thêm index theo các truy vấn thực tế của backend.

Migration index có thể chạy lại an toàn nhờ `IF NOT EXISTS`. Nên chạy lúc ít người dùng vì PostgreSQL sẽ khóa ghi ngắn hạn trên từng bảng trong lúc tạo index. Kết quả cuối script liệt kê toàn bộ index có tiền tố `idx_perf_` để kiểm tra.

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
- Index làm nhanh truy vấn đọc nhưng cũng tốn dung lượng và tăng chi phí ghi. Chỉ giữ các index khớp với `WHERE`, quan hệ và `ORDER BY` đang được backend sử dụng; theo dõi `pg_stat_user_indexes` trước khi bổ sung thêm.
