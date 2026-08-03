# AGENTS.md — Dự án EC Voucher Marketplace (Admin-first)

> Tài liệu điều hướng thiết kế và sinh giao diện cho **Figma Make / AI coding agent**.  
> Trọng tâm hiện tại là **vai trò Quản trị viên**; các vai trò Khách hàng, Đối tác và Nhân viên đối tác chỉ được mô tả ở mức quan hệ lan truyền để bảo đảm giao diện Admin không tách rời toàn hệ thống.

---

## 1. Tổng quan dự án

Dự án xây dựng một **hệ thống thương mại điện tử bán voucher giảm giá trực tuyến**, đóng vai trò sàn trung gian giữa:

- **Khách hàng**: tìm kiếm, mua, nhận và sử dụng voucher.
- **Đối tác**: đăng ký doanh nghiệp, quản lý chi nhánh, tạo và theo dõi chương trình voucher.
- **Nhân viên đối tác**: kiểm tra và xác nhận sử dụng voucher trong đúng phạm vi chi nhánh được phân công.
- **Quản trị viên**: kiểm duyệt, giám sát và xử lý các tình huống vận hành toàn sàn.

Luồng nghiệp vụ tổng quát:

**Đăng ký đối tác → Quản trị viên duyệt đối tác → Đối tác tạo voucher → Quản trị viên duyệt voucher → Voucher được công bố → Khách hàng mua → Thanh toán mô phỏng → Hệ thống phát hành voucher code → Đối tác xác thực sử dụng → Hệ thống ghi nhận báo cáo và nhật ký.**

### Mục tiêu của giao diện Admin

Giao diện Admin không chỉ là tập hợp các bảng dữ liệu. Nó phải giúp Quản trị viên:

1. Biết ngay đối tượng nào đang chờ xử lý.
2. Kiểm tra đủ dữ liệu trước khi quyết định.
3. Hiểu hậu quả của từng thao tác đối với các vai trò khác.
4. Chỉ được thực hiện hành động hợp lệ theo trạng thái hiện tại.
5. Luôn xác nhận các thao tác có ảnh hưởng nghiệp vụ.
6. Luôn ghi nhận lịch sử thay đổi và kết quả cuối cùng.
7. Không để dữ liệu ở trạng thái cập nhật một phần khi thao tác thất bại.

---

## 2. Nguồn yêu cầu và thứ tự ưu tiên

Khi có khác biệt giữa các tài liệu, áp dụng thứ tự sau:

1. **REPORT-ĐA-EC.pdf**  
   Là nguồn chi tiết chính cho các use case Admin:
   - UC-ADM-01 — Quản lý người dùng
   - UC-ADM-02 — Quản lý đối tác
   - UC-ADM-03 — Duyệt voucher
   - UC-ADM-04 — Quản lý đơn hàng
   - UC-ADM-05 — Quản lý nội dung

2. **FIT_HCMUS_EC_Project_Assigment_2026_v1.0.pdf**  
   Là nguồn phạm vi nghiệp vụ, quy tắc chung, dữ liệu, yêu cầu phi chức năng và hai mô-đun quản trị bổ sung:
   - BR-ADM-06 — Dashboard quản trị
   - BR-ADM-07 — Nhật ký hệ thống

3. **Tài liệu này**  
   Chuẩn hóa yêu cầu thành quy tắc giao diện, kiến trúc thông tin, trạng thái và tương tác để Figma Make sinh prototype nhất quán.

### Quy tắc chống tự suy diễn

- Không thêm thao tác nghiệp vụ chỉ vì “thường thấy ở hệ thống khác”.
- Không thêm xóa tài khoản người dùng vì luồng chi tiết hiện tại chỉ có: xem, tìm kiếm, cập nhật vai trò, khóa và mở khóa.
- Không cho phép Admin chỉnh trực tiếp mọi trạng thái bằng một dropdown chung.
- Không gộp trạng thái đơn hàng, thanh toán và voucher code thành một trạng thái duy nhất.
- Không gộp trạng thái kiểm duyệt voucher và trạng thái công bố voucher.
- Không biến các thao tác thanh toán, gửi email, SMS hoặc quét QR mô phỏng thành tích hợp thật.
- Không tạo mobile app native; giao diện là web responsive.
- Không tự thêm machine learning, chatbot, ERP, CRM hoặc cổng thanh toán thật.

---

## 3. Phạm vi hiện tại

### Trong phạm vi Admin-first

- Đăng nhập và kiểm soát truy cập trang quản trị.
- Dashboard quản trị.
- Quản lý người dùng.
- Quản lý đối tác và yêu cầu thay đổi chi nhánh.
- Duyệt voucher và xác định trạng thái công bố.
- Quản lý đơn hàng, hủy đơn, hoàn tiền mô phỏng và cấp lại mã.
- Quản lý nội dung.
- Nhật ký hệ thống.
- Các trạng thái loading, empty, error, forbidden, success và confirmation.
- Liên kết điều hướng giữa dashboard, danh sách, chi tiết và nhật ký.

### Chưa triển khai đầy đủ trong giai đoạn này

- Toàn bộ giao diện Khách hàng.
- Toàn bộ portal Đối tác.
- Toàn bộ giao diện Nhân viên đối tác.
- Thanh toán thật.
- Gửi email/SMS thật.
- Quét QR bằng camera thật.
- Tích hợp ERP/CRM.
- Mobile native.

Các vai trò ngoài Admin vẫn phải được xem xét ở mức **hậu quả lan truyền**, vì quyết định của Admin làm thay đổi quyền truy cập, dữ liệu và nội dung mà các vai trò đó nhìn thấy.

---

## 4. Mô hình vai trò và nguyên tắc lan truyền

### 4.1. Quản trị viên

Quản trị viên là người:

- Kiểm tra dữ liệu.
- Phê duyệt hoặc từ chối.
- Khóa hoặc mở khóa.
- Xử lý ngoại lệ vận hành.
- Theo dõi các trạng thái liên quan.
- Ghi nhận lý do.
- Truy vết thay đổi.

Quản trị viên **không được tùy ý sửa dữ liệu nghiệp vụ vượt ngoài use case**.

### 4.2. Khách hàng

Ảnh hưởng từ Admin:

- Tài khoản Tạm khóa → không thể tiếp tục sử dụng chức năng yêu cầu đăng nhập; lịch sử mua vẫn được giữ.
- Đơn hàng được hủy hoặc hoàn tiền → trạng thái đơn và voucher code trong ví thay đổi.
- Voucher code bị vô hiệu hóa hoặc cấp lại → mã cũ không còn hợp lệ; mã mới xuất hiện.
- Voucher bị tạm ẩn hoặc ngừng bán → không còn hiển thị để mua.
- Nội dung được công bố, tạm ẩn hoặc ngừng hiển thị → giao diện khách hàng cập nhật tương ứng.

