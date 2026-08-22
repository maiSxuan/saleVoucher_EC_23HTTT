Bạn là một System Architect chuyên nghiệp. Hãy phân tích tính năng/use case: "[TÊN USE CASE / CHỨC NĂNG CẦN VẼ]" trong dự án này.

Mục tiêu của bạn là cung cấp CHI TIẾT LUỒNG TƯƠNG TÁC (Detailed Interaction Flow) để dùng làm dữ liệu đầu vào cho việc vẽ Sequence Diagram. 

Vui lòng tuân thủ chặt chẽ các quy tắc phân tầng (3-Layer Architecture) và cấu trúc xuất dữ liệu bên dưới:

---
### 1. NGUYÊN TẮC PHÂN TẦNG (3-TIER ARCHITECTURE)
Hãy phân loại tất cả các đối tượng (Lifelines) tham gia vào 3 tầng:
1. Presentation Layer (UI/Boundary): Giao diện người dùng, Form, Page, View Model, API Controller tiếp nhận request.
2. Business Layer (Logic/Control): Các Service, Business Controller, Manager, Domain Entity xử lý logic nghiệp vụ, tính toán.
3. Data Access Layer (Data/Repository/Entity): Repository, DAO, Database/External System thực hiện truy vấn và lưu trữ dữ liệu.

---
### 2. YÊU CẦU ĐẦU RA (OUTPUT FORMAT)
Hãy trả về thông tin dưới dạng mô tả từng bước rõ ràng, KHÔNG CẦN xuất mã PlantUML/Mermaid (chỉ tập trung vào độ chính xác của luồng nghiệp vụ). 

Định dạng trả về bao gồm:

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
* List các Actor, Boundary, Control, Entity, External Systems tham gia. 
* Ví dụ: 
  - [Actor] Student
  - [Presentation] StudentInfoPage
  - [Business] TranscriptBuilder, Student, Seminar
  - [Data/External] Printer, StudentRepository

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
Mỗi bước cần ghi rõ:
1. **[STT] BÊN GỬI -> BÊN NHẬN**: Tên hàm / Tên thông điệp (Tham số truyền vào)
   - *Kiểu gọi*: Synchronous (Đồng bộ) / Asynchronous (Bất đồng bộ) / Return (Phản hồi).
   - *Tầng tương tác*: [Presentation -> Business], [Business -> Data], v.v.
   - *Mô tả ngắn*: Mục đích của bước này.

2. **CÁC KHỐI ĐIỀU KIỆN / VÒNG LẶP (Nếu có)**:
   - **Loop / Alt / Opt**: Điều kiện bắt đầu và kết thúc (vd: `loop [for each seminar]`, `alt [if valid]`).
   - Các thao tác con bên trong khối.

---
### 3. VÍ DỤ MẪU ĐẦU RA MONG MUỐN
- **[Actor] Student -> [Presentation] StudentInfoPage**: new()
- **[Presentation] StudentInfoPage -> [Business] TranscriptBuilder**: new(student)
- **[Business] TranscriptBuilder -> [Business] Student**: getSeminars()
- **[Business] Student --> [Business] TranscriptBuilder**: return list of seminars
- **LOOP [for each seminar]**:
    - **[Business] TranscriptBuilder -> [Business] Seminar**: getMark()
    - **[Business] Seminar -> [Business] Seminar**: calculateMark() (Self-call / Internal logic)
- **[Actor] Student -> [Presentation] StudentInfoPage**: Print()
- **[Presentation] StudentInfoPage -> [External] Printer**: print(studentPage)

---
Dựa trên mã nguồn/tài liệu dự án hiện có, hãy đưa ra bản phân tích luồng chi tiết cho: "[TÊN USE CASE / CHỨC NĂNG CẦN VẼ]".

Các chức năng cần thực hiện gồm:
"Thiết kế sequence: 
UC-PAR-01 — Đăng ký tài khoản doanh nghiệp 
UC-PAR-02 — Cập nhật hồ sơ chi nhánh
UC-PAR-03 — Cập nhật thông tin pháp lý doanh nghiệp 
UC-PAR-04 — Tạo voucher.
UC-PAR-05 — Gửi duyệt voucher.
UC-PAR-06 — Tạm ngưng voucher.
UC-PAR-07 — Ngừng bán voucher.
UC-PAR-08 — Mở bán lại voucher.
UC-PAR-09 — Xem danh sách voucher.
UC-PAR-10 — Xem chi tiết voucher.
UC-PAR-11 — Cập nhật voucher.
UC-PAR-12 — Xem kết quả duyệt voucher.
UC-PAR-14 --- Thêm tài khoản nhân viên
UC-PAR-16 — Báo cáo đối tác.
UC-ADM-02 — xử lý hồ sơ đối tác
UC-ADM-03 — Khóa/mở đối tác
UC-ADM-04 — Quản lý chi nhánh đối tác
UC-ADM-05 — Admin duyệt voucher."