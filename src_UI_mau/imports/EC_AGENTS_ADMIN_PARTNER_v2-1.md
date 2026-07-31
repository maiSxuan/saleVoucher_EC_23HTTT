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


# PHẦN II — MỞ RỘNG PARTNER PORTAL (ADMIN + ĐỐI TÁC)

> **Phạm vi hiệu lực:** Toàn bộ phần Admin phía trên được giữ nguyên. Phần này mở rộng cùng một hệ thống sang **Đối tác, Chủ tài khoản doanh nghiệp (Owner), Quản lý vận hành và Nhân viên chi nhánh**.  
> Quy định tại mục `20.9` của giai đoạn Admin-first chỉ còn áp dụng cho phần lịch sử phát triển trước đây; từ phần mở rộng này, Figma Make được phép dựng hoàn chỉnh **Partner Portal** theo đúng đặc tả bên dưới.

---

## 22. Nguồn yêu cầu và nguyên tắc mở rộng Partner Portal

### 22.1. Nguồn chi tiết chính

Nguồn chi tiết ưu tiên cho phần Đối tác là:

1. `đặc tả hệ thống cho đối tác (đã thêm uc).pdf`
   - Là phiên bản mới nhất.
   - Bổ sung hai khối đặc tả chính thức ở đầu tài liệu:
     - `BR_PAR_06` — Xác nhận sử dụng voucher.
     - `BR-PAR-07` — Báo cáo đối tác.
   - Đồng thời chứa lại toàn bộ các use case Đối tác đã có trong phiên bản trước.
2. `FIT_HCMUS_EC_Project_Assigment_2026_v1.0.pdf`
   - Dùng để kiểm tra phạm vi nghiệp vụ, quy tắc chung, dữ liệu và các giả định mô phỏng.
3. Phần Admin ở đầu tài liệu này
   - Dùng để bảo đảm quyết định của Admin và trạng thái hiển thị ở Partner Portal không mâu thuẫn.

Khi có khác biệt, áp dụng thứ tự:

1. Hai khối bổ sung `BR_PAR_06` và `BR-PAR-07` được ưu tiên cho chức năng xác nhận sử dụng voucher và báo cáo đối tác.
2. Các use case còn lại trong PDF mới được ưu tiên cho màn hình và hành động của Đối tác.
3. BRD được dùng để kiểm tra phạm vi và quy tắc xuyên vai trò.
4. Mô hình trạng thái đã chuẩn hóa trong phần Admin được dùng để tránh tạo hai hệ thống trạng thái mâu thuẫn.

### 22.2. Nguyên tắc giữ nguyên phần Admin

- Không xóa, rút gọn hoặc viết lại các mục Admin đã có.
- Partner Portal phải dùng cùng entity và trạng thái với Admin.
- Một yêu cầu do Đối tác gửi phải xuất hiện đúng trong queue xử lý tương ứng của Admin.
- Một quyết định của Admin phải phản ánh lại trên Partner Portal.
- Không tạo dữ liệu “bản sao riêng” cho Admin và Đối tác.
- Không cho phép Partner Portal tự bỏ qua bước kiểm duyệt đã quy định.
- Việc bổ sung đặc tả Partner không tự sinh thêm quyền hoặc mutation cho Admin nếu phần Admin chưa mô tả.

### 22.3. Chuẩn hóa mã tham chiếu nội bộ

PDF mới có hai use case bổ sung trùng phạm vi với hai use case đã xuất hiện ở cuối tài liệu. Vì vậy, tài liệu này giữ **21 năng lực chức năng Partner**, nhưng dùng khối bổ sung làm nguồn chi tiết ưu tiên cho UC-PAR-18 và UC-PAR-19.

| Mã nội bộ | Use case | Nguồn chi tiết ưu tiên |
|---|---|---|
| UC-PAR-01 | Đăng ký tài khoản doanh nghiệp | Use case đăng ký doanh nghiệp |
| UC-PAR-02 | Đăng nhập | Use case đăng nhập |
| UC-PAR-03 | Quên mật khẩu | Use case quên mật khẩu |
| UC-PAR-04 | Đăng xuất | Use case đăng xuất |
| UC-PAR-05 | Xác thực tài khoản | Use case xác thực tài khoản |
| UC-PAR-06 | Cập nhật hồ sơ chi nhánh | Use case cập nhật hồ sơ chi nhánh |
| UC-PAR-07 | Cập nhật thông tin pháp lý doanh nghiệp | Use case cập nhật thông tin pháp lý |
| UC-PAR-08 | Tạo voucher | Use case tạo voucher |
| UC-PAR-09 | Gửi duyệt voucher | Use case gửi duyệt voucher |
| UC-PAR-10 | Tạm ngưng voucher | Use case tạm ngưng voucher |
| UC-PAR-11 | Ngừng bán voucher | Use case ngừng bán voucher |
| UC-PAR-12 | Mở bán lại voucher | Use case mở bán lại voucher |
| UC-PAR-13 | Xem danh sách voucher | Use case xem danh sách voucher |
| UC-PAR-14 | Xem chi tiết voucher | Use case xem chi tiết voucher |
| UC-PAR-15 | Cập nhật voucher | Use case cập nhật voucher |
| UC-PAR-16 | Xem kết quả duyệt | Use case xem kết quả duyệt |
| UC-PAR-17 | Tra cứu voucher code | Use case tra cứu voucher code |
| UC-PAR-18 | Xác nhận sử dụng voucher | `BR_PAR_06` + use case xác nhận sử dụng voucher ở phần sau |
| UC-PAR-19 | Báo cáo đối tác | `BR-PAR-07` + use case xem báo cáo doanh thu ở phần sau |
| UC-PAR-20 | Thêm tài khoản nhân viên | Use case thêm tài khoản nhân viên |
| UC-PAR-21 | Quản lý danh sách nhân viên | Use case quản lý danh sách nhân viên |

### 22.4. Hai điểm bổ sung bắt buộc từ phiên bản mới

#### Xác nhận sử dụng voucher

Phiên bản mới làm rõ:

- Actor nghiệp vụ chính là **Nhân viên đối tác** tại chi nhánh.
- Màn hình phải hiển thị thông tin voucher đã kiểm tra, giá sau giảm và số tiền giảm trước khi xác nhận.
- Actor chỉ xác nhận, không nhập thêm dữ liệu ngoài phạm vi use case.
- Nếu voucher không hợp lệ thì không hiển thị chức năng xác nhận.
- Cập nhật trạng thái và ghi nhật ký là một thao tác nguyên tử: thiếu nhật ký thì không được coi là thành công và không được cập nhật trạng thái.

#### Báo cáo đối tác

Phiên bản mới làm rõ:

- Chỉ tài khoản có vai trò Đối tác mới truy cập báo cáo tổng quan.
- Bốn chỉ số bắt buộc là: Tổng doanh thu, Tổng voucher phát hành, Tổng voucher đã bán và Tỷ lệ sử dụng.
- Hai bộ lọc bắt buộc là: Chương trình voucher và Khoảng thời gian.
- Có hai empty state riêng: chưa có chương trình voucher được duyệt; không có giao dịch trong kỳ.
- Báo cáo là chức năng chỉ đọc, không thay đổi dữ liệu.
- Kết quả phải nhất quán với dữ liệu voucher và giao dịch thuộc đúng doanh nghiệp.

---

## 23. Mô hình actor và phạm vi quyền

### 23.1. Chủ tài khoản doanh nghiệp — `Owner`

Owner là tài khoản đại diện doanh nghiệp và là actor có phạm vi rộng nhất trong Partner Portal.

Owner được phép:

- Đăng ký hồ sơ doanh nghiệp.
- Quản lý thông tin doanh nghiệp theo luồng gửi duyệt.
- Gửi yêu cầu thêm, sửa hoặc xóa chi nhánh.
- Quản lý voucher theo trạng thái cho phép.
- Xem kết quả duyệt.
- Xem báo cáo doanh nghiệp.
- Tra cứu và xác nhận sử dụng voucher chỉ khi tài khoản Owner được cấp quyền vận hành tương ứng tại chi nhánh hợp lệ; quyền sở hữu doanh nghiệp không tự động thay thế quyền xác nhận tại quầy.
- Tạo và quản lý tài khoản nhân viên.

Chỉ Owner được:

- Thêm tài khoản nhân viên.
- Sửa vai trò và phạm vi chi nhánh của nhân viên.
- Khóa, mở khóa hoặc xóa tài khoản nhân viên.
- Thực hiện các thao tác quản trị nội bộ doanh nghiệp mà tài liệu nguồn ghi rõ actor là `Owner`.

### 23.2. Quản lý vận hành

Tài liệu nguồn xác định đây là một vai trò có thể được Owner gán khi tạo nhân viên, nhưng chưa mô tả đầy đủ ma trận quyền chi tiết.

Quy tắc thiết kế:

- Không hard-code Quản lý vận hành có toàn bộ quyền của Owner.
- Không hiển thị chức năng `Quản lý nhân viên` cho vai trò này.
- Các chức năng quản lý voucher, báo cáo, hồ sơ hoặc chi nhánh chỉ hiển thị khi hệ thống quyền thực tế cho phép.
- Trong prototype chính, có thể dùng Owner làm biến thể Partner Portal đầy đủ.
- Nếu dựng biến thể Quản lý vận hành, phải gắn nhãn `Quyền theo cấu hình` và không tự thêm quyền ngoài đặc tả.

### 23.3. Nhân viên chi nhánh

Nhân viên chi nhánh là actor nghiệp vụ chính của `BR_PAR_06` — Xác nhận sử dụng voucher. Nhân viên chi nhánh:

- Có tài khoản đăng nhập riêng.
- Được gán một hoặc nhiều chi nhánh.
- Tra cứu voucher code tại chi nhánh đang thao tác.
- Xác nhận sử dụng voucher hợp lệ trong phạm vi được gán.
- Không được xem dữ liệu vượt ngoài doanh nghiệp hoặc chi nhánh được phân công.
- Không được quản lý tài khoản nhân viên khác.
- Không được thay đổi thông tin pháp lý doanh nghiệp.
- Không được tự thay đổi phạm vi chi nhánh của mình.
- Không được truy cập báo cáo tổng quan doanh nghiệp nếu không có đặc tả quyền riêng; `BR-PAR-07` xác định actor báo cáo là Đối tác.