### 4.3. Đối tác

Ảnh hưởng từ Admin:

- Hồ sơ được duyệt → được phép vận hành theo phạm vi đã duyệt.
- Hồ sơ bị từ chối → không được tạo hoặc bán voucher.
- Đối tác Tạm khóa → không được vận hành bình thường; chi nhánh không được dùng cho voucher mới.
- Yêu cầu chi nhánh được duyệt → danh sách chi nhánh chính thức thay đổi.
- Voucher được duyệt/từ chối → portal đối tác nhận kết quả và lý do.
- Voucher được lên lịch, đang bán hoặc tạm ẩn → portal đối tác phải phản ánh đúng trạng thái công bố.

### 4.4. Nhân viên đối tác

Ảnh hưởng từ Admin:

- Đối tác Tạm khóa → nhân viên không được xác thực voucher trong phạm vi đối tác đó.
- Chi nhánh bị tạm ngưng hoặc bị từ chối → nhân viên tại chi nhánh đó không được xác thực voucher mới thuộc phạm vi không còn hợp lệ.
- Voucher bị tạm ẩn không đồng nghĩa voucher code đã bán bị vô hiệu hóa; việc xác thực mã phải dựa vào trạng thái voucher code và điều kiện sử dụng.
- Nhân viên chỉ được xem và xác thực voucher thuộc đối tác/chi nhánh của mình.

---

## 5. Các khái niệm bắt buộc phải tách riêng

### 5.1. Voucher sản phẩm và voucher code

**Voucher sản phẩm**

- Do đối tác tạo.
- Có tên, mô tả, giá, thời gian, số lượng, điều kiện và chi nhánh áp dụng.
- Được Admin kiểm duyệt.
- Có trạng thái kiểm duyệt và trạng thái công bố.

**Voucher code**

- Được sinh cho giao dịch hợp lệ sau khi thanh toán thành công.
- Gắn với đơn hàng và khách hàng.
- Có trạng thái sử dụng riêng.
- Có thể bị lỗi sinh mã, vô hiệu hóa hoặc được cấp lại.

Không dùng từ “voucher” để chỉ cả hai loại trong cùng một khu vực giao diện mà không ghi rõ.

### 5.2. Hai trục trạng thái của voucher sản phẩm

Để tránh mơ hồ, UI phải tách:

#### Trạng thái kiểm duyệt `reviewStatus`

- `Chờ duyệt`
- `Đã duyệt`
- `Từ chối`

#### Trạng thái công bố `publicationStatus`

- `Chưa công bố`
- `Chờ hiển thị`
- `Đang bán`
- `Tạm ẩn`
- `Ngừng bán`
- `Hết hạn`
- `Hết số lượng`

Ví dụ:

- `reviewStatus = Đã duyệt`
- `publicationStatus = Chờ hiển thị`

Điều này rõ hơn việc chỉ hiển thị một badge “Đã duyệt”.

### 5.3. Ba nhóm trạng thái trong đơn hàng

#### Trạng thái đơn hàng `orderStatus`

- `Đã tạo`
- `Chờ thanh toán`
- `Đã thanh toán`
- `Chờ hoàn tiền`
- `Đã hoàn tiền`
- `Đã hủy`
- `Hủy yêu cầu hoàn tiền`

#### Trạng thái thanh toán `paymentStatus`

- `Chờ thanh toán`
- `Thành công`
- `Thất bại`
- `Đã hoàn tiền mô phỏng`

#### Trạng thái voucher code `voucherCodeStatus`

- `Chưa phát hành`
- `Đã phát hành`
- `Lỗi sinh mã`
- `Chưa sử dụng`
- `Đã sử dụng`
- `Hết hạn`
- `Bị hủy`
- `Vô hiệu hóa`

Ba trạng thái phải nằm ở ba vị trí riêng và có nhãn rõ ràng.

### 5.4. Trạng thái nội dung

- `Đang hiển thị`
- `Tạm ẩn`
- `Ngừng hiển thị`

Không dùng “xóa” thay cho “Ngừng hiển thị” khi tài liệu chỉ yêu cầu giữ dữ liệu và ẩn khỏi giao diện người dùng.

---

## 6. Kiến trúc thông tin Admin

### 6.1. App shell

Giao diện Admin dùng cấu trúc:

- **Sidebar trái cố định**
- **Top bar**
- **Vùng nội dung chính**
- **Breadcrumb**
- **Notification/toast**
- **Modal xác nhận**
- **Drawer hoặc trang chi tiết**
- **Responsive collapse trên màn hình nhỏ**

### 6.2. Thứ tự menu

1. Tổng quan
2. Người dùng
3. Đối tác
4. Duyệt voucher
5. Đơn hàng
6. Nội dung
7. Nhật ký hệ thống

### 6.3. Điều hướng chéo

- Từ Dashboard → danh sách đã lọc theo nhóm cần xử lý.
- Từ hồ sơ Đối tác → danh sách voucher của đối tác.
- Từ voucher → hồ sơ đối tác và chi nhánh áp dụng.
- Từ đơn hàng → khách hàng, voucher sản phẩm, đối tác và voucher code.
- Từ mọi thao tác thành công → liên kết “Xem nhật ký”.
- Từ bản ghi nhật ký → quay lại đối tượng liên quan nếu còn tồn tại.

---

## 7. Quy tắc thiết kế UI/UX

### 7.1. Phong cách tổng thể

- Dashboard quản trị chuyên nghiệp, rõ ràng, thiên về dữ liệu và ra quyết định.
- Nền sáng: trắng hoặc xám rất nhạt.
- Card bo góc vừa phải, shadow nhẹ.
- Không dùng glassmorphism dày, gradient trang trí mạnh hoặc hiệu ứng gây nhiễu.
- Không thiết kế giống trang mua voucher dành cho khách hàng.
- Ưu tiên bảng dữ liệu, bộ lọc, badge trạng thái, timeline và panel chi tiết.

### 7.2. Màu sắc

- **Xanh dương**: hành động chính, liên kết, thông tin đang chọn.
- **Xanh lá**: thành công, đã duyệt, đang hoạt động, đang bán.
- **Vàng/cam**: chờ xử lý, cảnh báo, chờ duyệt, chờ hoàn tiền.
- **Đỏ**: từ chối, khóa, lỗi, vô hiệu hóa, thao tác nguy hiểm.
- **Xám**: chưa hoạt động, ngừng hiển thị, dữ liệu phụ.

