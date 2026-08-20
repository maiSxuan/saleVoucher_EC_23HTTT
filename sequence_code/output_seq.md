# Detailed Interaction Flow cho Sequence Diagram
## Hệ thống Quản lý và Phê duyệt Voucher / Đối tác (SaleVoucher EC)

Tài liệu này tổng hợp luồng tương tác chi tiết (Detailed Interaction Flow) cho 11 Use Cases theo đúng thực trạng mã nguồn hiện tại của dự án, tuân thủ nguyên tắc phân tầng 3 lớp (**Presentation Layer -> Business Layer -> Data Access Layer**) theo chuẩn [`rules_seq_dia.md`](file:///Users/nguyenkimngan/Downloads/saleVoucher_EC_23HTTT/rules_seq_dia.md).

---

# I. TỔNG QUAN PHÂN TẦNG VÀ DANH SÁCH LIFELINES CHUNG

### 1. Presentation Layer (Giao diện & API Controllers)
- **[Actor] Partner / Partner Manager**: Đối tác / Nhân viên quản lý Voucher thực hiện thao tác.
- **[Actor] Admin**: Quản trị viên hệ thống phê duyệt / quản lý.
- **[Presentation] VoucherFormPage**: Giao diện tạo và cập nhật Voucher.
- **[Presentation] VoucherDetailPage**: Giao diện xem chi tiết Voucher và thay đổi trạng thái bán.
- **[Presentation] VoucherListPage**: Giao diện danh sách Voucher phía Đối tác.
- **[Presentation] VoucherApprovalListPage**: Giao diện danh sách duyệt Voucher phía Admin.
- **[Presentation] VoucherApprovalDetailPage**: Giao diện phê duyệt/từ chối Voucher chi tiết phía Admin.
- **[Presentation] PartnerManagementPage**: Giao diện quản lý đối tác phía Admin.
- **[Presentation] PartnerDetailPage**: Giao diện xem/duyệt/từ chối/khóa đối tác phía Admin.
- **[Presentation/API] VoucherController**: Controller xử lý REST API Voucher (`/api/vouchers`).
- **[Presentation/API] PartnerController**: Controller xử lý REST API Partner (`/api/partners`, `/api/admin/partners`).

### 2. Business Layer (Logic Nghiệp vụ & Control)
- **[Business] VoucherService**: Service điều hướng logic tạo, cập nhật, đổi trạng thái và thẩm định Voucher.
- **[Business] PartnerService**: Service điều hướng logic duyệt, từ chối, khóa/mở khóa hồ sơ Đối tác.
- **[Business] BranchService**: Service quản lý liên kết chi nhánh áp dụng.
- **[Business] AuditLogService**: Service ghi nhật ký hệ thống (`log_ht`) với cơ chế `resolveActorId` định danh chính xác Partner/Manager/Admin.
- **[Business] uploadBase64ToSupabase**: Utility chuyển đổi ảnh Base64 và upload lên Supabase Storage bucket.

### 3. Data Access Layer / External Systems (Lưu trữ & Truy vấn)
- **[Data] VoucherRepository**: Repository tương tác bảng `voucher` & bảng trung gian `voucher_cn` trong Supabase DB.
- **[Data] VoucherBranchRepository**: Repository xử lý liên kết `voucher_cn`.
- **[Data] PartnerRepository**: Repository tương tác bảng `hosodn` & `taikhoan`.
- **[Data] BranchRepository**: Repository tương tác bảng `chinhanh`.
- **[Data] AuditLogRepository**: Repository ghi dữ liệu vào bảng `log_ht`.
- **[External] Supabase Postgres DB**: Hệ quản trị cơ sở dữ liệu PostgreSQL.
- **[External] Supabase Storage**: Dịch vụ lưu trữ file/hình ảnh công khai (Bucket `partner-documents`).

---

# II. CHI TIẾT LUỒNG TƯƠNG TÁC THEO TỪNG USE CASE

---

## 1. UC-PAR-04 — Tạo voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherFormPage**
- **[Presentation/API] VoucherController.create**
- **[Business] VoucherService.createVoucher**
- **[Business] uploadBase64ToSupabase**
- **[Data] VoucherRepository.create**
- **[Data] VoucherBranchRepository.setBranchesForVoucher**
- **[Business] AuditLogService.log**
- **[External] Supabase Storage**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherFormPage**: executeSave("draft" | "submit")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
   - *Mô tả*: Người dùng điền các thông tin voucher (`ten_voucher`, `gia_goc`, `gia_ban`, `so_luong_phat_hanh`, `ma_chi_nhanh`, `hinh_anh_url`...).
2. **[2] [Presentation] VoucherFormPage -> [Presentation/API] VoucherController.create**: saveVoucherApi(voucherData) -> POST /api/vouchers
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
   - *Mô tả*: Frontend đính kèm JWT Token và Header `x-actor-id`, `x-actor-role` gửi tới API create.
3. **[3] [Presentation/API] VoucherController.create -> [Business] VoucherService.createVoucher**: createVoucher(payload, actorId, actorRole)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
   - *Mô tả*: Controller trích xuất actorInfo và gọi Service tạo Voucher.
4. **[4] [Business] VoucherService.createVoucher -> [Business] uploadBase64ToSupabase**: uploadBase64ToSupabase(payload.hinh_anh_url, "vouchers")
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> Business]
   - *Mô tả*: Nếu `hinh_anh_url` dạng Base64 data URL, tiến hành upload lên Supabase Storage.