### 23.4. Quy tắc kế thừa trạng thái doanh nghiệp

- Nếu doanh nghiệp ở trạng thái `Chờ duyệt`, không tạo phiên Partner Portal.
- Nếu hồ sơ bị `Từ chối`, hiển thị lý do và không tạo phiên.
- Nếu doanh nghiệp bị `Khóa`, Owner và toàn bộ nhân viên không được đăng nhập.
- Khi tài khoản nhân viên Tạm khóa, phiên hiện tại phải bị hủy ngay.
- Quyền ở giao diện không thay thế kiểm tra quyền tại backend.

### 23.5. Ma trận phạm vi tối thiểu

| Chức năng | Owner | Quản lý vận hành | Nhân viên chi nhánh |
|---|---:|---:|---:|
| Đăng nhập/quên mật khẩu/đăng xuất | Có | Có | Có |
| Quản lý nhân viên | Có | Không | Không |
| Tra cứu voucher code | Có, trong phạm vi | Theo quyền | Có, trong chi nhánh được gán |
| Xác nhận sử dụng voucher | Có, trong phạm vi | Theo quyền | Có, trong chi nhánh được gán |
| Báo cáo toàn doanh nghiệp | Có | Theo quyền | Không mặc định |
| Hồ sơ pháp lý/chi nhánh | Có | Chưa được đặc tả đầy đủ | Không |
| Quản lý voucher | Có | Theo quyền | Không mặc định |

`Theo quyền` nghĩa là prototype không tự suy diễn; menu chỉ xuất hiện khi role/permission mock cho phép.

---

## 24. Mô hình trạng thái thống nhất Admin + Đối tác

### 24.1. Trạng thái tài khoản/hồ sơ đối tác

- `Chờ duyệt`
- `Hoạt động`
- `Từ chối`
- `Khóa`

Hành vi đăng nhập:

| Trạng thái | Kết quả |
|---|---|
| Chờ duyệt | Không tạo phiên; hiển thị hồ sơ đang chờ duyệt |
| Hoạt động | Cho phép đăng nhập theo vai trò |
| Từ chối | Không tạo phiên; hiển thị lý do từ chối |
| Khóa | Không tạo phiên; yêu cầu liên hệ Quản trị viên |

### 24.2. Trạng thái chi nhánh chính thức

- `Hoạt động`
- `Tạm ngưng`
- `Đã xóa/Vô hiệu hóa` nếu yêu cầu xóa đã được Admin duyệt

### 24.3. Trạng thái yêu cầu chi nhánh

- `Chờ duyệt`
- `Chờ duyệt cập nhật`
- `Chờ duyệt xóa`
- `Đã duyệt`
- `Từ chối`
- `Yêu cầu bổ sung thông tin`

Thông tin đề xuất phải được lưu riêng với thông tin chính thức.

### 24.4. Trạng thái yêu cầu cập nhật pháp lý

- `Chờ duyệt cập nhật`
- `Đã duyệt`
- `Từ chối`
- `Yêu cầu bổ sung thông tin`

Trong lúc chờ duyệt:

- Hồ sơ pháp lý hiện tại vẫn có hiệu lực.
- Doanh nghiệp vẫn hoạt động bình thường nếu không có quyết định khóa riêng.
- Không được ghi đè dữ liệu chính thức.

### 24.5. Trạng thái voucher sản phẩm

Partner Portal phải dùng cùng mô hình hai trục đã chuẩn hóa ở phần Admin.

#### Trạng thái kiểm duyệt `reviewStatus`

- `Chưa gửi duyệt`
- `Chờ duyệt`
- `Đã duyệt`
- `Từ chối`

#### Trạng thái công bố `publicationStatus`

- `Chưa công bố`
- `Chờ hiển thị`
- `Đang bán`
- `Tạm ngưng/Tạm ẩn`
- `Ngừng bán`
- `Hết hạn`
- `Hết số lượng`

#### Trạng thái bản soạn thảo

`Nháp` được biểu diễn bằng:

```text
reviewStatus = Chưa gửi duyệt
publicationStatus = Chưa công bố
```

#### Ánh xạ nhãn giữa hai portal

| Trạng thái thống nhất | Admin Portal | Partner Portal |
|---|---|---|
| Suspended | Tạm ẩn | Tạm ngưng bán |
| Pending review | Chờ duyệt | Chờ duyệt |
| Approved, not started | Chờ hiển thị | Đã duyệt / Chờ hiển thị |
| Active | Đang bán | Đang bán |
| Stopped terminal | Ngừng bán | Ngừng bán |

Không tạo hai trạng thái dữ liệu khác nhau chỉ vì nhãn hiển thị khác nhau.

### 24.6. Trạng thái voucher code

- `Chưa sử dụng`
- `Đã sử dụng`
- `Hết hạn`
- `Bị hủy`
- `Tạm khóa`
- `Vô hiệu hóa`
- `Lỗi sinh mã`

Trạng thái bán của voucher sản phẩm không được tự động ghi đè trạng thái voucher code đã phát hành.

### 24.7. Trạng thái nhân viên

- `Hoạt động`
- `Khóa`
- `Đã xóa/Vô hiệu hóa vĩnh viễn`

Xóa nhân viên là vô hiệu hóa tài khoản, không xóa lịch sử thao tác.

---

## 25. Kiến trúc thông tin Partner Portal

### 25.1. Khu vực công khai

- Đăng ký trở thành đối tác
- Xác thực OTP mô phỏng
- Đăng nhập
- Quên mật khẩu
- Đặt lại mật khẩu
- Trang trạng thái hồ sơ chờ duyệt/từ chối/khóa

### 25.2. App shell sau đăng nhập

Partner Portal dùng:

- Sidebar trái trên laptop.
- Bottom navigation hoặc sidebar thu gọn trên mobile.
- Top bar gồm:
  - Tên doanh nghiệp
  - Vai trò hiện tại
  - Chi nhánh đang thao tác khi cần
  - Thông báo
  - Menu tài khoản
- Breadcrumb.
- Vùng nội dung chính.
- Toast.
- Modal xác nhận.
- Drawer/trang chi tiết.
- Session-expired handling.

### 25.3. Menu Owner

1. Tổng quan
2. Voucher
3. Tra cứu voucher code
4. Báo cáo
5. Hồ sơ doanh nghiệp
6. Chi nhánh
7. Nhân viên
8. Tài khoản / Đăng xuất

### 25.4. Menu Nhân viên chi nhánh

1. Tra cứu voucher code
2. Lịch sử xác nhận của tài khoản nếu hệ thống có dữ liệu đọc
3. Tài khoản / Đăng xuất

Không tự thêm dashboard doanh thu cho nhân viên chi nhánh.

### 25.5. Điều hướng chéo

- Dashboard → danh sách voucher đã lọc.
- Voucher → kết quả duyệt.
- Voucher → chi nhánh áp dụng.
- Chi nhánh → yêu cầu thay đổi đang chờ.
- Thông báo duyệt → chi tiết voucher/hồ sơ/yêu cầu.
- Tra cứu mã hợp lệ → xác nhận sử dụng.
- Báo cáo → chi tiết voucher tương ứng.
- Danh sách nhân viên → chi tiết/sửa nhân viên.
- Kết quả gửi yêu cầu → khu vực theo dõi trạng thái yêu cầu.

---

## 26. Quy tắc thiết kế UI/UX cho Partner Portal

### 26.1. Phong cách

- Đồng bộ design system với Admin Portal.
- Partner Portal thiên về vận hành kinh doanh, không giống trang quản trị toàn sàn.
- Dùng card KPI, bảng voucher, form nhiều bước, badge trạng thái và timeline.
- Màn hình tra cứu voucher code phải tối ưu cho thao tác nhanh tại quầy.
- Không dùng hiệu ứng trang trí làm giảm khả năng đọc.

### 26.2. Form nhiều bước

Form đăng ký gồm ba nhóm chính:

1. Tài khoản
2. Doanh nghiệp
3. Chi nhánh và người đại diện

Xác thực OTP là bước con sau phần tài khoản.

Bắt buộc có:

- Step indicator.
- Nút `Quay lại` và `Tiếp tục`.
- Inline validation.
- Giữ dữ liệu đã nhập khi lỗi hệ thống.
- Cảnh báo trước khi rời trang có dữ liệu chưa gửi.
- Upload progress cho file lớn.
- Trạng thái upload thành công/thất bại.

### 26.3. Dữ liệu hiện tại và dữ liệu đề xuất

Với yêu cầu cập nhật pháp lý hoặc chi nhánh, giao diện phải hiển thị:

| Trường | Dữ liệu hiện tại | Dữ liệu đề xuất |
|---|---|---|

- Highlight trường thay đổi.
- Không hiển thị dữ liệu đề xuất như dữ liệu đã có hiệu lực.
- Có badge `Đang chờ duyệt`.
- Không cho gửi yêu cầu thứ hai khi đã có yêu cầu cùng loại đang chờ.

### 26.4. Hành động theo trạng thái

- Chỉ hiển thị hành động hợp lệ.
- Hành động bị chặn có thể ẩn hoặc disabled kèm lý do.
- Không dùng dropdown sửa trạng thái trực tiếp.
- `Ngừng bán`, `Xóa nhân viên`, `Gửi duyệt`, `Tạm ngưng`, `Mở bán lại`, `Xác nhận sử dụng` phải có bước xác nhận phù hợp.
- Hành động không thể hoàn tác phải dùng cảnh báo rõ ràng.

### 26.5. QR và gửi thông báo mô phỏng

- QR được mô phỏng bằng ảnh hoặc nhập mã.
- Khi QR không đọc được, chuyển sang nhập thủ công.
- Email/SMS/OTP là mô phỏng.
- UI phải ghi rõ `mô phỏng` ở nơi kết quả có thể bị hiểu là tích hợp thật.
- Không tự mở camera thật nếu chưa được yêu cầu.

