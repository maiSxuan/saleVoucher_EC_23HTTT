# ĐẶC TẢ SEQUENCE DIAGRAM (DETAILED INTERACTION FLOW)
## DỰ ÁN HỆ THỐNG QUẢN LÝ & PHÁT HÀNH E-VOUCHER (SNOW VOUCHER)

> Document Generated Following 3-Tier Architecture Principles (Presentation, Business, Data Access) for PlantUML / Mermaid Sequence Diagram Rendering.

---

## UC-PAR-01 — Đăng ký tài khoản doanh nghiệp

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người đại diện Doanh nghiệp)
- **[Presentation - UI]**: PartnerRegisterPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: PartnerController
- **[Business - Service]**: PartnerService, MailerService
- **[Data Access - DB]**: SupabaseDB (`DANHSACHOTP`, `TAIKHOAN`, `HOSODN`, `CHINHANH`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] PartnerRegisterPage**: Điền thông tin tài khoản đăng ký (email, sdt, password, ho_ten) & Bấm "Tiếp tục"
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
   - *Mô tả*: Khởi tạo bước 1 đăng ký tài khoản.

2. **[Presentation - UI] PartnerRegisterPage -> [Presentation - API Client] partnerApi**: requestPartnerOtpApi({ email, sdt, password, ho_ten })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Presentation UI -> API Client]
   - *Mô tả*: Gọi API yêu cầu cấp mã xác thực OTP.

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners/register/request-otp (body: { email, sdt, password, ho_ten })
   - *Kiểu gọi*: Synchronous HTTP
   - *Tầng tương tác*: [API Client -> Presentation Controller]
   - *Mô tả*: Chuyển tiếp HTTP Request đến Backend Controller.

4. **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: requestRegisterOtp({ email, sdt, password, ho_ten })
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation Controller -> Business Service]
   - *Mô tả*: Thực thi logic kiểm tra email trùng lặp và tạo mã OTP 6 chữ số.

5. **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: SELECT COUNT(*) FROM TAIKHOAN WHERE email = ?
   - *Kiểu gọi*: Synchronous DB Query
   - *Tầng tương tác*: [Business Service -> Data Access]
   - *Mô tả*: Kiểm tra email đã đăng ký chưa.

6. **ALT [If Email already exists]**:
   - **[Data Access - DB] SupabaseDB --> [Business - Service] PartnerService**: return count > 0
   - **[Business - Service] PartnerService --> [Presentation - Controller] PartnerController**: throw Error("Email đã tồn tại trên hệ thống")
   - **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerRegisterPage**: HTTP 400 Bad Request ({ message })

7. **ALT [If Email is valid & unique]**:
   - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: INSERT INTO DANHSACHOTP (email, otp, expire_at)
   - **[Data Access - DB] SupabaseDB --> [Business - Service] PartnerService**: return createdOtpRecord
   - **[Business - Service] PartnerService -> [Business - Service] MailerService**: sendOtpEmail(email, otp)
   - *Kiểu gọi*: Asynchronous Mail Dispatch
   - **[Business - Service] PartnerService --> [Presentation - Controller] PartnerController**: return { message: "Mã OTP đã được gửi", demoOtp }
   - **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerRegisterPage**: HTTP 200 OK ({ demoOtp })
   - *Mô tả*: Đã gửi mã OTP và hiển thị Popup nhập OTP cho Partner.

8. **[Actor] Partner -> [Presentation - UI] PartnerRegisterPage**: Nhập mã OTP 6 chữ số & Bấm "Xác nhận OTP"
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]

9. **[Presentation - UI] PartnerRegisterPage -> [Presentation - API Client] partnerApi**: verifyPartnerOtpApi({ email, otp, sdt, password, ho_ten })
   - *Kiểu gọi*: Asynchronous

10. **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners/register/verify-otp
   - *Kiểu gọi*: Synchronous HTTP

11. **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: verifyRegisterOtp({ email, otp, sdt, password, ho_ten })
   - *Kiểu gọi*: Synchronous

12. **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: SELECT * FROM DANHSACHOTP WHERE email = ? AND otp = ? AND expire_at > NOW()
   - *Kiểu gọi*: Synchronous DB Query