5. **[5] [Business] uploadBase64ToSupabase -> [External] Supabase Storage**: upload(filePath, fileBuffer, { contentType })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> External]
   - *Mô tả*: Đẩy ảnh lên Storage bucket `partner-documents` và nhận về `publicUrl`.
6. **[6] [External] Supabase Storage --> [Business] uploadBase64ToSupabase**: return publicUrl
   - *Kiểu gọi*: Return
   - *Tầng tương tác*: [External -> Business]
7. **[7] [Business] VoucherService.createVoucher -> [Data] VoucherRepository.create**: create(dbPayload)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
   - *Mô tả*: Tính toán `gia_tri_giam = Math.max(0, gia_goc - gia_ban)` và chuẩn bị Payload lưu DB.
8. **[8] [Data] VoucherRepository.create -> [External] Supabase DB**: supabase.from("voucher").insert(dbPayload).select().single()
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
   - *Mô tả*: Thêm dòng dữ liệu mới vào bảng `voucher`.
9. **[9] [External] Supabase DB --> [Data] VoucherRepository.create**: return createdVoucherRow
   - *Kiểu gọi*: Return
   - *Tầng tương tác*: [External -> Data]
10. **[10] [Data] VoucherRepository.create -> [External] Supabase DB**: supabase.from("voucher_cn").insert(branchLinks)
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Data -> External]
    - *Mô tả*: Lưu danh sách các chi nhánh liên kết vào bảng trung gian `voucher_cn`.
11. **[11] [Data] VoucherRepository.create --> [Business] VoucherService.createVoucher**: return VoucherModel
    - *Kiểu gọi*: Return
    - *Tầng tương tác*: [Data -> Business]
12. **[12] [Business] VoucherService.createVoucher -> [Business] AuditLogService.log**: log({ actorId, actorRole, action, targetType: "VOUCHER", targetId: ma_voucher, result: "Thanh cong" })
    - *Kiểu gọi*: Asynchronous
    - *Tầng tương tác*: [Business -> Business]
    - *Mô tả*: Ghi nhật ký thao tác `CREATE_VOUCHER_DRAFT` hoặc `SUBMIT_VOUCHER_REVIEW`.
13. **[13] [Business] AuditLogService.log -> [External] Supabase DB**: insert into log_ht
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Business -> External]
14. **[14] [Business] VoucherService.createVoucher --> [Presentation/API] VoucherController.create**: return voucherData
    - *Kiểu gọi*: Return
    - *Tầng tương tác*: [Business -> Presentation/API]
15. **[15] [Presentation/API] VoucherController.create --> [Presentation] VoucherFormPage**: res.status(201).json({ success: true, data })
    - *Kiểu gọi*: Return
    - *Tầng tương tác*: [Presentation/API -> Presentation]

#### C. CÁC KHỐI ĐIỀU KIỆN / VÒNG LẶP
- **OPT [if payload.hinh_anh_url.startsWith("data:")]**:
  - Thực hiện uploadBase64ToSupabase() để đổi lấy HTTP URL công khai trước khi lưu.
