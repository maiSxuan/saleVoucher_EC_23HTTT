# skills.md — Quy tắc phát triển EC Voucher Marketplace

> Tài liệu bắt buộc dành cho mọi thành viên và coding agent trong repository.  
> Trước khi phân tích, tạo migration, viết backend hoặc frontend, phải đọc `skills.md`, `plan.md` và đặc tả use case được giao.

---

## 1. Nhận diện đúng dự án

Dự án là **hệ thống thương mại điện tử bán voucher giảm giá trực tuyến**, gồm bốn nhóm nghiệp vụ:

- **Khách hàng**: đăng ký, đăng nhập, tìm kiếm, mua, nhận, sử dụng và đánh giá voucher.
- **Đối tác/nhân viên đối tác**: đăng ký doanh nghiệp, quản lý chi nhánh, tạo voucher, theo dõi kiểm duyệt, kiểm tra và xác nhận sử dụng voucher.
- **Quản trị viên**: quản lý người dùng, đối tác, voucher, đơn hàng, nội dung, dashboard và nhật ký.
- **Hệ thống**: thanh toán mô phỏng, phát hành voucher code duy nhất, ghi nhận sử dụng và tổng hợp báo cáo.

Luồng nghiệp vụ tổng quát bắt buộc:

```text
Đối tác đăng ký
→ Admin duyệt đối tác
→ Đối tác tạo voucher
→ Đối tác gửi duyệt
→ Admin duyệt voucher
→ Voucher được phép bán
→ Khách hàng tìm kiếm và mua
→ Thanh toán mô phỏng
→ Hệ thống phát hành voucher code
→ Nhân viên đối tác kiểm tra voucher code
→ Nhân viên đối tác xác nhận sử dụng
→ Hệ thống ghi nhận báo cáo và nhật ký
```

Không biến dự án thành POS, hệ thống giao hàng, loyalty, affiliate, chatbot, mobile native hoặc hệ thống bán sản phẩm vật lý.

---

## 2. Nguồn yêu cầu và thứ tự ưu tiên

Khi thực hiện task, đối chiếu theo thứ tự:

1. `FIT_HCMUS_EC_Project_Assigment_2026_v1.0.pdf`
2. `đặc tả hệ thống của admin.pdf`
3. `đặc tả hệ thống cho đối tác(2).pdf`
4. `đặc tả hệ thống cho khách hàng (2).pdf`
5. `EC-23HTTT-Relational model.drawio (1).png`
6. `EC_AGENTS_ADMIN_PARTNER_CUSTOMER(1).md`
7. `plan.md`

Khi tài liệu mâu thuẫn hoặc chưa đủ:

1. Chỉ rõ file và BR/UC liên quan.
2. Nêu chính xác điểm mâu thuẫn hoặc thiếu dữ liệu.
3. Dừng phần code chịu ảnh hưởng.
4. Đề xuất tối đa hai phương án.
5. Chờ owner hoặc nhóm chốt bằng ADR/ghi chú trong `plan.md`.

Không tự sinh trạng thái, cột, bảng, endpoint hoặc quy trình.

---

## 3. Kiến trúc bắt buộc

Dự án dùng **modular monolith**:

- Một backend.
- Một frontend.
- Một cơ sở dữ liệu quan hệ.
- Code chia theo **khối nghiệp vụ**.
- Mỗi khối có đủ ba lớp.

### 3.1. Ba lớp backend

```text
Presentation Layer
    Route + Controller + Validator + DTO

Business Logic Layer
    Service

Data Access Layer
    Model + Repository

Database
    Supabase/PostgreSQL
```

Luồng bắt buộc:

```text
Frontend
→ Route
→ Middleware
→ Controller
→ Service
→ Repository
→ Database
→ Repository
→ Service
→ Controller
→ Response
→ Frontend
```

### 3.2. Không dùng cấu trúc phẳng cho toàn dự án

Không tổ chức toàn bộ code thành:

```text
controllers/
services/
repositories/
```

vì bốn người sẽ sửa chung các thư mục và khó xác định ownership.

Phải chia **module trước, ba lớp sau**:

```text
modules/
└── <module-name>/
    ├── business/
    ├── data/
    └── presentation/
```