### 26.6. Trạng thái chung bắt buộc

Mỗi màn hình có:

- Loading.
- Loaded.
- Empty.
- No result.
- Inline validation error.
- System error.
- Permission denied.
- Session expired.
- Processing.
- Success.
- Partial notification failure khi dữ liệu đã lưu nhưng gửi thông báo thất bại.

---

## 27. UC-PAR-01 — Đăng ký tài khoản doanh nghiệp

### 27.1. Mục tiêu

Cho phép Chủ doanh nghiệp:

- Tạo thông tin đăng nhập.
- Xác thực Email/SĐT.
- Khai báo hồ sơ doanh nghiệp.
- Khai báo chi nhánh đầu tiên.
- Khai báo người đại diện pháp lý.
- Gửi hồ sơ đến Admin.
- Nhận trạng thái `Chờ duyệt`.

### 27.2. Bước 1 — Tài khoản

Trường:

- Email hoặc số điện thoại
- Mật khẩu
- Xác nhận mật khẩu
- CAPTCHA

Validation:

- Không để trống.
- Email/SĐT đúng định dạng.
- Email/SĐT chưa tồn tại trên toàn hệ thống.
- Mật khẩu và xác nhận khớp.
- Mật khẩu đáp ứng yêu cầu định dạng.

Nếu Email/SĐT đã tồn tại:

- Hiển thị thông báo tài khoản đã tồn tại.
- Có hành động `Đăng nhập`.
- Không tạo tài khoản mới.

### 27.3. Xác thực OTP

Sau khi thông tin tài khoản hợp lệ:

- Gửi OTP mô phỏng.
- Hiển thị đồng hồ đếm ngược.
- Cho nhập OTP.
- Có `Gửi lại mã`.
- Tối đa 3 lần nhập sai cho một OTP.
- Khi quá số lần:
  - Vô hiệu hóa OTP hiện tại.
  - Yêu cầu mã mới hoặc tạm khóa thao tác.

Chưa xác thực OTP thì không được sang phần hồ sơ doanh nghiệp.

### 27.4. Bước 2 — Doanh nghiệp

Trường:

- Tên doanh nghiệp
- Mã số thuế
- Loại hình doanh nghiệp
- Địa chỉ cơ sở chính
- Danh mục kinh doanh
- Giấy phép kinh doanh

Validation:

- Mã số thuế đúng định dạng.
- Mã số thuế tồn tại theo cơ chế mô phỏng của hệ thống.
- Mã số thuế chưa thuộc doanh nghiệp khác.
- Phải chọn loại hình doanh nghiệp.
- Phải chọn ít nhất một danh mục kinh doanh.
- Giấy phép kinh doanh bắt buộc.
- File đúng định dạng và dung lượng.

### 27.5. Bước 3 — Chi nhánh và người đại diện

#### Chi nhánh đầu tiên

- Tên chi nhánh
- Khu vực
- Địa chỉ
- Số điện thoại
- Giờ mở cửa
- Giờ đóng cửa
- Khoảng tạm nghỉ nếu có

Quy tắc:

- Giờ đóng phải sau giờ mở.
- SĐT đúng định dạng.
- Các trường bắt buộc không được trống.

#### Người đại diện

- Họ tên
- Chức vụ
- CCCD
- Số điện thoại
- Email liên hệ

Validation:

- CCCD đúng định dạng.
- Email/SĐT đúng định dạng.
- Không để trống trường bắt buộc.

### 27.6. Xác nhận đăng ký

Màn hình review trước khi gửi phải nhóm:

- Tài khoản đã xác thực
- Thông tin doanh nghiệp
- Chi nhánh
- Người đại diện
- Tệp pháp lý

Khi xác nhận:

1. Hệ thống kiểm tra lại toàn bộ dữ liệu.
2. Lưu tài khoản và hồ sơ với trạng thái `Chờ duyệt`.
3. Gửi hồ sơ sang queue `Quản lý đối tác` của Admin.
4. Hiển thị thông báo hồ sơ đang được duyệt.
5. Không tạo phiên Partner Portal đầy đủ.

### 27.7. Xử lý lỗi

- Lỗi lưu hồ sơ: không tạo dữ liệu một phần; giữ nguyên form để thử lại.
- Lỗi gửi thông báo sang Admin sau khi hồ sơ đã lưu:
  - Không rollback hồ sơ.
  - Giữ trạng thái `Chờ duyệt`.
  - Ghi log lỗi để gửi lại.
  - Người dùng vẫn nhận kết quả đăng ký thành công.
- Lỗi upload: giữ dữ liệu các trường khác.
- Không làm mất dữ liệu khi chuyển bước.

---

## 28. UC-PAR-02 đến UC-PAR-05 — Xác thực và phiên làm việc

### 28.1. Đăng nhập

Form:

- Email/SĐT
- Mật khẩu
- Ghi nhớ đăng nhập
- Quên mật khẩu

Luồng:

1. Kiểm tra trường bắt buộc.
2. Kiểm tra thông tin đăng nhập.
3. Kiểm tra trạng thái doanh nghiệp/tài khoản.
4. Tạo phiên hợp lệ.
5. Điều hướng theo vai trò.

Thông báo sai thông tin phải dùng thông báo chung:

`Email/SĐT hoặc mật khẩu không đúng`

Không tách lỗi sai email và sai mật khẩu.

### 28.2. Xử lý theo trạng thái khi đăng nhập

- `Chờ duyệt`: hiển thị hồ sơ đang được duyệt; không tạo phiên.
- `Từ chối`: hiển thị lý do từ chối; không tạo phiên.
- `Khóa`: hiển thị tài khoản Tạm khóa; không tạo phiên.
- `Hoạt động`: tạo phiên và điều hướng theo role.

Nếu đăng nhập sai quá số lần:

- Tạm khóa đăng nhập trong thời gian xác định.
- Hiển thị thời gian có thể thử lại.
- Không tiết lộ tài khoản có tồn tại hay không.

### 28.3. Quên mật khẩu

Luồng:

1. Nhập Email/SĐT.
2. Gửi OTP mô phỏng.
3. Nhập OTP.
4. Kiểm tra đúng và còn hiệu lực.
5. Nhập mật khẩu mới.
6. Xác nhận mật khẩu mới.
7. Cập nhật.
8. Điều hướng về đăng nhập.

Quy tắc:

- Chỉ áp dụng cho tài khoản ở trạng thái cho phép đăng nhập.
- OTP hiển thị thời gian còn lại.
- Sai OTP tối đa 3 lần.
- Mật khẩu mới phải đủ mạnh.
- Hai trường mật khẩu phải khớp.
- Nếu cập nhật thất bại, mật khẩu cũ vẫn còn hiệu lực.
- Không để tài khoản ở trạng thái không có mật khẩu hợp lệ.

### 28.4. Đăng xuất

- Nút đăng xuất trong menu tài khoản.
- Hủy session/token phía server.
- Xóa phiên phía client.
- Điều hướng về trang đăng nhập.
- Hiển thị thông báo thành công.

Nếu lỗi server:

- Vẫn xóa token client.
- Không cho tiếp tục thao tác.
- Ghi log để dọn phiên còn sót.

### 28.5. Hết hạn phiên

- Phiên tự hết hạn sau 30 phút không hoạt động.
- Điều hướng về đăng nhập.
- Hiển thị `Phiên làm việc đã hết hạn, vui lòng đăng nhập lại`.
- Không tự gửi lại thao tác đang dang dở sau khi đăng nhập lại.

### 28.6. Nhật ký bảo mật

Ghi log:

- Đăng nhập thành công/thất bại.
- IP/thiết bị.
- Yêu cầu đặt lại mật khẩu.
- Đăng xuất chủ động.
- Đăng xuất do timeout.
- Lỗi tạo phiên.

---

## 29. UC-PAR-06 — Quản lý chi nhánh và yêu cầu thay đổi

### 29.1. Danh sách chi nhánh

Cột:

- Tên chi nhánh
- Khu vực
- Địa chỉ
- Số điện thoại
- Giờ hoạt động
- Trạng thái chính thức
- Yêu cầu đang chờ
- Hành động

Badge cần phân biệt:

- Hoạt động
- Tạm ngưng
- Chờ duyệt
- Chờ duyệt cập nhật
- Chờ duyệt xóa
- Yêu cầu bổ sung
- Từ chối

### 29.2. Thêm chi nhánh

Form:

- Tên chi nhánh
- Khu vực
- Địa chỉ
- Số điện thoại
- Giờ mở
- Giờ đóng
- Tạm nghỉ nếu có

Sau khi gửi:

- Tạo yêu cầu `Chờ duyệt`.
- Không đưa chi nhánh vào danh sách chi nhánh hợp lệ để tạo voucher.
- Gửi sang queue Admin.
- Ghi nhật ký người gửi, thời gian và nội dung đề xuất.

### 29.3. Sửa chi nhánh

- Mở form với dữ liệu hiện tại.
- Lưu dữ liệu đề xuất riêng.
- Chuyển yêu cầu sang `Chờ duyệt cập nhật`.
- Thông tin chính thức vẫn tiếp tục được áp dụng.
- Hiển thị diff trước/sau.
- Không cho gửi yêu cầu mới khi chi nhánh đang có yêu cầu chờ.

### 29.4. Xóa chi nhánh

Trước khi cho gửi yêu cầu:

- Kiểm tra voucher đang bán gắn với chi nhánh.
- Kiểm tra voucher code chưa sử dụng liên quan.
- Kiểm tra đây có phải chi nhánh hoạt động duy nhất hay không.

Nếu có ràng buộc:

- Không cho gửi yêu cầu xóa.
- Hiển thị lý do cụ thể.
- Không tự tạo chức năng vô hiệu hóa mới ngoài use case.

Nếu không có ràng buộc:

- Hiển thị xác nhận gửi yêu cầu xóa.
- Ghi nhận `Chờ duyệt xóa`.
- Chi nhánh vẫn hoạt động cho đến khi Admin duyệt.

### 29.5. Quy tắc

