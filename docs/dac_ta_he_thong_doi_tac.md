# Đặc tả hệ thống cho đối tác

## 1. BR_PAR_06 — Xác nhận sử dụng voucher

| Trường | Nội dung |
|---|---|
| **Use case ID** | BR_PAR_06 |
| **Tên UC** | Xác nhận sử dụng voucher |
| **Actor** | Nhân viên chi nhánh |
| **Độ ưu tiên** | Cao |

**Mô tả:** Hệ thống cho phép nhân viên đối tác xác nhận việc sử dụng một voucher hợp lệ khi khách hàng xuất trình tại chi nhánh. Sau khi xác nhận, hệ thống cập nhật trạng thái voucher thành "Đã sử dụng" và ghi nhận nhật ký.

**Trigger:** Actor thực hiện thao tác xác nhận sử dụng voucher sau khi đã kiểm tra voucher code.

### Tiền điều kiện
1. Actor đã thực hiện thành công use case "Kiểm tra voucher code".
2. Voucher đã được hệ thống xác định là hợp lệ.
3. Voucher đang ở trạng thái cho phép sử dụng.
4. Actor có quyền thực hiện xác nhận sử dụng voucher.

### Hậu điều kiện

**Trường hợp thành công**
1. Trạng thái voucher được cập nhật thành "Đã sử dụng".
2. Hệ thống ghi nhận nhật ký bao gồm: Actor thực hiện; Thời gian xác nhận; Nội dung thao tác (xác nhận sử dụng voucher).
3. Hệ thống hiển thị thông báo xác nhận thành công.

**Trường hợp không thực hiện xác nhận**
1. Trạng thái voucher giữ nguyên.
2. Không phát sinh nhật ký sử dụng voucher.

### Luồng cơ bản
1. Nhân viên thực hiện use case Kiểm tra voucher code.
2. Hệ thống xác định voucher là hợp lệ và cho phép tiếp tục thao tác.
3. Hệ thống hiển thị thông tin voucher đã được kiểm tra trước đó (tên voucher, đối tác, chi nhánh, áp dụng, hạn, phần trăm giảm, điều kiện sử dụng).
4. Hệ thống hiển thị giá sản phẩm sau khi giảm và số tiền giảm.
5. Nhân viên chọn chức năng Xác nhận sử dụng voucher.
6. Hệ thống hiển thị yêu cầu xác nhận sử dụng voucher.
7. Nhân viên thực hiện thao tác xác nhận sử dụng voucher.
8. Hệ thống tiếp nhận yêu cầu xác nhận từ Actor.
9. Hệ thống cập nhật trạng thái voucher thành "Đã sử dụng".
10. Hệ thống ghi nhận nhật ký gồm người thực hiện, thời gian và nội dung thao tác.
11. Hệ thống hiển thị thông báo: "Xác nhận sử dụng voucher thành công."
12. Kết thúc Use Case.

### Luồng thay thế
**A1 – Voucher không hợp lệ**
- A1.1. Hệ thống xác định voucher không hợp lệ.
- A1.2. Hệ thống không hiển thị chức năng xác nhận sử dụng voucher.
- A1.3. Hệ thống hiển thị thông báo voucher không hợp lệ.
- A1.4. Hệ thống không cho phép tiếp tục thao tác xác nhận.
- A1.5. Hệ thống kết thúc Use Case.

### Luồng ngoại lệ
**E2 – Không thể cập nhật trạng thái voucher**
- E2.1. Hệ thống không thể hoàn tất việc cập nhật trạng thái voucher.
- E2.2. Hệ thống không ghi nhận nhật ký sử dụng.
- E2.3. Hệ thống hiển thị thông báo: "Không thể xác nhận sử dụng voucher. Vui lòng thử lại."
- E2.4. Hệ thống giữ nguyên trạng thái voucher trước đó.
- E2.5. Hệ thống kết thúc Use Case thất bại.

**E3 – Không thể ghi nhận nhật ký**
- E3.1. Hệ thống không thể ghi nhận nhật ký thao tác xác nhận sử dụng voucher.
- E3.2. Hệ thống không xác nhận thao tác thành công.
- E3.3. Hệ thống không cập nhật trạng thái voucher nếu nhật ký bắt buộc chưa được ghi nhận.
- E3.4. Hệ thống hiển thị thông báo: "Không thể hoàn tất thao tác do lỗi ghi nhận nhật ký."
- E3.5. Hệ thống giữ nguyên trạng thái voucher.
- E3.6. Hệ thống kết thúc Use Case thất bại.

### Yêu cầu phi chức năng

**NFR-01 – Hiệu năng**
1. Hệ thống phải phản hồi ngay sau khi Actor xác nhận sử dụng voucher.
2. Thao tác xác nhận không được gây gián đoạn quy trình thanh toán tại chi nhánh.
3. Trong thời gian xử lý, hệ thống phải thể hiện trạng thái đang xử lý để tránh thao tác lặp lại.

**NFR-02 – Bảo mật**
1. Chỉ Actor có quyền (đối tác hoặc nhân viên đối tác) mới được phép xác nhận sử dụng voucher.
2. Hệ thống phải kiểm tra quyền trước khi cho phép thao tác xác nhận.
3. Hệ thống phải kiểm tra lại trạng thái voucher tại thời điểm xác nhận để tránh sử dụng nhiều lần.

**NFR-03 – Tính ổn định**
1. Hệ thống không được cập nhật trạng thái voucher nếu quá trình xử lý chưa hoàn tất.
2. Hệ thống không được hiển thị thông báo thành công nếu chưa lưu dữ liệu thành công.
3. Hệ thống phải đảm bảo voucher không bị sử dụng nhiều lần trong trường hợp lỗi.

**NFR-05 – Khả năng sử dụng**
1. Hệ thống phải hiển thị rõ: Thông tin voucher; Trạng thái hiện tại của voucher.
2. Thao tác xác nhận phải rõ ràng và dễ nhận biết.
3. Hệ thống phải hiển thị thông báo rõ ràng trong các trường hợp: Xác nhận thành công; Voucher không hợp lệ; Không thể xác nhận.
4. Actor chỉ cần thực hiện thao tác xác nhận, không cần nhập thêm thông tin ngoài phạm vi use case.

**NFR-06 – Khả năng kiểm toán**
1. Hệ thống phải ghi nhận đầy đủ thao tác xác nhận sử dụng voucher.
2. Nhật ký phải bao gồm: Actor thực hiện; Thời gian thực hiện; Nội dung thao tác.
3. Thao tác chỉ được coi là thành công khi nhật ký đã được ghi nhận.

---

## BR-PAR-07 — Báo cáo đối tác

| Trường | Nội dung |
|---|---|
| **Tên UC** | Báo cáo đối tác |
| **Actor** | Owner, nhân viên quản lý |
| **Độ ưu tiên** | Cao |

**Mô tả:** Hệ thống cho phép Đối tác tải và xem báo cáo tổng quan về hiệu quả kinh doanh voucher, bao gồm các chỉ số tổng doanh thu, số lượng phát hành, số lượng bán và tỷ lệ sử dụng. Đối tác có thể lọc dữ liệu theo chương trình voucher hoặc khoảng thời gian, hệ thống sẽ cập nhật và hiển thị dữ liệu tương ứng.

**Trigger:** Đối tác truy cập chức năng Báo cáo trên giao diện sau khi đăng nhập.

### Tiền điều kiện
1. Đối tác đã đăng nhập vào hệ thống.
2. Tài khoản có vai trò Đối tác.
3. Phiên đăng nhập còn hiệu lực.
4. Hệ thống có dữ liệu voucher thuộc quyền quản lý của đối tác.

### Hậu điều kiện

**Trường hợp có dữ liệu**
1. Hệ thống đã hiển thị: Tổng doanh thu; Tổng voucher phát hành; Tổng voucher đã bán; Tỷ lệ sử dụng.
2. Hệ thống đã hiển thị dữ liệu chi tiết theo bộ lọc (nếu có).

**Trường hợp không có dữ liệu**
1. Hệ thống hiển thị thông báo phù hợp: Không có dữ liệu báo cáo; Không có giao dịch trong kỳ.
2. Không có dữ liệu nào bị thay đổi.

### Luồng cơ bản
1. Đối tác chọn chức năng Báo cáo trên giao diện.
2. Hệ thống kiểm tra phiên đăng nhập và quyền truy cập của tài khoản.
3. Hệ thống truy xuất dữ liệu báo cáo tổng quan của các chương trình voucher thuộc đối tác.
4. Hệ thống tính toán các chỉ số tổng quan, bao gồm: Tổng doanh thu, Tổng voucher phát hành, Tổng voucher đã bán, Tỷ lệ sử dụng.
5. Hệ thống hiển thị màn hình báo cáo tổng quan với các chỉ số đã tính toán.
6. Hệ thống hiển thị khu vực bộ lọc gồm: Chương trình voucher và Khoảng thời gian.
7. Đối tác chọn tiêu chí lọc theo chương trình voucher hoặc khoảng thời gian.
8. Hệ thống tiếp nhận tiêu chí lọc do Đối tác cung cấp.
9. Hệ thống truy xuất dữ liệu theo tiêu chí lọc đã chọn.
10. Hệ thống tính toán lại các chỉ số tương ứng với dữ liệu đã lọc.
11. Hệ thống hiển thị dữ liệu chi tiết và cập nhật các chỉ số theo tiêu chí lọc.
12. Hệ thống kết thúc Use Case.

### Luồng thay thế
**A1 – Chưa có chương trình voucher được duyệt**
- A1.1. Hệ thống không tìm thấy chương trình voucher nào thuộc đối tác.
- A1.2. Hệ thống không thực hiện tính toán các chỉ số báo cáo.
- A1.3. Hệ thống hiển thị thông báo: "Chưa có dữ liệu báo cáo."
- A1.4. Hệ thống hiển thị gợi ý tạo voucher mới.
- A1.5. Hệ thống kết thúc Use Case.

**A5 – Không có dữ liệu trong khoảng thời gian đã chọn**
- A5.1. Hệ thống không tìm thấy dữ liệu giao dịch phù hợp với khoảng thời gian hoặc chương trình đã chọn.
- A5.2. Hệ thống không thực hiện tính toán các chỉ số dựa trên dữ liệu rỗng.
- A5.3. Hệ thống hiển thị biểu đồ trống.
- A5.4. Hệ thống hiển thị thông báo: "Không có giao dịch trong kỳ này."
- A5.5. Hệ thống cho phép Đối tác thực hiện lại thao tác chọn bộ lọc.
- A5.6. Đối tác thay đổi tiêu chí lọc.
- A5.7. Hệ thống thực hiện lại quá trình truy xuất dữ liệu và quay về bước 9 của Basic Flow.
- A5.8. Đối tác không thay đổi bộ lọc.
- A5.9. Hệ thống kết thúc Use Case.

### Luồng ngoại lệ
**E1 – Không có quyền truy cập**
- E1.1. Hệ thống phát hiện tài khoản không có vai trò Đối tác.
- E1.2. Hệ thống từ chối truy cập dữ liệu báo cáo.
- E1.3. Hệ thống hiển thị thông báo: "Bạn không có quyền truy cập chức năng này."
- E1.4. Hệ thống kết thúc Use Case thất bại.

**E2 – Phiên đăng nhập không hợp lệ**
- E2.1. Hệ thống phát hiện phiên đăng nhập không còn hiệu lực.
- E2.2. Hệ thống không thực hiện truy xuất dữ liệu báo cáo.
- E2.3. Hệ thống hiển thị yêu cầu đăng nhập lại.
- E2.4. Hệ thống kết thúc Use Case thất bại.