- **ALT [if payload.trang_thai === "Cho duyet"]**:
  - Ghi AuditLog action = `"SUBMIT_VOUCHER_REVIEW"`, `trang_thai_kiem_duyet` = `"Cho duyet"`.
  - **ELSE**: Ghi AuditLog action = `"CREATE_VOUCHER_DRAFT"`, `trang_thai_kiem_duyet` = `"Nhap"`.

---

## 2. UC-PAR-05 — Gửi duyệt voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherDetailPage**
- **[Presentation/API] VoucherController.submit**
- **[Business] VoucherService.submitForReview**
- **[Data] VoucherRepository.updateStatus**
- **[Business] AuditLogService.log**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherDetailPage**: handleStatusChange("Cho duyet")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherDetailPage -> [Presentation/API] VoucherController.submit**: POST /api/vouchers/:id/submit
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.submit -> [Business] VoucherService.submitForReview**: submitForReview(id, actorId, actorRole)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.submitForReview -> [Data] VoucherRepository.updateStatus**: updateStatus(id, "Cho duyet", "Cho duyet")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.updateStatus -> [External] Supabase DB**: supabase.from("voucher").update({ trang_thai: "Cho duyet", trang_thai_kiem_duyet: "Cho duyet", ly_do_tu_choi: "" }).eq("ma_voucher", id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [External] Supabase DB --> [Data] VoucherRepository.updateStatus**: return updatedRow
   - *Kiểu gọi*: Return
   - *Tầng tương tác*: [External -> Data]
7. **[7] [Business] VoucherService.submitForReview -> [Business] AuditLogService.log**: log({ actorId, actorRole, action: "SUBMIT_VOUCHER_REVIEW", targetId: id, result: "Thanh cong" })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> Business]
8. **[8] [Business] VoucherService.submitForReview --> [Presentation/API] VoucherController.submit**: return updatedVoucher
   - *Kiểu gọi*: Return
   - *Tầng tương tác*: [Business -> Presentation/API]
9. **[9] [Presentation/API] VoucherController.submit --> [Presentation] VoucherDetailPage**: res.json({ success: true, data })
   - *Kiểu gọi*: Return
   - *Tầng tương tác*: [Presentation/API -> Presentation]

#### C. CÁC KHỐI ĐIỀU KIỆN / VÒNG LẶP
- **ALT [if update success]**: Trạng thái kiểm duyệt chuyển thành `Cho duyet`, lý do từ chối trước đó (nếu có) được xóa sạch.

---

## 3. UC-PAR-06 — Tạm ngưng voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherDetailPage**
- **[Presentation/API] VoucherController.updateStatus**
- **[Business] VoucherService.updateVoucherStatus**
- **[Data] VoucherRepository.updateStatus**
- **[Business] AuditLogService.log**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherDetailPage**: handleStatusChange("Tam ngung")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherDetailPage -> [Presentation/API] VoucherController.updateStatus**: PATCH /api/vouchers/:id/status { status: "Tam ngung" }
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.updateStatus -> [Business] VoucherService.updateVoucherStatus**: updateVoucherStatus(id, "Tam ngung", actorId, actorRole)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.updateVoucherStatus -> [Data] VoucherRepository.updateStatus**: updateStatus(id, "Tam ngung", "Da duyet")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.updateStatus -> [External] Supabase DB**: supabase.from("voucher").update({ trang_thai: "Tam ngung" }).eq("ma_voucher", id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [Business] VoucherService.updateVoucherStatus -> [Business] AuditLogService.log**: log({ actorId, actorRole, action: "PAUSE_VOUCHER", targetId: id, result: "Thanh cong" })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> Business]
7. **[7] [Business] VoucherService.updateVoucherStatus --> [Presentation/API] VoucherController.updateStatus**: return result
   - *Kiểu gọi*: Return
8. **[8] [Presentation/API] VoucherController.updateStatus --> [Presentation] VoucherDetailPage**: res.json({ success: true, data })
   - *Kiểu gọi*: Return

---