---

## 4. Cấu trúc repository hiện tại

```text
EC-VOUCHER/
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   │
│   │   ├── config/
│   │   │   ├── supabase.js
│   │   │   └── environment.js
│   │   │
│   │   ├── common/
│   │   │   ├── middlewares/
│   │   │   │   ├── authenticate.middleware.js
│   │   │   │   ├── authorize.middleware.js
│   │   │   │   └── error.middleware.js
│   │   │   ├── constants/
│   │   │   ├── errors/
│   │   │   └── utils/
│   │   │
│   │   ├── routes/
│   │   │   └── index.js
│   │   │
│   │   └── modules/
│   │       ├── core-access/
│   │       ├── partner-voucher/
│   │       ├── customer-commerce/
│   │       └── content-feedback/
│   │
│   ├── tests/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── app/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── shared/
│   │   └── features/
│   │       ├── core-access/
│   │       ├── partner-voucher/
│   │       ├── customer-commerce/
│   │       └── content-feedback/
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── README.md
│
├── docs/
│   ├── api/
│   ├── adr/
│   ├── test-cases/
│   └── screenshots/
│
├── skills.md
├── plan.md
└── README.md
```

Không tạo thêm một cấu trúc song song như `backend/src/controllers/` hoặc `backend/src/services/` ở cấp toàn dự án.

---

## 5. Cấu trúc chuẩn của một backend module

Mỗi module phải theo mẫu **đúng với cấu trúc hiện tại**:

```text
backend/src/modules/<module-name>/
│
├── business/
│   └── services/
│
├── data/
│   ├── models/
│   └── repositories/
│
├── presentation/
│   ├── routes/
│   ├── controllers/
│   ├── validators/
│   └── dtos/
│
├── index.js
└── README.md
```

Ví dụ:

```text
backend/src/modules/content-feedback/
│
├── business/
│   └── services/
│       ├── content.service.js
│       ├── review.service.js
│       └── complaint.service.js
│
├── data/
│   ├── models/
│   │   ├── content.model.js
│   │   ├── review.model.js
│   │   └── complaint.model.js
│   └── repositories/
│       ├── content.repository.js
│       ├── review.repository.js
│       └── complaint.repository.js
│
├── presentation/
│   ├── routes/
│   │   ├── content.routes.js
│   │   ├── review.routes.js
│   │   └── complaint.routes.js
│   ├── controllers/
│   │   ├── content.controller.js
│   │   ├── review.controller.js
│   │   └── complaint.controller.js
│   ├── validators/
│   └── dtos/
│
├── index.js
└── README.md
```

### Vai trò của từng thư mục

#### `business/services/`

Chứa business logic, transaction, state transition, permission, ownership, audit log orchestration.

#### `data/models/`

Chứa model/schema mapping, định nghĩa entity, mapper, constants liên quan dữ liệu của module.

#### `data/repositories/`

Chứa truy vấn dữ liệu với database/Supabase.  
Repository chỉ đọc/ghi dữ liệu, không chứa business rule.

#### `presentation/`

Chứa route, controller, validator, dto và logic tiếp nhận/trả response HTTP.

### `index.js` của module

`index.js` chỉ export:

- Router của module để `backend/src/routes/index.js` đăng ký.
- Service contract cần cho module khác.

Không export repository cho module khác.

```javascript
export { contentFeedbackRouter } from "./presentation/routes/index.js";
export { reviewEligibilityService } from "./business/services/review-eligibility.service.js";
```

---

## 6. Cấu trúc chuẩn của frontend feature

Frontend chia theo cùng tên module backend:

```text
frontend/src/features/<feature-name>/
│
├── pages/
├── components/
├── services/
├── hooks/
├── schemas/
└── index.js
```

Ví dụ:

```text
frontend/src/features/partner-voucher/
│
├── pages/
│   ├── partner/
│   └── admin/
├── components/
├── services/
│   ├── partnerApi.js
│   ├── voucherApi.js
│   └── partnerReportApi.js
├── hooks/
├── schemas/
└── index.js
```

Một feature có thể chứa page của nhiều actor nếu cùng một khối nghiệp vụ.

---

## 7. Ownership theo module

### 7.1. X — `core-access`