Màu sắc không được là tín hiệu duy nhất. Mọi badge phải có text và khi cần có icon.

### 7.3. Typography

- Font sans-serif dễ đọc như Inter/Roboto.
- Tiêu đề trang: 24–32 px.
- Tiêu đề khu vực: 18–22 px.
- Nội dung bảng: tối thiểu 14–16 px.
- Không dùng text quá nhỏ trong bảng hoặc modal.
- Số tiền, mã đơn, mã voucher và trạng thái phải dễ quét bằng mắt.

### 7.4. Bảng dữ liệu

Mọi danh sách phải có:

- Tiêu đề và mô tả ngắn.
- Thanh tìm kiếm/bộ lọc.
- Số lượng kết quả.
- Header rõ ràng.
- Badge trạng thái.
- Phân trang hoặc tải thêm.
- Empty state.
- Error state.
- Loading skeleton.
- Row click để mở chi tiết.
- Menu hành động theo ngữ cảnh, không hiển thị hành động không hợp lệ.

Không đặt quá nhiều nút màu trong từng dòng. Hành động phụ đặt trong menu `⋯`.

### 7.5. Modal xác nhận

Mọi thao tác thay đổi vai trò, trạng thái, phê duyệt, từ chối, khóa, mở khóa, hủy, hoàn tiền, cấp lại mã, công bố, tạm ẩn hoặc ngừng hiển thị phải có modal xác nhận.

Modal phải có:

- Tên thao tác.
- Đối tượng bị tác động.
- Trạng thái trước và trạng thái dự kiến sau.
- Hậu quả nghiệp vụ.
- Trường lý do khi đặc tả yêu cầu.
- Nút hủy.
- Nút xác nhận có nhãn hành động cụ thể.
- Loading khi đang xử lý.
- Chặn nhấn lặp.

Không dùng nút chung chung như “OK”.

### 7.6. Form và validation

- Label luôn hiển thị, không chỉ dùng placeholder.
- Lỗi đặt ngay dưới trường.
- Lý do khóa/mở khóa/từ chối/hủy/hoàn tiền phải bắt buộc khi đặc tả yêu cầu.
- Không đóng modal khi dữ liệu chưa hợp lệ.
- Khi lỗi hệ thống, giữ dữ liệu người dùng vừa nhập để có thể thử lại.
- Không thông báo thành công khi thao tác chưa lưu và chưa ghi nhật ký bắt buộc.

### 7.7. Các trạng thái hệ thống bắt buộc

Mỗi màn hình phải có prototype cho:

- Loading.
- Loaded.
- Empty.
- No search result.
- Validation error.
- Processing.
- Success.
- System error.
- Forbidden/không có quyền.
- Session expired.

---

## 8. UC-ADM-01 — Quản lý người dùng

### 8.1. Mục tiêu

Cho phép Quản trị viên:

- Xem danh sách tài khoản.
- Tìm kiếm.
- Xem hồ sơ chi tiết.
- Cập nhật vai trò.
- Khóa tài khoản.
- Mở khóa tài khoản.
- Truy vết thay đổi.

### 8.2. Màn hình danh sách người dùng

#### Bộ lọc

- Họ tên
- Số điện thoại
- Vai trò
- Trạng thái tài khoản

Có nút:

- `Tìm kiếm`
- `Đặt lại`

#### Cột bảng

- Họ tên
- Email
- Số điện thoại
- Vai trò
- Trạng thái
- Hành động

Không thêm cột hoặc hành động xóa nếu chưa có đặc tả.

#### Empty state

- Không có dữ liệu người dùng.
- Không có tài khoản phù hợp với điều kiện tìm kiếm.

Giữ nguyên bộ lọc khi không tìm thấy kết quả để Admin sửa điều kiện.

### 8.3. Màn hình chi tiết người dùng

Tổ chức theo các khu vực hoặc tab:

1. **Thông tin cá nhân**
2. **Vai trò và trạng thái**
3. **Lịch sử mua voucher**
4. **Lịch sử quản trị liên quan**

#### Hành động theo trạng thái

| Trạng thái hiện tại | Hành động được phép |
|---|---|
| Đang hoạt động | Cập nhật vai trò, Khóa tài khoản |
| Tạm khóa | Cập nhật vai trò nếu được phép, Mở khóa tài khoản |

Không hiển thị đồng thời nút `Khóa` và `Mở khóa`.

### 8.4. Cập nhật vai trò

Flow:

1. Admin chọn `Cập nhật vai trò`.
2. Hệ thống hiển thị vai trò hiện tại.
3. Admin chọn vai trò mới.
4. Admin nhấn `Xác nhận cập nhật`.
5. Modal hiển thị vai trò trước và sau.
6. Admin xác nhận.
7. Hệ thống cập nhật và ghi nhật ký.
8. Hiển thị vai trò mới và toast thành công.

Nếu Admin hủy:

- Đóng modal.
- Không thay đổi vai trò.
- Không ghi nhật ký thay đổi vai trò.

### 8.5. Khóa tài khoản

Modal cần:

- Tên tài khoản.
- Trạng thái hiện tại.
- Cảnh báo về ảnh hưởng đăng nhập.
- Trường `Lý do khóa tài khoản` bắt buộc.
- Nút `Hủy`.
- Nút nguy hiểm `Xác nhận khóa`.

Sau thành công:

- Badge chuyển thành `Tạm khóa`.
- Nút `Khóa` biến mất.
- Nút `Mở khóa` xuất hiện.
- Có liên kết xem nhật ký.

### 8.6. Mở khóa tài khoản

Modal cần:

- Tên tài khoản.
- Trạng thái hiện tại.
- Trường `Lý do mở khóa tài khoản` bắt buộc.
- Nút `Hủy`.
- Nút `Xác nhận mở khóa`.

Sau thành công:

- Badge chuyển thành `Đang hoạt động`.
- Cập nhật hành động theo trạng thái mới.

### 8.7. Nhật ký bắt buộc

Cập nhật vai trò:

- Người thực hiện
- Thời gian
- Vai trò cũ
- Vai trò mới
- Kết quả

Khóa/mở khóa:

- Người thực hiện
- Thời gian
- Loại thao tác
- Lý do
- Trạng thái trước
- Trạng thái sau
- Kết quả

### 8.8. Không được làm

