# plan.md — Kế hoạch 14 ngày phát triển EC Voucher Marketplace

> Kế hoạch tổ chức theo **bốn khối nghiệp vụ hoàn chỉnh**.  
> Mỗi người sở hữu một backend module và một frontend feature, tự làm xuyên suốt:
>
> `Database → Model → Repository → Service → Controller/Route → Frontend → Test`.

---
LƯU Ý: tất cả phải được lấy từ data thật, từ supabase

## 1. Mục tiêu 14 ngày

Hoàn thiện MVP chạy được luồng:

```text
Đối tác đăng ký
→ Admin duyệt đối tác
→ Đối tác tạo và gửi duyệt voucher
→ Admin duyệt voucher
→ Khách hàng tìm kiếm và thêm giỏ
→ Tạo đơn và thanh toán mô phỏng
→ Phát hành voucher code/QR
→ Nhân viên đối tác kiểm tra và xác nhận sử dụng
→ Khách hàng đánh giá/phản hồi
→ Admin/Đối tác xem dashboard, báo cáo và nhật ký
```

Mục tiêu nghiệm thu:

- Đủ vai trò Customer, Partner/Branch Staff, Admin.
- Trạng thái partner, voucher, order, payment và voucher code nhất quán.
- Code chỉ sinh sau payment success, duy nhất và không dùng lại.
- Không bán vượt tồn kho.
- Kiểm soát tenant/ownership.
- Có dashboard/báo cáo tối thiểu.
- Có migration, seed, test evidence, README và dữ liệu demo.

---

## 2. Cấu trúc source được khóa

### Backend

```text
backend/src/
├── server.js
├── app.js
├── config/
├── common/
├── routes/
│   └── index.js
└── modules/
    ├── core-access/          # X
    ├── partner-voucher/      # N
    ├── customer-commerce/    # My
    └── content-feedback/     # Q
```

Mỗi module:

```text
<module>/
├── business/
│   └── services/
├── data/
│   ├── models/
│   └── repositories/
├── presentation/
│   ├── routes/
│   ├── controllers/
│   ├── validators/
│   └── dtos/
├── index.js
└── README.md
```

### Frontend

```text
frontend/src/
├── main.jsx
├── App.jsx
├── app/
├── layouts/
├── routes/
├── shared/
└── features/
    ├── core-access/          # X
    ├── partner-voucher/      # N
    ├── customer-commerce/    # My
    └── content-feedback/     # Q
```

Mỗi feature:

```text
<feature>/
├── pages/
├── components/
├── services/
├── hooks/
├── schemas/
└── index.js
```

### Database

```text
database/
├── migrations/
├── seeds/
└── README.md
```

Không tạo source phẳng song song như `backend/src/controllers/` hoặc `frontend/src/pages/`.

---

## 3. Phân công theo khối hoàn chỉnh

## 3.1. X — Core Access, Voucher Code và Audit

Source owner:

```text
backend/src/modules/core-access/
frontend/src/features/core-access/
```

Use case:

- BR-ADM-01 — Quản lý người dùng.
- BR-CUS-07 — Nhận voucher đã mua.
- BR-PAR-05 — Kiểm tra voucher code.
- BR-PAR-06 — Xác nhận sử dụng voucher.
- BR-ADM-06 — Dashboard quản trị.
- BR-ADM-07 — Nhật ký hệ thống.

Trách nhiệm dùng chung:

- `authenticate.middleware.js`.
- `authorize.middleware.js`.
- Auth/session/token.
- API response/error chuẩn.
- Audit log contract.
- Issue/redeem idempotency.

Bảng owner:

- `NGUOI_DUNG`
- `TAI_KHOAN`
- `VOUCHER_MUA`
- `LS_SINH_MA`
- `LOG`

Không tự sửa:

- Voucher catalog/state của N.
- Order/payment state của My.
- Content/review của Q.

---

## 3.2. N — Partner, Branch, Voucher Catalog và Approval

Source owner:

```text
backend/src/modules/partner-voucher/
frontend/src/features/partner-voucher/
```

Use case:

- BR-PAR-01 đến BR-PAR-04.
- BR-PAR-07.
- BR-ADM-02.
- BR-ADM-03.