## 4. UC-PAR-07 — Ngừng bán voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherDetailPage**
- **[Presentation/API] VoucherController.updateStatus**
- **[Business] VoucherService.updateVoucherStatus**
- **[Data] VoucherRepository.updateStatus**
- **[Business] AuditLogService.log**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherDetailPage**: handleStatusChange("Ngung ban")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherDetailPage -> [Presentation/API] VoucherController.updateStatus**: PATCH /api/vouchers/:id/status { status: "Ngung ban" }
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.updateStatus -> [Business] VoucherService.updateVoucherStatus**: updateVoucherStatus(id, "Ngung ban", actorId, actorRole)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.updateVoucherStatus -> [Data] VoucherRepository.updateStatus**: updateStatus(id, "Ngung ban", "Da duyet")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.updateStatus -> [External] Supabase DB**: supabase.from("voucher").update({ trang_thai: "Ngung ban" }).eq("ma_voucher", id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [Business] VoucherService.updateVoucherStatus -> [Business] AuditLogService.log**: log({ actorId, actorRole, action: "CLOSE_VOUCHER", targetId: id, result: "Thanh cong" })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> Business]
7. **[7] [Business] VoucherService.updateVoucherStatus --> [Presentation/API] VoucherController.updateStatus**: return result
   - *Kiểu gọi*: Return
8. **[8] [Presentation/API] VoucherController.updateStatus --> [Presentation] VoucherDetailPage**: res.json({ success: true, data })
   - *Kiểu gọi*: Return

---

## 5. UC-PAR-08 — Mở bán lại voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherDetailPage**
- **[Presentation/API] VoucherController.updateStatus**
- **[Business] VoucherService.updateVoucherStatus**
- **[Data] VoucherRepository.updateStatus**
- **[Business] AuditLogService.log**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherDetailPage**: handleStatusChange("Dang ban")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherDetailPage -> [Presentation/API] VoucherController.updateStatus**: PATCH /api/vouchers/:id/status { status: "Dang ban" }
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.updateStatus -> [Business] VoucherService.updateVoucherStatus**: updateVoucherStatus(id, "Dang ban", actorId, actorRole)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.updateVoucherStatus -> [Data] VoucherRepository.updateStatus**: updateStatus(id, "Dang ban", "Da duyet")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.updateStatus -> [External] Supabase DB**: supabase.from("voucher").update({ trang_thai: "Dang ban" }).eq("ma_voucher", id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [Business] VoucherService.updateVoucherStatus -> [Business] AuditLogService.log**: log({ actorId, actorRole, action: "RESUME_VOUCHER", targetId: id, result: "Thanh cong" })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> Business]
7. **[7] [Business] VoucherService.updateVoucherStatus --> [Presentation/API] VoucherController.updateStatus**: return result
   - *Kiểu gọi*: Return
8. **[8] [Presentation/API] VoucherController.updateStatus --> [Presentation] VoucherDetailPage**: res.json({ success: true, data })
   - *Kiểu gọi*: Return

---

## 6. UC-PAR-09 — Xem danh sách voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherListPage**
- **[Presentation/API] VoucherController.listByPartner**
- **[Business] VoucherService.getVouchersByPartner**
- **[Data] VoucherRepository.findByPartnerId**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherListPage**: loadVouchers()
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherListPage -> [Presentation/API] VoucherController.listByPartner**: GET /api/vouchers/partner/:partnerId
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.listByPartner -> [Business] VoucherService.getVouchersByPartner**: getVouchersByPartner(partnerId, query)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.getVouchersByPartner -> [Data] VoucherRepository.findByPartnerId**: findByPartnerId(partnerId, query)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.findByPartnerId -> [External] Supabase DB**: Truy vấn bảng `chinhanh` thuộc `ma_hs` và danh sách `ma_voucher` thuộc `voucher_cn`.
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [External] Supabase DB --> [Data] VoucherRepository.findByPartnerId**: return rawVoucherRows
   - *Kiểu gọi*: Return
7. **[7] [Data] VoucherRepository.findByPartnerId -> [Data] VoucherRepository.makeVoucherModel**: Map `gia_ban = gia_goc - gia_tri_giam` và chuẩn hóa danh sách chi nhánh.
   - *Kiểu gọi*: Synchronous (Self-call)
   - *Tầng tương tác*: [Data -> Data]