- Không xóa tài khoản.
- Không sửa lịch sử mua voucher.
- Không tự tạo tài khoản Admin mới trong use case này.
- Không đổi vai trò bằng inline edit không xác nhận.
- Không cho phép thao tác thành công nếu ghi nhật ký bắt buộc thất bại.

---

## 9. UC-ADM-02 — Quản lý đối tác

### 9.1. Mục tiêu

Cho phép Admin:

- Xem và kiểm tra hồ sơ đối tác.
- Xem thông tin pháp lý.
- Xem trạng thái hoạt động.
- Xem danh sách chi nhánh.
- Duyệt hoặc từ chối đối tác.
- Khóa hoặc mở khóa đối tác.
- Xử lý yêu cầu thêm, sửa hoặc xóa chi nhánh.
- Yêu cầu bổ sung thông tin.
- Tạm ngưng chi nhánh khi cần.

### 9.2. Màn hình danh sách đối tác

#### Bộ lọc tối thiểu

- Tên doanh nghiệp
- Mã số thuế/mã đăng ký kinh doanh
- Trạng thái hồ sơ
- Trạng thái hoạt động
- Có yêu cầu thay đổi chi nhánh

#### Cột bảng

- Tên doanh nghiệp
- Mã số thuế
- Người đại diện
- Số chi nhánh
- Trạng thái hồ sơ
- Trạng thái hoạt động
- Yêu cầu chờ xử lý
- Hành động

### 9.3. Chi tiết đối tác

Bố cục bắt buộc tách thành:

1. **Thông tin doanh nghiệp**
2. **Thông tin pháp lý**
3. **Người đại diện và liên hệ**
4. **Trạng thái hồ sơ và hoạt động**
5. **Danh sách chi nhánh**
6. **Yêu cầu thay đổi chi nhánh**
7. **Lịch sử xử lý**

#### Thông tin doanh nghiệp

- Tên doanh nghiệp
- Mã số thuế/mã đăng ký kinh doanh
- Người đại diện
- Số điện thoại
- Email
- Địa chỉ kinh doanh
- Tài liệu pháp lý liên quan
- Trạng thái

### 9.4. Danh sách chi nhánh

Cột:

- Tên chi nhánh
- Địa chỉ
- Số điện thoại
- Trạng thái hoạt động
- Phạm vi áp dụng voucher
- Trạng thái yêu cầu thay đổi
- Hành động

### 9.5. Duyệt đối tác

Flow:

1. Admin kiểm tra hồ sơ và từng chi nhánh.
2. Chọn `Duyệt đối tác`.
3. Modal hiển thị kết quả dự kiến.
4. Nhập `Lý do duyệt`.
5. Xác nhận.
6. Hệ thống cập nhật hồ sơ và các chi nhánh hợp lệ.
7. Ghi nhật ký.
8. Hiển thị kết quả.

Hậu quả phải nêu rõ:

- Đối tác được phép hoạt động.
- Chi nhánh hợp lệ có thể được dùng để áp dụng voucher.
- Portal đối tác nhận trạng thái mới.

### 9.6. Từ chối đối tác

Modal bắt buộc có:

- Lý do từ chối.
- Cảnh báo: đối tác không được tạo hoặc bán voucher.
- Xác nhận rõ ràng.

Không cho phép từ chối mà không có lý do.

### 9.7. Khóa/mở khóa đối tác

Khi khóa:

- Trạng thái đối tác chuyển `Tạm khóa`.
- Chi nhánh của đối tác không được dùng cho voucher mới.
- Nhân viên đối tác bị ảnh hưởng quyền vận hành.
- Lý do khóa bắt buộc.
- Ghi nhật ký.

Khi mở khóa:

- Đối tác được hoạt động trở lại theo dữ liệu hợp lệ hiện có.
- Lý do mở khóa bắt buộc.
- Ghi nhật ký.

### 9.8. Xử lý yêu cầu thay đổi chi nhánh

Tách riêng thành một queue:

- Thêm chi nhánh
- Chỉnh sửa chi nhánh
- Xóa chi nhánh

#### Với yêu cầu chỉnh sửa

UI phải hiển thị dạng so sánh:

| Trường | Thông tin hiện tại | Nội dung đề nghị |
|---|---|---|
| Tên chi nhánh | ... | ... |
| Địa chỉ | ... | ... |
| Số điện thoại | ... | ... |
| Phạm vi áp dụng | ... | ... |

Không chỉ hiển thị dữ liệu mới.

#### Hành động

- Duyệt yêu cầu
- Từ chối yêu cầu
- Yêu cầu bổ sung thông tin
- Tạm ngưng chi nhánh khi chi nhánh đã duyệt nhưng không còn phù hợp

Yêu cầu chưa được duyệt không được làm thay đổi danh sách chi nhánh chính thức.

### 9.9. Nhật ký bắt buộc

- Duyệt/từ chối đối tác.
- Khóa/mở khóa đối tác.
- Yêu cầu bổ sung thông tin.
- Duyệt/từ chối thêm chi nhánh.
- Duyệt/từ chối sửa chi nhánh.
- Duyệt/từ chối xóa chi nhánh.
- Tạm ngưng chi nhánh.

Với chỉnh sửa chi nhánh, nhật ký phải có dữ liệu trước và sau.

---

## 10. UC-ADM-03 — Duyệt voucher

### 10.1. Mục tiêu

Cho phép Admin kiểm tra voucher do đối tác gửi và:

- Phê duyệt.
- Từ chối.
- Chọn tạm ẩn khi phê duyệt.
- Xác định trạng thái công bố theo thời gian bán, tồn kho và lựa chọn hiển thị.
- Ghi nhận lý do và lịch sử xử lý.

### 10.2. Danh sách chờ duyệt

Chỉ hiển thị voucher có `reviewStatus = Chờ duyệt`.

#### Bộ lọc

- Tên voucher
- Đối tác
- Danh mục
- Ngày gửi duyệt
- Chi nhánh/khu vực áp dụng

#### Cột bảng

- Ảnh
- Tên voucher
- Đối tác
- Danh mục
- Giá gốc
- Giá bán
- Thời gian bán
- Số lượng phát hành
- Ngày gửi
- Trạng thái kiểm duyệt

### 10.3. Chi tiết kiểm duyệt voucher

Chia thành các khối theo đúng trình tự kiểm tra:

1. **Thông tin nhận diện**
   - Tên
   - Mô tả
   - Danh mục
   - Hình ảnh
   - Đối tác phát hành
   - Chi nhánh áp dụng

2. **Thông tin giá**
   - Giá gốc
   - Giá bán
   - Giá hiển thị
   - Mức giảm được tính và hiển thị tham khảo