Bảng owner:

- `HO_SO_DN`
- `CHI_NHANH`
- `VOUCHER`
- `VOUCHER_CN`
- `DANH_MUC`

Phạm vi:

- Partner onboarding.
- Branch/legal information.
- Voucher draft/create/submit/manage.
- Admin partner approval.
- Admin voucher approval.
- Partner report.

Không tự sửa:

- Order/payment của My.
- Voucher code state của X.
- Review/complaint của Q.

---

## 3.3. My — Customer Commerce, Cart, Order và Payment

Source owner:

```text
backend/src/modules/customer-commerce/
frontend/src/features/customer-commerce/
```

Use case:

- BR-CUS-01 đến BR-CUS-06.
- BR-ADM-04.

Bảng owner:

- `GIO_HANG`
- `CHI_TIET_GIO_HANG`
- `DON_HANG`
- `CHI_TIET_DON_HANG`
- `THANH_TOAN`
- `HOAN_TIEN`

Phạm vi:

- Customer register/profile/password.
- Public voucher query qua contract của N.
- Cart.
- Checkout.
- Order/payment/refund mô phỏng.
- Admin order management.

Không:

- Tự sinh voucher code.
- Tự query repository của N.
- Tự ghi review của Q.

---

## 3.4. Q — Content, Review và Complaint

Source owner:

```text
backend/src/modules/content-feedback/
frontend/src/features/content-feedback/
```

Use case:

- BR-ADM-05.
- BR-CUS-08.

Bảng owner:

- `NOI_DUNG`
- `DANH_GIA`
- `KHIEU_NAI`

Phạm vi:

- Admin quản lý banner/article/popup/policy.
- Trạng thái hiển thị nội dung.
- Customer review.
- Customer complaint/feedback.
- Hiển thị review.
- Seed/test/documentation trong module.

Q không được sửa:

- `DON_HANG`, `THANH_TOAN`, `VOUCHER_MUA`.
- Tồn kho.
- Voucher code.
- Middleware quyền dùng chung.

Q phải dùng module mẫu do X tạo, không tự thiết kế cấu trúc khác.

---

## 4. Contract liên module phải khóa trước ngày 3

## 4.1. N → My: Public voucher contract

Cung cấp:

- Danh sách voucher đang được phép bán.
- Chi tiết voucher.
- Giá hiện tại.
- Thời gian bán/sử dụng.
- Số lượng còn khả dụng.
- Chi nhánh.
- Chính sách.

My không gọi repository voucher của N.

## 4.2. My → X: Issuance eligibility contract

Cung cấp:

- Order thuộc customer nào.
- Payment đã thành công hay chưa.
- Order item và quantity cần phát hành.
- Order có hủy/hoàn tiền không.
- Issuance request key để retry an toàn.

X không tự truy cập repository order của My.

## 4.3. N → X: Partner/branch scope contract

Cung cấp:

- Voucher product thuộc partner nào.
- Branch nào được áp dụng.
- Partner/branch có đang hoạt động không.

X dùng contract này khi verify/redeem.

## 4.4. My → Q: Review eligibility contract

Cung cấp:

- Current customer có sở hữu order/voucher mua không.
- Voucher đã mua hay đã sử dụng.
- Có được đánh giá theo ADR hay không.

Q không nhận `customerId` từ client làm nguồn quyền.

## 4.5. X → các module: Audit contract

Cung cấp:

```text
auditLogService.record({
  actorId,
  action,
  entityType,
  entityId,
  beforeData,
  afterData,
  reason,
  result
})
```

Nếu use case quy định log là bắt buộc, thao tác nghiệp vụ và log phải thành công cùng nhau.

---

## 5. Quy tắc tiến độ

- Một người không chuyển module giữa chừng.
- Một use case không chia cho nhiều owner.
- Cross-module chỉ qua service contract.
- Mỗi ngày phải có commit/PR/demo cụ thể.
- Task dài hơn một ngày phải tách nhỏ.
- Không giữ code local quá một ngày.
- Không đánh dấu hoàn thành khi frontend còn mock.
- Từ ngày 11 không thêm tính năng mới.

---