13. **ALT [If OTP is valid]**:
    - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: INSERT INTO TAIKHOAN (email, mat_khau, ho_ten, sdt, vai_tro) VALUES (?, hashed_pw, ?, ?, 'PARTNER_OWNER')
    - **[Data Access - DB] SupabaseDB --> [Business - Service] PartnerService**: return createdAccount
    - **[Business - Service] PartnerService --> [Presentation - Controller] PartnerController**: return { user: createdAccount, token: accessToken }
    - **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerRegisterPage**: HTTP 200 OK ({ user, token })
    - *Mô tả*: Tài khoản đại diện đã tạo thành công. UI tự động chuyển sang Bước 2 (Thông tin Doanh nghiệp & GPKD & Chi nhánh).

14. **[Actor] Partner -> [Presentation - UI] PartnerRegisterPage**: Khai báo Tên doanh nghiệp, MST, GPKD, Người đại diện, Chi nhánh & Bấm "Gửi duyệt hồ sơ"
    - *Kiểu gọi*: Synchronous

15. **[Presentation - UI] PartnerRegisterPage -> [Presentation - API Client] partnerApi**: registerPartnerProfileApi(profileFormData)
    - *Kiểu gọi*: Asynchronous

16. **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners (body: profileFormData)
    - *Kiểu gọi*: Synchronous HTTP

17. **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: createPartner(profileFormData, actorId)
    - *Kiểu gọi*: Synchronous

18. **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: INSERT INTO HOSODN (ma_nguoi_dung, ten_dn, ma_so_thue, dia_chi, trang_thai, ...) VALUES (?, ?, ?, ?, 'Cho duyet', ...)
    - *Kiểu gọi*: Synchronous DB Query

19. **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: INSERT INTO CHINHANH (ma_hs, ten_chi_nhanh, dia_chi, khu_vuc, trang_thai) VALUES (?, ?, ?, ?, 'Hoat dong')
    - *Kiểu gọi*: Synchronous DB Query

20. **[Business - Service] PartnerService --> [Presentation - Controller] PartnerController**: return createdPartnerProfile
    - *Kiểu gọi*: Return

21. **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerRegisterPage**: HTTP 201 Created ({ message: "Hồ sơ đối tác đã được tạo thành công! Trạng thái đang Chờ duyệt." })
    - *Kiểu gọi*: Return
    - *Mô tả*: Đăng ký hoàn tất, hiển thị Modal thông báo Chờ Admin phê duyệt.

---

## UC-PAR-02 — Cập nhật hồ sơ chi nhánh

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý đối tác)
- **[Presentation - UI]**: BranchManagementPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: BranchController
- **[Business - Service]**: BranchService
- **[Data Access - DB]**: SupabaseDB (`CHINHANH`, `YEUCAUCHINHANH`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] BranchManagementPage**: Mở form "Thêm chi nhánh mới" / "Cập nhật chi nhánh", nhập tên, địa chỉ, khu vực, sđt & Bấm "Gửi yêu cầu"
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]

2. **[Presentation - UI] BranchManagementPage -> [Presentation - API Client] partnerApi**: createBranchRequestApi({ ma_hs, ten_chi_nhanh, dia_chi, khu_vuc, sdt })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Presentation UI -> API Client]

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] BranchController**: POST /api/v1/branches/requests (body: { ma_hs, ten_chi_nhanh, ... })
   - *Kiểu gọi*: Synchronous HTTP
   - *Tầng tương tác*: [API Client -> Presentation Controller]

4. **[Presentation - Controller] BranchController -> [Business - Service] BranchService**: createBranchRequest(payload, actorId)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation Controller -> Business Service]

5. **[Business - Service] BranchService -> [Data Access - DB] SupabaseDB**: INSERT INTO YEUCAUCHINHANH (ma_hs, loai_yeu_cau, ten_chi_nhanh, dia_chi, khu_vuc, trang_thai) VALUES (?, 'THEM_MOI', ?, ?, ?, 'Cho duyet')
   - *Kiểu gọi*: Synchronous DB Query
   - *Tầng tương tác*: [Business Service -> Data Access]

6. **[Data Access - DB] SupabaseDB --> [Business - Service] BranchService**: return createdBranchRequest
   - *Kiểu gọi*: Return

7. **[Business - Service] BranchService --> [Presentation - Controller] BranchController**: return createdBranchRequest
   - *Kiểu gọi*: Return

8. **[Presentation - Controller] BranchController --> [Presentation - UI] BranchManagementPage**: HTTP 201 Created ({ message: "Yêu cầu thêm chi nhánh mới đã được gửi tới Quản trị viên!" })
   - *Kiểu gọi*: Return
   - *Mô tả*: Cập nhật giao diện danh sách chi nhánh kèm trạng thái "Chờ duyệt".