Backend:

```text
backend/src/modules/core-access/
```

Frontend:

```text
frontend/src/features/core-access/
```

Phạm vi:

- Auth/session/token dùng chung.
- RBAC middleware và account administration.
- BR-ADM-01.
- BR-CUS-07.
- BR-PAR-05.
- BR-PAR-06.
- BR-ADM-06.
- BR-ADM-07.
- Audit log dùng chung.
- Vòng đời voucher code phát hành.

### 7.2. N — `partner-voucher`

Backend:

```text
backend/src/modules/partner-voucher/
```

Frontend:

```text
frontend/src/features/partner-voucher/
```

Phạm vi:

- BR-PAR-01 đến BR-PAR-04.
- BR-PAR-07.
- BR-ADM-02.
- BR-ADM-03.
- Partner, branch, voucher catalog, approval và báo cáo đối tác.

### 7.3. My — `customer-commerce`

Backend:

```text
backend/src/modules/customer-commerce/
```

Frontend:

```text
frontend/src/features/customer-commerce/
```

Phạm vi:

- BR-CUS-01 đến BR-CUS-06.
- BR-ADM-04.
- Customer profile, catalog query, cart, order, payment và refund mô phỏng.

### 7.4. Q — `content-feedback`

Backend:

```text
backend/src/modules/content-feedback/
```

Frontend:

```text
frontend/src/features/content-feedback/
```

Phạm vi:

- BR-ADM-05.
- BR-CUS-08.
- Content, review, complaint.
- Seed/test data và tài liệu của chính module.

---

## 8. Quy tắc từng lớp

### 8.1. Route

Được làm:

- Khai báo HTTP method và URL.
- Gắn validator, authentication và authorization middleware.
- Gọi controller.

Không được:

- Query Supabase.
- Tính tiền.
- Chuyển trạng thái.
- Ghi log nghiệp vụ.

### 8.2. Controller

Được làm:

- Đọc `params`, `query`, `body`.
- Lấy actor từ `req.user`.
- Gọi service.
- Chọn HTTP status và trả response.
- Chuyển lỗi sang error middleware.

Không được:

- Gọi repository trực tiếp.
- Chứa business rule.
- Tự quản lý transaction.
- Tin `userId`, `partnerId`, `branchId` từ client khi có thể lấy từ token.

### 8.3. Service

Phải chứa:

- Business rule.
- Validation nghiệp vụ.
- Quyền, ownership và tenant scope.
- State transition.
- Transaction.
- Idempotency.
- Điều phối nhiều repository.
- Audit log hoặc usage log.

### 8.4. Model

Dùng để chuẩn hóa cấu trúc dữ liệu của module:

- Entity fields.
- Mapping logic.
- Data constants.
- Helper transform gần dữ liệu.

Không chứa business flow.

### 8.5. Repository

Chỉ:

- `SELECT`, `INSERT`, `UPDATE`, soft delete hoặc query tổng hợp.
- Nhận tham số từ service.
- Giới hạn query theo actor/tenant khi service truyền scope.
- Trả dữ liệu database.

Không:

- Biết HTTP.
- Tự quyết định quyền.
- Tự suy đoán trạng thái nghiệp vụ.
- Gọi service.

### 8.6. Frontend

Phải:

- Gọi API qua `features/<feature>/services/`.
- Không gọi Supabase trực tiếp.
- Có loading, empty, error, forbidden, success.
- Disable nút khi request đang xử lý.
- Hiển thị đúng trạng thái do backend trả.
- Không tự tính giá/tổng tiền làm nguồn dữ liệu cuối cùng.
- Không đặt business rule chỉ ở client.

---

## 9. Luồng phát triển một use case

Mỗi use case phải làm theo thứ tự:

```text
Requirement
→ Data design
→ Migration
→ Model
→ Repository
→ Service
→ Controller
→ Route
→ Backend test
→ Frontend API service
→ Page/Component
→ End-to-end test
→ Update plan.md
```

### Bước 1 — Requirement

Ghi rõ:

```text
BR/UC:
Actor:
Trigger:
Tiền điều kiện:
Hậu điều kiện:
Luồng chính:
Luồng thay thế ưu tiên:
Luồng ngoại lệ ưu tiên:
Business Rule:
Bảng đọc/ghi:
API:
Màn hình:
Điểm chưa rõ:
```