- Thêm, sửa và xóa đều phải được Admin duyệt.
- Mỗi chi nhánh tối đa một yêu cầu đang chờ tại một thời điểm.
- Doanh nghiệp phải có ít nhất một chi nhánh hoạt động.
- Chi nhánh mới chưa duyệt không được dùng cho voucher.
- Thông tin cũ giữ hiệu lực trong lúc chờ duyệt cập nhật.
- Chi nhánh chờ xóa giữ hiệu lực cho đến khi có quyết định.
- Giờ đóng phải sau giờ mở.
- Lỗi gửi thông báo cho Admin không rollback yêu cầu đã lưu.

---

## 30. UC-PAR-07 — Cập nhật thông tin pháp lý doanh nghiệp

### 30.1. Thông tin được đề xuất thay đổi

- Tên doanh nghiệp
- Mã số thuế
- Loại hình doanh nghiệp
- Địa chỉ cơ sở chính
- Danh mục kinh doanh
- Giấy phép kinh doanh
- Tên người đại diện
- Chức vụ
- CCCD
- Số điện thoại
- Email

### 30.2. Luồng

1. Hiển thị dữ liệu hiện tại.
2. Cho chỉnh sửa.
3. Highlight trường thay đổi.
4. Kiểm tra hợp lệ.
5. Tạo yêu cầu `Chờ duyệt cập nhật`.
6. Gửi Admin.
7. Giữ dữ liệu cũ có hiệu lực.
8. Hiển thị trạng thái chờ duyệt.

### 30.3. Chặn gửi

- Không có thay đổi.
- Đang có yêu cầu cập nhật khác chờ duyệt.
- Mã số thuế sai định dạng.
- Mã số thuế mới đã được sử dụng.
- Không chọn loại hình hoặc danh mục.
- CCCD sai định dạng.
- Email/SĐT sai định dạng.
- Upload giấy phép sai định dạng/dung lượng.

### 30.4. Quy tắc

- Thông tin pháp lý chỉ có hiệu lực sau khi Admin duyệt.
- Yêu cầu phải lưu riêng, không ghi đè.
- Mỗi doanh nghiệp tối đa một yêu cầu pháp lý đang chờ.
- Doanh nghiệp không tự Tạm khóa chỉ vì có yêu cầu cập nhật chờ duyệt.
- Nhật ký phải lưu diff trước/sau và kết quả duyệt.

---

## 31. Quản lý vòng đời voucher — UC-PAR-08 đến UC-PAR-16

### 31.1. Danh sách voucher

Bộ lọc trạng thái:

- Nháp
- Chờ duyệt
- Đã duyệt/Chờ hiển thị
- Đang bán
- Từ chối
- Tạm ngưng
- Ngừng bán
- Hết hạn
- Hết số lượng

Tìm kiếm:

- Tên voucher

Sắp xếp:

- Mới nhất
- Sắp hết thời gian bán
- Bán chạy nhất

Cột/card:

- Ảnh
- Tên
- Trạng thái kiểm duyệt
- Trạng thái công bố
- Giá bán
- Đã bán/Tổng phát hành
- Thời gian bán
- Hành động

Bộ lọc trạng thái nên hiển thị số lượng bằng tab/badge.

### 31.2. Tạo voucher

Form nhóm thành:

#### Thông tin cơ bản

- Tên voucher
- Danh mục
- Ảnh
- Mô tả

#### Giá

- Giá gốc
- Giá bán

#### Thời gian

- Bắt đầu bán
- Kết thúc bán
- Bắt đầu sử dụng
- Kết thúc sử dụng

#### Phạm vi và số lượng

- Một hoặc nhiều chi nhánh hợp lệ
- Số lượng phát hành

#### Điều kiện

- Điều kiện áp dụng
- Chính sách hoàn hủy

### 31.3. Validation tạo voucher

- Không để trống trường bắt buộc.
- Giá bán nhỏ hơn giá gốc.
- Giá trị giá hợp lệ và lớn hơn 0.
- Ngày kết thúc bán sau ngày bắt đầu bán.
- Ngày kết thúc sử dụng sau ngày bắt đầu sử dụng.
- Ngày kết thúc bán không muộn hơn ngày kết thúc sử dụng.
- Ngày bắt đầu bán không ở quá khứ.
- Chọn ít nhất một chi nhánh.
- Chỉ chọn chi nhánh thuộc doanh nghiệp và đã đủ điều kiện hoạt động.
- Số lượng phát hành là số nguyên dương.
- Chọn danh mục.
- Ảnh đúng loại và dung lượng.
- Điều kiện áp dụng không được để trống.

Theo đặc tả nguồn, `Lưu nháp` chỉ thành công khi dữ liệu đã đầy đủ và hợp lệ; không biến nháp thành cơ chế lưu form thiếu dữ liệu.

### 31.4. Kết quả lưu nháp

- `reviewStatus = Chưa gửi duyệt`
- `publicationStatus = Chưa công bố`
- Hiển thị badge `Nháp`
- Điều hướng đến chi tiết voucher.
- Ghi log tạo voucher.

### 31.5. Chi tiết voucher

Hiển thị:

- Tên, ảnh, danh mục, mô tả
- Giá gốc, giá bán
- Điều kiện áp dụng
- Thời gian bán
- Thời gian sử dụng
- Chi nhánh áp dụng
- Số lượng phát hành
- Đã bán
- Còn lại
- Chính sách hoàn hủy
- Trạng thái kiểm duyệt
- Trạng thái công bố
- Lý do từ chối nếu có
- Timeline thay đổi

### 31.6. Ma trận hành động voucher

| Trạng thái | Hành động |
|---|---|
| Nháp | Sửa toàn bộ, Gửi duyệt |
| Chờ duyệt | Chỉ xem |
| Từ chối | Xem lý do, Sửa toàn bộ; sau lưu về Nháp |
| Đã duyệt/Chờ hiển thị | Chỉ xem và theo dõi thời gian công bố |
| Đang bán | Tạm ngưng, Ngừng bán, Sửa giới hạn |
| Tạm ngưng | Mở bán lại, Ngừng bán, Sửa giới hạn |
| Ngừng bán | Chỉ xem |
| Hết hạn/Hết số lượng | Chỉ xem trừ khi có đặc tả mới |

Tài liệu nguồn có ví dụ `Nháp → Xóa` nhưng không có use case xóa voucher, điều kiện hoặc hậu quả. Vì vậy:

- Không sinh flow xóa voucher hoạt động.
- Có thể ẩn hành động `Xóa` khỏi prototype cơ bản.
- Chỉ bổ sung khi có đặc tả riêng.

### 31.7. Cập nhật voucher

#### Nháp hoặc Từ chối

- Cho sửa toàn bộ trường.
- Nếu voucher `Từ chối`, sau khi lưu chuyển về `Nháp`.
- Không tự gửi duyệt lại.
- Người dùng phải chủ động dùng `Gửi duyệt`.

#### Đang bán hoặc Tạm ngưng

Theo đặc tả hiện tại, chỉ cho sửa giới hạn:

- Mô tả
- Ảnh
- Điều kiện áp dụng
- Chính sách hoàn hủy
- Số lượng phát hành chỉ được tăng hoặc không thấp hơn số đã bán

Khóa:

- Giá
- Thời gian bán
- Thời gian sử dụng
- Chi nhánh áp dụng

Đây là điểm tài liệu nguồn ghi chú cần xác nhận. Prototype được phép thể hiện theo quy tắc trên nhưng phải ghi chú trong tài liệu kỹ thuật rằng đây là phạm vi sửa tạm chuẩn hóa.

#### Chờ duyệt hoặc Ngừng bán

- Không cho sửa.
- Disabled action kèm lý do.
- Backend vẫn phải chặn, không chỉ UI.

### 31.8. Gửi duyệt

Điều kiện:

- Voucher đang `Nháp`.
- Dữ liệu vẫn hợp lệ tại thời điểm gửi.
- Thời gian bán chưa rơi vào quá khứ.
- Chi nhánh vẫn tồn tại và hoạt động.

Flow:

1. Mở chi tiết.
2. Chọn `Gửi duyệt`.
3. Hiển thị cảnh báo không thể sửa trong lúc chờ.
4. Xác nhận.
5. Kiểm tra lại dữ liệu.
6. Chuyển `reviewStatus = Chờ duyệt`.
7. Gửi sang queue `Duyệt voucher` của Admin.
8. Ghi log snapshot tại thời điểm gửi.

Nếu gửi thông báo Admin thất bại nhưng trạng thái đã lưu:

- Không rollback.
- Ghi log để gửi lại.
- Voucher vẫn ở `Chờ duyệt`.

### 31.9. Xem kết quả duyệt

Hiển thị:

- Trạng thái hiện tại.
- Thời điểm xử lý.
- Người xử lý nếu được phép hiển thị.
- Lý do từ chối.
- Trạng thái công bố sau khi duyệt.
- Hành động tiếp theo.

Nếu `Chờ duyệt`:

- Hiển thị đang chờ Admin xử lý.

Nếu `Từ chối`:

- Hiển thị đầy đủ lý do.
- Có CTA `Sửa lại`.
- Sau khi sửa và lưu, voucher về `Nháp`.
- Không tự gửi duyệt lại.

Lỗi gửi notification không làm mất kết quả duyệt; Partner vẫn xem được khi mở chi tiết.

### 31.10. Tạm ngưng bán

Điều kiện:

- Voucher đang `Đang bán`.

Modal phải nêu:

- Voucher sẽ biến mất khỏi trang bán.
- Không phát sinh mua mới.
- Đơn hàng và voucher code đã phát hành vẫn giữ nguyên hiệu lực theo trạng thái code.

Sau xác nhận:

- Chuyển publication state sang suspended.
- Ẩn khỏi tìm kiếm/mua mới.
- Ghi log.
- Có thể mở bán lại nếu còn đủ điều kiện.

### 31.11. Ngừng bán

Điều kiện:

- Voucher đang `Đang bán` hoặc `Tạm ngưng`.

Modal:

- Cảnh báo không thể hoàn tác.
- Nêu rõ không phát sinh đơn mới.
- Nút nguy hiểm `Xác nhận ngừng bán`.

Sau thành công:

- `publicationStatus = Ngừng bán`
- Gỡ khỏi trang bán.
- Không cho mở bán lại.
- Không tự vô hiệu hóa voucher code đã phát hành; code tiếp tục theo vòng đời riêng.
- Ghi log.

### 31.12. Mở bán lại

Điều kiện:

- Voucher đang `Tạm ngưng`.
- Thời gian bán chưa hết.
- Thời gian sử dụng còn hợp lệ.
- Chưa bán hết số lượng.

Sau thành công:

- Chuyển sang `Đang bán`.
- Hiển thị lại trên trang khách hàng.
- Không cần Admin duyệt lại.

Nếu hết hạn hoặc hết số lượng:

- Không cho mở bán.
- Hiển thị nguyên nhân cụ thể.
- Không tự thay đổi ngày hoặc số lượng.

---

## 32. UC-PAR-17 — Tra cứu voucher code

### 32.1. Ngữ cảnh

Màn hình dùng tại quầy/chi nhánh, ưu tiên tốc độ và khả năng đọc nhanh.

Trước khi tra cứu phải có:

- Tài khoản đăng nhập hợp lệ.
- Chi nhánh đang thao tác được xác định.
- Quyền tại chi nhánh.

### 32.2. Giao diện

- Ô nhập voucher code.
- Nút `Tra cứu`.
- Khu vực QR mô phỏng.
- Nút chuyển sang nhập thủ công.
- Hiển thị chi nhánh đang thao tác.
- Khu vực kết quả lớn, rõ, tương phản cao.

### 32.3. Kết quả hợp lệ

Hiển thị:

- Tên voucher
- Chi nhánh áp dụng
- Thời hạn sử dụng
- Trạng thái hiện tại
- Thông tin xác minh khách hàng ở mức tối thiểu, không lộ dữ liệu đầy đủ
- Nút `Xác nhận sử dụng`

### 32.4. Các kết quả không hợp lệ

| Trường hợp | Thông báo/Hành vi |
|---|---|
| Mã không tồn tại | Mã voucher không hợp lệ |
| Ngoài phạm vi | Không thuộc phạm vi quản lý; không hiển thị thêm dữ liệu |
| Đã sử dụng | Hiển thị đã sử dụng và thời điểm sử dụng |
| Hết hạn | Không thể sử dụng |
| Bị hủy/khóa/vô hiệu hóa | Không thể sử dụng |
| QR không đọc được | Chuyển sang nhập thủ công |
| Lỗi hệ thống | Giữ mã đã nhập và có nút Thử lại |

Không hiển thị nút xác nhận nếu mã không hợp lệ.

---

## 33. UC-PAR-18 / BR_PAR_06 — Xác nhận sử dụng voucher

### 33.1. Mục tiêu và actor

Mục tiêu là cho phép **Nhân viên đối tác tại chi nhánh** xác nhận một voucher code hợp lệ đã được khách hàng sử dụng.

- Actor nghiệp vụ chính: Nhân viên đối tác.
- Tài khoản Owner/Đối tác chỉ được thực hiện nếu được cấp cùng quyền xác nhận tại chi nhánh hiện tại.
- Nguồn có chỗ gọi đối tượng được cập nhật là “voucher”; trong mô hình dữ liệu thống nhất, đối tượng phải chuyển trạng thái là **voucher code**, không phải voucher sản phẩm.

### 33.2. Tiền điều kiện bắt buộc

- Actor đã đăng nhập và phiên còn hiệu lực.
- Actor có quyền xác nhận tại chi nhánh đang thao tác.
- Use case `Tra cứu voucher code` vừa hoàn tất thành công.
- Mã tồn tại, thuộc phạm vi chi nhánh/chương trình của doanh nghiệp.
- Mã đang ở trạng thái cho phép sử dụng.
- Mã chưa được sử dụng, chưa hết hạn, chưa bị hủy hoặc khóa.

Nếu một điều kiện không còn đúng, không hiển thị hoặc vô hiệu hóa nút `Xác nhận sử dụng`.

### 33.3. Thông tin phải hiển thị trước khi xác nhận

Khu vực xác nhận phải hiển thị rõ:

- Tên voucher.
- Đối tác phát hành.
- Chi nhánh áp dụng và chi nhánh đang thao tác.
- Thời hạn sử dụng.
- Phần trăm hoặc mức giảm đã khai báo.
- Điều kiện sử dụng.
- Giá sản phẩm/giá trị trước giảm nếu có trong dữ liệu giao dịch.
- Giá sau giảm.
- Số tiền được giảm.
- Trạng thái hiện tại của voucher code.

Nếu không có dữ liệu giá trị giao dịch để tính giá sau giảm, không tự bịa số tiền. Giao diện chỉ hiển thị các trường có dữ liệu hợp lệ và ghi rõ `Không có dữ liệu tính giảm giá` khi cần.

### 33.4. Luồng xác nhận

1. Từ kết quả tra cứu hợp lệ, Actor chọn `Xác nhận sử dụng`.
2. Hệ thống mở modal hoặc trang xác nhận với toàn bộ thông tin tại mục 33.3.
3. Actor chỉ cần chọn `Xác nhận`; không yêu cầu nhập thêm ghi chú, giá trị hoặc dữ liệu khách hàng.
4. Hệ thống chuyển nút sang trạng thái `Đang xử lý`, khóa thao tác lặp.
5. Hệ thống kiểm tra lại đồng thời:
   - Quyền của Actor.
   - Chi nhánh hiện tại.
   - Trạng thái mới nhất của voucher code.
   - Thời hạn và trạng thái khóa/hủy.
6. Hệ thống thực hiện **một transaction nguyên tử** gồm:
   - Chuyển voucher code sang `Đã sử dụng`.
   - Ghi thời điểm xác nhận.
   - Ghi Actor thực hiện.
   - Ghi chi nhánh.
   - Ghi nội dung thao tác `Xác nhận sử dụng voucher`.
7. Chỉ khi cả cập nhật trạng thái và nhật ký đều thành công, hệ thống mới hiển thị `Xác nhận sử dụng voucher thành công`.
8. Màn hình cập nhật trạng thái cuối cùng và không còn nút xác nhận.

### 33.5. Actor hủy thao tác

Nếu Actor đóng modal hoặc chọn `Hủy`:

- Trạng thái code giữ nguyên.
- Không phát sinh nhật ký sử dụng thành công.
- Quay về kết quả tra cứu.

### 33.6. Voucher không hợp lệ

Nếu kết quả tra cứu không hợp lệ hoặc trạng thái đã thay đổi trước khi mở xác nhận:

- Không hiển thị nút xác nhận.
- Hiển thị nguyên nhân phù hợp: không hợp lệ, đã dùng, hết hạn, bị hủy/khóa hoặc ngoài phạm vi.
- Không cho gọi mutation xác nhận từ UI.
- Backend vẫn phải từ chối yêu cầu trái phép nếu client cố gọi trực tiếp.

### 33.7. Race condition

Nếu một Actor khác đã xác nhận cùng mã trong lúc modal đang mở:

- Transaction hiện tại thất bại có kiểm soát.
- Không ghi lần xác nhận thứ hai.
- Hiển thị `Mã đã được sử dụng trước đó`.
- Tải lại trạng thái và thời điểm sử dụng mới nhất.
- Hệ thống phải bảo đảm không có hai kết quả xác nhận thành công cho cùng một code.

### 33.8. Không thể cập nhật trạng thái

- Không ghi nhật ký sử dụng thành công.
- Giữ trạng thái code trước đó.
- Hiển thị `Không thể xác nhận sử dụng voucher. Vui lòng thử lại.`
- Giữ màn hình và cho phép thử lại.
- Không hiển thị success.

### 33.9. Không thể ghi nhật ký

Nhật ký là điều kiện bắt buộc của thao tác:

- Không coi thao tác là thành công.
- Rollback cập nhật trạng thái code nếu phần ghi log thất bại.
- Giữ code ở trạng thái trước thao tác.
- Hiển thị `Không thể hoàn tất thao tác do lỗi ghi nhận nhật ký.`
- Không tạo bản ghi “đã sử dụng” không có log tương ứng.

### 33.10. Trạng thái UI bắt buộc

- `Valid — Ready to confirm`.
- `Processing — Disable duplicate action`.
- `Success — Used`.
- `Invalid — Confirmation hidden`.
- `Already used`.
- `Permission denied`.
- `State update failed`.
- `Audit log failed`.
- `Race condition detected`.

### 33.11. Phi chức năng và kiểm toán

- Phản hồi nhanh vì thao tác diễn ra tại quầy, không làm gián đoạn quy trình phục vụ khách hàng.
- Kiểm tra quyền và trạng thái lại tại thời điểm xác nhận.
- Không hiển thị thành công trước khi transaction commit.
- Không yêu cầu Actor nhập thêm thông tin ngoài hành động xác nhận.
- Nhật ký bắt buộc gồm: Actor, thời gian, chi nhánh, voucher code và nội dung thao tác.
- Thao tác chỉ được coi là thành công khi nhật ký đã được ghi nhận đầy đủ.

---

## 34. UC-PAR-19 / BR-PAR-07 — Báo cáo đối tác

### 34.1. Mục tiêu và phạm vi

Báo cáo cho phép Đối tác xem hiệu quả kinh doanh voucher thuộc **chính doanh nghiệp mình**. Đây là chức năng chỉ đọc:

- Không cập nhật voucher.
- Không cập nhật giao dịch.
- Không thay đổi trạng thái đơn hàng hoặc voucher code.
- Không hiển thị dữ liệu của doanh nghiệp khác.

Actor chính theo `BR-PAR-07` là tài khoản có vai trò **Đối tác**. Nhân viên chi nhánh không được mặc định truy cập báo cáo tổng quan.

### 34.2. Kiểm tra truy cập

Trước khi tải dữ liệu:

1. Kiểm tra phiên đăng nhập còn hiệu lực.
2. Kiểm tra role có quyền báo cáo Đối tác.
3. Khóa phạm vi dữ liệu theo `partnerId/businessId` của phiên.
4. Kiểm tra chương trình voucher được chọn thuộc doanh nghiệp hiện tại.