8. **[8] [Data] VoucherRepository.findByPartnerId --> [Business] VoucherService.getVouchersByPartner**: return voucherModels
   - *Kiểu gọi*: Return
9. **[9] [Business] VoucherService.getVouchersByPartner --> [Presentation/API] VoucherController.listByPartner**: return listData
   - *Kiểu gọi*: Return
10. **[10] [Presentation/API] VoucherController.listByPartner --> [Presentation] VoucherListPage**: res.json({ success: true, data })
    - *Kiểu gọi*: Return

---

## 7. UC-PAR-10 — Xem chi tiết voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherDetailPage**
- **[Presentation/API] VoucherController.getById**
- **[Business] VoucherService.getVoucherById**
- **[Data] VoucherRepository.findById**
- **[Data] AuditLogRepository.getLatestRejectionReason**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherDetailPage**: loadData()
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherDetailPage -> [Presentation/API] VoucherController.getById**: GET /api/vouchers/:id
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.getById -> [Business] VoucherService.getVoucherById**: getVoucherById(id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.getVoucherById -> [Data] VoucherRepository.findById**: findById(id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.findById -> [External] Supabase DB**: select("*, danh_muc(ten_danh_muc)") from voucher where ma_voucher = id
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [External] Supabase DB --> [Data] VoucherRepository.findById**: return voucherRow
   - *Kiểu gọi*: Return
7. **[7] [Data] VoucherRepository.findById -> [External] Supabase DB**: select ma_chi_nhanh from voucher_cn where ma_voucher = id
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
8. **[8] OPT [if trang_thai === "Tu choi"]**:
   - **[Data] VoucherRepository.findById -> [Data] AuditLogRepository.getLatestRejectionReason**: getLatestRejectionReason("VOUCHER", id)
   - *Tầng tương tác*: [Data -> Data]
   - *Mô tả*: Lấy lý do từ chối phê duyệt từ nhật ký hệ thống `log_ht`.
9. **[9] [Data] VoucherRepository.findById --> [Business] VoucherService.getVoucherById**: return VoucherModel
   - *Kiểu gọi*: Return
10. **[10] [Business] VoucherService.getVoucherById --> [Presentation/API] VoucherController.getById**: return voucherDetail
    - *Kiểu gọi*: Return
11. **[11] [Presentation/API] VoucherController.getById --> [Presentation] VoucherDetailPage**: res.json({ success: true, data })
    - *Kiểu gọi*: Return

---

## 8. UC-PAR-11 — Cập nhật voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherFormPage**
- **[Presentation/API] VoucherController.update**
- **[Business] VoucherService.updateVoucher**
- **[Business] uploadBase64ToSupabase**
- **[Data] VoucherRepository.update**
- **[Data] VoucherBranchRepository.setBranchesForVoucher**
- **[Business] AuditLogService.log**
- **[External] Supabase Storage**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherFormPage**: executeSave("update")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherFormPage -> [Presentation/API] VoucherController.update**: saveVoucherApi(payload) -> PUT /api/vouchers/:id
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.update -> [Business] VoucherService.updateVoucher**: updateVoucher(id, payload, actorId, actorRole)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] OPT [if payload.hinh_anh_url startsWith("data:")]**:
   - **[Business] VoucherService.updateVoucher -> [Business] uploadBase64ToSupabase**: uploadBase64ToSupabase(payload.hinh_anh_url, "vouchers")
   - **[Business] uploadBase64ToSupabase -> [External] Supabase Storage**: upload(filePath, buffer)
   - **[External] Supabase Storage --> [Business] uploadBase64ToSupabase**: return newPublicUrl
5. **[5] [Business] VoucherService.updateVoucher -> [Data] VoucherRepository.update**: update(id, dbPayload)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
   - *Mô tả*: Cập nhật thông tin voucher và tự động tính `gia_tri_giam = Math.max(0, gia_goc - gia_ban)`.
6. **[6] [Data] VoucherRepository.update -> [External] Supabase DB**: supabase.from("voucher").update(dbPayload).eq("ma_voucher", id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
7. **[7] OPT [if payload.ma_chi_nhanh exists]**:
   - **[Business] VoucherService.updateVoucher -> [Data] VoucherBranchRepository.setBranchesForVoucher**: setBranchesForVoucher(id, payload.ma_chi_nhanh)
   - **[Data] VoucherBranchRepository.setBranchesForVoucher -> [External] Supabase DB**: delete & insert new mapping rows into `voucher_cn`.
8. **[8] [Business] VoucherService.updateVoucher -> [Business] AuditLogService.log**: log({ actorId, actorRole, action: "UPDATE_VOUCHER", targetId: id, result: "Thanh cong" })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> Business]
9. **[9] [Business] VoucherService.updateVoucher --> [Presentation/API] VoucherController.update**: return updatedVoucher
   - *Kiểu gọi*: Return
10. **[10] [Presentation/API] VoucherController.update --> [Presentation] VoucherFormPage**: res.json({ success: true, data })
    - *Kiểu gọi*: Return

---

## 9. UC-PAR-12 — Xem kết quả duyệt voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Partner / Partner Manager**
- **[Presentation] VoucherDetailPage**
- **[Presentation/API] VoucherController.getById**
- **[Business] VoucherService.getVoucherById**
- **[Data] VoucherRepository.findById**
- **[Data] AuditLogRepository.getLatestRejectionReason**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)
1. **[1] Partner -> [Presentation] VoucherDetailPage**: renderReviewStatusBanner()
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherDetailPage -> [Presentation/API] VoucherController.getById**: GET /api/vouchers/:id
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.getById -> [Business] VoucherService.getVoucherById**: getVoucherById(id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.getVoucherById -> [Data] VoucherRepository.findById**: findById(id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.findById -> [External] Supabase DB**: select * from voucher where ma_voucher = id
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] ALT [if trang_thai === "Tu choi" || trang_thai_kiem_duyet === "Tu choi"]**:
   - **[Data] VoucherRepository.findById -> [Data] AuditLogRepository.getLatestRejectionReason**: getLatestRejectionReason("VOUCHER", id)
   - **[Data] AuditLogRepository.getLatestRejectionReason -> [External] Supabase DB**: select ly_do_thuc_hien from log_ht where hanh_dong = 'REJECT_VOUCHER' and ma_doi_tuong = id order by tg_tao desc limit 1
   - **[External] Supabase DB --> [Data] AuditLogRepository.getLatestRejectionReason**: return rejectionReasonString
7. **[7] [Data] VoucherRepository.findById --> [Business] VoucherService.getVoucherById**: return VoucherModel (chứa `trang_thai_kiem_duyet` & `ly_do_tu_choi`)
   - *Kiểu gọi*: Return
8. **[8] [Business] VoucherService.getVoucherById --> [Presentation/API] VoucherController.getById**: return data
   - *Kiểu gọi*: Return
9. **[9] [Presentation/API] VoucherController.getById --> [Presentation] VoucherDetailPage**: res.json({ success: true, data })
   - *Kiểu gọi*: Return
   - *Mô tả*: UI render Banner tương ứng: Badge Emerald "Đã duyệt", Badge Rose "Bị từ chối" (kèm lý do), hoặc Badge Amber "Chờ duyệt".

---

## 10. UC-ADM-02 — Admin quản lý và duyệt đối tác

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Admin**
- **[Presentation] PartnerManagementPage / PartnerDetailPage**
- **[Presentation/API] PartnerController.approve / reject / lock**
- **[Business] PartnerService.approvePartner / rejectPartner / lockUnlockPartner**
- **[Data] PartnerRepository.updateStatus**
- **[Data] BranchRepository.findByPartnerId / update**
- **[Business] AuditLogService.log**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

##### Phê duyệt Đối tác (Approve Partner):
1. **[1] Admin -> [Presentation] PartnerDetailPage**: clickApprove(partnerId)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] PartnerDetailPage -> [Presentation/API] PartnerController.approve**: POST /api/admin/partners/:id/approve
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] PartnerController.approve -> [Business] PartnerService.approvePartner**: approvePartner(id, reason, actorId)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] PartnerService.approvePartner -> [Data] PartnerRepository.updateStatus**: updateStatus(id, "Dang hoat dong")
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] PartnerRepository.updateStatus -> [External] Supabase DB**: supabase.from("hosodn").update({ trang_thai: "Dang hoat dong" }).eq("ma_hs", id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [Business] PartnerService.approvePartner -> [Data] BranchRepository.findByPartnerId**: findByPartnerId(id)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
7. **[7] LOOP [for each branch of partner]**:
   - **[Business] PartnerService.approvePartner -> [Data] BranchRepository.update**: update(branch.ma_chi_nhanh, { trang_thai: "Dang hoat dong" })
   - **[Data] BranchRepository.update -> [External] Supabase DB**: update chinhanh set trang_thai = "Dang hoat dong"
8. **[8] [Business] PartnerService.approvePartner -> [Business] AuditLogService.log**: log({ actorId, actorRole: "ADMIN", action: "APPROVE_PARTNER", targetId: id, result: "Thanh cong" })
   - *Kiểu gọi*: Asynchronous
   - *Tầng tương tác*: [Business -> Business]
9. **[9] [Business] PartnerService.approvePartner --> [Presentation/API] PartnerController.approve**: return result
   - *Kiểu gọi*: Return
10. **[10] [Presentation/API] PartnerController.approve --> [Presentation] PartnerDetailPage**: res.json({ success: true, data })
    - *Kiểu gọi*: Return

##### Từ chối / Khóa Đối tác (Reject / Lock Partner):
- **ALT [if Admin rejects partner]**:
  - `PartnerController.reject` -> `PartnerService.rejectPartner` -> `PartnerRepository.updateStatus(id, "Tu choi", reason)` -> AuditLog `REJECT_PARTNER`.
- **ALT [if Admin locks/unlocks partner]**:
  - `PartnerController.lock` -> `PartnerService.lockUnlockPartner` -> `PartnerRepository.updateStatus(id, isLocking ? "Tam khoa" : "Dang hoat dong", reason)` -> AuditLog `LOCK_PARTNER` / `UNLOCK_PARTNER`.

---

## 11. UC-ADM-03 — Admin duyệt voucher

#### A. DANH SÁCH ĐỐI TƯỢNG (LIFELINES)
- **[Actor] Admin**
- **[Presentation] VoucherApprovalListPage / VoucherApprovalDetailPage**
- **[Presentation/API] VoucherController.approve / reject**
- **[Business] VoucherService.approveVoucher / rejectVoucher**
- **[Data] VoucherRepository.updateStatus**
- **[Business] AuditLogService.log**
- **[External] Supabase DB**

#### B. CHI TIẾT TỪNG BƯỚC CỦA LUỒNG (STEP-BY-STEP FLOW)

##### 1. Xem danh sách Voucher chờ duyệt (Admin Voucher List):
1. **[1] Admin -> [Presentation] VoucherApprovalListPage**: openApprovalList()
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
2. **[2] [Presentation] VoucherApprovalListPage -> [Presentation/API] VoucherController.list**: GET /api/vouchers
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
3. **[3] [Presentation/API] VoucherController.list -> [Business] VoucherService.getVouchers**: getVouchers(query)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
4. **[4] [Business] VoucherService.getVouchers -> [Data] VoucherRepository.findAll**: findAll(query)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Business -> Data]
5. **[5] [Data] VoucherRepository.findAll -> [External] Supabase DB**: select * from voucher
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Data -> External]
6. **[6] [Presentation] VoucherApprovalListPage -> [Presentation] VoucherApprovalListPage**: filteredVouchers (Ẩn `v.trang_thai === "Nhap"`, phân loại `trang_thai_kiem_duyet`)
   - *Kiểu gọi*: Synchronous (Internal Filter)