**E3 – Không thể truy xuất dữ liệu báo cáo**
- E3.1. Hệ thống không thể truy xuất dữ liệu voucher hoặc giao dịch.
- E3.2. Hệ thống không thực hiện tính toán chỉ số báo cáo.
- E3.3. Hệ thống hiển thị thông báo: "Không thể tải dữ liệu báo cáo. Vui lòng thử lại."
- E3.4. Đối tác thực hiện lại thao tác.
- E3.5. Hệ thống thực hiện lại quá trình truy xuất dữ liệu.
- E3.6. Hệ thống kết thúc Use Case nếu tiếp tục thất bại.

### Yêu cầu phi chức năng

**NFR-01 – Hiệu năng**
- Hệ thống phải hiển thị báo cáo tổng quan trong thời gian hợp lý.
- Việc áp dụng bộ lọc phải cập nhật dữ liệu mà không làm gián đoạn giao diện.
- Trong quá trình xử lý, hệ thống phải thể hiện trạng thái đang tải dữ liệu.

**NFR-02 – Bảo mật**
- Chỉ tài khoản Đối tác mới được truy cập báo cáo.
- Hệ thống phải kiểm tra quyền trước khi truy xuất dữ liệu.
- Dữ liệu hiển thị phải thuộc phạm vi quản lý của đối tác.

**NFR-03 – Tính ổn định**
- Khi không thể tải dữ liệu, hệ thống phải hiển thị thông báo rõ ràng.
- Không được hiển thị dữ liệu sai hoặc chưa đầy đủ như kết quả thành công.
- Không được làm mất dữ liệu khi xảy ra lỗi.

**NFR-05 – Khả năng sử dụng**
- Các chỉ số báo cáo phải hiển thị rõ ràng: Tổng doanh thu, Tổng phát hành, Tổng đã bán, Tỷ lệ sử dụng.
- Bộ lọc phải có nhãn rõ ràng: Chương trình voucher, Khoảng thời gian.
- Hệ thống phải hiển thị thông báo rõ ràng cho các trường hợp: Không có dữ liệu báo cáo, Không có giao dịch trong kỳ.
- Biểu đồ phải phản ánh đúng dữ liệu tương ứng với bộ lọc.

**NFR-06 – Khả năng kiểm toán**
- Dữ liệu báo cáo phải phản ánh đúng dữ liệu thực tế của hệ thống.
- Không được hiển thị dữ liệu không thuộc phạm vi của đối tác.
- Kết quả báo cáo phải nhất quán với dữ liệu giao dịch và voucher.

---

## Đăng ký tài khoản doanh nghiệp

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Owner |
| **Use case liên quan** | Đăng nhập, Xác thực tài khoản |

**Tóm tắt:** Use case này mô tả quá trình Người dùng cung cấp thông tin tài khoản, thông tin doanh nghiệp đăng ký, người đại diện pháp lý cho doanh nghiệp để tạo tài khoản tham gia sàn. Tài khoản sau khi tạo sẽ được hệ thống chuyển đi duyệt.

**Trigger:** Người dùng truy cập trang chủ hệ thống và nhấn chức năng "Đăng ký trở thành đối tác".

**Điều kiện tiên quyết:** None

### Hậu điều kiện

**Trường hợp đăng ký thành công**
- Tài khoản đã được tạo với trạng thái là "Chờ duyệt".
- Hồ sơ đã được gửi đến admin chờ phê duyệt.

**Trường hợp đăng ký không thành công**
- Không tạo tài khoản doanh nghiệp.
- Không lưu tài khoản mới vào hệ thống.
- Không lưu thông tin vào hệ thống.

### Dòng sự kiện chính
1. Người dùng nhấn nút "Đăng ký trở thành đối tác" trên trang.
2. Hệ thống hiển thị form đăng ký.
3. Người dùng nhập thông tin tài khoản: Email/SĐT, Mật khẩu, Xác nhận lại mật khẩu.
4. Người dùng nhấn nút "Tiếp tục".
5. Hệ thống kiểm tra thông tin tài khoản chưa tồn tại.
6. Thực hiện use case "Xác thực tài khoản".
7. Người dùng thiết lập thông tin doanh nghiệp: Nhập tên doanh nghiệp; Nhập mã số thuế; Chọn loại hình doanh nghiệp; Nhập địa chỉ cơ sở chính; Chọn danh mục kinh doanh; Upload giấy phép kinh doanh.
8. Người dùng nhấn nút "Tiếp tục".
9. Hệ thống kiểm tra thông tin doanh nghiệp hợp lệ: mã số thuế không tồn tại.
10. Người dùng thiết lập thông tin chi nhánh: Nhập tên chi nhánh; Chọn khu vực; Nhập địa chỉ chi nhánh; Nhập số điện thoại; Chọn giờ hoạt động (giờ mở, giờ đóng, tạm nghỉ - option).
11. Người dùng thiết lập thông tin người đại diện: Nhập tên người đại diện; Chọn chức vụ hoặc nhập; Nhập CCCD; Nhập số điện thoại; Nhập email liên hệ.
12. Người dùng nhấn nút "Xác nhận đăng ký".
13. Hệ thống kiểm tra thông tin hợp lệ.
14. Hệ thống ghi nhận hồ sơ với trạng thái "Chờ duyệt".
15. Hệ thống gửi hồ sơ đến quản trị viên.
16. Hệ thống hiển thị thông báo: "Tài khoản đã được đăng ký. Hồ sơ doanh nghiệp đang được duyệt. Vui lòng chờ đến khi có kết quả."
17. Kết thúc use case.

### Dòng sự kiện phụ
- **A5.a — Trống trường dữ liệu tài khoản:** A5.a.1. Hiện thông báo lỗi tại các trường trống dữ liệu. Quay về bước 3.
- **A5.b — Email/SĐT đăng ký đã tồn tại:**
  - A5.b.1. Hiện thông báo "Email đã được đăng ký tài khoản. Bạn có muốn đăng nhập?"
  - A5.b.2x. Người dùng nhấn "Đăng nhập" → chuyển sang UC "Đăng nhập tài khoản".
  - A5.b.2y. Người dùng ở lại trang. Quay về bước 3.
- **A5.c — Mật khẩu và xác nhận mật khẩu không khớp:**
  - A5.c.1. Hệ thống báo lỗi tại trường "Xác nhận lại mật khẩu": "Mật khẩu xác nhận không khớp".
  - A5.c.2. Quay về bước 3.
- **A5.d — Email/SĐT sai định dạng:**
  - A5.d.1. Hệ thống báo lỗi tại trường tương ứng: "Email/Số điện thoại không đúng định dạng".
  - A5.d.2. Quay về bước 3.
- **A9a — Mã số thuế sai định dạng:** A9a.1. Hệ thống báo lỗi tại trường mã số thuế.
- **A9b — Mã số thuế không tồn tại:**
  - A9b.1. Hệ thống hiển thị thông báo "Mã số thuế không tồn tại, vui lòng kiểm tra lại".
  - A9b.2. Hệ thống xóa thông tin trong trường mã số thuế, focus vào trường đó.
  - A9b.3. Người dùng nhập lại mã số thuế. Quay về bước 7.
- **A9c — Không có loại hình doanh nghiệp hoặc danh mục kinh doanh:** A9c.1. Hệ thống báo lỗi tại khu vực chọn: "Phải chọn ít nhất một mục".
- **A9d — Trống trường thông tin doanh nghiệp (tên doanh nghiệp, địa chỉ cơ sở chính, hoặc chưa upload giấy phép kinh doanh):** A9d.1. Hệ thống báo lỗi tại từng trường trống tương ứng. Quay về bước 6.
- **A13a — Trống trường bắt buộc ở thông tin chi nhánh hoặc người đại diện:** A13a.1. Hệ thống báo lỗi tại các trường trống tương ứng. Quay về bước 9 hoặc bước 10 (tùy vị trí trường lỗi).
- **A13b — Số điện thoại chi nhánh / số điện thoại hoặc email người đại diện sai định dạng:**
  - A13b.1. Hệ thống báo lỗi tại trường tương ứng: "Sai định dạng".
  - A13b.2. Quay về bước 9 hoặc bước 10.
- **A13c — CCCD sai định dạng:**
  - A13c.1. Hệ thống báo lỗi tại trường CCCD: "Số CCCD không hợp lệ".
  - A13c.2. Quay về bước 10.
- **A13d — Giờ đóng chi nhánh nhỏ hơn hoặc bằng giờ mở chi nhánh:**
  - A13d.1. Hệ thống báo lỗi tại khu vực giờ hoạt động: "Giờ đóng cửa phải sau giờ mở cửa".
  - A13d.2. Quay về bước 9.

### Dòng ngoại lệ
**E1 — Lỗi upload giấy phép kinh doanh (sai định dạng/quá dung lượng)**
- E1.1. Hệ thống báo lỗi tại khu vực upload, nêu rõ định dạng/dung lượng cho phép.
- E1.2. Người dùng chọn lại file. Quay về bước 6.

**E2 — Mất kết nối / lỗi hệ thống khi ghi nhận hồ sơ (bước 13)**
- E2.1. Hệ thống hiển thị thông báo "Có lỗi xảy ra, vui lòng thử lại".
- E2.2. Dữ liệu đã nhập được giữ nguyên trên form.
- E2.3. Người dùng nhấn "Xác nhận đăng ký" lại. Quay về bước 11.

**E3 — Hệ thống không gửi được hồ sơ đến quản trị viên (lỗi nội bộ, xảy ra sau khi hồ sơ đã lưu ở bước 13)**
- E3.1. Hồ sơ vẫn được ghi nhận với trạng thái "Chờ duyệt" (không rollback).
- E3.2. Hệ thống ghi log lỗi để xử lý/gửi lại.
- E3.3. Người dùng vẫn nhận thông báo thành công như bước 15.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Mỗi bước validate (5, 8, 12) phải phản hồi trong thời gian hợp lý để không gây gián đoạn trải nghiệm điền form nhiều bước; upload giấy phép kinh doanh cần hiển thị tiến trình (progress) nếu file lớn.
- **NFR-03 Tính ổn định:** Nếu xảy ra lỗi hệ thống ở bước ghi nhận hồ sơ (E2), dữ liệu người dùng đã nhập ở các bước trước không được mất — cần giữ trạng thái form.
- **NFR-04 Khả năng mở rộng:** Form đăng ký cần dễ mở rộng thêm trường thông tin doanh nghiệp/chi nhánh trong tương lai (ví dụ: nhiều chi nhánh cùng lúc) mà không phải thiết kế lại toàn bộ luồng.
- **NFR-05 Khả năng sử dụng:** Form nhiều bước (3 phần: tài khoản – doanh nghiệp – chi nhánh/người đại diện) cần có chỉ báo tiến trình (step indicator) để người dùng biết đang ở bước nào. Giao diện responsive trên di động, đặc biệt cho phần upload giấy phép kinh doanh. Thông báo lỗi phải hiển thị ngay tại trường liên quan (inline validation), không chỉ hiện ở popup chung chung.
- **NFR-06 Khả năng kiểm toán:** Mỗi hồ sơ đăng ký (thành công hoặc thất bại ở bước ghi nhận) cần được ghi log thời gian, IP/thiết bị nhằm phục vụ truy vết nếu phát sinh gian lận đăng ký (liên quan RB-12).

---

## 2. Đăng nhập

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Đối tác (tất cả role) |
| **Use case liên quan** | Quên mật khẩu, Đăng xuất |