3. **Thời gian**
   - Thời gian bắt đầu bán
   - Thời gian kết thúc bán
   - Thời gian sử dụng nếu được khai báo

4. **Số lượng**
   - Số lượng phát hành
   - Số lượng đã bán
   - Số lượng còn lại

5. **Phạm vi áp dụng**
   - Danh sách chi nhánh
   - Trạng thái từng chi nhánh
   - Khu vực áp dụng

6. **Điều kiện sử dụng**
   - Số lần sử dụng
   - Số người
   - Khung giờ
   - Điều kiện và giới hạn khác đã khai báo

7. **Kết quả kiểm duyệt và hành động**

### 10.4. Checklist hỗ trợ Admin

Checklist chỉ hỗ trợ kiểm tra, không tự phê duyệt:

- Tên/mô tả/hình ảnh phù hợp.
- Voucher gắn đúng đối tác.
- Giá gốc và giá bán hợp lệ.
- Giá bán nhỏ hơn giá gốc.
- Thời gian hợp lệ.
- Số lượng hợp lệ.
- Chi nhánh thuộc đối tác và đang đủ điều kiện.
- Điều kiện sử dụng không mâu thuẫn.

Admin vẫn là người xác nhận cuối cùng.

### 10.5. Phê duyệt voucher

Modal:

- Voucher được xử lý.
- Đối tác phát hành.
- Tóm tắt giá, thời gian và tồn kho.
- Checkbox `Tạm ẩn sau khi phê duyệt`.
- Trạng thái kiểm duyệt sau thao tác.
- Trạng thái công bố dự kiến.
- Nút `Hủy`.
- Nút `Xác nhận phê duyệt`.

Logic trạng thái:

```text
reviewStatus = Đã duyệt

nếu Admin chọn tạm ẩn:
    publicationStatus = Tạm ẩn
ngược lại nếu chưa đến thời gian bán:
    publicationStatus = Chờ hiển thị
ngược lại nếu đã đến thời gian bán và còn số lượng:
    publicationStatus = Đang bán
ngược lại:
    publicationStatus = trạng thái phù hợp theo thời gian/tồn kho
```

Nếu `Chờ hiển thị`, UI phải nói rõ hệ thống sẽ tự động công bố khi đến thời gian bán nếu vẫn còn đủ điều kiện.

### 10.6. Từ chối voucher

Lý do từ chối bắt buộc.

Có thể hỗ trợ chọn nhóm lý do:

- Thông tin nhận diện gây hiểu nhầm.
- Thông tin giá không hợp lệ.
- Thời gian không hợp lệ.
- Số lượng/tồn kho không hợp lệ.
- Chi nhánh/phạm vi áp dụng không hợp lệ.
- Điều kiện sử dụng không nhất quán.
- Khác.

Sau khi chọn nhóm, Admin vẫn phải nhập mô tả cụ thể.

### 10.7. Hậu quả lan truyền

Phê duyệt:

- Portal đối tác nhận kết quả.
- Voucher có thể được lên lịch hoặc công bố.
- Khách hàng chỉ nhìn thấy voucher khi trạng thái công bố cho phép.

Từ chối:

- Không công bố.
- Portal đối tác thấy lý do.
- Đối tác có cơ sở sửa dữ liệu và gửi lại theo quy trình tương lai.

### 10.8. Nhật ký bắt buộc

- Người thực hiện
- Thời gian
- Voucher
- Đối tác
- Kết quả duyệt
- Trạng thái kiểm duyệt trước/sau
- Trạng thái công bố trước/sau
- Lý do từ chối nếu có
- Kết quả cuối cùng

---

## 11. UC-ADM-04 — Quản lý đơn hàng

### 11.1. Mục tiêu

Cho phép Admin:

- Tra cứu và kiểm tra đơn hàng.
- Theo dõi lịch sử thanh toán.
- Theo dõi lịch sử sinh/gửi voucher code.
- Xử lý yêu cầu hủy.
- Ghi nhận hoàn tiền mô phỏng.
- Từ chối hủy/hoàn tiền.
- Xử lý trường hợp chưa nhận được mã hoặc mã lỗi.
- Cấp lại voucher code.
- Ghi nhật ký toàn bộ quá trình.

### 11.2. Danh sách đơn hàng

#### Bộ lọc

- Mã đơn hàng
- Tên/tài khoản khách hàng
- Voucher được mua
- Đối tác phát hành
- Trạng thái đơn hàng
- Trạng thái thanh toán
- Trạng thái voucher code

#### Cột bảng

- Mã đơn
- Khách hàng
- Voucher
- Đối tác
- Tổng tiền
- Trạng thái đơn hàng
- Trạng thái thanh toán
- Trạng thái voucher code
- Thời gian tạo
- Hành động

### 11.3. Chi tiết đơn hàng

Tách thành các tab/khu vực:

1. **Tổng quan đơn hàng**
2. **Khách hàng**
3. **Voucher và đối tác**
4. **Lịch sử thanh toán**
5. **Lịch sử phát hành và gửi mã**
6. **Voucher code hiện tại**
7. **Yêu cầu hủy/hoàn tiền**
8. **Nhật ký quản trị**

Không gộp lịch sử thanh toán với lịch sử phát hành mã.

### 11.4. Kiểm tra tính nhất quán

UI cần hỗ trợ Admin đối chiếu:

- Đơn đã thanh toán hay chưa.
- Voucher code đã được sinh hay chưa.
- Trạng thái mã có phù hợp trạng thái thanh toán không.
- Có lịch sử gửi mã hay chưa.
- Có yêu cầu hủy/hoàn tiền đang chờ không.

Có thể hiển thị panel cảnh báo “Phát hiện dữ liệu cần kiểm tra”, nhưng không tự thay đổi trạng thái.

### 11.5. Ma trận hành động

| Điều kiện | Hành động |
|---|---|
| Chỉ tra cứu, dữ liệu hợp lệ | Không thay đổi dữ liệu |
| Đã thanh toán nhưng chưa phát hành được mã và đủ điều kiện hủy | Chuyển sang Chờ hoàn tiền |
| Đang Chờ hoàn tiền và đủ điều kiện | Ghi nhận hoàn tiền mô phỏng |
| Yêu cầu hủy/hoàn tiền không đủ điều kiện | Từ chối và nhập lý do |
| Đã thanh toán, mã lỗi hoặc chưa có mã hợp lệ | Cấp lại mã |
| Mã cũ tồn tại khi cấp lại/hoàn tiền | Vô hiệu hóa mã cũ trước khi tiếp tục |

