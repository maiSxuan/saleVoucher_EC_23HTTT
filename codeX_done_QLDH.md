# TỔNG HỢP LOGIC QUẢN LÝ ĐƠN HÀNG (UC-ADM-04 -> UC-ADM-07)

File này ghi chú lại toàn bộ kiến trúc, luồng xử lý và các thay đổi đã được thực hiện để hoàn thiện module Quản lý đơn hàng cho Admin theo đúng đặc tả hệ thống.

---

## 1. UC-ADM-04: Quản lý Đơn hàng (Xử lý đơn thanh toán & Cấp mã)
- **Tình huống:** Khách hàng thanh toán xong, nhưng có thể bị lỗi không sinh được mã tự động. Admin phải vào xử lý thủ công.
- **Frontend (AdminOrdersPage):**
  - Có tab hoặc bộ lọc xem các đơn hàng "Đã thanh toán" nhưng "Chưa cấp mã" (Lỗi sinh mã hệ thống).
  - Có nút "Cấp mã thủ công" gọi API để retry việc sinh mã voucher (gọi hàm `generateVoucherCodes`).
- **Backend (`order.service.js` & `order.repository.js`):**
  - Hàm `generateVoucherCodes`: Xử lý transaction, lấy mã từ bảng `voucher_codes` (nếu partner sinh sẵn) hoặc tự động sinh chuỗi random, insert vào bảng `voucher_mua`.
  - Nếu thành công, đổi trạng thái đơn hàng thành `Đã hoàn thành`. Cập nhật `thoi_gian_sinh_ma`.

## 2. UC-ADM-05: Duyệt yêu cầu hủy đơn
- **Tình huống:** Khách hàng có đơn "Đã thanh toán", bấm nút "Yêu cầu hủy đơn". Hệ thống tạo bản ghi trong bảng `YEUCAUHUY`. Trạng thái đơn chuyển thành "Chờ xử lý".
- **Frontend (AdminOrdersPage - Tab Yêu cầu hủy):**
  - Hiển thị danh sách các đơn có yêu cầu hủy.
  - Form duyệt: 
    - Nếu **Từ chối**: Nhập lý do từ chối -> Đơn hàng quay về trạng thái "Đã thanh toán".
    - Nếu **Chấp nhận**: Đơn hàng chuyển sang trạng thái "Đã hủy". Đồng thời hệ thống **tự động** nhảy sang bước Hoàn tiền (UC-ADM-06).
- **Backend (`order.service.js` - `approveCancelRequest` / `rejectCancelRequest`):**
  - Hàm `approveCancelRequest(orderId, adminId)`:
    - Update bảng `yeucauhuy` thành `Chap nhan`.
    - Update bảng `donhang` thành `Đã hủy`.
    - Tự động tạo bản ghi mới vào bảng `HOANTIEN` với trạng thái `Đang xử lý` để chuyển sang quy trình hoàn tiền.
  - Tích hợp `auditLogService` lưu lại log lịch sử duyệt của Admin.

## 3. UC-ADM-06: Hoàn tiền đơn hàng
- **Tình huống:** Sau khi Yêu cầu hủy đơn được chấp nhận (UC-ADM-05) hoặc Khiếu nại được giải quyết bằng cách hoàn tiền (UC-ADM-07), hoặc Admin chủ động Hủy đơn. Một bản ghi `HOANTIEN` được sinh ra.
- **Frontend (AdminOrdersPage / AdminRefunds):**
  - Hiển thị danh sách cần hoàn tiền (tiền mặt / Momo / VNPAY / PayPal).
  - Nút **"Hoàn tiền"**: Admin bấm xác nhận hoàn. Nếu là cổng thanh toán điện tử (như PayPal/VNPAY) thì gọi API tự động qua cổng.
- **Backend (`payment.service.js` & `paypal.gateway.js`):**
  - Hàm `refundOrder(orderId, adminId)`:
    - Tra cứu thông tin giao dịch gốc (`ma_gd_goc`) từ bảng `THANHTOAN`.
    - Dựa vào cổng thanh toán (VD: PayPal), gọi `paypalGateway.refundCapture({ captureId, amountVnd })`.
    - Nếu cổng trả về thành công: Update bảng `HOANTIEN` thành `Thành công`. Update bảng `THANHTOAN` thêm giao dịch âm.
    - Cập nhật log chi tiết.

## 4. UC-ADM-07: Quản lý Khiếu nại
- **Tình huống:** Khách hàng báo mã voucher không dùng được. Hệ thống sinh bản ghi `KHIEUNAI`.
- **Frontend (AdminComplaintsPage):**
  - Hiển thị khiếu nại trạng thái: `Mới`, `Đang xử lý`, `Đã giải quyết`.
  - Admin bấm **"Tiếp nhận"** -> trạng thái đổi thành `Đang xử lý`.
  - Admin xử lý qua 2 hướng:
    - **Hướng 1 (Từ chối):** Lý do từ chối, kết thúc khiếu nại (Đã giải quyết).
    - **Hướng 2 (Cấp lại mã mới):** Hủy mã cũ, sinh mã voucher mới cho khách (Lưu lịch sử đổi mã).
    - **Hướng 3 (Hoàn tiền):** Hủy mã cũ, tạo bản ghi Hoàn tiền (chuyển qua UC-ADM-06). Đơn hàng thành "Đã hủy".
- **Backend (`order.service.js` - `resolveComplaint`):**
  - Nhận action `REJECT`, `NEW_CODE`, `REFUND`.
  - Tích hợp kỹ lưỡng quy trình cấp mới mã voucher hoặc gọi quy trình tạo yêu cầu `HOANTIEN` (gắn liền với `ma_khieu_nai` để trace vết).

## 5. UI Khách hàng (HCI Cập nhật)
- Các mã voucher ở Frontend (`CustomerOrdersPage`) hiển thị các thẻ Badge trực quan báo hiệu "Đã đánh giá", "Đang khiếu nại". Ngăn chặn submit lặp lại bằng cách disabled.
- Khối "Quy trình xử lý Yêu cầu & Hoàn tiền" dạng Timeline (Progress Tracker) để khách hàng nắm rõ tiến độ (Thay cho bảng text cứng nhắc).

---
**Cam kết:** Tất cả các luồng xử lý database (Transaction), ghi log Audit (Lịch sử thao tác), và xử lý lỗi đồng bộ đều đã được ánh xạ chuẩn xác vào bộ Code Base hiện tại của hệ thống.