# 6. Lịch phát triển 14 ngày

## Ngày 1 — Khóa kiến trúc, ownership và ADR

| Người | Công việc | Deliverable |
|---|---|---|
| X | Tạo skeleton backend module mẫu, frontend feature mẫu, common middleware/error/response | Project chạy; module mẫu đủ `business/data/presentation` |
| N | Đối chiếu partner/voucher spec với ERD; state diagram partner/voucher | ADR state + schema impact |
| My | Đối chiếu customer/order/payment với ERD; state diagram order/payment/stock | ADR order/payment/stock |
| Q | Clone/chạy project; sao chép module mẫu thành `content-feedback`; liệt kê file cần tạo | Module skeleton + checklist từng file |

Gate:

- [ ] Chốt naming `business/data/presentation`.
- [ ] Chốt dùng `data/models` và `data/repositories`.
- [ ] Chốt module/feature ownership.
- [ ] ADR chưa chốt phải có owner và deadline.
- [ ] Không ai tạo bảng tùy ý.

---

## Ngày 2 — Migration, Model và Repository

| Người | Công việc | Deliverable |
|---|---|---|
| X | Migration/account/issued voucher/audit; model + repository cơ bản | Repository test account/code/log |
| N | Migration partner/branch/voucher/category; model + repository theo tenant | Repository query theo partner |
| My | Migration cart/order/payment/refund; model + repository theo customer | Repository cart/order/payment |
| Q | Migration content/review/complaint; model + repository CRUD theo mẫu | `content.model.js`, `content.repository.js`, ... |

Gate:

- [ ] Migration chạy từ database sạch.
- [ ] Không sửa migration module khác.
- [ ] Unique constraint code và account được chốt.
- [ ] Repository không chứa business rule.

---

## Ngày 3 — Service foundation và contract

| Người | Công việc | Deliverable |
|---|---|---|
| X | Auth/RBAC/User/Audit service; interface issue/verify/redeem | Service tests + audit contract |
| N | Partner/Branch/Voucher service; public voucher và branch scope contract | Validation giá/thời gian/state |
| My | Customer/Cart/Order/Payment service; issuance/review eligibility contract | Transaction design + service tests |
| Q | Content/Review/Complaint service; dùng review eligibility mock contract | Validation/service tests |

Gate:

- [ ] Bốn contract Mục 4 được commit.
- [ ] Bên cung cấp và bên dùng cùng review.
- [ ] Q có file mẫu và test mẫu.

---

## Ngày 4 — Route/Controller backend đợt 1

| Người | Công việc | Deliverable |
|---|---|---|
| X | Auth + BR-ADM-01 API | User list/detail/role/lock/unlock |
| N | Partner register/profile/branch + voucher draft API | BR-PAR-01/02 backend nền |
| My | Customer register/login/profile + public catalog adapter | BR-CUS-01/02 backend nền |
| Q | Content list/create/update/status API | BR-ADM-05 backend nền |

Mỗi người phải có Postman collection hoặc API test script.

---

## Ngày 5 — Frontend đợt 1

| Người | Công việc | Deliverable |
|---|---|---|
| X | Login/admin users pages | BR-ADM-01 full-stack |
| N | Partner onboarding nhiều bước + profile/branch pages | BR-PAR-01 UI |
| My | Customer register/login/profile + voucher list/detail skeleton | Account UI |
| Q | Content list/form/status pages | Content CRUD UI |

Q task chi tiết:

1. `contentApi.js`.
2. `ContentListPage.jsx`.
3. `ContentTable.jsx`.
4. `ContentForm.jsx`.
5. Loading/error/empty.
6. Test create/update/hide.

---

## Ngày 6 — Approval và public catalog

| Người | Công việc | Deliverable |
|---|---|---|
| X | Hoàn thiện shared auth/audit support; fix integration blockers | Shared foundation ổn định |
| N | Admin partner approval + partner create/submit voucher | BR-ADM-02, BR-PAR-02/03 |
| My | Voucher search/filter/detail qua contract N | BR-CUS-03/04 |
| Q | Banner/article/popup/policy theo một content module | BR-ADM-05 full-stack |

Milestone:

```text
Partner đăng ký → Admin duyệt
```

---

## Ngày 7 — Voucher approval, cart và review backend

| Người | Công việc | Deliverable |
|---|---|---|
| X | Issued voucher core, unique/idempotency tests | Issue-code service sẵn sàng |
| N | Admin voucher approve/reject + partner xem kết quả | BR-ADM-03, BR-PAR-03 |
| My | Cart add/update/delete/total + stock warning | BR-CUS-05 full-stack |
| Q | Review/complaint controller/routes + eligibility contract | BR-CUS-08 backend |

Milestone tuần 1:

```text
Partner đăng ký
→ Admin duyệt
→ Partner tạo/gửi voucher
→ Admin duyệt
→ Customer tìm/xem
→ Thêm giỏ
```

---

## Ngày 8 — Quản lý voucher, checkout, review UI

| Người | Công việc | Deliverable |
|---|---|---|
| X | Issuance API + dashboard query nền | BR-CUS-07 backend base |
| N | Voucher list/detail/update/pause/stop/reopen | BR-PAR-04 full-stack |
| My | Checkout/create order/payment success/failure | BR-CUS-06 core |
| Q | ReviewForm, ComplaintForm, ReviewList và UI states | BR-CUS-08 full-stack cơ bản |

---

## Ngày 9 — Voucher code, redeem, admin order

| Người | Công việc | Deliverable |
|---|---|---|
| X | Issue code/QR, My Vouchers, verify/redeem transaction | BR-CUS-07, BR-PAR-05/06 core |
| N | Partner report model/repository/service/page | BR-PAR-07 |
| My | Admin order list/detail/cancel/refund backend | BR-ADM-04 backend |
| Q | Admin complaint intake page + regression content/review | Q module chức năng đủ |

Q không đợi người khác: nếu eligibility contract chưa ổn, làm test/empty/error/seed/documentation rồi tích hợp sau.

---

## Ngày 10 — Hoàn thiện full-stack từng module

| Người | Công việc | Deliverable |
|---|---|---|
| X | Dashboard Admin + audit log + voucher-code pages | BR-ADM-06/07 và code lifecycle full-stack |
| N | Partner legal/branch change flow + report filters | N module đạt DoD |
| My | My Orders + payment retry + Admin order/refund UI | My module đạt DoD |
| Q | Responsive, validation, disable submit, seed/test evidence | Q module đạt DoD |

Gate:

- [ ] Từng module tự demo độc lập.
- [ ] Không còn page dùng mock không ghi chú.
- [ ] Không còn API chưa có contract.

---

## Ngày 11 — Tích hợp E2E

Không thêm chức năng mới.

| Người | Trọng tâm |
|---|---|
| X | Payment success → issue; verify → redeem; audit |
| N | Approved voucher → public catalog; branch/partner scope |
| My | Cart → stock check → order → payment → issuance request |
| Q | Purchase eligibility → review/complaint; content public display |

Gate:

- [ ] Luồng demo Mục 11 chạy từ đầu đến cuối.
- [ ] Ghi toàn bộ bug vào bảng chung.
- [ ] Mỗi bug có owner, severity và cách tái hiện.

---

## Ngày 12 — Test ownership và test chéo

| Module | Owner test | Reviewer |
|---|---|---|
| Core access/code/audit | X | N |
| Partner/voucher | N | My |
| Customer/order/payment | My | X |
| Content/review/complaint | Q | X |

Bắt buộc:

- [ ] Unit/service test critical.
- [ ] API test.
- [ ] Role/ownership/tenant test.
- [ ] Retry/double-click.
- [ ] Loading/error/empty.
- [ ] Regression.
- [ ] Database state sau thao tác.

---

## Ngày 13 — Seed, README và rehearsal

| Người | Công việc |
|---|---|
| X | Admin/account/code/audit seed; auth README |
| N | Partner/branch/voucher seed nhiều trạng thái |
| My | Customer/cart/order/payment/refund seed |
| Q | Content/review/complaint seed; tổng hợp screenshot/test evidence |

Chung:

- [ ] `.env.example`.
- [ ] Cách chạy database/backend/frontend.
- [ ] Tài khoản demo.
- [ ] Postman collection/API docs.
- [ ] Rehearsal demo.
- [ ] Quay thử video.