**Tóm tắt:** Use case mô tả quá trình đối tác đăng nhập vào hệ thống bằng email/SĐT và mật khẩu để truy cập các chức năng quản lý voucher, xác thực sử dụng và báo cáo.

**Trigger:** Người dùng nhấn nút "Đăng nhập" trên trang, hoặc bị hệ thống điều hướng đến trang đăng nhập khi truy cập chức năng yêu cầu xác thực.

**Điều kiện tiên quyết:** Tài khoản đối tác đã tồn tại trong hệ thống.

### Hậu điều kiện
1. **Đăng nhập thành công:** Phiên làm việc được tạo, điều hướng về trang dashboard.
2. **Đăng nhập không thành công:** Không thiết lập phiên làm việc; Không cấp quyền truy cập vào hệ thống.

### Dòng sự kiện chính
1. Người dùng truy cập trang đăng nhập.
2. Hệ thống hiển thị form đăng nhập (Email/SĐT, Mật khẩu).
3. Người dùng nhập Email/SĐT và Mật khẩu.
4. Người dùng nhấn nút "Đăng nhập".
5. Hệ thống kiểm tra thông tin đăng nhập khớp với dữ liệu đã lưu.
6. Hệ thống kiểm tra trạng thái tài khoản đối tác.
7. Hệ thống tạo phiên làm việc, điều hướng vào trang quản lý đối tác tương ứng với vai trò.
8. Kết thúc use case.

### Dòng sự kiện phụ
- **A3.a — Trống trường Email/SĐT hoặc Mật khẩu:** A3.a.1. Hệ thống báo lỗi tại trường trống. Quay về bước 3.
- **A3.b — Người dùng nhấn "Quên mật khẩu":** A3.b.1. Chuyển sang UC "Quên mật khẩu".
- **A5.a — Sai Email/SĐT hoặc Mật khẩu:**
  - A5.a.1. Hệ thống hiển thị thông báo chung: "Email/SĐT hoặc mật khẩu không đúng".
  - A5.a.2. Quay về bước 3.
- **A6.a — Tài khoản ở trạng thái "Chờ duyệt":** A6.a.1. Hệ thống hiển thị thông báo: "Hồ sơ doanh nghiệp đang được duyệt, vui lòng quay lại sau". Không tạo phiên làm việc.
- **A6.b — Tài khoản ở trạng thái "Từ chối":** A6.b.1. Hệ thống hiển thị thông báo lý do từ chối. Không tạo phiên làm việc.
- **A6.c — Tài khoản ở trạng thái "Khóa":** A6.c.1. Hệ thống hiển thị thông báo: "Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên". Không tạo phiên làm việc.

### Dòng ngoại lệ
- **E1 — Đăng nhập sai liên tiếp quá số lần cho phép:**
  - E1.1. Hệ thống tạm khóa đăng nhập trong khoảng thời gian nhất định.
  - E1.2. Hiển thị thông báo: "Bạn đã nhập sai quá nhiều lần, vui lòng thử lại sau [X phút]".
- **E2 — Lỗi hệ thống khi tạo phiên làm việc:** E2.1. Hệ thống hiển thị thông báo lỗi, yêu cầu thử lại. Quay về bước 4.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Xác thực đăng nhập phản hồi nhanh, không gây cảm giác chờ đợi.
- **NFR-02 Bảo mật:** Mật khẩu truyền đi phải được mã hóa (HTTPS); session token không lộ trong URL; giới hạn số lần thử sai (rate limiting); không phân biệt lỗi "sai email" và "sai mật khẩu" trong thông báo.
- **NFR-03 Tính ổn định:** Nếu hệ thống lỗi khi tạo session, không được đăng nhập ở trạng thái "nửa vời" (session không hợp lệ).
- **NFR-05 Khả năng sử dụng:** Có tùy chọn "Ghi nhớ đăng nhập"; thông báo lỗi rõ ràng, hiển thị ngay tại form.
- **NFR-06 Khả năng kiểm toán:** Ghi log mọi lần đăng nhập (thành công/thất bại) kèm thời gian, IP để phục vụ truy vết bảo mật.

---

## 3. Quên mật khẩu

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Đối tác (tất cả role) |
| **Use case liên quan** | Đăng nhập |

**Tóm tắt:** Use case mô tả quá trình đối tác lấy lại quyền truy cập tài khoản khi quên mật khẩu, thông qua xác thực Email/SĐT bằng mã OTP mô phỏng (theo ASM-02).

**Trigger:** Người dùng nhấn "Quên mật khẩu" tại trang đăng nhập.

**Điều kiện tiên quyết:** Tài khoản đối tác đã tồn tại và đang ở trạng thái cho phép đăng nhập (Hoạt động).

**Hậu điều kiện:** Mật khẩu tài khoản được cập nhật thành mật khẩu mới.

### Dòng sự kiện chính
1. Người dùng nhấn "Quên mật khẩu" tại trang đăng nhập.
2. Hệ thống hiển thị form nhập Email/SĐT.
3. Người dùng nhập Email/SĐT đã đăng ký.
4. Người dùng nhấn "Gửi yêu cầu".
5. Hệ thống kiểm tra Email/SĐT tồn tại trong hệ thống.
6. Hệ thống gửi mã OTP (mô phỏng) đến Email/SĐT.
7. Hệ thống hiển thị thông báo "Đã gửi mã xác nhận, vui lòng kiểm tra".
8. Người dùng nhập mã OTP nhận được.
9. Người dùng nhấn "Xác nhận".
10. Hệ thống kiểm tra mã OTP hợp lệ và còn hiệu lực.
11. Hệ thống hiển thị form nhập mật khẩu mới (Mật khẩu mới, Xác nhận mật khẩu mới).
12. Người dùng nhập mật khẩu mới và xác nhận.
13. Người dùng nhấn "Đặt lại mật khẩu".
14. Hệ thống kiểm tra mật khẩu mới hợp lệ.
15. Hệ thống cập nhật mật khẩu mới.
16. Hệ thống hiển thị thông báo "Đặt lại mật khẩu thành công" và điều hướng về trang đăng nhập.
17. Kết thúc use case.

### Dòng sự kiện phụ
- **A3.a — Trống trường Email/SĐT:** A3.a.1. Hệ thống báo lỗi tại trường trống. Quay về bước 3.
- **A5.a — Email/SĐT không tồn tại trong hệ thống:** A5.a.1. Hệ thống vẫn hiển thị thông báo "email không tồn tại". Không thực sự gửi OTP. Kết thúc use case.
- **A10.a — Mã OTP sai:** A10.a.1. Hệ thống báo lỗi: "Mã xác nhận không đúng". Quay về bước 8.
- **A10.b — Mã OTP hết hạn:**
  - A10.b.1. Hệ thống hiển thị thông báo "Mã đã hết hạn" kèm nút "Gửi lại mã".
  - A10.b.2. Người dùng nhấn "Gửi lại mã". Quay về bước 6.
- **A14.a — Mật khẩu mới không đủ mạnh (độ dài/ký tự theo quy định):** A14.a.1. Hệ thống báo lỗi tại trường mật khẩu, nêu rõ yêu cầu định dạng.
- **A14.b — Mật khẩu mới và xác nhận không khớp:** A14.b.1. Hệ thống báo lỗi tại trường xác nhận. Quay về bước 12.

### Dòng ngoại lệ
- **E1 — Lỗi gửi OTP (hệ thống mô phỏng gửi thất bại):** E1.1. Hệ thống hiển thị thông báo lỗi, cho phép thử gửi lại. Quay về bước 4.
- **E2 — Lỗi hệ thống khi cập nhật mật khẩu (bước 15):** E2.1. Hệ thống hiển thị thông báo lỗi, mật khẩu cũ vẫn còn hiệu lực. Người dùng thử lại từ bước 13.
- **E3 — Nhập sai OTP quá số lần cho phép:** E3.1. Hệ thống vô hiệu hóa mã OTP hiện tại, yêu cầu gửi lại mã mới (quay về bước 6) hoặc tạm khóa chức năng trong khoảng thời gian.

**Business Rule:** Số lần nhập sai OTP là 3.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** OTP phải được gửi (mô phỏng) và phản hồi nhanh sau khi người dùng nhấn "Gửi yêu cầu".
- **NFR-02 Bảo mật:** OTP có thời gian hết hạn ngắn; giới hạn số lần thử OTP sai.
- **NFR-03 Tính ổn định:** Không để tài khoản ở trạng thái không có mật khẩu hợp lệ nếu quá trình cập nhật thất bại giữa chừng.
- **NFR-05 Khả năng sử dụng:** Hiển thị rõ thời gian còn lại của OTP; cho phép gửi lại mã dễ dàng.
- **NFR-06 Khả năng kiểm toán:** Ghi log các yêu cầu đặt lại mật khẩu (thời gian, IP) để phục vụ điều tra nếu có lạm dụng.

---

## 4. Đăng xuất

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Đối tác (tất cả role) |
| **Use case liên quan** | Đăng nhập |

**Tóm tắt:** Use case mô tả quá trình đối tác kết thúc phiên làm việc hiện tại trên hệ thống, chủ động hoặc do phiên hết hạn.

**Trigger:** Người dùng nhấn nút "Đăng xuất"; hoặc hệ thống tự động đăng xuất khi phiên làm việc hết hạn.

**Điều kiện tiên quyết:** Người dùng đã đăng nhập và đang hoạt động.

**Hậu điều kiện:** Kết thúc phiên làm việc, người dùng không còn quyền truy cập các chức năng yêu cầu đăng nhập cho đến khi đăng nhập lại.

### Dòng sự kiện chính
1. Người dùng nhấn nút "Đăng xuất".
2. Hệ thống hủy phiên làm việc hiện tại (session/token).
3. Hệ thống điều hướng người dùng về trang đăng nhập.
4. Hệ thống hiển thị thông báo "Bạn đã đăng xuất thành công".
5. Kết thúc use case.

### Dòng sự kiện phụ
**A1.a — Đăng xuất tự động do phiên làm việc hết hạn (session timeout)**
- A1.a.1. Hệ thống tự động hủy phiên làm việc khi hết thời gian quy định mà không có thao tác.
- A1.a.2. Hệ thống điều hướng về trang đăng nhập kèm thông báo "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại". Quay về luồng chính từ bước 3.

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi hủy phiên làm việc phía server**
- E1.1. Hệ thống vẫn xóa token/phiên phía client để đảm bảo người dùng không thể tiếp tục thao tác.
- E1.2. Hệ thống ghi log lỗi để dọn dẹp phiên còn sót phía server sau.

**Business Rule:** Phiên làm việc tự động hết hạn sau 30 phút không hoạt động.

### Yêu cầu phi chức năng
- **NFR-02 Bảo mật:** Token/session phải bị vô hiệu hóa ngay lập tức phía server sau khi đăng xuất, không chỉ xóa phía client.
- **NFR-03 Tính ổn định:** Đăng xuất phải thành công dù có lỗi mạng tạm thời (ưu tiên xóa client-side trước).
- **NFR-06 Khả năng kiểm toán:** Ghi log thời điểm đăng xuất (chủ động hoặc do timeout).

---

## 5. Xác thực tài khoản

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Owner |
| **Use case liên quan** | Đăng ký |

**Tóm tắt:** UC mô tả bước xác thực quyền sở hữu Email/SĐT thông qua mã OTP mô phỏng, được gọi từ luồng đăng ký tài khoản đối tác trước khi tiếp tục nhập hồ sơ doanh nghiệp.