##### 2. Phê duyệt Voucher (Approve Voucher):
7. **[7] Admin -> [Presentation] VoucherApprovalDetailPage**: clickApprove(voucherId, isHidden)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Actor -> Presentation]
8. **[8] [Presentation] VoucherApprovalDetailPage -> [Presentation/API] VoucherController.approve**: POST /api/vouchers/:id/approve { isHidden }
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation -> Presentation/API]
9. **[9] [Presentation/API] VoucherController.approve -> [Business] VoucherService.approveVoucher**: approveVoucher(id, isHidden, reason, actorId, actorRole)
   - *Kiểu gọi*: Synchronous
   - *Tầng tương tác*: [Presentation/API -> Business]
10. **[10] [Business] VoucherService.approveVoucher -> [Data] VoucherRepository.updateStatus**: updateStatus(id, isHidden ? "Tam ngung" : "Dang ban", "Da duyet")
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Business -> Data]
11. **[11] [Data] VoucherRepository.updateStatus -> [External] Supabase DB**: supabase.from("voucher").update({ trang_thai: isHidden ? "Tam ngung" : "Dang ban", trang_thai_kiem_duyet: "Da duyet", ly_do_tu_choi: "" }).eq("ma_voucher", id)
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Data -> External]
12. **[12] [Business] VoucherService.approveVoucher -> [Business] AuditLogService.log**: log({ actorId, actorRole: "ADMIN", action: "APPROVE_VOUCHER", targetId: id, result: "Thanh cong" })
    - *Kiểu gọi*: Asynchronous
    - *Tầng tương tác*: [Business -> Business]