Kết quả:

- Sai quyền: `Bạn không có quyền truy cập chức năng này.`
- Phiên hết hạn: yêu cầu đăng nhập lại, không truy xuất dữ liệu.
- Không được dùng việc ẩn menu làm cơ chế bảo mật duy nhất.

### 34.3. Bốn KPI bắt buộc

Bốn KPI chính phải hiển thị bằng card rõ ràng:

1. Tổng doanh thu.
2. Tổng voucher phát hành.
3. Tổng voucher đã bán.
4. Tỷ lệ sử dụng.

`Tổng voucher đã sử dụng` được phép hiển thị như chỉ số hỗ trợ trong bảng, biểu đồ hoặc tooltip vì use case báo cáo chi tiết phía sau có dữ liệu này; không thay thế bốn KPI bắt buộc ở trên.

### 34.4. Khoảng thời gian mặc định

Use case báo cáo chi tiết cũ sử dụng mặc định 30 ngày gần nhất. Có thể dùng mốc này cho prototype, nhưng phải:

- Hiển thị rõ khoảng ngày đang áp dụng.
- Cho phép thay đổi.
- Không hard-code công thức chỉ dùng được cho 30 ngày.

### 34.5. Bộ lọc

Hai bộ lọc bắt buộc theo `BR-PAR-07`:

- `Chương trình voucher`.
- `Khoảng thời gian`.

Khoảng thời gian gồm ngày bắt đầu và ngày kết thúc.

Validation:

- Ngày bắt đầu không sau ngày kết thúc.
- Voucher được chọn phải thuộc doanh nghiệp hiện tại.
- Không truy vấn dữ liệu ngoài tenant.

Bộ lọc `Chi nhánh` xuất hiện trong use case báo cáo chi tiết cũ và có thể đặt dưới `Bộ lọc nâng cao`; không được coi là điều kiện bắt buộc của BR-PAR-07.

### 34.6. Luồng tải báo cáo

1. Đối tác chọn `Báo cáo`.
2. Hệ thống kiểm tra phiên và quyền.
3. Hệ thống tải dữ liệu voucher và giao dịch trong phạm vi doanh nghiệp.
4. Hệ thống tính bốn KPI bắt buộc.
5. Hệ thống hiển thị KPI, biểu đồ và dữ liệu chi tiết.
6. Đối tác chọn chương trình voucher và/hoặc khoảng thời gian.
7. Hệ thống hiển thị loading cục bộ, không khóa toàn bộ giao diện.
8. Hệ thống truy xuất và tính lại dữ liệu theo bộ lọc.
9. Hệ thống cập nhật KPI, biểu đồ và bảng đồng nhất trong cùng một lần phản hồi.

### 34.7. Breakdown chi tiết

Bảng theo từng voucher có thể gồm:

- Tên chương trình voucher.
- Số lượng phát hành.
- Số lượng đã bán.
- Số lượng đã sử dụng.
- Doanh thu.
- Tỷ lệ sử dụng.

Công thức:

```text
Tỷ lệ sử dụng = Số voucher code đã sử dụng / Số voucher code đã bán
```

Khi số đã bán bằng 0, không chia cho 0; hiển thị `0%` hoặc `Chưa có lượt bán` theo design system.

Doanh thu:

- Chỉ tính giao dịch thanh toán thành công.
- Không tính đơn đã hủy.
- Không tính phần đã hoàn tiền.
- Số liệu KPI, biểu đồ và bảng phải dùng cùng một nguồn dữ liệu và cùng bộ lọc.

### 34.8. Empty state — chưa có chương trình được duyệt

Khi doanh nghiệp chưa có chương trình voucher đủ điều kiện báo cáo:

- Không tính KPI từ dữ liệu rỗng.
- Hiển thị `Chưa có dữ liệu báo cáo.`
- Hiển thị gợi ý `Tạo voucher mới` hoặc điều hướng đến quản lý voucher.
- Không hiển thị số liệu giả.

### 34.9. Empty state — không có giao dịch trong kỳ

Khi có voucher nhưng không có giao dịch phù hợp bộ lọc:

- Hiển thị biểu đồ trống đúng chuẩn.
- Hiển thị `Không có giao dịch trong kỳ này.`
- Cho phép thay đổi bộ lọc ngay trên màn hình.
- Không coi dữ liệu rỗng là lỗi hệ thống.

### 34.10. Lỗi tải dữ liệu

Khi không thể truy xuất voucher hoặc giao dịch:

- Không tính hoặc hiển thị dữ liệu thiếu như kết quả thành công.
- Giữ bộ lọc hiện tại.
- Hiển thị `Không thể tải dữ liệu báo cáo. Vui lòng thử lại.`
- Có nút `Thử lại`.
- Nếu tiếp tục thất bại, giữ màn hình lỗi; không thay bằng số 0 gây hiểu nhầm.

### 34.11. Trình bày

- Bốn KPI card ở đầu trang.
- Bộ lọc có nhãn rõ ràng.
- Biểu đồ cột hoặc đường; không dùng biểu đồ 3D.
- Bảng số liệu chi tiết bên dưới.
- Loading skeleton cho KPI/biểu đồ/bảng.
- Responsive trên laptop và mobile web.
- Biểu đồ phải phản ánh đúng bộ lọc hiện tại.

### 34.12. Xuất báo cáo

CSV/Excel chỉ là tính năng mở rộng trong use case báo cáo cũ, không phải yêu cầu bắt buộc của `BR-PAR-07`.

- Không đặt nút xuất báo cáo trong prototype cơ bản.
- Chỉ bổ sung khi người dùng yêu cầu rõ.

### 34.13. Tính nhất quán và kiểm toán

- Kết quả báo cáo phải nhất quán với dữ liệu voucher và giao dịch.
- Không hiển thị dữ liệu ngoài phạm vi Đối tác.
- Thay đổi bộ lọc không tạo mutation nghiệp vụ.
- Có thể ghi log truy cập báo cáo phục vụ bảo mật, nhưng không tạo audit log thay đổi dữ liệu vì use case này chỉ đọc.

---

## 35. UC-PAR-20 và UC-PAR-21 — Quản lý nhân viên

### 35.1. Danh sách nhân viên

Cột:

- Họ tên
- Email/SĐT
- Vai trò
- Chi nhánh phụ trách
- Trạng thái
- Hành động

Bộ lọc có thể dùng:

- Vai trò
- Chi nhánh
- Trạng thái
- Từ khóa tên/Email/SĐT

Bộ lọc là thao tác đọc, không thay đổi nghiệp vụ.

### 35.2. Thêm nhân viên

Chỉ Owner được thực hiện.

Form:

- Họ tên
- Email/SĐT
- Vai trò:
  - Quản lý vận hành
  - Nhân viên chi nhánh
- Chi nhánh phụ trách:
  - Chỉ hiển thị khi chọn Nhân viên chi nhánh
  - Chọn một hoặc nhiều

Validation:

- Trường bắt buộc.
- Email/SĐT đúng định dạng.
- Email/SĐT duy nhất trên toàn hệ thống.
- Nhân viên chi nhánh phải có ít nhất một chi nhánh.

Sau khi tạo:

- Tạo tài khoản nhân viên.
- Sinh thông tin thiết lập mật khẩu ban đầu ở mức mô phỏng.
- Gửi hướng dẫn mô phỏng.
- Ghi log người tạo, role và chi nhánh.

Nếu gửi thông báo thất bại:

- Không rollback tài khoản.
- Hiển thị trạng thái gửi thất bại.
- Owner có thể dùng cơ chế cung cấp thông tin tạm thời theo prototype.
- Không lưu plaintext lâu dài.

### 35.3. Sửa nhân viên

Owner có thể sửa:

- Vai trò
- Chi nhánh phụ trách

Nếu đổi sang Nhân viên chi nhánh:

- Bắt buộc chọn ít nhất một chi nhánh.

Phải có modal hoặc form xác nhận lưu và ghi diff trước/sau.

### 35.4. Khóa nhân viên

- Chỉ hiển thị khi đang `Hoạt động`.
- Modal cảnh báo nhân viên không thể đăng nhập.
- Sau xác nhận:
  - Chuyển `Khóa`.
  - Hủy phiên hiện tại ngay.
  - Ghi log.

### 35.5. Mở khóa nhân viên

- Chỉ hiển thị khi đang `Khóa`.
- Chuyển về `Hoạt động`.
- Không tự tạo lại quyền ngoài role/chi nhánh đã lưu.
- Ghi log.

### 35.6. Xóa nhân viên

- Hành động không thể hoàn tác trên giao diện.
- Thực chất là vô hiệu hóa vĩnh viễn tài khoản.
- Giữ toàn bộ lịch sử thao tác.
- Ghi log.
- Không xóa các bản ghi xác nhận voucher trước đây.

### 35.7. Ràng buộc Owner

- Owner không được tự khóa chính mình qua module này.
- Owner không được tự xóa chính mình qua module này.
- Doanh nghiệp luôn phải có ít nhất một Owner hoạt động.
- Chỉ Owner quản lý nhân viên.

---

## 36. Dashboard Đối tác

Tài liệu nguồn nêu đăng nhập thành công điều hướng về dashboard nhưng không định nghĩa use case thay đổi dữ liệu riêng. Dashboard là màn hình đọc và điều hướng.

### 36.1. KPI phù hợp dữ liệu đã có

Dashboard có thể hiển thị KPI vận hành bên dưới, nhưng khi điều hướng vào module Báo cáo phải ưu tiên bốn KPI bắt buộc của BR-PAR-07.

- Voucher nháp
- Voucher chờ duyệt
- Voucher đang bán
- Voucher bị từ chối
- Voucher tạm ngưng
- Yêu cầu chi nhánh chờ duyệt
- Yêu cầu pháp lý chờ duyệt
- Voucher đã bán
- Voucher đã sử dụng
- Doanh thu 30 ngày
- Tỷ lệ sử dụng

Không dùng các KPI dashboard để thay thế báo cáo chi tiết hoặc bỏ qua bộ lọc chương trình/khoảng thời gian.