**Trigger:** Khi người dùng đăng ký tài khoản và ở bước kiểm tra tài khoản tồn tại xong.

**Điều kiện tiên quyết:** Email/SĐT đã được nhập và xác nhận chưa tồn tại trong hệ thống.

### Hậu điều kiện
1. **Trường hợp xác thực thành công:** Email/SĐT được đánh dấu đã xác thực; Tiếp tục bước 6 của luồng "Đăng ký tài khoản doanh nghiệp".
2. **Trường hợp xác thực không thành công (quá số lần cho phép):** Hệ thống vô hiệu hóa mã hiện tại; Hệ thống tạm khóa chức năng trong một khoảng thời gian.

### Dòng sự kiện chính
1. Hệ thống gửi mã OTP (mô phỏng) đến Email/SĐT vừa nhập.
2. Hệ thống hiển thị màn hình nhập mã OTP kèm đồng hồ đếm ngược thời gian hiệu lực.
3. Người dùng nhập mã OTP nhận được.
4. Người dùng nhấn "Xác nhận".
5. Hệ thống kiểm tra mã OTP đúng và còn hiệu lực.
6. Hệ thống đánh dấu Email/SĐT đã xác thực.
7. Hệ thống quay lại luồng đăng nhập, tiếp tục từ bước 6 (nhập thông tin doanh nghiệp).
8. Kết thúc use case.

### Dòng sự kiện phụ
- **A3.a — Trống trường OTP:** A3.a.1. Hệ thống báo lỗi tại trường trống. Quay về bước 3.
- **A5.a — Mã OTP sai:** A5.a.1. Hệ thống báo lỗi "Mã xác nhận không đúng". Quay về bước 3.
- **A5.b — Mã OTP hết hạn:**
  - A5.b.1. Hệ thống hiển thị thông báo "Mã đã hết hạn" kèm nút "Gửi lại mã".
  - A5.b.2. Người dùng nhấn "Gửi lại mã". Quay về bước 1.
- **A2.a — Người dùng chủ động nhấn "Gửi lại mã" trước khi hết hạn:** A2.a.1. Hệ thống vô hiệu hóa mã cũ, gửi mã mới. Quay về bước 1.

### Dòng ngoại lệ
- **E1 — Lỗi gửi OTP (hệ thống mô phỏng gửi thất bại):** E1.1. Hệ thống hiển thị thông báo lỗi, cho phép thử gửi lại. Quay về bước 1.
- **E2 — Nhập sai OTP quá số lần cho phép:** E2.1. Hệ thống vô hiệu hóa mã hiện tại, yêu cầu gửi lại mã mới hoặc tạm khóa chức năng trong khoảng thời gian (chống dò mã).

### Business Rule
- Mã OTP có thời gian hết hạn — đề xuất 5 phút, áp dụng thống nhất với UC (Quên mật khẩu).
- Giới hạn số lần nhập sai OTP và số lần gửi lại trong một khoảng thời gian.
- Tại thời điểm này, hồ sơ đối tác chưa được ghi nhận chính thức — trạng thái "đã xác thực" cần được giữ tạm trong phiên làm việc (session/tạm) cho đến khi toàn bộ form được xác nhận.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Gửi và xác thực OTP phản hồi nhanh, tránh làm gián đoạn luồng đăng ký nhiều bước.
- **NFR-02 Bảo mật:** OTP hết hạn ngắn; giới hạn số lần thử sai/gửi lại.
- **NFR-05 Khả năng sử dụng:** Hiển thị rõ thời gian còn lại; cho phép quay lại sửa Email/SĐT nếu nhập sai (quay về SUC-PAR-01 bước 3) thay vì buộc chờ hết hạn.
- **NFR-06 Khả năng kiểm toán:** Ghi log các lần gửi/xác thực OTP (thời gian, kết quả) phục vụ điều tra lạm dụng.

---

## 6. Cập nhật hồ sơ chi nhánh

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Owner |

**Tóm tắt:** Đối tác gửi yêu cầu thêm, sửa, hoặc xóa chi nhánh. Mọi thay đổi đều phải được quản trị viên duyệt trước khi chính thức áp dụng; thông tin/trạng thái hiện hành vẫn giữ nguyên hiệu lực trong thời gian chờ.

**Trigger:** Đối tác chọn chức năng "Quản lý chi nhánh" trong trang quản lý hồ sơ.

**Điều kiện tiên quyết:** Đối tác đã đăng nhập, tài khoản ở trạng thái "Hoạt động".

### Hậu điều kiện

**Trường hợp chỉ xem danh sách chi nhánh**
- Hệ thống đã hiển thị danh sách chi nhánh theo yêu cầu.
- Không có dữ liệu chi nhánh nào bị thay đổi.

**Trường hợp thêm chi nhánh mới**
- Chi nhánh mới được ghi nhận trên hệ thống với trạng thái "Chờ duyệt".
- Hệ thống ghi nhận vào nhật ký: đối tác thực hiện, thời gian gửi yêu cầu, nội dung thông tin chi nhánh đề xuất.

**Trường hợp sửa chi nhánh**
- Đề xuất thay đổi được lưu riêng biệt trên hệ thống với trạng thái "Chờ duyệt cập nhật"; thông tin chi nhánh hiện hành không bị thay đổi.
- Hệ thống ghi nhận vào nhật ký: đối tác thực hiện, thời gian gửi yêu cầu, thông tin trước khi thay đổi, thông tin đề xuất sau khi thay đổi.

**Trường hợp xóa chi nhánh**
- Yêu cầu xóa được ghi nhận trên hệ thống với trạng thái "Chờ duyệt xóa"; chi nhánh vẫn hoạt động bình thường cho đến khi có kết quả duyệt.
- Hệ thống ghi nhận vào nhật ký: đối tác thực hiện, thời gian gửi yêu cầu, chi nhánh được đề xuất xóa.

### Dòng sự kiện chính
1. Đối tác chọn "Quản lý chi nhánh" trong trang quản lý hồ sơ.
2. Hệ thống hiển thị danh sách chi nhánh hiện có kèm trạng thái (Hoạt động / Chờ duyệt / Chờ duyệt cập nhật).
3. Đối tác nhấn "Thêm chi nhánh mới".
4. Hệ thống hiển thị form nhập thông tin chi nhánh: Tên chi nhánh, Khu vực, Địa chỉ, Số điện thoại, Giờ hoạt động (giờ mở, giờ đóng, tạm nghỉ - option).
5. Đối tác nhập thông tin.
6. Đối tác nhấn "Gửi yêu cầu".
7. Hệ thống kiểm tra thông tin hợp lệ.
8. Hệ thống ghi nhận chi nhánh mới với trạng thái "Chờ duyệt".
9. Hệ thống gửi yêu cầu đến quản trị viên để duyệt.
10. Hệ thống hiển thị thông báo "Yêu cầu thêm chi nhánh đã được gửi, đang chờ quản trị viên duyệt".
11. Kết thúc use case.

### Dòng sự kiện phụ

**A3.x — Sửa chi nhánh hiện có**
- A3.x.1. Đối tác chọn một chi nhánh, nhấn "Cập nhật".
- A3.x.2. Hệ thống hiển thị form với thông tin hiện tại của chi nhánh.
- A3.x.3. Đối tác chỉnh sửa thông tin (Tên chi nhánh, Khu vực, Địa chỉ, SĐT, Giờ hoạt động).
- A3.x.4. Đối tác nhấn "Gửi yêu cầu".
- A3.x.5. Hệ thống kiểm tra thông tin hợp lệ (áp dụng các nhánh lỗi A7.a, A7.b, A7.c).
- A3.x.6. Hệ thống lưu đề xuất thay đổi riêng biệt (không ghi đè dữ liệu chính thức), đánh dấu chi nhánh ở trạng thái "Chờ duyệt cập nhật" — thông tin cũ vẫn hiển thị/áp dụng cho đến khi có kết quả duyệt.
- A3.x.7. Hệ thống gửi yêu cầu đến quản trị viên.
- A3.x.8. Hệ thống hiển thị thông báo "Yêu cầu cập nhật chi nhánh đã được gửi, thông tin hiện tại vẫn được áp dụng cho đến khi có kết quả duyệt".

**A3.y — Xóa chi nhánh**
- A3.y.1. Đối tác chọn một chi nhánh, nhấn "Xóa".
- A3.y.2. Hệ thống kiểm tra chi nhánh có đang gắn với voucher "Đang bán" hoặc voucher code chưa sử dụng không.
  - A3.y.2a. Không có ràng buộc → Hệ thống hiển thị xác nhận: "Gửi yêu cầu xóa chi nhánh này để quản trị viên duyệt?"
    - A3.y.2a.1. Đối tác xác nhận → Hệ thống ghi nhận yêu cầu với trạng thái "Chờ duyệt xóa" — chi nhánh vẫn hoạt động bình thường (vẫn dùng được cho voucher) cho đến khi có kết quả duyệt.
    - A3.y.2a.2. Hệ thống gửi yêu cầu đến quản trị viên.
    - A3.y.2a.3. Hệ thống hiển thị thông báo: "Yêu cầu xóa chi nhánh đã được gửi, đang chờ quản trị viên duyệt."
  - A3.y.2b. Có voucher hoạt động gắn với chi nhánh → Hệ thống báo lỗi: "Không thể xóa chi nhánh đang có voucher hoạt động." Đề xuất dùng "Vô hiệu hóa chi nhánh" thay thế.
  - A3.y.2c. Là chi nhánh duy nhất của doanh nghiệp → Hệ thống báo lỗi: "Doanh nghiệp phải có ít nhất 1 chi nhánh hoạt động." Không cho gửi yêu cầu.

**A6.a — Chi nhánh đang có 1 yêu cầu (thêm/sửa/xóa) khác chờ duyệt:** A6.a.1. Hệ thống báo: "Chi nhánh này đang có yêu cầu chờ duyệt, vui lòng chờ kết quả trước khi gửi yêu cầu mới." Không cho gửi tiếp.

**A7.a — Trống trường bắt buộc:** A7.a.1. Hệ thống báo lỗi tại trường trống. Quay về bước 5.

**A7.b — Số điện thoại chi nhánh sai định dạng:** A7.b.1. Hệ thống báo lỗi tại trường SĐT. Quay về bước 5.

**A7.c — Giờ đóng chi nhánh nhỏ hơn hoặc bằng giờ mở:** A7.c.1. Hệ thống báo lỗi: "Giờ đóng cửa phải sau giờ mở cửa". Quay về bước 5.

### Dòng ngoại lệ
- **E1 — Lỗi hệ thống khi ghi nhận yêu cầu (bước 8):** E1.1. Hệ thống báo lỗi, không tạo yêu cầu, giữ nguyên dữ liệu form. Đối tác thử lại từ bước 6.
- **E2 — Lỗi gửi yêu cầu đến quản trị viên (bước 9):**
  - E2.1. Yêu cầu vẫn được ghi nhận với trạng thái "Chờ duyệt"/"Chờ duyệt cập nhật" (không rollback).
  - E2.2. Hệ thống ghi log lỗi để xử lý/gửi lại. Đối tác vẫn nhận thông báo thành công như bước 10.

