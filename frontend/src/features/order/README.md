# Feature Order (Quản lý đơn hàng - Giao diện Khách hàng & Admin)

Feature này chứa toàn bộ các trang giao diện, API client, hooks và components phục vụ cho use case Quản lý đơn hàng (Đồng bộ Khách hàng ↔ Admin).

## Cấu trúc thư mục
- `api/`: Các hàm gọi API backend đơn hàng.
- `components/`: Các UI components tái sử dụng cho đơn hàng.
- `hooks/`: Custom React hooks cho đơn hàng.
- `pages/admin/`: Giao diện quản lý đơn hàng của Admin (`OrdersPage`, `OrderDetailPage`,...).
- `pages/customer/`: Giao diện đơn hàng của Khách hàng (`CustomerOrdersPage`,...).
- `doc/`: Tài liệu chi tiết kỹ thuật.