---

## UC-PAR-03 — Cập nhật thông tin pháp lý doanh nghiệp

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người đại diện Doanh nghiệp)
- **[Presentation - UI]**: PartnerProfilePage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: PartnerController
- **[Business - Service]**: PartnerService
- **[Data Access - DB]**: SupabaseDB (`HOSODN`, `YEUCAUCAPNHATHOSODN`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] PartnerProfilePage**: Nhập thay đổi (Tên DN, Địa chỉ, GPKD mới, Logo mới, Thông tin người đại diện) & Bấm "Gửi yêu cầu cập nhật"
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] PartnerProfilePage -> [Presentation - API Client] partnerApi**: createPartnerProfileRequestApi(partnerId, updatePayload)
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners/:id/profile-request (body: updatePayload)
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: createProfileRequest(payload, actorId)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: INSERT INTO YEUCAUCAPNHATHOSODN (ma_hs, noi_dung_thay_doi, trang_thai) VALUES (?, JSON.stringify(updatePayload), 'Cho duyet')
   - *Kiểu gọi*: Synchronous DB Query

6. **[Data Access - DB] SupabaseDB --> [Business - Service] PartnerService**: return createdProfileRequest

7. **[Business - Service] PartnerService --> [Presentation - Controller] PartnerController**: return createdProfileRequest

8. **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerProfilePage**: HTTP 201 Created ({ message: "Đã gửi Yêu cầu Cập nhật Hồ sơ Doanh nghiệp tới Quản trị viên!" })
   - *Mô tả*: Hiển thị banner "Yêu cầu cập nhật thông tin đang chờ Admin kiểm duyệt".

---