---

## Ngày 14 — Code freeze và demo

- [ ] Không thêm feature.
- [ ] Chỉ sửa blocker/critical.
- [ ] Merge PR đã review.
- [ ] Chạy migration từ database sạch.
- [ ] Chạy toàn bộ E2E.
- [ ] Tag phiên bản demo.
- [ ] Quay video dự phòng.
- [ ] Đối chiếu BR → UI → API → DB → Test.
- [ ] Backup database seed và source.

---

## 7. Công việc dự phòng để không ai rảnh

Khi bị blocker, không ngồi chờ.

### X

- Review PR.
- Viết middleware/error/response.
- Test RBAC.
- Test idempotency/audit.
- Sửa integration contract.

### N

- Seed partner/branch/voucher.
- Test tenant và branch scope.
- Viết voucher state matrix.
- Hoàn thiện loading/error/empty cho N feature.

### My

- Seed cart/order/payment.
- Test stock/concurrency.
- Viết order/payment state matrix.
- Hoàn thiện API tests.

### Q

- Test thủ công.
- Seed content/review/complaint.
- Loading/error/empty/responsive.
- Viết API documentation.
- Chụp screenshot.
- Lập regression checklist.
- Kiểm tra form validation.

Mỗi việc dự phòng vẫn phải có commit, file hoặc test evidence.

---

## 8. Task format bắt buộc

```markdown
### Task
- Requirement:
- Module:
- Owner:
- Input/tiền điều kiện:
- Output/hậu điều kiện:
- File tạo/sửa:
- Model:
- Repository:
- Service:
- Controller/Route:
- Frontend:
- Contract liên module:
- Business Rule:
- Test cases:
- Definition of Done:
- File mẫu:
```

Task tối đa 0.5–1 ngày.

Không giao “Làm dashboard”. Tách thành:

```text
1. dashboard.model.js
2. dashboard.repository.js
3. dashboard.service.js
4. dashboard.controller.js
5. dashboard.routes.js
6. dashboardApi.js
7. AdminDashboardPage.jsx
8. KpiCard.jsx
9. Filter + loading/error/empty
10. Test
```

---

## 9. Nhịp làm việc mỗi ngày

| Thời điểm | Hoạt động |
|---|---|
| Đầu ngày 15 phút | Hôm qua, hôm nay, blocker |
| Trước nghỉ trưa | Commit/push phần buổi sáng |
| Cuối buổi code | Tự test và cập nhật task |
| Cuối ngày 30 phút | Demo, review PR, cập nhật plan |

Quy tắc:

- Không có deliverable cuối ngày = task chưa hoàn thành.
- “Đang tìm hiểu” không phải deliverable.
- Không giữ code local qua ngày.
- PR nhỏ, theo use case hoặc task con.

---

## 10. Git và Pull Request

Branch:

```text
feature/x/core-access-br-adm-01
feature/n/partner-voucher-br-par-02
feature/my/customer-commerce-br-cus-06
feature/q/content-feedback-br-adm-05
fix/<owner>/<module>-<description>
```

PR:

```markdown
## Requirement
- BR/UC:
- Module:

## Thay đổi
- Migration:
- Model:
- Repository:
- Service:
- Controller/Route:
- Frontend:

## Contract liên module
- ...

## Business Rule
- ...

## Test
- Kịch bản/lệnh:
- Kết quả:

## Chưa hoàn tất
- ...
```

Review:

- PR Q phải có X hoặc owner contract liên quan review.
- Contract liên module phải có cả hai owner review.
- Migration/state machine cần hai người review.
- Không push trực tiếp `main`.
- Không merge build/test đỏ.
- Không merge code gọi repository module khác.

---

## 11. Kịch bản demo E2E