### 36.2. Khu vực cần chú ý

- Voucher bị từ chối cần sửa.
- Voucher sắp hết thời gian bán.
- Voucher sắp hết số lượng.
- Yêu cầu hồ sơ/chi nhánh cần bổ sung.
- Kết quả duyệt mới.
- Lỗi gửi thông báo mô phỏng.
- Nhân viên Tạm khóa.

### 36.3. Quick actions

Quick action chỉ điều hướng:

- Tạo voucher mới.
- Tra cứu voucher code.
- Xem voucher chờ duyệt.
- Xem báo cáo.
- Xem yêu cầu chi nhánh.

Không duyệt hoặc đổi trạng thái trực tiếp từ KPI.

---

## 37. Liên kết hai chiều Admin ↔ Đối tác

### 37.1. Hồ sơ đăng ký

```text
Partner gửi hồ sơ
→ Admin thấy hồ sơ Chờ duyệt
→ Admin duyệt/từ chối
→ Partner nhận trạng thái và lý do
```

### 37.2. Yêu cầu chi nhánh

```text
Partner tạo yêu cầu thêm/sửa/xóa
→ Dữ liệu đề xuất lưu riêng
→ Admin kiểm tra và xử lý
→ Danh sách chính thức chỉ đổi khi được duyệt
→ Partner nhận kết quả
```

### 37.3. Cập nhật pháp lý

```text
Partner gửi diff pháp lý
→ Admin xem trước/sau
→ Admin duyệt/từ chối/yêu cầu bổ sung
→ Dữ liệu chính thức cập nhật hoặc giữ nguyên
→ Partner nhận kết quả
```

### 37.4. Voucher

```text
Partner tạo Nháp
→ Partner gửi duyệt
→ Admin xem queue Chờ duyệt
→ Admin phê duyệt/từ chối
→ Partner xem kết quả
→ Hệ thống công bố theo thời gian và trạng thái
```

### 37.5. Khóa doanh nghiệp

```text
Admin khóa đối tác
→ Partner và nhân viên không đăng nhập
→ Chi nhánh không được dùng cho voucher mới
→ Partner Portal hiển thị thông báo liên hệ Admin
```

### 37.6. Nhật ký

- Hành động Partner quan trọng phải có log.
- Admin có thể tra cứu log theo module và đối tượng.
- Partner chỉ xem lịch sử nghiệp vụ thuộc phạm vi của mình nếu màn hình có yêu cầu.
- Không cho Partner sửa/xóa log.

---

## 38. Quy tắc bảo mật, ổn định và kiểm toán

### 38.1. Bảo mật

- Mật khẩu không lưu plaintext.
- Truyền dữ liệu đăng nhập qua HTTPS.
- Token không xuất hiện trong URL.
- CAPTCHA tại đăng ký.
- Rate limiting cho đăng ký, đăng nhập và OTP.
- Kiểm tra quyền ở backend.
- Kiểm tra tenant/doanh nghiệp ở mọi truy vấn.
- Kiểm tra chi nhánh ở tra cứu và xác nhận voucher.
- Không lộ đầy đủ dữ liệu khách hàng khi tra cứu code.
- File upload phải kiểm tra loại file thực tế.
- Khóa tài khoản phải thu hồi phiên.

### 38.2. Tính ổn định

- Không để dữ liệu cập nhật một phần.
- Dữ liệu đề xuất không ghi đè dữ liệu chính thức trước khi duyệt.
- Không lặp mutation khi reload.
- Không mất form khi lỗi.
- Không rollback dữ liệu nghiệp vụ đã lưu chỉ vì notification mô phỏng thất bại.
- Không xác nhận sử dụng code hai lần.
- Cập nhật `Đã sử dụng` và ghi nhật ký xác nhận phải nằm trong cùng transaction; lỗi một phần phải rollback toàn bộ.
- Không đổi trạng thái voucher nếu thao tác lưu thất bại.
- Không hiển thị success trước khi commit hoàn tất.
- Báo cáo không được hiển thị dữ liệu thiếu như kết quả thành công và không được biến empty state thành lỗi hệ thống.

### 38.3. Kiểm toán

Ghi log tối thiểu:

- Đăng ký hồ sơ.
- Xác thực tài khoản.
- Đăng nhập/đăng xuất.
- Đặt lại mật khẩu.
- Yêu cầu thêm/sửa/xóa chi nhánh.
- Yêu cầu cập nhật pháp lý.
- Tạo/cập nhật voucher.
- Gửi duyệt.
- Tạm ngưng/ngừng bán/mở bán lại.
- Kết quả duyệt.
- Tra cứu mã nếu chính sách log yêu cầu.
- Xác nhận sử dụng.
- Tạo/sửa/khóa/mở khóa/xóa nhân viên.

Log mutation gồm:

- Người thực hiện
- Vai trò
- Doanh nghiệp
- Chi nhánh nếu có
- Thời gian
- Đối tượng
- Dữ liệu trước/sau
- Kết quả
- Lỗi nếu thất bại

---

## 39. Dữ liệu mẫu tối thiểu cho Partner Portal

### 39.1. Tài khoản/doanh nghiệp

- Hồ sơ chờ duyệt.
- Hồ sơ hoạt động.
- Hồ sơ bị từ chối có lý do.
- Doanh nghiệp Tạm khóa.
- Owner hoạt động.
- Quản lý vận hành.
- Nhân viên chi nhánh hoạt động.
- Nhân viên Tạm khóa.

### 39.2. Chi nhánh

- Chi nhánh hoạt động.
- Chi nhánh tạm ngưng.
- Chi nhánh mới chờ duyệt.
- Yêu cầu cập nhật chờ duyệt.
- Yêu cầu xóa chờ duyệt.
- Yêu cầu bị từ chối.
- Yêu cầu cần bổ sung.

### 39.3. Voucher

- Nháp hợp lệ.
- Nháp có thời gian đã lỗi tại thời điểm gửi.
- Chờ duyệt.
- Bị từ chối có lý do.
- Đã duyệt chờ hiển thị.
- Đang bán.
- Tạm ngưng.
- Ngừng bán.
- Hết hạn.
- Hết số lượng.

### 39.4. Voucher code

- Hợp lệ chưa sử dụng.
- Đã sử dụng.
- Hết hạn.
- Ngoài phạm vi chi nhánh.
- Bị hủy/khóa.
- Mã không tồn tại.
- Hai nhân viên cùng xác nhận để mô phỏng race condition.
- Mã hợp lệ có đủ dữ liệu giá để hiển thị giá sau giảm và số tiền giảm.
- Mã hợp lệ thiếu dữ liệu giá trị giao dịch để kiểm tra fallback `Không có dữ liệu tính giảm giá`.
- Lỗi cập nhật trạng thái.
- Lỗi ghi audit log khiến transaction rollback.

### 39.5. Báo cáo

- Có dữ liệu 30 ngày.
- Chưa có chương trình voucher được duyệt.
- Có voucher nhưng không có giao dịch trong kỳ.
- Không có dữ liệu theo một bộ lọc.
- Tài khoản không có quyền truy cập.
- Phiên hết hạn.
- Lỗi truy xuất dữ liệu và trạng thái thử lại.
- Đơn thành công.
- Đơn hủy.
- Đơn hoàn tiền.
- Voucher đã bán nhưng chưa sử dụng.
- Voucher đã sử dụng.

---

## 40. Các flow prototype bắt buộc

1. **Đăng ký doanh nghiệp**
   - Nhập tài khoản
   - Xác thực OTP
   - Nhập doanh nghiệp
   - Nhập chi nhánh/người đại diện
   - Gửi
   - Thấy trạng thái Chờ duyệt

2. **Đăng nhập theo trạng thái**
   - Hoạt động → dashboard
   - Chờ duyệt → trang chờ
   - Từ chối → lý do
   - Khóa → liên hệ Admin

3. **Thêm chi nhánh**
   - Mở danh sách
   - Nhập dữ liệu
   - Gửi yêu cầu
   - Thấy badge Chờ duyệt
   - Admin xử lý
   - Partner thấy kết quả

4. **Cập nhật pháp lý**
   - Xem dữ liệu hiện tại
   - Chỉnh sửa
   - Xem diff
   - Gửi
   - Dữ liệu cũ vẫn có hiệu lực

5. **Tạo và gửi duyệt voucher**
   - Tạo voucher
   - Validate
   - Lưu Nháp
   - Gửi duyệt
   - Chờ duyệt
   - Admin duyệt/từ chối
   - Partner xem kết quả

6. **Voucher bị từ chối**
   - Xem lý do
   - Sửa
   - Lưu về Nháp
   - Gửi duyệt lại bằng thao tác riêng

7. **Tạm ngưng và mở bán lại**
   - Đang bán → Tạm ngưng
   - Voucher biến mất khỏi trang bán
   - Code cũ vẫn hợp lệ
   - Mở bán lại khi đủ điều kiện

8. **Ngừng bán**
   - Cảnh báo không thể hoàn tác
   - Xác nhận
   - Trạng thái terminal
   - Không có nút mở bán lại

9. **Tra cứu và xác nhận voucher**
   - Chọn chi nhánh
   - Nhập mã/QR mô phỏng
   - Xem kết quả
   - Xem điều kiện, giá sau giảm và số tiền giảm
   - Xác nhận bằng một thao tác, không nhập thêm dữ liệu
   - Recheck quyền và trạng thái
   - Commit trạng thái `Đã sử dụng` cùng audit log
   - Chỉ hiển thị thành công khi cả hai phần đã lưu

10. **Race condition và lỗi nhật ký**
    - Hai phiên tra cùng mã
    - Phiên thứ nhất xác nhận thành công
    - Phiên thứ hai bị từ chối khi recheck
    - Mô phỏng lỗi ghi nhật ký
    - Voucher code phải rollback về trạng thái trước thao tác

11. **Báo cáo**
    - Kiểm tra role và phiên
    - Mặc định 30 ngày nếu dùng cấu hình cũ
    - Lọc theo chương trình voucher và khoảng thời gian
    - Hiển thị bốn KPI bắt buộc, chart và bảng
    - Empty state `Chưa có dữ liệu báo cáo`
    - Empty state `Không có giao dịch trong kỳ này`
    - Lỗi tải dữ liệu với nút Thử lại