## UC-PAR-04 — Tạo voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý Voucher)
- **[Presentation - UI]**: VoucherFormPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`, `APDUNGCHINHANH`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherFormPage**: Nhập Tên Voucher, Danh mục, Giá gốc, Giá bán, Số lượng, Thời hạn, Chi nhánh áp dụng & Bấm "Lưu bản nháp"
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherFormPage -> [Presentation - API Client] partnerApi**: createVoucherApi({ ...voucherData, trang_thai: 'Nhap', trang_thai_kiem_duyet: 'Nhap' })
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: POST /api/v1/vouchers (body: voucherData)
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: createVoucher(payload, actorId, actorRole)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: INSERT INTO VOUCHER (ma_hs, ten_voucher, gia_goc, gia_ban, so_luong_phat_hanh, trang_thai, trang_thai_kiem_duyet, ...) VALUES (...)
   - *Kiểu gọi*: Synchronous DB Query

6. **LOOP [for each applicable branchId in ma_chi_nhanh]**:
   - **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: INSERT INTO APDUNGCHINHANH (ma_voucher, ma_chi_nhanh) VALUES (newVoucherId, branchId)

7. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return createdVoucher

8. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherFormPage**: HTTP 201 Created ({ data: createdVoucher, message: "Lưu bản nháp thành công!" })
   - *Mô tả*: Đã lưu voucher trạng thái Bản nháp.

---

## UC-PAR-05 — Gửi duyệt voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý Voucher)
- **[Presentation - UI]**: VoucherFormPage / VoucherListPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherFormPage**: Bấm nút "✓ Lưu & Gửi duyệt ngay" -> Xác nhận Modal gửi duyệt
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherFormPage -> [Presentation - API Client] partnerApi**: submitVoucherForReviewApi(voucherId)
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: POST /api/v1/vouchers/:id/submit-review
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: submitForReview(voucherId, actorId, actorRole)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: UPDATE VOUCHER SET trang_thai = 'Cho duyet', trang_thai_kiem_duyet = 'Cho duyet', ly_do_tu_choi = '' WHERE ma_voucher = ?
   - *Kiểu gọi*: Synchronous DB Query

6. **[Data Access - DB] SupabaseDB --> [Business - Service] VoucherService**: return updatedVoucher

7. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return updatedVoucher

8. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherFormPage**: HTTP 200 OK ({ message: "Gửi duyệt Voucher thành công!" })
   - *Mô tả*: Trạng thái Voucher chuyển sang "Chờ duyệt", hiển thị Toast thành công và chuyển hướng về danh sách.

---

## UC-PAR-06 — Tạm ngưng voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý Voucher)
- **[Presentation - UI]**: VoucherDetailPage / VoucherListPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherDetailPage**: Bấm nút "Tạm ngưng phát hành" & Xác nhận lý do
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherDetailPage -> [Presentation - API Client] partnerApi**: updateVoucherStatusApi(voucherId, 'Tam ngung')
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: PATCH /api/v1/vouchers/:id/status (body: { trang_thai: 'Tam ngung' })
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: updateVoucherStatus(voucherId, 'Tam ngung', actorId, actorRole)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: UPDATE VOUCHER SET trang_thai = 'Tam ngung' WHERE ma_voucher = ?
   - *Kiểu gọi*: Synchronous DB Query

6. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return updatedVoucher

7. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherDetailPage**: HTTP 200 OK ({ message: "Đã tạm ngưng phát hành Voucher thành công!" })
   - *Mô tả*: Voucher tạm thời không hiển thị mở bán trên Sàn cho khách hàng.

---

## UC-PAR-07 — Ngừng bán voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý Voucher)
- **[Presentation - UI]**: VoucherDetailPage / VoucherListPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherDetailPage**: Bấm nút "Ngừng bán vĩnh viễn" -> Xác nhận Modal
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherDetailPage -> [Presentation - API Client] partnerApi**: updateVoucherStatusApi(voucherId, 'Ngung ban')
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: PATCH /api/v1/vouchers/:id/status (body: { trang_thai: 'Ngung ban' })
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: updateVoucherStatus(voucherId, 'Ngung ban', actorId, actorRole)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: UPDATE VOUCHER SET trang_thai = 'Ngung ban' WHERE ma_voucher = ?
   - *Kiểu gọi*: Synchronous DB Query

6. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return updatedVoucher

7. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherDetailPage**: HTTP 200 OK ({ message: "Đã ngừng bán chương trình Voucher thành công!" })

---

## UC-PAR-08 — Mở bán lại voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý Voucher)
- **[Presentation - UI]**: VoucherDetailPage / VoucherListPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherDetailPage**: Bấm nút "Mở bán lại" (Đối với voucher đang "Tam ngung")
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherDetailPage -> [Presentation - API Client] partnerApi**: updateVoucherStatusApi(voucherId, 'Dang ban')
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: PATCH /api/v1/vouchers/:id/status (body: { trang_thai: 'Dang ban' })
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: updateVoucherStatus(voucherId, 'Dang ban', actorId, actorRole)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: UPDATE VOUCHER SET trang_thai = 'Dang ban' WHERE ma_voucher = ? AND trang_thai_kiem_duyet = 'Da duyet'
   - *Kiểu gọi*: Synchronous DB Query

6. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return updatedVoucher

7. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherDetailPage**: HTTP 200 OK ({ message: "Đã mở bán lại Voucher thành công trên Sàn!" })

---

## UC-PAR-09 — Xem danh sách voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý / Người đại diện)
- **[Presentation - UI]**: VoucherListPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService, TranslationService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`, `DANHMUC`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherListPage**: Truy cập trang "Quản lý Voucher" (lọc theo search, trang_thai, ma_dm)
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherListPage -> [Presentation - API Client] partnerApi**: getVouchersByPartnerApi(partnerId, queryParams)
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: GET /api/v1/vouchers/partner/:partnerId?search=...&trang_thai=...
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: getVouchersByPartner(partnerId, queryParams)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: SELECT v.*, dm.ten_danh_muc FROM VOUCHER v LEFT JOIN DANHMUC dm ON v.ma_dm = dm.ma_dm WHERE v.ma_hs = ?
   - *Kiểu gọi*: Synchronous DB Query

6. **[Data Access - DB] SupabaseDB --> [Business - Service] VoucherService**: return voucherList

7. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return voucherList

8. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherListPage**: HTTP 200 OK ({ data: voucherList })
   - *Mô tả*: Hiển thị danh sách card voucher kèm badge trạng thái (Đang bán, Chờ duyệt, Bản nháp, Tạm ngưng, Ngừng bán).

---