Không tìm được BR/UC thì không code.

### Bước 2 — Data và migration

Xác định:

- Bảng đọc.
- Bảng ghi.
- Khóa chính/khóa ngoại.
- Unique/check constraint.
- Trạng thái trước/sau.
- Transaction.
- Audit/usage log.
- Response DTO.

Mọi thay đổi schema phải qua:

```text
database/migrations/
```

Không sửa trực tiếp Supabase rồi bỏ qua migration.

### Bước 3 — Model và Repository

Tạo trong:

```text
backend/src/modules/<module>/data/models/
backend/src/modules/<module>/data/repositories/
```

Tên gợi ý:

```text
user.model.js
user.repository.js
voucher.model.js
voucher.repository.js
order.model.js
order.repository.js
```

### Bước 4 — Service

Tạo trong:

```text
backend/src/modules/<module>/business/services/
```

Service là nơi bảo vệ business rule, transaction và ownership.

### Bước 5 — Controller và Route

Controller:

```text
backend/src/modules/<module>/presentation/controllers/
```

Route:

```text
backend/src/modules/<module>/presentation/routes/
```

Sau đó export router qua module `index.js` và đăng ký tại:

```text
backend/src/routes/index.js
```

### Bước 6 — Test backend

Khóa API contract:

```text
Method:
URL:
Authentication:
Authorization:
Params:
Query:
Body:
Success status:
Success response:
Error statuses:
Business Rule:
Idempotency:
```

Test tối thiểu:

1. Thành công.
2. Input sai.
3. Chưa đăng nhập.
4. Sai role/ownership.
5. Không tìm thấy.
6. Vi phạm business rule.
7. Retry/double-click nếu thao tác không được lặp.

### Bước 7 — Frontend

Tạo trong:

```text
frontend/src/features/<feature>/
```

Thứ tự:

1. API service.
2. Schema/form validation phía UI.
3. Page.
4. Component.
5. Loading/error/empty/forbidden.
6. Kết nối route/layout.
7. Test E2E.

### Bước 8 — End-to-end và cập nhật kế hoạch

Chỉ đánh dấu hoàn thành khi:

```text
UI
→ API
→ Controller
→ Service
→ Repository
→ Database
→ Response
→ UI
```

chạy được bằng dữ liệu thật trong database demo.

---

## 10. Giao tiếp liên module

Module không được gọi repository của module khác.

### Sai

```javascript
// Q gọi trực tiếp orderRepository của My
orderRepository.findPaidOrder(customerId, voucherId);
```

### Đúng

```javascript
// My export business contract
purchaseEligibilityService.check({
  currentUserId,
  voucherId
});
```

```javascript
// Q gọi service contract
const eligibility = await purchaseEligibilityService.check({
  currentUserId,
  voucherId
});
```

Các contract bắt buộc:

### N → My: voucher công khai

- Danh sách voucher được bán.
- Chi tiết voucher.
- Giá, thời gian, tồn kho, chi nhánh, chính sách.

### My → X: đơn đủ điều kiện phát hành mã

- Chỉ order thanh toán thành công.
- Trả order item và số lượng cần phát hành.
- Retry không làm sinh mã trùng.

### N → X: phạm vi voucher/đối tác/chi nhánh

- Kiểm tra voucher code có thuộc đúng partner/branch.
- X không query trực tiếp repository của N.

### My → Q: quyền đánh giá

- Kiểm tra current customer đã mua/đã sử dụng voucher.
- Q không query bảng đơn hàng.

Thay đổi contract phải được hai module review.

---

## 11. Quy tắc chống tự sinh tính năng

Không tự thêm:

- Thanh toán thật.
- Email/SMS thật.
- QR camera thật.
- AI/ML/recommendation/chatbot.
- Mobile native.
- ERP/CRM.
- Shipping, loyalty, affiliate, live chat.
- Xuất Excel/PDF nếu use case không yêu cầu.
- Xóa tài khoản khi đặc tả chỉ khóa/mở khóa.
- Dropdown chung đổi mọi trạng thái.
- Trạng thái, bảng, cột hoặc API không có căn cứ.

