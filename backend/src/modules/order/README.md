# Module Order (Quản lý đơn hàng & Đồng bộ Khách hàng - Admin)

Module này chuyên trách toàn bộ nghiệp vụ liên quan đến đơn hàng, thanh toán, phát hành mã voucher (`voucher_mua`), xử lý bất thường thanh toán (A4a), hủy đơn (A4b), hoàn tiền mô phỏng (A4c), cấp lại mã lỗi (A4d) và nhật ký hệ thống theo chuẩn `BR-ADM-04`.

## Cấu trúc thư mục
- `business/services/`: Xử lý logic nghiệp vụ đơn hàng.
- `data/models/`: Định nghĩa entity/model dữ liệu đơn hàng.
- `data/repositories/`: Tương tác cơ sở dữ liệu Supabase.
- `presentation/controllers/`: Tiếp nhận HTTP request, gọi service.
- `presentation/routes/`: Khai báo API endpoints kèm middleware phân quyền.
- `presentation/validators/`: Kiểm tra tính hợp lệ dữ liệu đầu vào.
- `presentation/dtos/`: Chuẩn hóa dữ liệu truyền tải.