### Business Rule
- Thêm, sửa, và xóa chi nhánh đều phải được quản trị viên duyệt trước khi chính thức áp dụng.
- Trong thời gian chờ duyệt xóa, chi nhánh vẫn hoạt động bình thường — chỉ chính thức bị xóa sau khi admin duyệt.
- Trong thời gian chờ duyệt cập nhật, thông tin chi nhánh cũ vẫn có hiệu lực.
- Chi nhánh mới ở trạng thái "Chờ duyệt" chưa thể chọn làm chi nhánh áp dụng khi tạo voucher.
- Tại một thời điểm, mỗi chi nhánh chỉ có tối đa 1 yêu cầu (thêm/sửa/xóa) đang chờ duyệt.
- Doanh nghiệp phải có tối thiểu 1 chi nhánh hoạt động; không được xóa chi nhánh có voucher hoạt động.
- Giờ đóng chi nhánh phải sau giờ mở.

### Yêu cầu phi chức năng
- **NFR-03 Tính ổn định:** Đề xuất thay đổi chi nhánh phải lưu tách biệt khỏi dữ liệu chính thức, không ghi đè trực tiếp.
- **NFR-05 Khả năng sử dụng:** Danh sách chi nhánh cần hiển thị rõ trạng thái (Hoạt động/Chờ duyệt/Chờ duyệt cập nhật); form sửa nên highlight "trước/sau" để dễ đối chiếu khi admin duyệt.
- **NFR-06 Khả năng kiểm toán:** Ghi log nội dung thay đổi (diff), thời điểm gửi và kết quả duyệt của từng yêu cầu — RB-12.

---

## 7. Cập nhật thông tin pháp lý doanh nghiệp

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Owner |

**Tóm tắt:** Use case mô tả quá trình đối tác đề xuất thay đổi thông tin pháp lý cốt lõi của doanh nghiệp (tên doanh nghiệp, mã số thuế, loại hình doanh nghiệp, địa chỉ cơ sở chính, danh mục kinh doanh, giấy phép kinh doanh, thông tin người đại diện pháp lý). Vì đây là thông tin ảnh hưởng đến tính hợp pháp của hồ sơ, yêu cầu thay đổi phải được quản trị viên duyệt trước khi chính thức áp dụng.

**Trigger:** Đối tác chọn "Cập nhật thông tin pháp lý" trong trang quản lý hồ sơ.

**Điều kiện tiên quyết:** Đối tác đã đăng nhập, tài khoản ở trạng thái "Hoạt động".

**Hậu điều kiện:** Yêu cầu cập nhật được ghi nhận với trạng thái "Chờ duyệt cập nhật"; thông tin pháp lý hiện tại vẫn giữ nguyên hiệu lực cho đến khi có kết quả duyệt.

### Dòng sự kiện chính
1. Đối tác chọn "Cập nhật thông tin pháp lý" trong trang quản lý hồ sơ.
2. Hệ thống hiển thị form với thông tin pháp lý hiện tại: Tên doanh nghiệp, Mã số thuế, Loại hình doanh nghiệp, Địa chỉ cơ sở chính, Danh mục kinh doanh, Giấy phép kinh doanh, Thông tin người đại diện (tên, chức vụ, CCCD, SĐT, email).
3. Đối tác chỉnh sửa các trường cần thay đổi.
4. Đối tác nhấn "Gửi yêu cầu cập nhật".
5. Hệ thống kiểm tra thông tin hợp lệ.
6. Hệ thống ghi nhận yêu cầu cập nhật với trạng thái "Chờ duyệt cập nhật".
7. Hệ thống gửi yêu cầu đến quản trị viên để duyệt.
8. Hệ thống hiển thị thông báo: "Yêu cầu cập nhật đã được gửi. Thông tin hiện tại vẫn được áp dụng cho đến khi có kết quả duyệt."
9. Kết thúc use case.

### Dòng sự kiện phụ
- **A3.a — Không có thay đổi nào so với thông tin hiện tại:** A3.a.1. Hệ thống báo: "Không có thay đổi để gửi." Không tạo yêu cầu duyệt.
- **A5.a — Trống trường bắt buộc:** A5.a.1. Hệ thống báo lỗi tại trường trống. Quay về bước 3.
- **A5.b — Mã số thuế sai định dạng:** A5.b.1. Hệ thống báo lỗi tại trường mã số thuế. Quay về bước 3.
- **A5.c — Mã số thuế mới đã thuộc về doanh nghiệp khác:** A5.c.1. Hệ thống báo lỗi: "Mã số thuế đã được sử dụng." Quay về bước 3.
- **A5.d — Không chọn loại hình doanh nghiệp hoặc danh mục kinh doanh:** A5.d.1. Hệ thống báo lỗi: "Phải chọn ít nhất một mục." Quay về bước 3.
- **A5.e — CCCD người đại diện sai định dạng:** A5.e.1. Hệ thống báo lỗi tại trường CCCD. Quay về bước 3.
- **A5.f — SĐT hoặc email người đại diện sai định dạng:** A5.f.1. Hệ thống báo lỗi tại trường tương ứng. Quay về bước 3.
- **A6.a — Đã tồn tại một yêu cầu cập nhật khác đang chờ duyệt:** A6.a.1. Hệ thống báo: "Bạn đang có một yêu cầu cập nhật thông tin chờ duyệt, vui lòng chờ kết quả trước khi gửi yêu cầu mới." Không cho tiếp tục gửi.

### Dòng ngoại lệ
- **E1 — Lỗi upload giấy phép kinh doanh mới (sai định dạng/quá dung lượng):** E1.1. Hệ thống báo lỗi tại khu vực upload. Người dùng chọn lại file. Quay về bước 3.
- **E2 — Lỗi hệ thống khi ghi nhận yêu cầu (bước 6):** E2.1. Hệ thống hiển thị thông báo lỗi, không tạo yêu cầu duyệt, giữ nguyên dữ liệu form. Đối tác thử lại từ bước 4.
- **E3 — Lỗi gửi yêu cầu đến quản trị viên (yêu cầu đã lưu ở bước 6 nhưng không đến được admin):**
  - E3.1. Yêu cầu vẫn được ghi nhận với trạng thái "Chờ duyệt cập nhật" (không rollback).
  - E3.2. Hệ thống ghi log lỗi để xử lý/gửi lại.
  - E3.3. Đối tác vẫn nhận thông báo thành công như bước 8.

### Business Rule
- Thay đổi thông tin pháp lý cốt lõi phải được quản trị viên duyệt trước khi chính thức có hiệu lực.
- Trong thời gian chờ duyệt, thông tin cũ vẫn có hiệu lực và doanh nghiệp vẫn hoạt động bình thường — không bị khóa hay tạm ngưng chỉ vì có yêu cầu cập nhật đang chờ.
- Tại một thời điểm, đối tác chỉ được có tối đa 1 yêu cầu cập nhật thông tin pháp lý đang chờ duyệt.
- Mã số thuế (nếu thay đổi) phải duy nhất trên hệ thống.

### Yêu cầu phi chức năng
- **NFR-02 Bảo mật:** File giấy phép kinh doanh mới phải được kiểm tra loại file thực tế trước khi lưu.
- **NFR-03 Tính ổn định:** Yêu cầu cập nhật không được ghi đè trực tiếp lên dữ liệu chính thức — phải lưu như bản đề xuất riêng biệt cho đến khi được duyệt.
- **NFR-05 Khả năng sử dụng:** Form nên highlight rõ trường nào đang được thay đổi so với thông tin gốc (dạng "trước/sau") để cả đối tác và admin dễ đối chiếu khi duyệt.
- **NFR-06 Khả năng kiểm toán:** Ghi log toàn bộ nội dung thay đổi (diff) của mỗi yêu cầu cập nhật, kèm thời gian gửi và kết quả duyệt — liên quan RB-12.

---

## 8. Tạo voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |
| **Use case liên quan** | Gửi duyệt |

**Tóm tắt:** Use case mô tả quá trình đối tác tạo mới một voucher với đầy đủ thông tin giá, mô tả, thời gian bán, thời gian sử dụng, chi nhánh áp dụng và số lượng phát hành. Voucher sau khi lưu ở trạng thái "Nháp", sẵn sàng để gửi duyệt ở bước sau.

**Trigger:** Đối tác chọn "Tạo voucher mới" trong trang quản lý voucher.

**Điều kiện tiên quyết:** Đối tác đã đăng nhập, tài khoản ở trạng thái "Hoạt động".

**Hậu điều kiện:** Voucher được tạo với trạng thái "Nháp", tất cả thông tin đầy đủ và hợp lệ.

### Dòng sự kiện chính
1. Đối tác chọn "Tạo voucher mới" trong trang quản lý voucher.
2. Hệ thống hiển thị form tạo voucher.
3. Đối tác nhập thông tin voucher: Tên voucher, Danh mục, Ảnh voucher (upload), Mô tả, Giá gốc, Giá bán, Điều kiện áp dụng (nhập tự do), Thời gian bán (ngày bắt đầu — ngày kết thúc), Thời gian sử dụng (ngày bắt đầu — ngày kết thúc), Chi nhánh áp dụng (chọn 1 hoặc nhiều từ danh sách chi nhánh của đối tác), Số lượng phát hành, Chính sách hoàn hủy.
4. Đối tác nhấn "Lưu nháp".
5. Hệ thống kiểm tra toàn bộ thông tin hợp lệ theo quy tắc nghiệp vụ.
6. Hệ thống lưu voucher với trạng thái "Nháp".
7. Hệ thống hiển thị thông báo "Đã lưu voucher dưới dạng nháp" và chuyển đến trang chi tiết voucher.
8. Kết thúc use case.

### Dòng sự kiện phụ
- **A5.a — Trống trường bắt buộc:** A5.a.1. Hệ thống báo lỗi tại từng trường trống. Quay về bước 3.
- **A5.b — Giá bán lớn hơn hoặc bằng giá gốc:** A5.b.1. Hệ thống báo lỗi: "Giá bán phải nhỏ hơn giá gốc" (RB-02). Quay về bước 3.
- **A5.c — Ảnh voucher sai định dạng hoặc quá dung lượng:** A5.c.1. Hệ thống báo lỗi tại khu vực upload, nêu rõ định dạng/dung lượng cho phép.
- **A5.d — Ngày bắt đầu bán không sớm hơn ngày kết thúc bán:** A5.d.1. Hệ thống báo lỗi: "Ngày kết thúc bán phải sau ngày bắt đầu bán". Quay về bước 3.
- **A5.e — Ngày bắt đầu sử dụng không sớm hơn ngày kết thúc sử dụng:** A5.e.1. Hệ thống báo lỗi: "Ngày kết thúc sử dụng phải sau ngày bắt đầu sử dụng". Quay về bước 3.
- **A5.f — Ngày kết thúc bán muộn hơn ngày kết thúc sử dụng:** A5.f.1. Hệ thống báo lỗi: "Thời gian sử dụng phải kết thúc sau hoặc cùng thời điểm kết thúc bán". Quay về bước 3.
- **A5.g — Ngày bắt đầu bán nằm trong quá khứ:** A5.g.1. Hệ thống báo lỗi: "Ngày bắt đầu bán phải từ hôm nay trở đi". Quay về bước 3.
- **A5.h — Chưa chọn chi nhánh áp dụng:** A5.h.1. Hệ thống báo lỗi: "Phải chọn ít nhất 1 chi nhánh áp dụng". Quay về bước 3.
- **A5.i — Số lượng phát hành không hợp lệ (≤ 0 hoặc không phải số nguyên):** A5.i.1. Hệ thống báo lỗi tại trường số lượng phát hành. Quay về bước 3.
- **A5.j — Chưa chọn danh mục:** A5.j.1. Hệ thống báo lỗi: "Phải chọn danh mục voucher". Quay về bước 3.