12. **Quản lý nhân viên**
    - Owner tạo Nhân viên chi nhánh
    - Bắt buộc chọn chi nhánh
    - Khóa nhân viên
    - Phiên nhân viên bị hủy
    - Mở khóa
    - Xóa/vô hiệu hóa và giữ lịch sử

---

## 41. Definition of Done cho Partner Portal

Một module Partner chỉ hoàn thành khi:

- Đúng actor và đúng phạm vi doanh nghiệp.
- Có màn hình list/detail/form phù hợp.
- Có state loading/empty/error/success.
- Có validation inline.
- Có hành động theo đúng trạng thái.
- Không có hành động ngoài đặc tả.
- Có confirmation cho mutation quan trọng.
- Có dữ liệu trước/sau với yêu cầu cập nhật.
- Không ghi đè dữ liệu chính thức trước khi duyệt.
- Có kết nối hai chiều với Admin.
- Có audit log.
- Responsive trên laptop và mobile web.
- Màn hình voucher code thao tác nhanh tại quầy.
- Màn hình xác nhận hiển thị đủ thông tin voucher, giá sau giảm và số tiền giảm khi có dữ liệu.
- Xác nhận sử dụng chỉ thành công sau khi trạng thái và audit log cùng commit.
- Báo cáo hiển thị đủ bốn KPI bắt buộc và hai empty state được đặc tả.
- Không lộ dữ liệu khách hàng ngoài mức cần thiết.
- Không để dữ liệu cập nhật một phần.
- Có ít nhất một flow end-to-end chạy được.

---

## 42. Chỉ dẫn trực tiếp cho Figma Make — Giai đoạn Admin + Partner

1. Giữ nguyên toàn bộ màn hình Admin đã tạo.
2. Dùng chung design system, trạng thái và entity.
3. Tạo public flow:
   - Đăng ký doanh nghiệp
   - OTP mô phỏng
   - Đăng nhập
   - Quên mật khẩu
4. Tạo Partner App Shell.
5. Tạo dashboard đọc và điều hướng.
6. Tạo các module:
   - Hồ sơ doanh nghiệp
   - Chi nhánh
   - Voucher
   - Tra cứu voucher code
   - Báo cáo
   - Nhân viên
7. Tạo role variant:
   - Owner đầy đủ
   - Nhân viên chi nhánh tối giản
   - Quản lý vận hành chỉ theo permission mock rõ ràng
8. Kết nối các queue Partner → Admin.
9. Kết nối kết quả Admin → Partner notification/detail.
10. Không tạo cổng thanh toán thật.
11. Không gửi OTP/email/SMS thật.
12. Không bật camera thật cho QR.
13. Màn hình xác nhận voucher phải hiển thị giá sau giảm, số tiền giảm, trạng thái hiện tại và chỉ một hành động xác nhận chính; không thêm form nhập liệu phụ.
14. Mô phỏng riêng trạng thái lỗi cập nhật và lỗi ghi nhật ký; lỗi log phải rollback trạng thái code.
15. Báo cáo phải có bốn KPI bắt buộc, bộ lọc Chương trình voucher + Khoảng thời gian, hai empty state và lỗi tải có Thử lại.
16. Không thêm export báo cáo ở bản cơ bản.
17. Không thêm xóa voucher khi chưa có đặc tả riêng.
18. Không tự cấp quyền Owner cho Quản lý vận hành.
19. Dùng mock data có trạng thái lỗi, chờ, từ chối, khóa, race condition và audit rollback.
20. Mỗi mutation phải có confirmation, processing và kết quả cuối.
21. Mọi thay đổi quan trọng phải có audit trail.
22. Ưu tiên prototype end-to-end hơn số lượng frame rời.
23. Khi gặp điểm chưa rõ, hiển thị read-only hoặc ghi chú cần xác nhận; không tự tạo mutation.

---

## 43. Các quyết định chuẩn hóa cho phần Đối tác

### 43.1. Số lượng use case và khối bổ sung

PDF mới có:

- Hai khối bổ sung ở đầu tài liệu: `BR_PAR_06` và `BR-PAR-07`.
- Toàn bộ các use case Partner của phiên bản trước.
- Hai khối bổ sung trùng chức năng với use case xác nhận sử dụng và use case báo cáo ở phần sau, nhưng chi tiết hơn về UI, lỗi, quyền và NFR.

Vì vậy:

- Không tạo thêm hai module trùng lặp.
- Hệ thống vẫn có **21 năng lực chức năng Partner** trong bảng mã nội bộ.
- `BR_PAR_06` là nguồn ưu tiên của UC-PAR-18.
- `BR-PAR-07` là nguồn ưu tiên của UC-PAR-19.

### 43.2. Tạm ẩn và tạm ngưng

- Admin dùng nhãn `Tạm ẩn`.
- Đối tác dùng nhãn `Tạm ngưng bán`.
- Hai nhãn ánh xạ cùng một trạng thái công bố suspended.
- Không tạo hai bản ghi trạng thái riêng.

### 43.3. Đã duyệt và chờ hiển thị

- `Đã duyệt` là kết quả kiểm duyệt.
- `Chờ hiển thị` là trạng thái công bố khi chưa đến thời gian bán.
- Partner Portal có thể hiển thị đồng thời:
  - `Kiểm duyệt: Đã duyệt`
  - `Công bố: Chờ hiển thị`

### 43.4. Lưu nháp

Theo nguồn, voucher chỉ được lưu Nháp khi đã đầy đủ và hợp lệ.

- Không dùng Nháp như autosave dữ liệu thiếu.
- Có thể giữ dữ liệu form cục bộ khi lỗi hoặc rời trang theo cơ chế UI, nhưng không tạo bản ghi Nháp nghiệp vụ không hợp lệ.

### 43.5. Sửa voucher đang bán

Nguồn cho phép sửa giới hạn và ghi chú cần xác nhận.

- Dựng UI theo phạm vi sửa giới hạn đã nêu.
- Khóa giá, thời gian và chi nhánh.
- Đánh dấu đây là quyết định cần xác nhận khi triển khai backend chính thức.
- Không cho phép API sửa vượt phạm vi.

### 43.6. Xóa voucher nháp

Nguồn chỉ nhắc trong ví dụ hành động nhưng không có use case.

- Không triển khai mutation xóa voucher.
- Không suy ra soft delete/hard delete.
- Chờ đặc tả bổ sung.

### 43.7. Ngừng bán và voucher code đã phát hành

Câu trong nguồn về voucher code sau ngừng bán bị thiếu phần kết. Để thống nhất với việc voucher sản phẩm và voucher code có vòng đời riêng:

- Ngừng bán chỉ chặn giao dịch mới.
- Không tự vô hiệu hóa code đã phát hành.
- Code tiếp tục được đánh giá theo hết hạn, đã dùng, hủy, khóa hoặc vô hiệu hóa riêng.

### 43.8. Quyền Quản lý vận hành

Nguồn chỉ nêu tên vai trò khi Owner tạo nhân viên, chưa nêu ma trận đầy đủ.

- Owner là variant Partner đầy đủ.
- Nhân viên chi nhánh có flow tra cứu/xác nhận.
- Quản lý vận hành chỉ nhận các menu đã được permission mock xác định.
- Không tự coi Quản lý vận hành là Owner.

### 43.9. Actor xác nhận sử dụng voucher

`BR_PAR_06` chỉ định Actor là Nhân viên đối tác; NFR cho phép tài khoản Đối tác hoặc nhân viên có quyền.

Chuẩn hóa:

- Actor mặc định trong prototype tại quầy là Nhân viên chi nhánh.
- Owner/Đối tác chỉ được xác nhận nếu có quyền vận hành cùng phạm vi chi nhánh.
- Không suy ra rằng mọi Owner mặc định có quyền xác nhận tại mọi chi nhánh.

### 43.10. Tính nguyên tử của xác nhận sử dụng

Khối bổ sung yêu cầu thao tác chỉ thành công khi nhật ký đã được ghi nhận.

Vì vậy:

```text
update voucher_code status + insert usage audit log = one atomic transaction
```

- Lỗi cập nhật: không có log thành công.
- Lỗi log: rollback trạng thái.
- Không tồn tại code `Đã sử dụng` mà thiếu nhật ký xác nhận tương ứng.

### 43.11. Bốn KPI báo cáo bắt buộc

`BR-PAR-07` yêu cầu bốn KPI chính:

- Tổng doanh thu.
- Tổng voucher phát hành.
- Tổng voucher đã bán.
- Tỷ lệ sử dụng.

Số đã sử dụng vẫn được phép dùng trong công thức và breakdown, nhưng không thay thế bốn KPI card bắt buộc.

### 43.12. Bộ lọc báo cáo

- `Chương trình voucher` và `Khoảng thời gian` là bộ lọc bắt buộc.
- `Chi nhánh` là bộ lọc nâng cao lấy từ use case báo cáo cũ, không phải yêu cầu cốt lõi của BR-PAR-07.
- Không thêm export CSV/Excel trong bản cơ bản.

### 43.13. Giá sau giảm trong xác nhận voucher

Khối bổ sung yêu cầu hiển thị giá sau giảm và số tiền giảm.

- Chỉ tính khi có đủ dữ liệu giá trị giao dịch và quy tắc giảm.
- Không tự suy ra giá sản phẩm tại quầy nếu hệ thống không lưu dữ liệu đó.
- Thiếu dữ liệu thì hiển thị fallback rõ ràng, không tạo số giả.

---

**Nguyên tắc cuối cùng của hệ thống Admin + Partner:** Mọi dữ liệu Partner gửi lên phải có trạng thái, phạm vi và điểm kiểm soát rõ ràng; mọi quyết định Admin phải phản ánh lại đúng trên Partner Portal; mọi voucher code phải được xác thực theo doanh nghiệp, chi nhánh và trạng thái tại chính thời điểm sử dụng; thao tác xác nhận chỉ hoàn tất khi trạng thái và nhật ký cùng được ghi nhận thành công.