### 11.6. Xử lý hủy đơn

Modal:

- Mã đơn.
- Trạng thái đơn.
- Trạng thái thanh toán.
- Trạng thái mã.
- Điều kiện hủy.
- `Lý do hủy đơn`.
- Hậu quả dự kiến.
- Xác nhận.

Trường hợp đã thanh toán nhưng chưa có mã hợp lệ:

- Chuyển đơn sang `Chờ hoàn tiền`.
- Không sinh mã mới.
- Ghi lý do.
- Ghi nhật ký.

### 11.7. Hoàn tiền mô phỏng

Modal:

- Số tiền dự kiến.
- Voucher code liên quan.
- Cảnh báo mã sẽ bị vô hiệu hóa.
- `Lý do hoàn tiền`.
- Nút `Ghi nhận hoàn tiền mô phỏng`.

Sau thành công:

- Voucher code liên quan `Vô hiệu hóa`.
- Đơn hàng `Đã hoàn tiền`.
- Thanh toán `Đã hoàn tiền mô phỏng`.
- Ghi nhật ký.
- Hiển thị badge và timeline mới.

Không hiển thị logo hoặc luồng cổng thanh toán thật.

### 11.8. Từ chối hủy/hoàn tiền

Modal có nhãn lý do đúng ngữ cảnh:

- `Lý do từ chối hủy`
- hoặc `Lý do từ chối hoàn tiền`

Sau xử lý:

- Giữ trạng thái phù hợp theo đặc tả.
- Lưu lý do.
- Ghi nhật ký.
- Thông báo kết quả cho khách hàng ở mức mô phỏng.

### 11.9. Cấp lại voucher code

Điều kiện:

- Thanh toán thành công.
- Chưa có mã hợp lệ hoặc mã có trạng thái `Lỗi sinh mã`.

Flow:

1. Admin mở chi tiết.
2. Kiểm tra lịch sử sinh và gửi mã.
3. Chọn `Cấp lại mã mới`.
4. Modal xác nhận.
5. Hệ thống kiểm tra lại điều kiện.
6. Vô hiệu hóa mã cũ nếu có.
7. Sinh mã mới.
8. Liên kết với đơn và khách hàng.
9. Gửi email mô phỏng.
10. Cập nhật lịch sử.
11. Ghi nhật ký gồm mã cũ, mã mới và kết quả gửi.

UI phải ghi rõ `Gửi email mô phỏng`, không giả định tích hợp email thật.

### 11.10. Xử lý lỗi nhất quán

Nếu một bước phụ thuộc thất bại:

- Không tiếp tục bước sau.
- Không hiển thị thành công.
- Không để trạng thái đơn, thanh toán, tồn kho hoặc voucher code lệch nhau.
- Hiển thị lỗi tại đúng khu vực.
- Cho phép thử lại an toàn.
- Không tự lặp lại thao tác khi reload.

---

## 12. UC-ADM-05 — Quản lý nội dung

### 12.1. Nhóm nội dung

- Danh mục voucher
- Banner
- Bài viết
- Popup
- Chính sách

### 12.2. Content hub

Màn hình đầu tiên hiển thị 5 nhóm nội dung bằng tab hoặc card.

Mỗi nhóm hiển thị:

- Tổng số nội dung
- Đang hiển thị
- Tạm ẩn
- Ngừng hiển thị
- Nút vào danh sách

### 12.3. Danh sách nội dung

Cấu trúc cột thay đổi theo nhóm, nhưng tối thiểu có:

- Tên/tiêu đề
- Nhóm nội dung
- Vị trí hiển thị nếu có
- Trạng thái hiển thị
- Thời gian cập nhật
- Người cập nhật
- Hành động

### 12.4. Tạo mới

Flow:

1. Admin chọn nhóm.
2. Chọn `Tạo mới`.
3. Hệ thống mở form đúng loại nội dung.
4. Admin nhập và kiểm tra dữ liệu.
5. Chọn `Tạo mới và công bố`.
6. Modal xác nhận.
7. Hệ thống lưu, cập nhật `Đang hiển thị`, ghi nhật ký.
8. Nội dung xuất hiện trên giao diện liên quan.

Có thể có `Xem trước` vì đây là thao tác đọc, không thay đổi nghiệp vụ.

Không tự thêm `Lưu nháp` nếu chưa được đặc tả.

### 12.5. Cập nhật và công bố

- Form hiển thị dữ liệu hiện tại.
- Admin chỉnh sửa.
- Có chế độ xem trước.
- Chọn `Cập nhật và công bố`.
- Modal xác nhận.
- Ghi nhận dữ liệu trước/sau.
- Nếu hủy xác nhận, giữ nguyên nội dung đã công bố.

### 12.6. Tạm ẩn

Hậu quả:

- Trạng thái `Tạm ẩn`.
- Không còn hiển thị trên giao diện người dùng.
- Dữ liệu vẫn được giữ.
- Có nhật ký.

Modal phải nêu rõ đây là ẩn tạm thời, không xóa dữ liệu.

### 12.7. Ngừng hiển thị

Hậu quả:

- Trạng thái `Ngừng hiển thị`.
- Nội dung hoặc danh mục bị ẩn khỏi toàn bộ giao diện người dùng.
- Có nhật ký.

Đây là thao tác có ảnh hưởng rộng, cần modal cảnh báo rõ.

### 12.8. Hủy tạo/cập nhật

- Không công bố dữ liệu đang nhập.
- Tạo mới: không thêm bản ghi đã công bố.
- Cập nhật: giữ nguyên bản hiện tại.
- Không đổi trạng thái.
- Cảnh báo mất thay đổi chưa lưu khi rời form.

---

## 13. BR-ADM-06 — Dashboard quản trị

> Dashboard là yêu cầu tổng thể từ BRD; tài liệu use case chi tiết hiện tại không quy định một luồng thay đổi dữ liệu riêng. Vì vậy Dashboard là màn hình **đọc, tổng hợp và điều hướng**, không phải nơi chỉnh trạng thái trực tiếp.

### 13.1. KPI cards

- Tổng người dùng
- Tài khoản Tạm khóa
- Đối tác chờ duyệt
- Yêu cầu chi nhánh chờ xử lý
- Voucher chờ duyệt
- Đơn hàng
- Đơn chờ hoàn tiền
- Sự cố phát hành mã
- Doanh thu mô phỏng
- Voucher đã bán
- Voucher đã sử dụng

### 13.2. Queue cần xử lý

Ưu tiên hiển thị:

1. Đối tác chờ duyệt.
2. Yêu cầu thay đổi chi nhánh.
3. Voucher chờ duyệt.
4. Đơn chờ hoàn tiền.
5. Đơn lỗi sinh mã.
6. Thao tác hệ thống thất bại cần kiểm tra.

Mỗi item có:

- Đối tượng.
- Thời gian chờ.
- Trạng thái.
- Mức độ cần chú ý.
- Nút `Xem chi tiết`.

### 13.3. Biểu đồ

Chỉ dùng biểu đồ phục vụ quyết định:

- Doanh thu mô phỏng theo thời gian.
- Số đơn theo trạng thái.
- Voucher bán ra/đã sử dụng.
- Số đối tác theo trạng thái.
- Số lượng thao tác quản trị theo kết quả.

Không dùng biểu đồ 3D hoặc trang trí không mang thông tin.

### 13.4. Quy tắc Dashboard

- Click KPI mở danh sách với bộ lọc tương ứng.
- Không đặt nút duyệt/từ chối trực tiếp trên KPI card.
- Hiển thị thời gian cập nhật dữ liệu.
- Có loading/error riêng cho từng widget, không làm hỏng toàn trang.

---

## 14. BR-ADM-07 — Nhật ký hệ thống

> Nhật ký là mô-đun đọc và truy vết. Không cho sửa hoặc xóa log từ giao diện Admin thông thường.

### 14.1. Danh sách nhật ký

#### Bộ lọc

- Người thực hiện
- Mô-đun
- Loại thao tác
- Đối tượng
- Kết quả
- Khoảng thời gian

#### Cột

- Thời gian
- Người thực hiện
- Mô-đun
- Thao tác
- Đối tượng
- Trạng thái trước
- Trạng thái sau
- Kết quả
- Lý do
- Chi tiết

### 14.2. Chi tiết nhật ký

Drawer chi tiết gồm:

- ID log
- Người thực hiện
- Thời gian
- Use case/mô-đun
- Đối tượng và liên kết
- Nội dung thao tác
- Dữ liệu trước
- Dữ liệu sau
- Lý do
- Kết quả
- Thông báo lỗi nếu thất bại
- Mã cũ/mã mới đối với cấp lại voucher code

### 14.3. Quy tắc

- Thao tác thất bại không được ghi nhận là thành công.
- Log phải phản ánh kết quả cuối cùng.
- Nếu ghi log là điều kiện bắt buộc mà ghi log thất bại, thay đổi nghiệp vụ không được commit.
- Không có nút edit/delete log.
- Có thể export chỉ khi được yêu cầu bổ sung sau; hiện tại không tự thêm.

---

## 15. Quy tắc nghiệp vụ toàn hệ thống phải phản ánh trên UI

1. Voucher chỉ được bán khi đã được Admin duyệt.
2. Giá bán phải nhỏ hơn giá gốc.
3. Voucher phải có thời gian bán và thời gian sử dụng rõ ràng.
4. Voucher không được bán khi hết số lượng hoặc hết thời gian bán.
5. Voucher code chỉ phát hành sau khi thanh toán thành công.
6. Mỗi voucher code phải duy nhất và khó đoán.
7. Voucher đã sử dụng không được dùng lại, trừ trường hợp thiết kế nhiều lượt.
8. Voucher code hết hạn, bị hủy hoặc Tạm khóa không được sử dụng.
9. Đối tác chỉ xác thực voucher thuộc phạm vi của mình.
10. Số lượng bán không vượt quá số lượng phát hành.
11. Các thao tác quản trị quan trọng phải được lưu vết.
12. Đơn đã hủy không được phát hành voucher.
13. Chính sách hủy và hoàn tiền bám theo điều kiện voucher hoặc chính sách sàn.
14. Tại thời điểm đặt mua và thanh toán phải kiểm tra tồn kho.
15. UI không được cho phép thao tác trái với các quy tắc trên, kể cả khi dùng mock data.

---

## 16. Quy tắc kỹ thuật cho prototype Figma Make

### 16.1. Dữ liệu

- Dùng mock data có cấu trúc.
- Mỗi entity có ID ổn định.
- Dữ liệu phải đủ để thể hiện các trạng thái khác nhau.
- Không dùng toàn bộ dữ liệu “đẹp” hoặc thành công; phải có pending, locked, rejected, failed và empty.

### 16.2. Tương tác

Prototype phải hoạt động được:

- Sidebar navigation.
- Search/filter.
- Row click.
- Tab switching.
- Drawer/modal.
- Confirm/cancel.
- Required reason validation.
- Loading state.
- Success toast.
- Error message.
- Badge/state change sau thao tác mô phỏng.
- Deep link giả lập giữa các entity.
- Responsive sidebar.

### 16.3. Không được tạo prototype tĩnh

Không chỉ dựng các frame rời. Ít nhất phải mô phỏng được các flow:

1. Tìm người dùng → mở chi tiết → khóa → nhập lý do → xác nhận → trạng thái đổi.
2. Mở đối tác chờ duyệt → kiểm tra chi nhánh → duyệt → thấy trạng thái mới.
3. Mở voucher chờ duyệt → kiểm tra → phê duyệt → thấy trạng thái kiểm duyệt và công bố.
4. Mở đơn lỗi sinh mã → cấp lại mã → thấy mã cũ/mới và lịch sử.
5. Mở nội dung → tạm ẩn → thấy trạng thái và ảnh hưởng hiển thị.
6. Mở nhật ký từ toast hoặc chi tiết đối tượng.

### 16.4. Ngôn ngữ

- Ngôn ngữ mặc định: tiếng Việt.
- Dùng thuật ngữ thống nhất trong toàn app.
- Không trộn `Partner`, `Merchant`, `Vendor` nếu tài liệu dùng `Đối tác`.
- Không gọi voucher code là voucher sản phẩm.

---

## 17. Dữ liệu mẫu tối thiểu cho prototype

Dữ liệu dưới đây chỉ để Figma Make thể hiện trạng thái, không phải yêu cầu số lượng production.

### Người dùng

- Một tài khoản đang hoạt động.
- Một tài khoản Tạm khóa.
- Một tài khoản khách hàng có lịch sử mua.
- Một tài khoản đối tác.
- Một tài khoản nhân viên đối tác.

### Đối tác

- Một hồ sơ chờ duyệt.
- Một hồ sơ đã duyệt.
- Một hồ sơ bị từ chối.
- Một hồ sơ Tạm khóa.
- Một đối tác có yêu cầu thêm chi nhánh.
- Một đối tác có yêu cầu sửa chi nhánh.
- Một chi nhánh tạm ngưng.