### Dòng ngoại lệ
- **E1 — Lỗi hệ thống khi upload ảnh:** E1.1. Hệ thống hiển thị thông báo lỗi, cho phép thử upload lại. Quay về bước 3.
- **E2 — Lỗi hệ thống khi lưu voucher (bước 6):** E2.1. Hệ thống hiển thị thông báo lỗi, giữ nguyên toàn bộ dữ liệu đã nhập trên form. E2.2. Đối tác thử lưu lại. Quay về bước 4.

### Business Rule
- **RB-02:** Giá bán phải nhỏ hơn giá gốc.
- **RB-03:** Voucher phải có thời gian bán và thời gian sử dụng rõ ràng (khoảng ngày cố định).
- Ngày kết thúc thời gian bán phải ≤ ngày kết thúc thời gian sử dụng.
- Ngày bắt đầu thời gian bán không được ở quá khứ.
- Chi nhánh áp dụng chỉ được chọn trong danh sách chi nhánh thuộc chính đối tác đó.
- "Nháp" nghĩa là dữ liệu đã đầy đủ và hợp lệ — không cho lưu nháp khi thiếu hoặc sai thông tin.
- Điều kiện áp dụng là trường nhập tự do, không có validate nghiệp vụ đặc biệt ngoài không được để trống.
- Số lượng phát hành phải là số nguyên dương.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Hiển thị tiến trình upload nếu ảnh voucher có dung lượng lớn.
- **NFR-02 Bảo mật:** Kiểm tra loại file ảnh thực tế trước khi lưu, tránh upload file độc hại.
- **NFR-03 Tính ổn định:** Nếu lỗi hệ thống khi lưu, dữ liệu form không bị mất, đối tác không phải nhập lại từ đầu.
- **NFR-05 Khả năng sử dụng:** Form nhiều trường nên phân nhóm rõ (Thông tin cơ bản / Giá / Thời gian / Chi nhánh & số lượng) để dễ nhập và kiểm tra.
- **NFR-06 Khả năng kiểm toán:** Ghi log việc tạo voucher (đối tác nào, thời điểm, nội dung) phục vụ truy vết.

---

## 9. Gửi duyệt voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |
| **Use case liên quan** | Tạo voucher |

**Tóm tắt:** Đối tác gửi voucher đang ở trạng thái "Nháp" đi để quản trị viên duyệt trước khi được phép bán.

**Trigger:** Đối tác chọn "Gửi duyệt" tại voucher đang ở trạng thái "Nháp".

**Điều kiện tiên quyết:** Voucher tồn tại, đang ở trạng thái "Nháp".

**Hậu điều kiện:** Voucher chuyển sang trạng thái "Chờ duyệt".

### Dòng sự kiện chính
1. Đối tác chọn voucher đang ở trạng thái "Nháp" trong danh sách voucher.
2. Hệ thống hiển thị chi tiết voucher kèm nút "Gửi duyệt".
3. Đối tác nhấn "Gửi duyệt".
4. Hệ thống hiển thị xác nhận: "Bạn có chắc muốn gửi voucher này đi duyệt?"
5. Đối tác xác nhận.
6. Hệ thống kiểm tra lại tính hợp lệ của voucher tại thời điểm gửi (vd: thời gian bán chưa rơi vào quá khứ do để nháp quá lâu, chi nhánh áp dụng vẫn còn tồn tại/hoạt động).
7. Hệ thống chuyển trạng thái voucher từ "Nháp" sang "Chờ duyệt".
8. Hệ thống gửi thông báo đến quản trị viên có voucher mới cần duyệt.
9. Hệ thống hiển thị thông báo "Voucher đã được gửi duyệt".
10. Kết thúc use case.

### Dòng sự kiện phụ
- **A3.a — Đối tác hủy thao tác tại bước xác nhận:** A3.a.1. Quay về danh sách voucher, giữ nguyên trạng thái "Nháp".
- **A6.a — Thời gian bán đã rơi vào quá khứ (do lưu nháp quá lâu):**
  - A6.a.1. Hệ thống báo lỗi: "Thời gian bán không còn hợp lệ, vui lòng cập nhật lại trước khi gửi duyệt".
  - A6.a.2. Đối tác chuyển sang UC "Cập nhật voucher" để chỉnh sửa, sau đó quay lại bước 1.
- **A6.b — Chi nhánh áp dụng đã bị xóa/vô hiệu hóa kể từ lúc tạo nháp:** A6.b.1. Hệ thống báo lỗi, yêu cầu chọn lại chi nhánh hợp lệ. Chuyển sang UC "Cập nhật voucher".

### Dòng ngoại lệ
- **E1 — Lỗi hệ thống khi chuyển trạng thái (bước 7):** E1.1. Hệ thống báo lỗi, giữ nguyên trạng thái "Nháp". Đối tác thử lại từ bước 3.
- **E2 — Lỗi gửi thông báo đến quản trị viên (bước 8):** E2.1. Voucher vẫn chuyển sang "Chờ duyệt" (không rollback). Hệ thống ghi log lỗi để gửi lại thông báo.

### Business Rule
- **RB-01:** Voucher chỉ được bán khi đã được quản trị viên duyệt.
- Chỉ voucher ở trạng thái "Nháp" mới được gửi duyệt.
- Sau khi gửi duyệt, voucher ở trạng thái "Chờ duyệt" không thể chỉnh sửa trực tiếp cho đến khi có kết quả duyệt.
- Thời gian bán phải còn hợp lệ (chưa ở quá khứ) tại thời điểm gửi duyệt.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Chuyển trạng thái và gửi thông báo cho admin diễn ra gần như tức thời.
- **NFR-05 Khả năng sử dụng:** Cảnh báo rõ ràng trước khi gửi (không thể tự sửa cho đến khi có kết quả).
- **NFR-06 Khả năng kiểm toán:** Ghi log thời điểm gửi duyệt, nội dung voucher tại thời điểm gửi — liên quan RB-12.

---

## 10. Tạm ngưng voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |

**Tóm tắt:** Đối tác tạm thời ngừng bán một voucher đang "Đang bán" mà không hủy voucher; có thể mở bán lại sau. Đơn hàng và voucher code đã phát hành trước đó không bị ảnh hưởng.

**Trigger:** Đối tác chọn "Tạm ngưng bán" tại voucher đang ở trạng thái "Đang bán".

**Điều kiện tiên quyết:** Voucher đang ở trạng thái "Đang bán".

**Hậu điều kiện:** Voucher chuyển sang trạng thái "Tạm ngưng"; ngừng hiển thị/mua mới trên sàn; voucher code đã phát hành trước đó giữ nguyên hiệu lực sử dụng.

### Dòng sự kiện chính
1. Đối tác chọn voucher đang ở trạng thái "Đang bán".
2. Hệ thống hiển thị chi tiết voucher kèm nút "Tạm ngưng bán".
3. Đối tác nhấn "Tạm ngưng bán".
4. Hệ thống hiển thị xác nhận kèm cảnh báo: "Voucher sẽ ngừng hiển thị trên sàn, khách hàng không thể mua thêm. Đơn hàng và voucher đã bán vẫn giữ nguyên hiệu lực."
5. Đối tác xác nhận.
6. Hệ thống chuyển trạng thái voucher sang "Tạm ngưng".
7. Hệ thống ẩn voucher khỏi kết quả tìm kiếm và trang bán công khai.
8. Hệ thống hiển thị thông báo "Đã tạm ngưng bán voucher".
9. Kết thúc use case.

### Dòng sự kiện phụ
**A3.a — Đối tác hủy thao tác tại bước xác nhận:** A3.a.1. Quay về danh sách voucher, giữ nguyên trạng thái "Đang bán".

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi chuyển trạng thái:** E1.1. Hệ thống báo lỗi, giữ nguyên trạng thái "Đang bán". Đối tác thử lại từ bước 3.

### Business Rule
- (suy ra, RB-04): Voucher ở trạng thái "Tạm ngưng" không được bán mới, tương tự như hết thời gian bán.
- (suy ra): Voucher code đã phát hành trước khi tạm ngưng không bị ảnh hưởng — vẫn sử dụng bình thường.
- (suy ra): Từ "Tạm ngưng" có thể chuyển lại "Đang bán" (không cần duyệt lại vì đã được duyệt từ trước).

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Voucher biến mất khỏi trang khách hàng ngay sau khi tạm ngưng (gần thời gian thực).
- **NFR-05 Khả năng sử dụng:** Cảnh báo rõ hệ quả trước khi xác nhận.
- **NFR-06 Khả năng kiểm toán:** Ghi log thời điểm và người thực hiện tạm ngưng.

---

## 11. Ngừng bán voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |

**Tóm tắt:** Đối tác ngừng hẳn việc bán một voucher — hành động không thể hoàn tác. Voucher không thể mở bán lại sau khi ngừng.

**Trigger:** Đối tác chọn "Ngừng bán" tại voucher đang ở trạng thái "Đang bán" hoặc "Tạm ngưng".

**Điều kiện tiên quyết:** Voucher đang ở trạng thái "Đang bán" hoặc "Tạm ngưng".

**Hậu điều kiện:** Voucher chuyển sang trạng thái "Ngừng bán" (trạng thái cuối); không thể phát sinh đơn hàng mới.

### Dòng sự kiện chính
1. Đối tác chọn voucher đang ở trạng thái "Đang bán" hoặc "Tạm ngưng".
2. Hệ thống hiển thị chi tiết voucher kèm nút "Ngừng bán".
3. Đối tác nhấn "Ngừng bán".
4. Hệ thống hiển thị xác nhận kèm cảnh báo: "Đây là hành động không thể hoàn tác. Voucher sẽ ngừng bán vĩnh viễn."
5. Đối tác xác nhận.
6. Hệ thống chuyển trạng thái voucher sang "Ngừng bán".
7. Hệ thống gỡ voucher khỏi trang bán và kết quả tìm kiếm vĩnh viễn.
8. Hệ thống hiển thị thông báo "Voucher đã ngừng bán".
9. Kết thúc use case.

### Dòng sự kiện phụ
**A3.a — Đối tác hủy thao tác tại bước xác nhận:** A3.a.1. Quay về danh sách voucher, giữ nguyên trạng thái trước đó.

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi chuyển trạng thái:** E1.1. Hệ thống báo lỗi, giữ nguyên trạng thái cũ. Đối tác thử lại từ bước 3.

### Business Rule
- "Ngừng bán" là trạng thái cuối (terminal) — không thể quay lại "Đang bán" hay "Tạm ngưng".
- Voucher code đã phát hành trước khi ngừng bán vẫn giữ hiệu lực (theo hồ sơ gốc).

### Yêu cầu phi chức năng
- **NFR-05 Khả năng sử dụng:** Cảnh báo rõ tính không thể hoàn tác trước khi xác nhận.
- **NFR-06 Khả năng kiểm toán:** Ghi log thời điểm, người thực hiện và lý do ngừng bán (nếu có nhập).

---

## 12. Mở bán lại voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |
| **Use case liên quan** | Tạm ngưng voucher |

**Tóm tắt:** Đối tác mở bán lại một voucher đang ở trạng thái "Tạm ngưng", đưa voucher trở lại hiển thị và cho phép mua trên sàn mà không cần quản trị viên duyệt lại (vì đã được duyệt trước đó).

**Trigger:** Đối tác chọn "Mở bán lại" tại voucher đang ở trạng thái "Tạm ngưng".

**Điều kiện tiên quyết:** Voucher đang ở trạng thái "Tạm ngưng".

**Hậu điều kiện:** Voucher chuyển sang trạng thái "Đang bán"; hiển thị và mua được trở lại trên sàn.