1. [ ] Owner đăng ký doanh nghiệp.
2. [ ] Admin duyệt partner và branch.
3. [ ] Partner đăng nhập.
4. [ ] Partner tạo voucher draft.
5. [ ] Partner gửi duyệt.
6. [ ] Admin duyệt voucher.
7. [ ] Customer đăng ký/đăng nhập.
8. [ ] Customer tìm và xem voucher.
9. [ ] Thêm giỏ, cập nhật quantity.
10. [ ] Tạo order và payment success.
11. [ ] Hệ thống phát hành đủ code/QR.
12. [ ] Customer xem My Vouchers và My Orders.
13. [ ] Branch staff verify code.
14. [ ] Branch staff redeem; lần hai bị từ chối.
15. [ ] Customer gửi review hoặc complaint.
16. [ ] Admin/Partner xem dashboard/report/log.

---

## 12. Test theo rủi ro

### RISK-01 — Sai vòng đời voucher

- [ ] Chưa duyệt không public.
- [ ] Chờ duyệt không sửa trái rule.
- [ ] Publication status độc lập review status.

### RISK-02 — Code không duy nhất

- [ ] Unique constraint.
- [ ] Retry/reload không sinh thêm.
- [ ] Quantity nhiều tạo đúng số code.

### RISK-03 — Bán vượt

- [ ] Cart chỉ cảnh báo.
- [ ] Recheck khi tạo order/payment.
- [ ] Request cạnh tranh không vượt quantity.

### RISK-04 — Phân quyền

- [ ] Customer không xem order/code người khác.
- [ ] Partner không xem partner khác.
- [ ] Branch staff không redeem ngoài branch.
- [ ] Non-admin không gọi API admin.

### RISK-05 — Demo data yếu

- [ ] Đủ actor.
- [ ] Đủ state thành công/thất bại.
- [ ] Có hết hạn, hết hàng, reject, payment fail, refund, used.

---

## 13. Seed data tối thiểu

- [ ] 1 Admin.
- [ ] 2 Customer.
- [ ] 2 Partner Owner.
- [ ] 1 Partner Manager.
- [ ] 2 Branch Staff.
- [ ] 2 partner profiles nhiều trạng thái.
- [ ] 4 branches nhiều trạng thái.
- [ ] 10 vouchers nhiều review/publication state.
- [ ] Order unpaid/paid/cancel/refund.
- [ ] Voucher code unused/used/expired/issuance error.
- [ ] Content visible/hidden/stopped.
- [ ] Reviews và complaints.
- [ ] Audit logs.

---

## 14. Definition of Done

Một use case chỉ hoàn thành khi:

- [ ] Đúng module/source owner.
- [ ] Migration chạy được.
- [ ] Model hoàn chỉnh.
- [ ] Repository hoàn chỉnh.
- [ ] Service có rule/quyền/transaction/log.
- [ ] Controller không chứa business logic.
- [ ] Route có middleware.
- [ ] Backend API test đạt.
- [ ] API contract khóa.
- [ ] Frontend gọi API thật.
- [ ] Loading/empty/error/forbidden/success.
- [ ] Test main flow và ít nhất hai case sai.
- [ ] Test ownership/tenant.
- [ ] Test retry nếu cần.
- [ ] Seed/demo data.
- [ ] PR review và merge.
- [ ] `plan.md` cập nhật.

---

## 15. Bảng tiến độ use case

### X — `core-access`

- [ ] BR-ADM-01
- [ ] BR-CUS-07
- [ ] BR-PAR-05
- [ ] BR-PAR-06
- [ ] BR-ADM-06
- [ ] BR-ADM-07

### N — `partner-voucher`

- [ ] BR-PAR-01
- [ ] BR-PAR-02
- [ ] BR-PAR-03
- [ ] BR-PAR-04
- [ ] BR-PAR-07
- [ ] BR-ADM-02
- [ ] BR-ADM-03

### My — `customer-commerce`

- [ ] BR-CUS-01
- [ ] BR-CUS-02
- [ ] BR-CUS-03
- [ ] BR-CUS-04
- [ ] BR-CUS-05
- [ ] BR-CUS-06
- [ ] BR-ADM-04

### Q — `content-feedback`

- [ ] BR-ADM-05
- [ ] BR-CUS-08
- [ ] Module seed
- [ ] Module test evidence
- [ ] Module API documentation

---

## 16. Blocker và quyết định

| Ngày | Mã | Module | Vấn đề | Owner | Quyết định/trạng thái |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