## UC-PAR-10 — Xem chi tiết voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý / Người đại diện)
- **[Presentation - UI]**: VoucherDetailPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`, `APDUNGCHINHANH`, `CHINHANH`, `DANHMUC`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherDetailPage**: Bấm chọn 1 Voucher trong danh sách để xem chi tiết
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherDetailPage -> [Presentation - API Client] partnerApi**: getVoucherByIdApi(voucherId)
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: GET /api/v1/vouchers/:id
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: getVoucherById(voucherId, lang)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: SELECT v.*, dm.ten_danh_muc, cn.* FROM VOUCHER v JOIN APDUNGCHINHANH acn ON v.ma_voucher = acn.ma_voucher JOIN CHINHANH cn ON acn.ma_chi_nhanh = cn.ma_chi_nhanh WHERE v.ma_voucher = ?
   - *Kiểu gọi*: Synchronous DB Query

6. **[Data Access - DB] SupabaseDB --> [Business - Service] VoucherService**: return voucherDetailRecord

7. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return voucherDetailRecord

8. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherDetailPage**: HTTP 200 OK ({ data: voucherDetailRecord })
   - *Mô tả*: Render toàn bộ thông tin Voucher, hình ảnh, thời hạn, danh sách chi nhánh áp dụng & lịch sử duyệt.

---

## UC-PAR-11 — Cập nhật voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý Voucher)
- **[Presentation - UI]**: VoucherFormPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`, `APDUNGCHINHANH`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherFormPage**: Điều chỉnh thông tin (Tên, mô tả, số lượng mở rộng, chi nhánh) & Bấm "Lưu thay đổi"
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherFormPage -> [Presentation - API Client] partnerApi**: updateVoucherApi(voucherId, updatePayload)
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: PUT /api/v1/vouchers/:id (body: updatePayload)
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: updateVoucher(voucherId, updatePayload, actorId, actorRole)
   - *Kiểu gọi*: Synchronous

5. **ALT [If Voucher status is 'Tam ngung']**:
   - **[Business - Service] VoucherService**: Kiểm tra `so_luong_phat_hanh` mới không được nhỏ hơn số lượng ban đầu.

6. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: UPDATE VOUCHER SET ten_voucher = ?, mo_ta = ?, so_luong_phat_hanh = ?, ... WHERE ma_voucher = ?
   - *Kiểu gọi*: Synchronous DB Query

7. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: DELETE FROM APDUNGCHINHANH WHERE ma_voucher = ?; INSERT INTO APDUNGCHINHANH ...
   - *Kiểu gọi*: Synchronous DB Query

8. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return updatedVoucher

9. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherFormPage**: HTTP 200 OK ({ message: "Đã cập nhật thông tin Voucher thành công!" })

---

## UC-PAR-12 — Xem kết quả duyệt voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người quản lý / Người đại diện)
- **[Presentation - UI]**: VoucherDetailPage / VoucherListPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] VoucherDetailPage**: Mở trang chi tiết Voucher bị từ chối phê duyệt
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] VoucherDetailPage -> [Presentation - API Client] partnerApi**: getVoucherByIdApi(voucherId)
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: GET /api/v1/vouchers/:id
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: getVoucherById(voucherId)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: SELECT trang_thai_kiem_duyet, ly_do_tu_choi FROM VOUCHER WHERE ma_voucher = ?
   - *Kiểu gọi*: Synchronous DB Query

6. **[Business - Service] VoucherService --> [Presentation - Controller] VoucherController**: return { trang_thai_kiem_duyet: 'Tu choi', ly_do_tu_choi: '...' }

7. **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherDetailPage**: HTTP 200 OK ({ data: voucherRecord })

8. **[Presentation - UI] VoucherDetailPage**: Hiển thị Banner cảnh báo màu đỏ: "Voucher bị từ chối phê duyệt: [Nội dung lý do Admin từ chối]" kèm nút "Chỉnh sửa & Gửi lại".

---

## UC-PAR-14 — Thêm tài khoản nhân viên

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người đại diện Doanh nghiệp)
- **[Presentation - UI]**: StaffManagementPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: PartnerController / StaffController
- **[Business - Service]**: PartnerService / StaffService
- **[Data Access - DB]**: SupabaseDB (`TAIKHOAN`, `NHANVIEN`, `CHINHANH`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] StaffManagementPage**: Nhập họ tên, email, sđt, vai trò (Bán hàng / Quản lý voucher) & chọn Chi nhánh -> Bấm "Thêm nhân viên"
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] StaffManagementPage -> [Presentation - API Client] partnerApi**: createStaffApi({ ho_ten, email, sdt, vai_tro, ma_chi_nhanh, ma_hs })
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners/staffs (body: staffPayload)
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: createStaff(staffPayload, actorId)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: INSERT INTO TAIKHOAN (email, mat_khau, ho_ten, sdt, vai_tro) VALUES (?, hashed_pw, ?, ?, role)
   - *Kiểu gọi*: Synchronous DB Query