### Dòng sự kiện chính
1. Đối tác chọn voucher đang ở trạng thái "Tạm ngưng" trong danh sách voucher.
2. Hệ thống hiển thị chi tiết voucher kèm nút "Mở bán lại".
3. Đối tác nhấn "Mở bán lại".
4. Hệ thống kiểm tra điều kiện hợp lệ để mở bán lại (thời gian bán/sử dụng chưa hết hạn, số lượng phát hành chưa bán hết).
5. Hệ thống chuyển trạng thái voucher sang "Đang bán".
6. Hệ thống hiển thị lại voucher trên trang bán và kết quả tìm kiếm.
7. Hệ thống hiển thị thông báo "Đã mở bán lại voucher".
8. Kết thúc use case.

### Dòng sự kiện phụ
- **A4.a — Thời gian bán đã hết hạn (do voucher bị tạm ngưng quá lâu, ngày kết thúc bán đã qua):** A4.a.1. Hệ thống báo lỗi: "Thời gian bán của voucher đã hết hạn, không thể mở bán lại". Gợi ý đối tác tạo voucher mới hoặc cập nhật thời gian bán.
- **A4.b — Số lượng phát hành đã bán hết trước khi tạm ngưng:** A4.b.1. Hệ thống báo lỗi: "Voucher đã bán hết số lượng phát hành, không thể mở bán lại".

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi chuyển trạng thái:** E1.1. Hệ thống báo lỗi, giữ nguyên trạng thái "Tạm ngưng". Đối tác thử lại từ bước 3.

### Business Rule
- Mở bán lại từ "Tạm ngưng" không cần quản trị viên duyệt lại.
- Không thể mở bán lại nếu đã hết thời gian bán hoặc hết số lượng phát hành.
- Chỉ voucher ở trạng thái "Tạm ngưng" mới có thao tác "Mở bán lại" — không áp dụng cho "Ngừng bán" (trạng thái cuối, không thể đảo ngược).

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Voucher hiển thị lại trên trang khách hàng gần thời gian thực sau khi mở bán lại.
- **NFR-06 Khả năng kiểm toán:** Ghi log thời điểm và người thực hiện mở bán lại.

---

## 13. Xem danh sách voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |

**Tóm tắt:** Đối tác xem toàn bộ voucher thuộc doanh nghiệp mình, có thể lọc theo trạng thái và tìm kiếm để quản lý.

**Trigger:** Đối tác chọn "Quản lý voucher" trên menu.

**Điều kiện tiên quyết:** Đối tác đã đăng nhập.

**Hậu điều kiện:** Danh sách voucher được hiển thị.

### Dòng sự kiện chính
1. Đối tác chọn "Quản lý voucher".
2. Hệ thống hiển thị danh sách voucher của đối tác (mặc định toàn bộ trạng thái, sắp xếp theo mới tạo nhất), mỗi dòng gồm: ảnh, tên, trạng thái, giá bán, số lượng đã bán/tổng phát hành, thời gian bán.
3. Đối tác chọn bộ lọc theo trạng thái (Nháp / Chờ duyệt / Đang bán / Từ chối / Tạm ngưng / Ngừng bán).
4. Hệ thống hiển thị danh sách voucher khớp bộ lọc.
5. Kết thúc use case.

### Dòng sự kiện phụ
- **A3.a — Đối tác tìm kiếm theo tên voucher (kết hợp với bộ lọc trạng thái):** A3.a.1. Hệ thống hiển thị kết quả khớp từ khóa trong phạm vi bộ lọc hiện tại.
- **A3.b — Không có voucher nào khớp điều kiện lọc/tìm kiếm:** A3.b.1. Hệ thống hiển thị "Không tìm thấy voucher phù hợp".
- **A2.a — Đối tác sắp xếp danh sách (mới nhất, sắp hết hạn bán, bán chạy nhất):** A2.a.1. Hệ thống hiển thị lại danh sách theo tiêu chí sắp xếp đã chọn.

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi tải danh sách:** E1.1. Hệ thống hiển thị thông báo lỗi kèm nút "Thử lại".

**Business Rule:** Đối tác chỉ xem được voucher thuộc chính doanh nghiệp mình.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Danh sách cần phân trang/lazy-load khi số lượng voucher lớn.
- **NFR-05 Khả năng sử dụng:** Bộ lọc trạng thái hiển thị rõ số lượng voucher theo từng trạng thái (dạng tab/badge).

---

## 14. Xem chi tiết voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |
| **Use case liên quan** | Xem danh sách voucher |

**Tóm tắt:** Đối tác xem đầy đủ thông tin của một voucher cụ thể, kèm các hành động khả dụng tương ứng với trạng thái hiện tại.

**Trigger:** Đối tác chọn một voucher từ danh sách.

**Điều kiện tiên quyết:** Voucher tồn tại và thuộc về đối tác đang đăng nhập.

**Hậu điều kiện:** Không thay đổi dữ liệu, chỉ hiển thị thông tin.

### Dòng sự kiện chính
1. Đối tác chọn một voucher từ danh sách.
2. Hệ thống hiển thị đầy đủ thông tin: tên, ảnh, danh mục, mô tả, giá gốc/giá bán, điều kiện áp dụng, thời gian bán, thời gian sử dụng, chi nhánh áp dụng, số lượng phát hành/đã bán/còn lại, chính sách hoàn hủy, trạng thái hiện tại.
3. Hệ thống hiển thị các hành động khả dụng tương ứng với trạng thái hiện tại của voucher (vd: "Nháp" → Cập nhật/Gửi duyệt/Xóa; "Đang bán" → Tạm ngưng/Sửa giới hạn/Ngừng bán; "Tạm ngưng" → Mở bán lại/Ngừng bán/Sửa giới hạn; "Từ chối" → Xem lý do/Sửa; "Chờ duyệt", "Ngừng bán" → chỉ xem).
4. Kết thúc use case.

### Dòng sự kiện phụ
**A1.a — Voucher không tồn tại hoặc không thuộc về đối tác đang đăng nhập:** A1.a.1. Hệ thống hiển thị lỗi "Không tìm thấy voucher" hoặc từ chối truy cập, không hiển thị dữ liệu.

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi tải dữ liệu chi tiết:** E1.1. Hệ thống hiển thị lỗi kèm nút "Thử lại".

### Business Rule
- (suy ra, RB-09 tương tự): Đối tác chỉ xem chi tiết voucher thuộc doanh nghiệp mình.
- (suy ra): Hành động khả dụng phụ thuộc vào trạng thái hiện tại của voucher (chi tiết ở SUC-PAR-09).

### Yêu cầu phi chức năng
**NFR-05 Khả năng sử dụng:** Trạng thái và các hành động khả dụng hiển thị nổi bật, tránh nhầm lẫn hành động không hợp lệ với trạng thái hiện tại.

---

## 15. Cập nhật voucher

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |

**Tóm tắt:** Đối tác chỉnh sửa thông tin voucher. Phạm vi được sửa phụ thuộc vào trạng thái hiện tại: sửa toàn bộ khi "Nháp"/"Từ chối", sửa giới hạn khi "Đang bán"/"Tạm ngưng", không được sửa khi "Chờ duyệt"/"Ngừng bán".

**Trigger:** Đối tác nhấn "Sửa" tại trang chi tiết voucher.

**Điều kiện tiên quyết:** Voucher tồn tại, thuộc về đối tác, đang ở trạng thái cho phép sửa ("Nháp", "Từ chối", "Đang bán", hoặc "Tạm ngưng").

**Hậu điều kiện:** Thông tin voucher được cập nhật theo phạm vi cho phép của trạng thái hiện tại.

### Dòng sự kiện chính
1. Đối tác chọn voucher đang ở trạng thái "Nháp" hoặc "Từ chối", nhấn "Sửa".
2. Hệ thống hiển thị form với đầy đủ thông tin hiện tại, cho phép chỉnh sửa toàn bộ trường.
3. Đối tác chỉnh sửa thông tin.
4. Đối tác nhấn "Lưu".
5. Hệ thống kiểm tra thông tin hợp lệ.
6. Hệ thống lưu thay đổi. Nếu voucher đang ở "Từ chối", chuyển trạng thái về "Nháp".
7. Hệ thống hiển thị thông báo "Đã lưu thay đổi".
8. Kết thúc use case.

### Dòng sự kiện phụ

**A1.x — Sửa giới hạn khi voucher đang "Đang bán" hoặc "Tạm ngưng"**
- A1.x.1. Hệ thống chỉ cho phép chỉnh sửa: Mô tả, Ảnh, Điều kiện áp dụng, Chính sách hoàn hủy, Số lượng phát hành (chỉ được tăng, không giảm dưới số đã bán).
- A1.x.2. Các trường Giá, Thời gian bán/sử dụng, Chi nhánh áp dụng bị khóa, không cho sửa (bảo vệ quyền lợi khách đã mua theo giá/điều kiện niêm yết).
- A1.x.3. Đối tác chỉnh sửa các trường được phép, nhấn "Lưu".
- A1.x.4. Hệ thống kiểm tra hợp lệ và lưu thay đổi ngay, không cần duyệt lại. Kết thúc use case.

**A1.y — Voucher đang ở "Chờ duyệt" hoặc "Ngừng bán":** A1.y.1. Nút "Sửa" bị ẩn hoặc vô hiệu hóa, kèm chú thích lý do (vd: "Đang chờ duyệt, không thể chỉnh sửa").

**A5.a — Trống trường bắt buộc / sai định dạng** (áp dụng các nhánh lỗi tương tự: giá bán ≥ giá gốc, ngày không hợp lệ, số lượng không hợp lệ...): A5.a.1. Hệ thống báo lỗi tại trường tương ứng. Quay về bước 3.

**A5.b — Số lượng phát hành mới nhỏ hơn số lượng đã bán** (áp dụng khi sửa ở trạng thái "Đang bán"/"Tạm ngưng"): A5.b.1. Hệ thống báo lỗi: "Số lượng phát hành không được nhỏ hơn số lượng đã bán". Quay về A1.x.3.

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi lưu thay đổi:** E1.1. Hệ thống báo lỗi, giữ nguyên dữ liệu đã nhập trên form. Đối tác thử lại từ bước "Lưu".

### Business Rule
- (suy ra): "Chờ duyệt" và "Ngừng bán" — không được chỉnh sửa.
- (suy ra): "Nháp" và "Từ chối" — được sửa toàn bộ.
- (đề xuất, cần xác nhận): "Đang bán" và "Tạm ngưng" — chỉ sửa trường không ảnh hưởng đơn đã bán, áp dụng ngay, không cần duyệt lại.
- **RB-11:** Số lượng bán ra không được vượt quá số lượng phát hành → áp dụng khi giảm/tăng số lượng.

### Yêu cầu phi chức năng
- **NFR-05 Khả năng sử dụng:** Trường bị khóa cần hiển thị rõ (disabled + tooltip giải thích lý do).
- **NFR-06 Khả năng kiểm toán:** Ghi log nội dung thay đổi (diff trước/sau) mỗi lần cập nhật voucher.

---

## 16. Xem kết quả duyệt

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên quản lý |
| **Use case liên quan** | Gửi duyệt, Xem chi tiết voucher, Cập nhật voucher |

**Tóm tắt:** Use case mô tả việc đối tác theo dõi và xem kết quả duyệt của voucher (đã được duyệt để bán, hoặc bị từ chối kèm lý do) sau khi gửi duyệt.

**Trigger:** Hệ thống gửi thông báo khi quản trị viên xử lý xong voucher đang "Chờ duyệt" (chuyển thành "Đã duyệt" hoặc "Từ chối"); hoặc đối tác chủ động vào xem trạng thái duyệt.