### Voucher

- Chờ duyệt và hợp lệ.
- Chờ duyệt nhưng sai giá.
- Đã duyệt, chờ hiển thị.
- Đang bán.
- Tạm ẩn.
- Hết số lượng.

### Đơn hàng

- Chờ thanh toán.
- Thanh toán thành công và đã có mã.
- Thanh toán thành công nhưng lỗi sinh mã.
- Chờ hoàn tiền.
- Đã hoàn tiền.
- Có yêu cầu hoàn tiền bị từ chối.

### Nội dung

Mỗi nhóm có ít nhất:

- Một nội dung đang hiển thị.
- Một nội dung tạm ẩn.
- Một nội dung ngừng hiển thị.

---

## 18. Workflow bắt buộc khi thêm một màn hình hoặc tính năng mới

### Bước 1 — Đối chiếu phạm vi

- Tính năng có nằm trong use case hoặc BRD không?
- Nếu không có, không tự thêm.

### Bước 2 — Xác định actor

- Admin thực hiện gì?
- Vai trò nào bị ảnh hưởng?
- Ai chỉ được xem kết quả?

### Bước 3 — Xác định trạng thái

- Trạng thái trước.
- Điều kiện hành động.
- Trạng thái sau.
- Hậu quả lan truyền.
- Hành động nào không được phép.

### Bước 4 — Thiết kế luồng

- Điểm bắt đầu.
- Dữ liệu hiển thị.
- Hành động.
- Xác nhận.
- Lý do.
- Xử lý thành công.
- Xử lý thất bại.
- Nhật ký.

### Bước 5 — Thiết kế màn hình

- List.
- Detail.
- Modal/drawer.
- Empty/loading/error.
- Responsive.

### Bước 6 — Kiểm tra tính nhất quán

- Có gộp sai các trạng thái không?
- Có hành động không hợp lệ không?
- Có bỏ qua lý do hoặc confirmation không?
- Có hiển thị thành công trước khi hoàn tất không?
- Có ghi log đúng không?

### Bước 7 — Kiểm tra lan truyền

- Khách hàng nhìn thấy gì?
- Đối tác nhìn thấy gì?
- Nhân viên đối tác còn quyền gì?
- Dashboard và audit log cập nhật ra sao?

### Bước 8 — Cập nhật tài liệu

- Bổ sung màn hình.
- Bổ sung state.
- Bổ sung flow.
- Không ghi đè hoặc xóa quy tắc nền tảng nếu chưa được yêu cầu.

---

## 19. Definition of Done cho giao diện Admin

Một mô-đun chỉ được xem là hoàn thành khi:

- Có list và detail phù hợp.
- Có filter/search theo đặc tả.
- Có hành động đúng ngữ cảnh.
- Không có hành động ngoài phạm vi.
- Có confirmation và reason nếu cần.
- Có loading, empty, error, forbidden và success.
- Có trạng thái trước/sau rõ ràng.
- Có hậu quả lan truyền được mô tả.
- Có audit log.
- Không để trạng thái dữ liệu mâu thuẫn.
- Có responsive cho laptop và mobile web.
- Có ít nhất một flow prototype chạy được từ đầu đến cuối.

---

## 20. Chỉ dẫn trực tiếp cho Figma Make

Khi đọc file này, hãy thực hiện theo thứ tự:

1. Tạo **Admin App Shell** hoàn chỉnh.
2. Tạo design system nhỏ gồm:
   - màu semantic,
   - typography,
   - button,
   - input,
   - select,
   - badge,
   - table,
   - tabs,
   - modal,
   - drawer,
   - toast,
   - timeline,
   - empty/loading/error state.
3. Tạo 7 mô-đun Admin theo menu.
4. Ưu tiên dựng đầy đủ UC-ADM-01 đến UC-ADM-05 trước.
5. Dashboard và Nhật ký là lớp tổng hợp và truy vết.
6. Dùng mock data có nhiều trạng thái.
7. Kết nối prototype cho các flow bắt buộc.
8. Không tự thêm chức năng ngoài phạm vi.
9. Không thiết kế các role khác thành sản phẩm hoàn chỉnh trong giai đoạn này; chỉ bảo đảm mọi quyết định Admin có điểm lan truyền rõ ràng để phát triển tiếp.
10. Khi một yêu cầu còn mơ hồ, giữ giao diện ở mức đọc hoặc ghi chú cần xác nhận; không tự tạo thêm hành động thay đổi dữ liệu.

---

## 21. Các quyết định chuẩn hóa đã áp dụng

### 21.1. ID use case

Tài liệu có chỗ dùng `BR-ADM-02` cho Quản lý đối tác, nhưng trong hệ thống use case chi tiết tài liệu này chuẩn hóa thành:

- `UC-ADM-01`
- `UC-ADM-02`
- `UC-ADM-03`
- `UC-ADM-04`
- `UC-ADM-05`

Các mã `BR-ADM-xx` vẫn được dùng để truy vết về yêu cầu nghiệp vụ trong BRD.

### 21.2. Trạng thái voucher sau phê duyệt

Để xử lý việc tài liệu dùng cả “Đã duyệt” và “Chờ hiển thị”, giao diện dùng hai trục:

- `reviewStatus = Đã duyệt`
- `publicationStatus = Chờ hiển thị | Đang bán | Tạm ẩn | ...`

Không coi hai trạng thái này là mâu thuẫn hoặc thay thế nhau.

### 21.3. Xóa tài khoản

Một ghi chú đầu tài liệu có nhắc cập nhật/xóa tài khoản khi người đại diện liên hệ Admin, nhưng use case chi tiết UC-ADM-01 không cung cấp luồng xóa, điều kiện, hậu quả hoặc quy tắc nhật ký tương ứng.

Vì vậy:

- Không sinh nút `Xóa tài khoản`.
- Chỉ sinh: xem, tìm kiếm, cập nhật vai trò, khóa, mở khóa.
- Chức năng xóa chỉ được bổ sung khi có đặc tả chi tiết mới.

### 21.4. Email, SMS và QR

- Email/SMS: mô phỏng bằng trạng thái hoặc thông báo.
- QR: mô phỏng bằng ảnh hoặc nhập mã.
- Không mô tả là tích hợp production.

---

**Nguyên tắc cuối cùng:** Giao diện phải thể hiện đúng nghiệp vụ và trạng thái trước khi cố làm đẹp. Một prototype đẹp nhưng cho phép hành động sai, gộp sai trạng thái hoặc không có xác nhận/nhật ký là không đạt yêu cầu của dự án.