6. **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: INSERT INTO NHANVIEN (ma_nguoi_dung, ma_hs, ma_chi_nhanh, trang_thai) VALUES (newUserId, partnerId, branchId, 'Hoat dong')
   - *Kiểu gọi*: Synchronous DB Query

7. **[Business - Service] PartnerService --> [Presentation - Controller] PartnerController**: return createdStaffRecord

8. **[Presentation - Controller] PartnerController --> [Presentation - UI] StaffManagementPage**: HTTP 201 Created ({ message: "Thêm nhân viên mới thành công." })
   - *Mô tả*: Danh sách nhân viên cập nhật thông tin nhân viên mới.

---

## UC-PAR-16 — Báo cáo đối tác

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Partner (Người đại diện / Người quản lý)
- **[Presentation - UI]**: PartnerReportsPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: PartnerReportController
- **[Business - Service]**: PartnerReportService
- **[Data Access - DB]**: SupabaseDB (`HOADON`, `CHITIETHOADON`, `VOUCHERSUDUNG`, `VOUCHER`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Partner -> [Presentation - UI] PartnerReportsPage**: Truy cập trang "Báo cáo doanh thu" (chọn mốc thời gian: 7 ngày, 30 ngày, quý, năm)
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] PartnerReportsPage -> [Presentation - API Client] partnerApi**: getPartnerRevenueReportApi(partnerId, { period })
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerReportController**: GET /api/v1/partner-reports/revenue?partnerId=...&period=...
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] PartnerReportController -> [Business - Service] PartnerReportService**: getRevenueReport(partnerId, period)
   - *Kiểu gọi*: Synchronous

5. **[Business - Service] PartnerReportService -> [Data Access - DB] SupabaseDB**: SELECT SUM(ct.thanh_tien) AS tong_doanh_thu, COUNT(ct.ma_cthd) AS tong_voucher_ban, SUM(vsd.so_luong) AS tong_da_doi FROM CHITIETHOADON ct JOIN VOUCHER v ON ct.ma_voucher = v.ma_voucher LEFT JOIN VOUCHERSUDUNG vsd ON v.ma_voucher = vsd.ma_voucher WHERE v.ma_hs = ?
   - *Kiểu gọi*: Synchronous DB Query

6. **[Data Access - DB] SupabaseDB --> [Business - Service] PartnerReportService**: return reportMetrics

7. **[Business - Service] PartnerReportService --> [Presentation - Controller] PartnerReportController**: return reportMetrics

8. **[Presentation - Controller] PartnerReportController --> [Presentation - UI] PartnerReportsPage**: HTTP 200 OK ({ data: reportMetrics })
   - *Mô tả*: Render biểu đồ doanh thu Recharts, tổng doanh số, tỷ lệ đổi voucher tại quầy & danh sách top bán chạy.

---