13. **[13] [Business] VoucherService.approveVoucher --> [Presentation/API] VoucherController.approve**: return result
    - *Kiểu gọi*: Return
14. **[14] [Presentation/API] VoucherController.approve --> [Presentation] VoucherApprovalDetailPage**: res.json({ success: true, data })
    - *Kiểu gọi*: Return

##### 3. Từ chối Voucher (Reject Voucher):
15. **[15] Admin -> [Presentation] VoucherApprovalDetailPage**: clickReject(voucherId, reason)
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Actor -> Presentation]
16. **[16] [Presentation] VoucherApprovalDetailPage -> [Presentation/API] VoucherController.reject**: POST /api/vouchers/:id/reject { reason }
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Presentation -> Presentation/API]
17. **[17] [Presentation/API] VoucherController.reject -> [Business] VoucherService.rejectVoucher**: rejectVoucher(id, reason, actorId, actorRole)
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Presentation/API -> Business]
18. **[18] [Business] VoucherService.rejectVoucher -> [Data] VoucherRepository.updateStatus**: updateStatus(id, "Tu choi", "Tu choi", reason)
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Business -> Data]
19. **[19] [Data] VoucherRepository.updateStatus -> [External] Supabase DB**: supabase.from("voucher").update({ trang_thai: "Tu choi", trang_thai_kiem_duyet: "Tu choi", ly_do_tu_choi: reason }).eq("ma_voucher", id)
    - *Kiểu gọi*: Synchronous
    - *Tầng tương tác*: [Data -> External]