**Điều kiện tiên quyết:** Voucher đã được gửi duyệt.

**Hậu điều kiện:** Đối tác nắm được kết quả/tiến độ duyệt hiện tại của voucher. Không thay đổi dữ liệu.

### Dòng sự kiện chính
1. Đối tác nhấn vào thông báo, hoặc vào chi tiết voucher.
2. Hệ thống hiển thị kết quả duyệt: trạng thái mới và thời điểm duyệt.
3. Nếu voucher bị từ chối, hệ thống hiển thị thêm lý do từ chối do quản trị viên nhập.
4. Kết thúc use case.

### Dòng sự kiện phụ
- **A2.a — Đối tác chủ động xem voucher đang "Chờ duyệt" (chưa có kết quả):** A2.a.1. Hệ thống hiển thị "Voucher đang chờ quản trị viên duyệt", không có lý do/kết quả vì chưa xử lý xong.
- **A4.a — Voucher bị từ chối, đối tác muốn sửa lại:**
  - A4.a.1. Đối tác nhấn "Sửa lại và gửi duyệt" tại màn hình kết quả.
  - A4.a.2. Chuyển sang UC "Cập nhật voucher" — sau khi lưu, voucher về trạng thái "Nháp".
  - A4.a.3. Đối tác cần chủ động gửi duyệt lại qua UC "Gửi duyệt".

### Dòng ngoại lệ
- **E1 — Lỗi hệ thống khi tải kết quả duyệt:** E1.1. Hệ thống hiển thị thông báo lỗi kèm nút "Thử lại".
- **E2 — Lỗi gửi thông báo đến đối tác khi có kết quả:**
  - E2.1. Kết quả duyệt vẫn được lưu đúng trong hệ thống (không rollback).
  - E2.2. Đối tác vẫn có thể xem kết quả khi chủ động vào chi tiết voucher (bỏ qua bước nhận thông báo).

### Business Rule
- Lý do từ chối là bắt buộc phải có khi quản trị viên từ chối voucher — hiển thị đầy đủ cho đối tác.
- Kết quả duyệt chỉ hiển thị cho đúng đối tác sở hữu voucher đó.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Thông báo kết quả duyệt gửi đến đối tác gần thời gian thực.
- **NFR-05 Khả năng sử dụng:** Lý do từ chối hiển thị rõ ràng, có gợi ý hành động tiếp theo ("Sửa lại và gửi duyệt").
- **NFR-06 Khả năng kiểm toán:** Ghi log thời điểm duyệt, người duyệt (quản trị viên), và kết quả — liên quan RB-12.

---

## 17. Tra cứu voucher code

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Nhân viên chi nhánh |
| **Use case liên quan** | Xác nhận sử dụng voucher |

**Tóm tắt:** Đối tác hoặc nhân viên đối tác tra cứu tình trạng hợp lệ của một voucher code bằng cách nhập mã hoặc quét QR mô phỏng (ASM-03), trước khi xác nhận cho khách hàng sử dụng tại chi nhánh.

**Trigger:** Người dùng chọn chức năng "Tra cứu voucher code" tại quầy/chi nhánh.

**Điều kiện tiên quyết:** Đã đăng nhập; đã xác định chi nhánh đang thao tác.

**Hậu điều kiện:** Hiển thị thông tin trạng thái hợp lệ của voucher code. Không thay đổi dữ liệu.

### Dòng sự kiện chính
1. Người dùng chọn "Tra cứu voucher code".
2. Hệ thống hiển thị màn hình nhập mã hoặc quét QR mô phỏng.
3. Người dùng nhập mã voucher code (hoặc quét QR mô phỏng — theo ASM-03).
4. Người dùng nhấn "Tra cứu".
5. Hệ thống kiểm tra mã tồn tại trong hệ thống.
6. Hệ thống kiểm tra mã thuộc phạm vi chi nhánh/chương trình của đối tác đang đăng nhập.
7. Hệ thống kiểm tra trạng thái sử dụng hiện tại của mã.
8. Hệ thống hiển thị kết quả: tên voucher, chi nhánh áp dụng, thời hạn sử dụng, trạng thái hiện tại.
9. Nếu mã hợp lệ và chưa sử dụng, hệ thống hiển thị nút "Xác nhận sử dụng".
10. Kết thúc use case.

### Dòng sự kiện phụ
- **A5.a — Mã không tồn tại:** A5.a.1. Hệ thống báo lỗi: "Mã voucher không hợp lệ".
- **A6.a — Mã thuộc voucher/chi nhánh không thuộc phạm vi quản lý của đối tác (RB-09):** A6.a.1. Hệ thống báo lỗi: "Mã không thuộc phạm vi quản lý của bạn", không hiển thị thêm thông tin chi tiết.
- **A7.a — Mã đã được sử dụng trước đó:** A7.a.1. Hệ thống hiển thị: "Mã đã được sử dụng" kèm thời điểm sử dụng trước đó. Không hiển thị nút "Xác nhận sử dụng".
- **A7.b — Mã đã hết hạn sử dụng (RB-08):** A7.b.1. Hệ thống hiển thị: "Mã đã hết hạn, không thể sử dụng".
- **A7.c — Mã bị hủy/khóa (đơn hàng bị hủy hoàn tiền, hoặc bị quản trị viên khóa):** A7.c.1. Hệ thống hiển thị: "Mã đã bị hủy/khóa, không thể sử dụng".
- **A3.a — Quét QR mô phỏng lỗi/không đọc được:** A3.a.1. Hệ thống chuyển sang chế độ nhập mã thủ công. Quay về bước 3.

### Dòng ngoại lệ
**E1 — Lỗi hệ thống khi tra cứu:** E1.1. Hệ thống hiển thị lỗi kèm nút "Thử lại".

### Business Rule
- **RB-08:** Voucher hết hạn, bị hủy hoặc bị khóa thì không được sử dụng.
- **RB-09:** Đối tác chỉ được xác thực voucher thuộc phạm vi chi nhánh hoặc chương trình của mình.
- **ASM-03:** Quét QR có thể mô phỏng bằng nhập mã hoặc hiển thị QR ảnh.

### Yêu cầu phi chức năng
- **NFR-01 Hiệu năng:** Tra cứu phải phản hồi nhanh vì thao tác diễn ra tại quầy, trước mặt khách hàng.
- **NFR-02 Bảo mật:** Không hiển thị đầy đủ thông tin cá nhân của khách hàng sở hữu mã (chỉ đủ để xác minh, vd tên viết tắt); không cho tra cứu vượt phạm vi chi nhánh/chương trình của đối tác.
- **NFR-05 Khả năng sử dụng:** Kết quả tra cứu hiển thị rõ ràng bằng màu sắc/icon theo trạng thái (hợp lệ/đã dùng/hết hạn/khóa) để nhân viên quầy nhận biết nhanh.

---

## Thêm tài khoản nhân viên

| Trường | Nội dung |
|---|---|
| **Tác nhân** | Owner |

**Tóm tắt:** Chủ tài khoản (Owner) tạo tài khoản đăng nhập riêng cho nhân viên, gán vai trò (Quản lý vận hành hoặc Nhân viên chi nhánh) và phạm vi chi nhánh phụ trách (nếu là Nhân viên chi nhánh).

**Trigger:** Owner chọn "Quản lý nhân viên" → "Thêm nhân viên" trong trang quản lý hồ sơ.

**Điều kiện tiên quyết:** Owner đã đăng nhập.

**Hậu điều kiện:** Tài khoản nhân viên mới được tạo với vai trò và phạm vi chi nhánh (nếu có) đã gán.

### Dòng sự kiện chính
1. Owner chọn "Quản lý nhân viên" trong trang quản lý hồ sơ.
2. Hệ thống hiển thị danh sách nhân viên hiện có kèm nút "Thêm nhân viên".
3. Owner nhấn "Thêm nhân viên".
4. Hệ thống hiển thị form: Họ tên, Email/SĐT (dùng đăng nhập), Vai trò (Quản lý vận hành / Nhân viên chi nhánh), Chi nhánh phụ trách (chỉ hiện khi chọn vai trò Nhân viên chi nhánh — chọn 1 hoặc nhiều).
5. Owner nhập thông tin và chọn vai trò/chi nhánh.
6. Owner nhấn "Tạo tài khoản".
7. Hệ thống kiểm tra thông tin hợp lệ và Email/SĐT chưa tồn tại trên hệ thống.
8. Hệ thống tạo tài khoản nhân viên, sinh thông tin thiết lập mật khẩu ban đầu (mô phỏng).
9. Hệ thống gửi thông báo (mô phỏng theo ASM-02) đến Email/SĐT nhân viên kèm hướng dẫn đăng nhập lần đầu.
10. Hệ thống hiển thị thông báo "Đã tạo tài khoản nhân viên thành công" và cập nhật danh sách.
11. Kết thúc use case.

### Dòng sự kiện phụ
- **A5.a — Trống trường bắt buộc:** A5.a.1. Hệ thống báo lỗi tại trường trống. Quay về bước 5.
- **A5.b — Email/SĐT sai định dạng:** A5.b.1. Hệ thống báo lỗi tại trường tương ứng. Quay về bước 5.
- **A5.c — Chọn vai trò "Nhân viên chi nhánh" nhưng chưa chọn chi nhánh:** A5.c.1. Hệ thống báo lỗi: "Phải chọn ít nhất 1 chi nhánh cho nhân viên chi nhánh". Quay về bước 5.
- **A7.a — Email/SĐT đã tồn tại (trùng với tài khoản khác — đối tác, nhân viên khác, hoặc khách hàng):** A7.a.1. Hệ thống báo lỗi: "Email/SĐT đã được sử dụng". Quay về bước 5.

### Dòng ngoại lệ
- **E1 — Lỗi hệ thống khi tạo tài khoản (bước 8):** E1.1. Hệ thống báo lỗi, không tạo tài khoản, giữ nguyên dữ liệu form. Owner thử lại từ bước 6.
- **E2 — Lỗi gửi thông báo đến nhân viên (bước 9):**
  - E2.1. Tài khoản vẫn được tạo thành công (không rollback).
  - E2.2. Owner có thể xem lại thông tin đăng nhập tạm thời trong danh sách nhân viên để cung cấp thủ công.

### Business Rule
- Chỉ Owner mới có quyền thêm tài khoản nhân viên.
- Email/SĐT nhân viên phải duy nhất trên toàn hệ thống.
- Vai trò "Nhân viên chi nhánh" bắt buộc phải gán ít nhất 1 chi nhánh; vai trò "Quản lý vận hành" không cần gán chi nhánh cụ thể (quản lý toàn bộ chi nhánh của doanh nghiệp).
- Tài khoản nhân viên kế thừa trạng thái hoạt động của doanh nghiệp gốc — nếu doanh nghiệp bị khóa, toàn bộ nhân viên không thể đăng nhập.

### Yêu cầu phi chức năng
- **NFR-02 Bảo mật:** Mật khẩu/thông tin thiết lập ban đầu không hiển thị dạng plaintext lâu dài trong hệ thống; nhân viên bắt buộc đổi mật khẩu lần đăng nhập đầu (khuyến nghị).
- **NFR-05 Khả năng sử dụng:** Form ẩn/hiện trường "Chi nhánh phụ trách" động theo vai trò được chọn.
- **NFR-06 Khả năng kiểm toán:** Ghi log việc tạo tài khoản nhân viên (ai tạo, vai trò, chi nhánh gán) — liên quan RB-12.