Được mô phỏng:

- Thanh toán.
- OTP.
- Email/SMS bằng thông báo nội bộ.
- QR bằng ảnh hoặc nhập code.
- Dữ liệu demo.

---

## 12. Business Rule bắt buộc

Các rule phải được bảo vệ tại Service/backend:

1. `RB-01`: Voucher chỉ được bán khi Admin đã duyệt.
2. `RB-02`: Giá bán nhỏ hơn giá gốc.
3. `RB-03`: Có thời gian bán và sử dụng rõ ràng.
4. `RB-04`: Không bán khi hết số lượng hoặc hết thời gian.
5. `RB-05`: Chỉ phát hành code sau thanh toán thành công.
6. `RB-06`: Code duy nhất và khó đoán.
7. `RB-07`: Code đã dùng không được dùng lại.
8. `RB-08`: Code hết hạn, hủy hoặc khóa không được sử dụng.
9. `RB-09`: Đối tác chỉ xác thực trong phạm vi hợp lệ.
10. `RB-10`: Chỉ khách đã mua/đã sử dụng mới được đánh giá.
11. `RB-11`: Không bán vượt số lượng phát hành.
12. `RB-12`: Thao tác quản trị quan trọng phải ghi log.
13. `RB-13`: Đơn đã hủy không phát hành code.
14. `RB-14`: Hủy/hoàn tiền theo chính sách.
15. `RB-15`: Kiểm tra tồn kho khi đặt mua và thanh toán.

Frontend có thể hỗ trợ chặn sớm, nhưng backend luôn kiểm tra lại.

---

## 13. Trạng thái không được gộp

### Tài khoản/đối tác

Tách:

- Account status.
- Partner approval status.
- Partner operation status.
- Branch operation status.

### Voucher sản phẩm

Tách:

- Review status.
- Publication/sale status.
- Availability tính từ thời gian, tồn kho và chi nhánh.

### Đơn hàng

Tách:

- Order status.
- Payment/refund status.
- Issuance status.
- Voucher-code usage status.

Không coi:

- `Đã thanh toán` = `Đã phát hành mã`.
- `Đã hủy` = `Đã hoàn tiền`.
- `Đã duyệt` = `Đang bán`.

---

## 14. Database và ownership

Baseline:

- X: `NGUOI_DUNG`, `TAI_KHOAN`, `LOG`, `VOUCHER_MUA`, `LS_SINH_MA`.
- N: `HO_SO_DN`, `CHI_NHANH`, `VOUCHER`, `VOUCHER_CN`, `DANH_MUC`.
- My: `GIO_HANG`, `CHI_TIET_GIO_HANG`, `DON_HANG`, `CHI_TIET_DON_HANG`, `THANH_TOAN`, `HOAN_TIEN`.
- Q: `NOI_DUNG`, `DANH_GIA`, `KHIEU_NAI`.

Quy tắc:

- Không sửa migration thuộc module khác khi chưa có owner review.
- Voucher code phải có unique constraint.
- Email/SĐT phải chống trùng theo schema chốt.
- Giá mua phải lưu snapshot trong chi tiết đơn.
- Không xóa audit/history để làm đẹp dữ liệu.
- Migration phải chạy được từ database sạch.

---

## 15. Transaction, idempotency và log

Bắt buộc xử lý an toàn:

- Cập nhật role + log.
- Khóa/mở khóa + log.
- Duyệt/từ chối partner hoặc voucher + log.
- Tạo order + kiểm tra/trừ tồn.
- Payment success + phát hành code.
- Redeem + usage log.
- Hủy/hoàn tiền/cấp lại code + dữ liệu liên quan.

Nếu log là bắt buộc và ghi log thất bại:

- Không báo thành công.
- Không để dữ liệu cập nhật một phần.

Chống gửi lặp:

- Issue code.
- Redeem.
- Approve/reject.
- Lock/unlock.
- Cancel/refund.
- Reissue code.

Reload hoặc double-click không được tạo kết quả nghiệp vụ lần hai.

---

## 16. Bảo mật