20. **[20] [Business] VoucherService.rejectVoucher -> [Business] AuditLogService.log**: log({ actorId, actorRole: "ADMIN", action: "REJECT_VOUCHER", targetId: id, reason, result: "Thanh cong" })
    - *Kiểu gọi*: Asynchronous
    - *Tầng tương tác*: [Business -> Business]
21. **[21] [Business] VoucherService.rejectVoucher --> [Presentation/API] VoucherController.reject**: return result
    - *Kiểu gọi*: Return
22. **[22] [Presentation/API] VoucherController.reject --> [Presentation] VoucherApprovalDetailPage**: res.json({ success: true, data })
    - *Kiểu gọi*: Return

#### C. CÁC KHỐI ĐIỀU KIỆN / VÒNG LẶP
- **ALT [if isHidden === true]**:
  - Voucher chuyển sang `trang_thai_kiem_duyet` = `"Da duyet"`, nhưng `trang_thai` công bố = `"Tam ngung"`.
- **ALT [if isHidden === false]**:
  - Voucher chuyển sang `trang_thai_kiem_duyet` = `"Da duyet"`, và `trang_thai` công bố = `"Dang ban"`.
- **ALT [if reject voucher]**:
  - Voucher chuyển sang `trang_thai` & `trang_thai_kiem_duyet` = `"Tu choi"`, đồng thời lưu `ly_do_tu_choi` vào DB & AuditLog.

---

# III. KẾT LUẬN
Bản mô tả luồng tương tác trên đây hoàn toàn chuẩn hóa theo đúng **mã nguồn thực tế hiện tại**, phân định rành mạch 3 tầng kiến trúc, ghi nhận chính xác tên hàm, tham số, kiểu tương tác (Sync/Async/Return) và các khối logic (Alt/Opt/Loop) phục vụ trực tiếp cho việc vẽ sơ đồ Sequence Diagram UML.