## UC-ADM-02 — Xử lý hồ sơ đối tác

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Admin (Quản trị viên hệ thống)
- **[Presentation - UI]**: PartnerDetailPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: PartnerController
- **[Business - Service]**: PartnerService, MailerService
- **[Data Access - DB]**: SupabaseDB (`HOSODN`, `YEUCAUCAPNHATHOSODN`, `TAIKHOAN`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Admin -> [Presentation - UI] PartnerDetailPage**: Xem thông tin GPKD, MST, người đại diện -> Bấm "Phê duyệt đối tác" HOẶC "Từ chối" (nhập lý do)
   - *Kiểu gọi*: Synchronous

2. **ALT [If Admin Approves Partner Profile]**:
   - **[Presentation - UI] PartnerDetailPage -> [Presentation - API Client] partnerApi**: approvePartnerApi(partnerId)
   - **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners/:id/approve
   - **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: approvePartner(partnerId, reason, adminId)
   - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: UPDATE HOSODN SET trang_thai = 'Dang hoat dong' WHERE ma_hs = ?
   - **[Business - Service] PartnerService -> [Business - Service] MailerService**: sendPartnerApprovalEmail(partnerEmail)
   - **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerDetailPage**: HTTP 200 OK ({ message: "Đã phê duyệt hồ sơ đối tác thành công!" })

3. **ALT [If Admin Rejects Partner Profile]**:
   - **[Presentation - UI] PartnerDetailPage -> [Presentation - API Client] partnerApi**: rejectPartnerApi(partnerId, reason)
   - **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners/:id/reject (body: { reason })
   - **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: rejectPartner(partnerId, reason, adminId)
   - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: UPDATE HOSODN SET trang_thai = 'Tu choi', ly_do_tu_choi = ? WHERE ma_hs = ?
   - **[Business - Service] PartnerService -> [Business - Service] MailerService**: sendPartnerRejectionEmail(partnerEmail, reason)
   - **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerDetailPage**: HTTP 200 OK ({ message: "Đã từ chối hồ sơ đối tác." })

---

## UC-ADM-03 — Khóa/mở đối tác

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Admin (Quản trị viên hệ thống)
- **[Presentation - UI]**: PartnerDetailPage / PartnerManagementPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: PartnerController
- **[Business - Service]**: PartnerService
- **[Data Access - DB]**: SupabaseDB (`HOSODN`, `TAIKHOAN`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Admin -> [Presentation - UI] PartnerDetailPage**: Bấm "Tạm khóa đối tác" HOẶC "Mở khóa đối tác" -> Nhập lý do khóa
   - *Kiểu gọi*: Synchronous

2. **[Presentation - UI] PartnerDetailPage -> [Presentation - API Client] partnerApi**: lockUnlockPartnerApi(partnerId, isLocking, reason)
   - *Kiểu gọi*: Asynchronous

3. **[Presentation - API Client] partnerApi -> [Presentation - Controller] PartnerController**: POST /api/v1/partners/:id/lock (body: { isLocking, reason })
   - *Kiểu gọi*: Synchronous HTTP

4. **[Presentation - Controller] PartnerController -> [Business - Service] PartnerService**: lockUnlockPartner(partnerId, isLocking, reason, adminId)
   - *Kiểu gọi*: Synchronous

5. **ALT [If isLocking is True]**:
   - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: UPDATE HOSODN SET trang_thai = 'Tam khoa', ly_do_tu_choi = ? WHERE ma_hs = ?
   - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: UPDATE TAIKHOAN SET trang_thai = 'Tam khoa' WHERE ma_nguoi_dung = (SELECT ma_nguoi_dung FROM HOSODN WHERE ma_hs = ?)
   - **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerDetailPage**: HTTP 200 OK ({ message: "Đã khóa tài khoản đối tác thành công!" })

6. **ALT [If isLocking is False (Unlock)]**:
   - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: UPDATE HOSODN SET trang_thai = 'Dang hoat dong' WHERE ma_hs = ?
   - **[Business - Service] PartnerService -> [Data Access - DB] SupabaseDB**: UPDATE TAIKHOAN SET trang_thai = 'Hoat dong' WHERE ma_nguoi_dung = (SELECT ma_nguoi_dung FROM HOSODN WHERE ma_hs = ?)
   - **[Presentation - Controller] PartnerController --> [Presentation - UI] PartnerDetailPage**: HTTP 200 OK ({ message: "Đã mở khóa tài khoản đối tác thành công!" })

---

## UC-ADM-04 — Quản lý chi nhánh đối tác

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Admin (Quản trị viên hệ thống)
- **[Presentation - UI]**: PartnerDetailPage (Tab Chi nhánh)
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: BranchController
- **[Business - Service]**: BranchService
- **[Data Access - DB]**: SupabaseDB (`YEUCAUCHINHANH`, `CHINHANH`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Admin -> [Presentation - UI] PartnerDetailPage**: Xem danh sách Yêu cầu thêm chi nhánh -> Bấm "Duyệt chi nhánh" HOẶC "Từ chối"
   - *Kiểu gọi*: Synchronous

2. **ALT [If Admin Approves Branch Request]**:
   - **[Presentation - UI] PartnerDetailPage -> [Presentation - API Client] partnerApi**: approveBranchRequestApi(requestId)
   - **[Presentation - API Client] partnerApi -> [Presentation - Controller] BranchController**: POST /api/v1/branches/requests/:id/approve
   - **[Presentation - Controller] BranchController -> [Business - Service] BranchService**: approveBranchRequest(requestId, adminId)
   - **[Business - Service] BranchService -> [Data Access - DB] SupabaseDB**: INSERT INTO CHINHANH (ma_hs, ten_chi_nhanh, dia_chi, khu_vuc, trang_thai) SELECT ma_hs, ten_chi_nhanh, dia_chi, khu_vuc, 'Hoat dong' FROM YEUCAUCHINHANH WHERE ma_yeu_cau = ?
   - **[Business - Service] BranchService -> [Data Access - DB] SupabaseDB**: UPDATE YEUCAUCHINHANH SET trang_thai = 'Da duyet' WHERE ma_yeu_cau = ?
   - **[Presentation - Controller] BranchController --> [Presentation - UI] PartnerDetailPage**: HTTP 200 OK ({ message: "Đã duyệt yêu cầu chi nhánh thành công!" })

3. **ALT [If Admin Rejects Branch Request]**:
   - **[Presentation - UI] PartnerDetailPage -> [Presentation - API Client] partnerApi**: rejectBranchRequestApi(requestId, reason)
   - **[Presentation - API Client] partnerApi -> [Presentation - Controller] BranchController**: POST /api/v1/branches/requests/:id/reject (body: { reason })
   - **[Presentation - Controller] BranchController -> [Business - Service] BranchService**: rejectBranchRequest(requestId, reason, adminId)
   - **[Business - Service] BranchService -> [Data Access - DB] SupabaseDB**: UPDATE YEUCAUCHINHANH SET trang_thai = 'Tu choi', ghi_chu_admin = ? WHERE ma_yeu_cau = ?
   - **[Presentation - Controller] BranchController --> [Presentation - UI] PartnerDetailPage**: HTTP 200 OK ({ message: "Đã từ chối yêu cầu chi nhánh." })

---

## UC-ADM-05 — Admin duyệt voucher

### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor]**: Admin (Quản trị viên hệ thống)
- **[Presentation - UI]**: VoucherApprovalDetailPage / VoucherApprovalListPage
- **[Presentation - API Client]**: partnerApi
- **[Presentation - Controller]**: VoucherController
- **[Business - Service]**: VoucherService, MailerService
- **[Data Access - DB]**: SupabaseDB (`VOUCHER`)

### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

1. **[Actor] Admin -> [Presentation - UI] VoucherApprovalDetailPage**: Kiểm tra thông tin Voucher, chiết khấu, hình ảnh, thời hạn & chi nhánh -> Bấm "Phê duyệt" HOẶC "Từ chối"
   - *Kiểu gọi*: Synchronous

2. **ALT [If Admin Approves Voucher]**:
   - **[Presentation - UI] VoucherApprovalDetailPage -> [Presentation - API Client] partnerApi**: approveVoucherApi(voucherId, { isHidden: false })
   - **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: POST /api/v1/vouchers/:id/approve
   - **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: approveVoucher(voucherId, isHidden, reason, adminId)
   - **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: UPDATE VOUCHER SET trang_thai = 'Dang ban', trang_thai_kiem_duyet = 'Da duyet', ly_do_tu_choi = '' WHERE ma_voucher = ?
   - **[Business - Service] VoucherService -> [Business - Service] MailerService**: sendVoucherApprovedEmail(partnerEmail, voucherTitle)
   - **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherApprovalDetailPage**: HTTP 200 OK ({ message: "Voucher đã được phê duyệt thành công!" })

3. **ALT [If Admin Rejects Voucher]**:
   - **[Presentation - UI] VoucherApprovalDetailPage -> [Presentation - API Client] partnerApi**: rejectVoucherApi(voucherId, reason)
   - **[Presentation - API Client] partnerApi -> [Presentation - Controller] VoucherController**: POST /api/v1/vouchers/:id/reject (body: { reason })
   - **[Presentation - Controller] VoucherController -> [Business - Service] VoucherService**: rejectVoucher(voucherId, reason, adminId)
   - **[Business - Service] VoucherService -> [Data Access - DB] SupabaseDB**: UPDATE VOUCHER SET trang_thai = 'Tu choi', trang_thai_kiem_duyet = 'Tu choi', ly_do_tu_choi = ? WHERE ma_voucher = ?
   - **[Business - Service] VoucherService -> [Business - Service] MailerService**: sendVoucherRejectedEmail(partnerEmail, voucherTitle, reason)
   - **[Presentation - Controller] VoucherController --> [Presentation - UI] VoucherApprovalDetailPage**: HTTP 200 OK ({ message: "Đã từ chối voucher. Lý do đã được ghi nhận và gửi cho đối tác." })

---
*Bản đặc tả Sequence Diagram chi tiết tuân thủ quy tắc 3 tầng (Presentation, Business, Data Access) đã hoàn thành cho 18 use cases yêu cầu.*