- Backend kiểm tra role và ownership.
- Customer chỉ xem dữ liệu của mình.
- Partner chỉ xem dữ liệu doanh nghiệp mình.
- Branch staff chỉ redeem đúng chi nhánh.
- Không tin ID actor từ body.
- Password phải hash.
- Token/secret để trong `.env`.
- Voucher code không lộ trước thanh toán.
- Frontend ẩn nút không thay thế backend authorization.
- Query tenant-sensitive phải giới hạn theo actor hiện tại.

---

## 17. Quy tắc dành cho thành viên mới/yếu

Khi giao task, phải nêu:

```text
BR/UC:
Module:
Tên file tạo/sửa:
Tên hàm:
Input:
Output:
Business Rule:
API contract:
Test cases:
Definition of Done:
File mẫu để sao chép:
```

Mỗi task tối đa 0.5–1 ngày.

Không giao:

```text
"Làm quản lý nội dung"
```

Phải tách:

```text
1. content.model.js
2. content.repository.js
3. content.service.js
4. content.controller.js
5. content.routes.js
6. contentApi.js
7. ContentListPage.jsx
8. ContentForm.jsx
9. Test các trạng thái
```

Nếu bị blocker, chuyển sang task trong chính module:

- Test.
- Seed.
- Loading/error/empty.
- Documentation.
- Regression checklist.

Không tự sửa module khác để “chạy cho được”.

---

## 18. Definition of Done

Một use case chỉ hoàn thành khi:

- [ ] Truy vết được BR/UC.
- [ ] Đúng module owner.
- [ ] Migration/schema đã xác định.
- [ ] Có model.
- [ ] Có repository.
- [ ] Service chứa business rule/quyền/transaction cần thiết.
- [ ] Controller không chứa business logic.
- [ ] Route có middleware đúng.
- [ ] Backend test độc lập đạt.
- [ ] API contract được khóa.
- [ ] Frontend gọi API thật.
- [ ] Có loading, empty, error, forbidden, success.
- [ ] Test quyền/ownership/tenant.
- [ ] Test retry/double-click khi cần.
- [ ] Audit/usage log đúng.
- [ ] E2E chạy được.
- [ ] Seed liên quan có sẵn.
- [ ] Build/lint/test hiện có đạt hoặc ghi rõ lỗi.
- [ ] `plan.md` được cập nhật.
- [ ] PR đã review và merge.

---

## 19. Hành vi bị cấm

- Tạo cấu trúc phẳng song song với module-first.
- Gọi Supabase từ component.
- Gọi repository từ route/controller.
- Gọi repository của module khác.
- Viết business rule trong frontend/controller.
- Sửa schema trực tiếp không migration.
- Hard-code secret hoặc actor ID.
- Báo thành công khi dữ liệu/log chưa lưu.
- Sinh code lần hai khi reload.
- Redeem voucher đã dùng.
- Bán vượt tồn kho.
- Refactor toàn dự án cho một task nhỏ.
- Đổi API contract không thông báo bên sử dụng.
- Tự thêm feature không có BR/UC.

---

## 20. Mẫu báo cáo sau mỗi task

```markdown
## Requirement
- BR/UC:
- Actor:
- Module owner:

## Data
- Bảng đọc:
- Bảng ghi:
- Migration:
- Trạng thái trước/sau:

## Backend
- Model:
- Repository:
- Service:
- Controller:
- Route:
- API contract:

## Frontend
- API service:
- Page:
- Component:
- UI states:

## Business Rule và quyền
- ...

## Test
- Backend:
- End-to-end:
- Lệnh/kịch bản:
- Kết quả:

## File thay đổi
- ...

## Chưa hoàn tất / blocker
- ...

## Cập nhật plan.md
- [ ] / [x] ...
```

---

## 21. Phản hồi khởi đầu chuẩn của coding agent

```text
Tôi sẽ xử lý theo luồng:
Requirement → Data → Migration → Model → Repository → Service → Controller → Route
→ Backend Test → Frontend API Service → Page/Component
→ End-to-End Test → Update plan.md.

BR/UC:
Module:
Owner:
File dự kiến sửa:
Contract liên module:
Điểm cần xác nhận:
```

Chỉ bắt đầu code sau khi requirement, module owner, dữ liệu và contract đã rõ.
