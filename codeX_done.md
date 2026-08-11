# Báo cáo hoàn thành Task X (Core Access): BƯỚC 1

Các hạng mục đã hoàn tất theo `plan_taskX.md` (bao gồm góp ý của bạn):

## 1. Backend: Middleware Xác thực & Phân quyền
- **Xác thực (`authenticate.middleware.js`)**: Kiểm tra JWT Token (`Bearer`). Giải mã bằng thư viện `jsonwebtoken` và gắn thông tin vào `req.user`. Trả `401 Unauthorized` nếu token sai/hết hạn.
- **Phân quyền (`authorize.middleware.js`)**: Hàm nhận một mảng các role hợp lệ. So khớp với role của user hiện tại và trả `403 Forbidden` nếu user không đủ quyền truy cập.

## 2. Backend: Login API (`auth.service.js` & `auth.controller.js`)
- Mở router cho endpoint `POST /auth/login`.
- Xử lý mock data cho cả 4 roles (`ADMIN`, `PARTNER_OWNER`, `PARTNER_STAFF`, `CUSTOMER`) theo thông tin gửi lên.
- Sign JWT token có hạn 1 ngày và trả về cấu trúc response chuẩn với `accessToken` + `user` info. Xử lý lỗi tập trung bằng Error code và return bad request ở Controller.

## 3. Frontend: Giao diện & Routing
- **`LoginPage.jsx` duy nhất**: Đã tạo một page duy nhất theo góp ý (không có đổi Tab, không có các form thừa thãi) với một theme màu (`indigo`) thống nhất và trung tính. Trang có thẻ `<select>` cho Role để API nhận biết loại hình đăng nhập nhưng giao diện không thay đổi để tránh rò rỉ chức năng, đảm bảo bất kỳ ai cũng đăng nhập chung một cổng.
- **`ProtectedRoute.jsx`**: Bọc lại các route private, kiểm tra token trong `localStorage`. Cho phép lọc Role theo yêu cầu (chuyển hướng `/login` hoặc `/forbidden`).
- **`Forbidden.jsx`**: Màn hình dành cho các lượt vi phạm Role (403) hiển thị cảnh báo đẹp mắt.
- **`Header.jsx` động**: Render ra các badge role với màu sắc khác nhau tuỳ user (Admin = Xanh dương, Partner Owner = Xanh ngọc sậm, Partner Staff = Xanh ngọc nhạt, Customer = Cam) giống như chuẩn Figma Make.

## 4. Xác minh (Verification)
- Đã xử lý bắt lỗi `401 Unauthorized` và `403 Forbidden` trong Router frontend. Đã lưu đúng token và xóa token khi "Đăng xuất" qua Header.

---

# Cập nhật: BƯỚC 2 Đã Hoàn Thành (Kết nối Dữ liệu thật Supabase)

Tất cả các tính năng cơ sở hạ tầng ở Bước 2 đều đã được xây dựng xong và kết nối với cơ sở dữ liệu thật của dự án (Supabase). Cụ thể như sau:

## 1. Dịch vụ Ghi Nhật ký Hệ thống (Audit Log Service)
- **Đã làm gì?** Tạo ra một "cuốn sổ ghi chép" điện tử tự động.
- **Để làm gì?** Bất cứ khi nào có ai đó đăng nhập thành công, đăng nhập sai mật khẩu, hay Admin thực hiện thao tác quan trọng, hệ thống sẽ tự động ghi lại vào cơ sở dữ liệu (bảng `LOG_HT`). Nhờ vậy, chúng ta luôn biết "Ai đã làm gì, vào lúc nào, và kết quả ra sao". Hiện tại tính năng này đã hoạt động hoàn hảo và ghi dữ liệu thật!

## 2. Chuẩn hóa cách Hệ thống trả lời (Chuẩn Response API)
- **Đã làm gì?** Tạo ra một "form mẫu" chuẩn mực cho mọi câu trả lời của máy chủ (server).
- **Để làm gì?** Giống như nhân viên tổng đài luôn trả lời theo một mẫu câu lịch sự. Dù thành công hay thất bại, máy chủ luôn trả về dữ liệu theo đúng một cấu trúc cố định (ví dụ: luôn có chữ `success: true` hoặc `success: false`). Điều này giúp người làm giao diện (Frontend) cực kỳ dễ làm việc, không sợ bị bất ngờ vì cấu trúc dữ liệu trả về lộn xộn.

## 3. Bộ xử lý Lỗi thông minh (Exception Handler)
- **Đã làm gì?** Phân loại các lỗi thành từng nhóm rõ ràng (như Lỗi do người dùng nhập sai, Lỗi chưa đăng nhập, Lỗi không có quyền, Lỗi không tìm thấy dữ liệu).
- **Để làm gì?** Khi có lỗi xảy ra, thay vì máy chủ "chết đứng" hoặc chửi thề bằng những đoạn mã dài ngoằng khó hiểu, nó sẽ từ tốn báo lại mã lỗi ngắn gọn (ví dụ: `UNAUTHORIZED` - Bạn chưa đăng nhập). Frontend chỉ cần nhìn vào mã lỗi này là biết ngay phải hiển thị thông báo tiếng Việt gì cho khách hàng xem.

## 4. Bảo vệ dữ liệu (Cấu hình Transaction)
- **Đã làm gì?** Cấu hình tính năng "Làm tất cả hoặc Không làm gì cả" (Transaction) cho cơ sở dữ liệu Supabase.
- **Để làm gì?** Hãy tưởng tượng việc chuyển tiền: Tiền phải trừ ở tài khoản bạn VÀ cộng vào tài khoản người kia. Nếu trừ tiền bạn xong mà bị cúp điện, tiền không tới người kia thì bạn mất tiền oan. Tính năng Transaction đảm bảo nếu có lỗi ở bất kỳ bước nào, nó sẽ "quay ngược thời gian" hoàn tác mọi thứ như chưa hề có cuộc chia ly. Dữ liệu luôn an toàn tuyệt đối.

## 5. Từ điển các Trạng thái (Enum & Trạng thái dùng chung)
- **Đã làm gì?** Đồng bộ 100% các từ khóa trạng thái trong mã nguồn (code) với cơ sở dữ liệu.
- **Để làm gì?** Tránh tình trạng "ông nói gà bà nói vịt". Ví dụ trong cơ sở dữ liệu lưu là `Cho thanh toan` nhưng trong code lại ghi là `pending`. Giờ đây, code đã dùng chung một cuốn từ điển chuẩn xác (Voucher thì có `Cho duyet`, `Dang ban`... Đơn hàng thì có `Cho thanh toan`, `Da thanh toan`...). Khi lấy dữ liệu thật ra, mọi thứ sẽ khớp nhau hoàn hảo không bị lỗi hiển thị.

**Tóm lại:** Khối nền tảng vững chắc nhất (Core Platform) đã được xây xong và kết nối với dữ liệu thật. Những người làm các tính năng khác (như Giỏ hàng, Tạo Voucher) giờ chỉ việc mang ra xài mà không phải lo nghĩ về bảo mật, ghi log hay lỗi vặt nữa!

---

## Giải thích Luồng chạy của Code của task bước 2

Để hệ thống hoạt động trơn tru và không bị rối, chúng ta chia code thành các "phòng ban" giống như một công ty thực sự. Dưới đây là cách một yêu cầu từ người dùng (ví dụ: bấm nút Đăng nhập) đi qua các phòng ban này:

**1. Lễ tân (Route & Middleware)**
- Khách (người dùng) vừa bước vào cửa, "Lễ tân" (Route) sẽ đón khách và hỏi khách muốn làm gì. 
- Ngay tại cửa có "Bảo vệ" (Middleware). Anh bảo vệ sẽ kiểm tra xem khách có thẻ thành viên không (đã đăng nhập chưa - `authenticate.middleware`), hoặc khách có quyền vào phòng VIP không (phân quyền - `authorize.middleware`).
- Nếu bảo vệ thấy ổn, khách sẽ được dẫn vào gặp Quản lý.

**2. Quản lý sảnh (Controller)**
- "Quản lý" (Controller) sẽ nhận giấy tờ (dữ liệu email, mật khẩu) từ khách.
- Quản lý không tự đi làm việc chuyên môn, họ chỉ kiểm tra xem giấy tờ có đầy đủ không (vd: thiếu email thì đuổi về ngay bằng bộ xử lý lỗi `AppError`).
- Nếu đủ giấy tờ, Quản lý đưa hồ sơ xuống phòng Chuyên môn.

**3. Phòng Chuyên môn (Service)**
- Đây là nơi làm việc thực sự! Các "Chuyên viên" (Service) như `auth.service.js` sẽ bắt đầu xử lý nghiệp vụ.
- Chuyên viên sẽ gọi xuống kho để kiểm tra xem email này có tồn tại không, mật khẩu có đúng không, tài khoản có Tạm khóa không.
- Nếu mọi thứ đúng chuẩn, Chuyên viên sẽ tự động lấy bút ghi vào "Sổ nhật ký công ty" (gọi `auditLogService.log`) rằng: "Vào lúc này, anh A đã đăng nhập thành công". 

**4. Thủ kho (Repository) & Kho chứa (Database / Supabase)**
- Chuyên viên không tự đi mò mẫm trong kho. Họ nhờ "Thủ kho" (Repository).
- `user.repository.js` chính là thủ kho. Thủ kho có chìa khóa để kết nối trực tiếp với "Kho chứa đồ" là cơ sở dữ liệu thật (Supabase).
- Thủ kho chạy vào kho, lấy đúng thông tin tài khoản mà Chuyên viên cần rồi mang lên.

**5. Trả kết quả (Response)**
- Sau khi Chuyên viên làm xong, họ đưa kết quả (như thẻ đăng nhập Token) lại cho Quản lý (Controller).
- Quản lý sẽ gói ghém kết quả vào hộp quà thật đẹp theo đúng "Chuẩn Response API" (vd: `{ success: true, data: ... }`) và trao tận tay cho Khách (Frontend hiển thị thành công).

**Tóm lại luồng code luôn đi theo đường 1 chiều:**
Người dùng ➡️ **Route** (Lễ tân) ➡️ **Controller** (Quản lý) ➡️ **Service** (Chuyên viên) ➡️ **Repository** (Thủ kho) ➡️ **Database** (Supabase). Sau đó mang kết quả quay ngược lại!

---

## Giải đáp thắc mắc: Validator và ValidationError khác nhau chỗ nào?

Nếu bạn mở 2 file `auth.validator.js` và `ValidationError.js` ra, bạn có thể thắc mắc tại sao lại có 2 khái niệm nghe có vẻ giống nhau. Đây là sự khác biệt:

**1. `auth.validator.js` (Người kiểm tra / Hành động)**
- Đây là **công cụ (function)** làm nhiệm vụ "khám xét" dữ liệu.
- Giống như anh bảo vệ đứng soi xem khách hàng có mang đủ CMND, vé mời hay không.
- Ví dụ trong code: Nó sẽ xem thử người dùng đã nhập đủ `email` và `password` chưa, định dạng email có chữ `@` không. Nếu thiếu, nó sẽ "la lên" (throw error).

**2. `ValidationError.js` (Mẫu giấy phạt / Kết quả)**
- Đây là **định dạng của cái lỗi (Error Class)** sẽ được trả về khi việc kiểm tra thất bại.
- Giống như "Mẫu Biên Bản Xử Phạt" được in sẵn. Nó quy định sẵn mã lỗi là `400` (Bad Request), chữ in to là `VALIDATION_ERROR`.
- Khi anh bảo vệ (Validator) bắt được lỗi, anh ta sẽ lấy cái mẫu biên bản này (`ValidationError`) ra ghi vào và đưa cho khách hàng, để khách hàng biết chính xác mình sai ở đâu.

**Tóm lại:** 
- **Validator** là **NGƯỜI HÀNH ĐỘNG** đi tìm lỗi (Động từ).
- **ValidationError** là **CÁI NHÃN MÁC** gắn vào cái lỗi đó để báo cho người dùng biết (Danh từ). Validator dùng ValidationError để báo cáo!

Câu 1: Tại sao lại chia code thành Route, Controller, Service, Repository?
--> áp dụng mô hình kiến trúc nhiều lớp (Layered Architecture) để đạt được Separation of Concerns (Chia để trị):
- Route: Chỉ làm nhiệm vụ điều hướng URL.
- Controller: Chỉ làm nhiệm vụ nhận Request và trả Response.
- Service: Xử lý toàn bộ logic nghiệp vụ (Business Logic). Tách biệt hoàn toàn với công nghệ DB.
- Repository: Chỉ chứa code kết nối Database (Supabase).
- Việc này giúp code dễ bảo trì (maintain) và dễ test. Nếu sau này dự án đổi từ Supabase sang MySQL hoặc MongoDB, tụi em chỉ việc viết lại lớp Repository, toàn bộ logic ở Controller và Service vẫn giữ nguyên 100% không cần đụng tới."

Câu 2: Tại sao phải tạo chuẩn Response API và các file lỗi (AppError, ValidationError...)?
--> Dùng kỹ thuật Centralized Error Handling (Xử lý lỗi tập trung). Thay vì file nào cũng phải viết try/catch rồi gõ res.status(500).json(...) khiến code bị lặp lại (vi phạm nguyên tắc DRY - Don't Repeat Yourself), thì ở lớp Service mình chỉ việc throw new NotFoundError(). Cái lỗi đó sẽ bay thẳng ra ngoài và bị một Error Middleware đứng cuối cùng chụp lại, tự động chuyển thành JSON chuẩn trả về cho Frontend.
- Việc chuẩn hóa này tạo ra một "Giao kèo" (Contract) chặt chẽ giữa Backend và Frontend. Đội Frontend chỉ cần viết đúng 1 cái Axios Interceptor là có thể bắt được mọi lỗi của toàn hệ thống."

Câu 3: Tại sao làm Transaction lại phức tạp vậy (có withSupabaseTransaction và RPC)?
--> Vì dự án dùng Supabase (dựa trên PostgREST API). Nhược điểm của API này là nó không hỗ trợ explicit transaction (các lệnh BEGIN, COMMIT, ROLLBACK) trực tiếp từ code Javascript giống như dùng ORM Prisma hay Sequelize.
- Nên để đảm bảo dữ liệu không bị hỏng khi lỗi (ACID properties), mình đã tự build một lớp wrapper withSupabaseTransaction để thực hiện chiến lược Rollback thủ công (Manual Compensating Action) cho các nghiệp vụ nhỏ. Còn với các nghiệp vụ phức tạp liên quan đến tài chính, mình gọi trực tiếp các Stored Procedures (RPC) trong PostgreSQL để đẩy Transaction xuống tận DB Engine xử lý."

Câu 4: Tại sao phải làm thư mục constants/enum?
--> Để tránh lỗi Magic Strings. Nếu gõ tay chữ 'Cho thanh toan' ở nhiều nơi, lỡ gõ sai chính tả thì DB sẽ báo lỗi vì dưới DB mình có cài đặt CHECK constraint rất chặt chẽ. Việc gom tất cả trạng thái vào các file Constants giúp đảm bảo Single Source of Truth (Nguồn chân lý duy nhất). Khi code, IDE (VSCode) sẽ gợi ý code tự động, giúp không bao giờ bị sai chính tả và sau này muốn đổi tên trạng thái chỉ cần vào 1 file sửa là toàn hệ thống tự cập nhật."

Giải thích LUỒNG CODE chức năng Đăng nhập
1. Client (Frontend) gửi 1 Request POST /auth/login có chứa email/password.
2. Máy chủ nhận được, đi qua Lớp Route (auth.routes.js). Tại đây, Route thấy chữ /login nên điều hướng nó cho AuthController.
3. Trước khi Controller xử lý, dữ liệu đi qua một cái Validator để kiểm tra tính hợp lệ (xem có bị rỗng không).
4. AuthController nhận dữ liệu, nó KHÔNG tự chọc vào DB mà gọi hàm AuthService.login(email, password).
5. AuthService (lớp nghiệp vụ) bắt đầu làm việc. Nó nhờ UserRepository chọc vào Supabase để tìm email. UserRepository tìm xong trả data lên cho Service.
6. AuthService dùng thư viện bcrypt so sánh mật khẩu.
- Nếu SAI: Gọi throw new UnauthorizedError('Sai mật khẩu'). Hệ thống ngừng ngay lập tức, chuyển qua Error Middleware báo lỗi 401.
- Nếu ĐÚNG: Ký JWT Token, gọi AuditLogService để ghi nhận lịch sử vào DB. Cuối cùng Service trả token về cho Controller.
7. AuthController dùng hàm successResponse bọc token lại thành cục JSON vuông vức và gửi trả về Client với mã 200 OK.

----------------------------------------------------------------------
# BƯỚC 3 Đã Hoàn Thành
- FILE: user.model.js (trong feature/core-access/domain/models/)
 * PURPOSE: Model đại diện cho entity người dùng trong module core-access.
 *
 * Tại sao cần file này?
# BR-ADM-01: Quản lý người dùng — Đã Hoàn Thành (BƯỚC 3)

Toàn bộ chức năng xem danh sách, xem chi tiết, khóa/mở khóa, cập nhật vai trò người dùng đã được kết nối với Supabase thật, ghi audit log, và hiển thị qua giao diện React.

---

## 1. Backend — Các file đã tạo/cập nhật

### FILE: `backend/src/modules/core-access/data/models/user.model.js`
**Purpose:** Model chuẩn hóa cấu trúc dữ liệu user khi trả về từ repository.

**Tại sao cần?**
- Service/controller chỉ làm việc với `UserModel` (camelCase), không cần biết tên cột DB (snake_case tiếng Việt).
- Khi DB đổi tên cột, chỉ cần sửa model, không đụng vào service hay controller.

**Mapping cột DB → field JS:**
| DB Column (NGUOIDUNG) | UserModel field | Ý nghĩa |
|---|---|---|
| `ma_nguoi_dung` | `id` | Khóa chính UUID |
| `ho_ten` | `name` | Họ tên |
| `email` | `email` | Email |
| `sdt` | `phone` | Số điện thoại |
| `vai_tro` | `role` | Vai trò DB ('Admin', 'Khach hang'...) |
| `trang_thai` | `status` | Trạng thái ('Dang hoat dong'/'Bi khoa') |
| `ngay_tao` | `createdAt` | Ngày tạo tài khoản |
| `ma_chi_nhanh` | `branchId` | FK chi nhánh (nullable) |
| `ma_tk` | `accountId` | UUID tài khoản đăng nhập |

---

### FILE: `backend/src/modules/core-access/data/repositories/user.repository.js`
**Purpose:** Repository duy nhất truy cập bảng `NGUOIDUNG` + `TAIKHOAN` từ Supabase.

**Tại sao cần?**
- Tập trung mọi câu query Supabase vào một chỗ (Single Responsibility).
- Service KHÔNG được query Supabase trực tiếp — chỉ gọi qua repository.
- Repository KHÔNG chứa business rule — chỉ SELECT / UPDATE.

**5 method đã triển khai:**

| Method | SQL tương đương | Dùng ở đâu |
|---|---|---|
| `findAccountByLoginInfo(email)` | SELECT + JOIN + WHERE | `auth.service.js` — xác thực đăng nhập |
| `findAll({ page, limit, name, phone, role, status })` | SELECT + ILIKE + EQ + RANGE | `user.service.js` — admin xem danh sách |
| `findById(userId)` | SELECT WHERE id = ? SINGLE | `user.service.js` — admin xem chi tiết |
| `updateStatus(userId, newStatus)` | UPDATE trang_thai WHERE id = ? | `user.service.js` — khóa/mở khóa |
| `updateRole(userId, newRole)` | UPDATE vai_tro WHERE id = ? | `user.service.js` — đổi vai trò |

**Kỹ thuật Supabase dùng:**
- `ilike('%...%')` → tìm không phân biệt hoa thường (tìm tên, SĐT)
- `range(offset, offset+limit-1)` → phân trang
- `{ count: 'exact' }` → đếm tổng số bản ghi để tính `totalPages`
- `.single()` → trả về 1 bản ghi, null nếu không tìm thấy (PGRST116)

---

### FILE: `backend/src/modules/core-access/business/services/user.service.js`
**Purpose:** Xử lý toàn bộ business logic cho BR-ADM-01.

**Tại sao cần?**
- Service là "người gác cổng" business rule — controller KHÔNG được chứa điều kiện nghiệp vụ.
- Service điều phối: gọi repository lấy data → kiểm tra rule → gọi auditLogService ghi log → trả kết quả.

**6 method và Business Rules:**

| Method | Business Rules quan trọng | Strict Log? |
|---|---|---|
| `listUsers()` | Hỗ trợ lọc + phân trang, map DB → UserModel | Không |
| `getUserById()` | Trả 404 nếu không tìm thấy | Không |
| `lockUser()` | Admin không tự khóa mình; chỉ khóa TK đang active | ✅ Có (RB-15) |
| `unlockUser()` | Chỉ mở khóa TK đang Tạm khóa | ✅ Có (RB-15) |
| `updateUserRole()` | Admin không đổi role mình; role mới phải hợp lệ | ✅ Có (RB-15) |
| `getProfile()` | Lấy thông tin người đang đăng nhập theo `userId` từ JWT | Không |

**Tại sao Strict Log (RB-15)?**
Theo `skills.md §15`: Thao tác bắt buộc log (khóa/mở khóa/đổi role) mà ghi log thất bại → KHÔNG được báo thành công cho frontend. Dùng `auditLogService.log({...}, true)` để enforce.

---

### FILE: `backend/src/modules/core-access/presentation/controllers/user.controller.js`
**Purpose:** Controller tiếp nhận HTTP request, gọi service, trả HTTP response.

**Nguyên tắc thiết kế:**
- Controller chỉ làm 3 việc: đọc `req.params/body/query` → gọi service → trả `res.json()`
- KHÔNG chứa business rule (vi phạm kiến trúc)
- `actorId` (người thực hiện) LUÔN lấy từ `req.user.id` (JWT token) — KHÔNG lấy từ body client

**5 handler:**
- `listUsers(req, res)` → GET /admin/users
- `getUserById(req, res)` → GET /admin/users/:userId
- `lockUser(req, res)` → PATCH /admin/users/:userId/lock
- `unlockUser(req, res)` → PATCH /admin/users/:userId/unlock
- `updateUserRole(req, res)` → PATCH /admin/users/:userId/role
- `getProfile(req, res)` → GET /users/profile

---

### FILE: `backend/src/modules/core-access/presentation/routes/user.routes.js`
**Purpose:** Khai báo HTTP routes với middleware chain đúng thứ tự.

**Middleware chain cho mỗi request admin:**
```
Request → authenticateMiddleware (kiểm tra JWT) → authorizeMiddleware(ADMIN) → controller handler
```

**API Contract đầy đủ:**
| Method | URL | Middleware | Controller |
|---|---|---|---|
| GET | `/admin/users` | auth + ADMIN | `listUsers` |
| GET | `/admin/users/:userId` | auth + ADMIN | `getUserById` |
| PATCH | `/admin/users/:userId/lock` | auth + ADMIN | `lockUser` |
| PATCH | `/admin/users/:userId/unlock` | auth + ADMIN | `unlockUser` |
| PATCH | `/admin/users/:userId/role` | auth + ADMIN | `updateUserRole` |
| GET | `/users/profile` | auth (any role) | `getProfile` |

---

## 2. Frontend — Các file đã tạo/cập nhật

### FILE: `frontend/src/features/core-access/api/userApi.js`
**Purpose:** Tầng gọi API backend cho chức năng quản lý người dùng.

**Tại sao cần?**
- Frontend KHÔNG được gọi Supabase trực tiếp (`skills.md §8.6 + §19`).
- Tập trung tất cả URL, headers, xử lý response lỗi ở một chỗ.

**Cách lấy token:** `localStorage.getItem('accessToken')` → gửi kèm `Authorization: Bearer <token>`

**5 function export:**
```js
fetchUsers({ page, limit, name, phone, role, status })   // GET /admin/users
fetchUserById(userId)                                      // GET /admin/users/:userId
lockUser(userId, reason)                                   // PATCH /admin/users/:userId/lock
unlockUser(userId, reason)                                 // PATCH /admin/users/:userId/unlock
updateUserRole(userId, newRole, reason)                    // PATCH /admin/users/:userId/role
```

---

### FILE: `frontend/src/features/core-access/pages/admin/UserListPage.jsx`
**Purpose:** Trang Admin quản lý người dùng — dữ liệu thật từ Supabase qua API.

**Thay thế MockData bằng API thật:**
- Trước: dùng `mockUsers` từ `mockData.ts`
- Sau: gọi `fetchUsers()` từ `userApi.js` → backend → Supabase

**4 UI States được xử lý (`skills.md §8.6`):**
| State | Hiển thị |
|---|---|
| `loading = true` | Spinner (Loader2 + animate-spin) |
| `error` | Thông báo lỗi + nút "Thử lại" |
| `users.length === 0` | "Không tìm thấy tài khoản phù hợp" |
| `users.length > 0` | Bảng danh sách + phân trang |

**Tính năng:**
- Bộ lọc: theo tên, SĐT, vai trò, trạng thái (debounce qua useEffect)
- Phân trang: Trước / Sau
- Xem chi tiết: click row → `UserDetailPanel`
- Khóa/Mở khóa: Modal xác nhận có nhập lý do bắt buộc
- Cập nhật vai trò: Modal với select dropdown + lý do tùy chọn
- Cập nhật UI local: sau thành công → cập nhật state ngay không cần reload

---

### FILE: `frontend/src/features/core-access/layouts/AdminLayout.jsx`
**Purpose:** Layout bao ngoài cho toàn bộ trang admin — sidebar + topbar + Outlet.

**Tại sao cần?**
- Admin cần layout riêng (sidebar điều hướng) khác với customer/partner (chỉ có Header chung).
- Tách layout ra để các trang admin (`UserListPage`, `AuditLogPage`...) chỉ render nội dung, không lo layout.

**Tính năng:**
- Sidebar thu gọn/mở rộng trên desktop (toggle ChevronLeft)
- Sidebar overlay trên mobile (Menu icon)
- Breadcrumb topbar tự cập nhật theo `useLocation()`
- Active menu dùng `useLocation().pathname` để highlight đúng item
- Logout: xóa `accessToken` + `user` khỏi localStorage → `/login`
- Avatar chữ cái đầu lấy từ `currentUser.name` trong localStorage

---

### FILE: `frontend/src/app/router.jsx`
**Purpose:** Cập nhật route `/admin/*` để dùng `AdminLayout` + bảo vệ bởi `ProtectedRoute(ADMIN)`.

**Cấu trúc route admin:**
```
/admin     → ProtectedRoute(ADMIN) → AdminLayout → AdminDashboardPage
/admin/users → ProtectedRoute(ADMIN) → AdminLayout → UserListPage (BR-ADM-01)
/admin/logs  → ProtectedRoute(ADMIN) → AdminLayout → AuditLogPage (placeholder)
```

**Tại sao admin route tách ra khỏi "/" ?**
Admin dùng `AdminLayout` (có sidebar), customer/partner dùng `App` (có Header chung). Tách ra tránh render nhầm layout.

---

## 3. Luồng hoàn chỉnh BR-ADM-01 (Xem danh sách người dùng)

```
Admin truy cập /admin/users
  → ProtectedRoute: kiểm tra localStorage.accessToken + user.role === 'ADMIN'
  → AdminLayout render sidebar + topbar
  → UserListPage mount → useEffect gọi fetchUsers()
  → userApi.js: fetch GET /admin/users?page=1&limit=20 + header Authorization: Bearer <token>
  → Backend user.routes.js: authenticateMiddleware (decode JWT → req.user)
  → authorizeMiddleware('ADMIN'): kiểm tra req.user.role === 'ADMIN'
  → UserController.listUsers(): đọc query params
  → UserService.listUsers(): gọi userRepository.findAll()
  → UserRepository: query Supabase bảng nguoidung + áp bộ lọc + phân trang
  → Supabase trả data thật
  → UserService: map rows → UserModel[]
  → Controller: res.json({ success: true, data: [...], pagination: {...} })
  → Frontend: setUsers(data) → render bảng danh sách
```

---

## 4. Kết quả kiểm thử (node -e)
- `user.service.js` load OK — 6 methods: `listUsers, getUserById, lockUser, unlockUser, updateUserRole, getProfile`
- `user.routes.js` load OK — 6 routes đăng ký đúng: `/admin/users`, `/admin/users/:userId`, `/admin/users/:userId/lock`, `/admin/users/:userId/unlock`, `/admin/users/:userId/role`, `/users/profile`
- `core-access/index.js` load OK — 7 services export: `authService, userService, auditLogService, voucherIssuanceService, voucherVerificationService, voucherRedemptionService, adminDashboardService`

- FILE: user.controller.js
 * PURPOSE: Controller tiếp nhận HTTP request, gọi userService, trả HTTP response.
 *
 * Tại sao cần file này?
 * - Controller là cầu nối giữa HTTP layer và business layer.
 * - Controller chỉ làm 3 việc: đọc params/body, gọi service, trả response.
 * - Không chứa business rule (việc đó là của service).
 * - Không gọi repository trực tiếp (vi phạm kiến trúc).
 *
 * Lưu ý: req.user được gắn bởi authenticateMiddleware (đã decode JWT token).
 *   req.user.id       = ma_nguoi_dung của người đang đăng nhập
 *   req.user.accountId = ma_tk của người đang đăng nhập
 *   req.user.role     = JWT role ('ADMIN', 'CUSTOMER', ...)

---

# BƯỚC 4 Đã Hoàn Thành: Chức năng Quên mật khẩu & Đăng nhập bằng OTP qua Email

## 1. Dịch vụ Gửi Email (`email.service.js`)
- **Mục đích:** Gửi mã OTP xác thực qua email thực tế cho người dùng bằng `nodemailer`.
- **Hoạt động:** Sử dụng cấu hình SMTP từ file `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`). Khi được gọi, nó tạo một email HTML có giao diện đẹp và mã OTP 6 số bên trong. Nếu chưa cấu hình SMTP, mã OTP sẽ chỉ được in ra console.

## 2. Xử lý logic OTP (`auth.service.js`)
- **Lưu trữ tạm thời:** Sử dụng cấu trúc `Map()` trong Node.js để lưu cặp `(email, { otp, expiresAt })`. Trong môi trường thực tế lớn hơn có thể thay bằng Redis.
- **`generateOTP(email)`:**
  - Kiểm tra xem email có tồn tại trong hệ thống (bảng `TAIKHOAN`).
  - Tạo một mã OTP ngẫu nhiên 6 chữ số, lưu vào `Map()` với thời hạn là 5 phút.
  - Gọi `auditLogService.log` lưu lịch sử "Yêu cầu mã OTP".
  - Chuyển mã OTP sang cho `email.service.js` để gửi email thật.
- **`loginWithOTP({ email, otp })`:**
  - Kiểm tra OTP có đúng và còn hạn hay không.
  - Xóa OTP ngay lập tức sau khi dùng để tránh bị tấn công Replay Attack.
  - Các bước tiếp theo giống hệt hàm `login` bình thường: Tạo payload cho JWT, ký Token, ghi lại log Đăng nhập OTP và trả Token về.

## 3. Controller & Routes (`auth.controller.js` & `auth.routes.js`)
- Thêm hai endpoint `POST /auth/forgot-password` và `POST /auth/login-with-otp` để Frontend có thể giao tiếp.

## 4. Giao diện Frontend (`LoginPage.jsx`)
- Thay đổi cấu trúc trang đăng nhập từ dạng Form đơn giản thành State Machine với 3 trạng thái (`mode`):
  1. `login`: Hiển thị form đăng nhập bằng mật khẩu như cũ, có thêm nút "Quên mật khẩu?".
  2. `forgot-password`: Hiển thị form để người dùng nhập email cần khôi phục.
  3. `enter-otp`: Hiển thị form yêu cầu người dùng nhập 6 chữ số OTP được gửi qua email.
- **Logic chuyển đổi:** Khi người dùng nhập email và bấm gửi, hệ thống gọi API `/auth/forgot-password`. Nhận thành công, báo cho người dùng kiểm tra email, và UI tự động chuyển sang chế độ `enter-otp`. Khi nhập OTP thành công sẽ điều hướng vào hệ thống tương tự đăng nhập bằng mật khẩu.

---

# BƯỚC 5 Đã Hoàn Thành: Hoàn thiện logic BR-ADM-01 Quản lý người dùng

Dựa trên yêu cầu của file đặc tả `đặc tả hệ thống của admin.pdf`, các tính năng **Khóa/mở khóa**, **Phân quyền** và **Audit log service cơ bản** đã được triển khai hoàn chỉnh từ Backend tới Frontend.

## 1. Dịch vụ Audit Log (`audit-log.service.js` & `audit-log.repository.js`)
- **Mục đích:** Ghi nhận mọi thao tác quan trọng của Quản trị viên (Khóa, Mở khóa, Đổi vai trò) vào hệ thống (đáp ứng NFR-06).
- **Giải thích code:** 
  - File Service nhận các tham số như `actorId` (người thực hiện), `actorRole`, `action`, `targetType` (đối tượng tác động), `before` (dữ liệu cũ), `after` (dữ liệu mới), và `reason` (lý do).
  - Có cơ chế `strict = true`. Theo luật nghiệp vụ (RB-15), nếu thao tác bắt buộc ghi log mà tiến trình ghi log bị lỗi (VD: rớt mạng DB), hệ thống sẽ chủ động `throw new Error` và **hủy bỏ luôn thao tác chính** (không cho phép đổi role hay khóa tài khoản nếu không ghi log được). Điều này đảm bảo tính toàn vẹn dữ liệu kiểm toán.

## 2. Xử lý nghiệp vụ Người dùng (`user.service.js`)
- **Mục đích:** Xử lý logic khóa, mở khóa, cập nhật vai trò, kèm theo các ràng buộc nghiệp vụ (Business Rules).
- **Khóa tài khoản (`lockUser`) / Mở khóa (`unlockUser`):**
  - Kiểm tra xem admin có đang tự khóa chính mình không (`actorId === targetUserId`). Nếu có, ném lỗi `AppError('Không thể khóa tài khoản của chính mình')`.
  - Kiểm tra trạng thái hiện tại. Không thể khóa tài khoản đã bị khóa, và không thể mở khóa tài khoản đang hoạt động.
  - Gọi `auditLogService.log(..., true)` để ghi log bắt buộc kèm lý do (`reason`).
  - Gọi Repository để thực sự cập nhật DB sang `Tam khoa` hoặc `Dang hoat dong`.
- **Cập nhật vai trò (`updateUserRole`):**
  - Không cho phép admin tự đổi role của chính mình.
  - Kiểm tra vai trò mới có nằm trong danh sách `VALID_ROLES` của hệ thống hay không.
  - Kiểm tra nếu vai trò mới trùng vai trò cũ thì báo lỗi `SAME_ROLE` không cần cập nhật.
  - Ghi Audit Log bắt buộc (`strict = true`) lưu lại `before: { vai_tro: ... }` và `after: { vai_tro: newRole }`.

## 3. Tương tác cơ sở dữ liệu (`user.repository.js`)
- **Mục đích:** Gọi trực tiếp vào Supabase để cập nhật dữ liệu bằng `.update()`.
- Lệnh `.update({ trang_thai: newStatus }).eq('ma_nguoi_dung', userId).single()` sẽ giúp cập nhật trạng thái người dùng an toàn.
- *Lưu ý:* Vừa qua mình đã sửa lại lỗi `Cannot coerce the result to a single JSON object` ở hàm `findAccountByLoginInfo` bằng cách thay `.single()` thành `.limit(1).maybeSingle()` để phòng ngừa trường hợp database có dữ liệu trùng lặp gây sập ứng dụng.

## 4. Giao diện Frontend (`UserListPage.jsx`)
- **Mục đích:** Hiển thị danh sách, popup xác nhận (ConfirmModal) và xử lý sự kiện người dùng bấm Khóa / Cập nhật vai trò.
- **Giải thích code:**
  - Component `UserListPage` tải dữ liệu bằng `fetchUsers` thông qua `userApi.js`.
  - Component `UserDetailPanel` dùng để xem thông tin chi tiết một người dùng và chứa các nút hành động (Khóa/Mở khóa/Cập nhật vai trò).
  - Component `ConfirmModal` hiển thị hộp thoại cảnh báo có yêu cầu nhập **Lý do (Bắt buộc)** theo như đặc tả của chức năng khóa tài khoản. Khi bấm xác nhận, nó sẽ gọi hàm xử lý tương ứng (`handleLock`, `handleUnlock`, `handleRoleUpdate`).
  - Sau khi API Backend trả về thành công, Frontend tự động cập nhật local state (`setUsers`) để giao diện phản ánh thay đổi ngay lập tức mà không cần F5 tải lại trang.

---

# BƯỚC 5.1 Đã Hoàn Thành: Hoàn thiện Logic Phân Quyền Combobox và Hiển Thị 3 Tab Chi Tiết

Dựa trên yêu cầu của bạn, chức năng **Cập nhật vai trò** đã được phân quyền chặt chẽ: **Chỉ hỗ trợ chuyển đổi qua lại giữa Nhân viên bán hàng và Nhân viên quản lý voucher**, và bắt buộc phải chọn Chi nhánh/Đối tác tương ứng qua Combobox.

## 1. Backend (`user.repository.js`, `user.service.js`, `user.controller.js`, `user.routes.js`)
- Bổ sung thêm API lấy danh sách Chi nhánh (`GET /admin/branches`) và Đối tác Doanh nghiệp (`GET /admin/partners`) phục vụ cho việc hiển thị Combobox (Dropdown) trên giao diện.
- Nâng cấp API lấy chi tiết người dùng (`GET /admin/users/:userId`) để đính kèm thông tin Chi nhánh, Doanh nghiệp, Lịch sử mua hàng, và Lịch sử Audit Logs quản trị của tài khoản đó.
- Bổ sung Business Rule chặt chẽ vào `updateUserRole`: 
  - Chỉ cho phép thao tác nếu người dùng đang có vai trò là `Nhan vien ban hang` hoặc `Nhan vien quan ly voucher`.
  - Chỉ cho phép đổi sang vai trò ngược lại giữa 2 vai trò này.
  - Khi đổi sang `Nhan vien ban hang`, bắt buộc phải có mã Chi nhánh. Khi đổi sang `Nhan vien quan ly voucher`, bắt buộc phải có mã Đối tác.
- Hàm `updateRole` ở `user.repository.js` hỗ trợ cập nhật `ma_chi_nhanh` và `ma_hsdn` xuống Database, đồng thời set các giá trị không cần thiết về `null` để đảm bảo không vi phạm Check Constraint của Database (như `chk_nguoi_dung_chi_nhanh_nvbh`).

## 2. Frontend (`UserListPage.jsx` & `userApi.js`)
- Cập nhật giao diện `UserDetailPanel` hiển thị 3 Tab: **Thông tin cá nhân**, **Lịch sử mua voucher**, và **Lịch sử quản trị**.
- Nút "Cập nhật vai trò" giờ đây chỉ xuất hiện khi xem chi tiết các tài khoản thuộc vai trò `Nhan vien ban hang` hoặc `Nhan vien quan ly voucher`.
- Modal Cập nhật Vai trò tự động giới hạn tuỳ chọn (chỉ cho phép đổi sang vai trò còn lại trong 2 vai trò trên) và yêu cầu chọn Chi nhánh/Đối tác từ Combobox tương ứng.

---

# BƯỚC 6 Đã Hoàn Thành: Triển khai Hoàn chỉnh Nghiệp vụ Đối tác (BR-PAR-05, BR-PAR-06, Quét QR Camera Thật & Sinh Mã QR Thật)

Dựa trên yêu cầu từ file đặc tả `đặc tả hệ thống cho đối tác (2).pdf` và chỉ đạo trực tiếp từ bạn, toàn bộ nghiệp vụ **Tra cứu/Xác thực Voucher (BR-PAR-05)**, **Xác nhận Sử dụng Voucher tại Quầy (BR-PAR-06)**, cùng cơ chế **Sinh mã QR Code thật** và **Quét mã bằng Camera thiết bị / Upload ảnh thật** đã được triển khai hoàn chỉnh, kết nối cơ sở dữ liệu Supabase thật và vượt qua 100% các kịch bản kiểm thử tự động.

---

## 1. Kiến trúc & Logic Nghiệp vụ Backend (`core-access`)

### 1.1. Data Model & Repository (`issued-voucher.model.js` & `issued-voucher.repository.js`)
- **Truy vấn đa bảng ổn định**: Khắc phục triệt để lỗi Schema Cache của PostgREST bằng cách truy vấn tách biệt và liên kết dữ liệu giữa `voucher_mua`, `voucher`, `donhang`, `taikhoan`, `nguoidung`, và `chinhanh`.
- **Ẩn danh thông tin khách hàng (NFR-02)**: Tên khách hàng và số điện thoại được làm mờ tự động (Ví dụ: `Nguyễn Minh Anh` ➔ `N***** M** A**`, `0901234567` ➔ `090****567`) để bảo vệ dữ liệu cá nhân khi nhân viên quầy tra cứu.
- **Atomic Update chống Race Condition (RB-07)**:
  - Khi thực hiện xác nhận sử dụng, câu lệnh `.update({ trang_thai: 'Da su dung', ... }).eq('voucher_code', code).eq('trang_thai', 'Chua su dung')` chỉ cập nhật thành công nếu trạng thái lúc đó thực sự là `Chua su dung`.
  - Nếu có 2 nhân viên quầy quét cùng 1 mã cùng 1 lúc, chỉ đúng 1 người cập nhật thành công, người thứ hai sẽ nhận thông báo lỗi mã đã được sử dụng ngay lập tức.
- **Rollback khi gặp lỗi ngoại lệ E3**: Nếu quá trình ghi log kiểm toán bắt buộc (Audit Log) bị lỗi, hệ thống tự động hoàn tác `revertRedemption` trả lại trạng thái `Chua su dung` để bảo đảm tính toàn vẹn dữ liệu.
- **Lấy danh sách mã mẫu demo (`findSampleCodes`)**: Cung cấp API để Frontend có thể hiển thị danh sách các mã voucher có sẵn trong Database, giúp người kiểm thử bấm tra cứu nhanh bằng 1 click chuột.

### 1.2. Dịch vụ Nghiệp vụ Service (`voucher-verification.service.js` & `voucher-redemption.service.js`)
- **Xác thực toàn diện các ràng buộc (BR-PAR-05)**:
  1. `E1` - Mã voucher không tồn tại trong hệ thống.
  2. `E2` - Mã voucher đã sử dụng (`RB-07`).
  3. `E4` - Mã voucher đã hết hạn sử dụng (`RB-08`).
  4. `E5` - Mã voucher bị vô hiệu hóa / tạm dừng do đơn hàng bị hủy hoặc gian lận.
  5. `RB-09` - Ràng buộc chi nhánh: Kiểm tra chi nhánh mà nhân viên đang đăng nhập có nằm trong danh sách chi nhánh được áp dụng voucher hay không.
- **Sinh mã QR Code thật theo chuẩn ISO/IEC 18004**:
  - Tích hợp thư viện `qrcode` để sinh ra chuỗi Base64 Data URL (`image/png`) từ định dạng chuẩn `ECQR:<voucher_code>`.
  - Mã QR này có thể render trực tiếp lên thẻ `<img>` hoặc vẽ lên `<canvas>` với độ nét cao và khả năng sửa lỗi (Error Correction Level M).
- **Ghi nhật ký kiểm toán nghiêm ngặt (Audit Log - RB-12, RB-15, NFR-06)**:
  - Mọi thao tác xác nhận sử dụng thành công đều được ghi lại vào bảng `LOG_HT` với `doi_tuong = 'VOUCHER_MUA'`, `hanh_dong = 'su_dung_voucher'`, lưu vết `ma_chi_nhanh_su_dung`, `ma_nhan_vien_xac_nhan`, và thời điểm thực hiện.

### 1.3. Controller & Định tuyến Routes (`redemption.controller.js` & `redemption.routes.js`)
- `POST /api/vouchers/verify`: Tra cứu thông tin, kiểm tra tính hợp lệ và trả về thông tin chi tiết kèm mã QR DataURL.
- `POST /api/vouchers/redeem`: Xác nhận sử dụng voucher tại quầy chi nhánh (bảo vệ bởi `authenticateMiddleware`).
- `GET /api/vouchers/usage-history`: Lấy lịch sử các giao dịch đã sử dụng voucher tại chi nhánh (có phân trang).
- `GET /api/vouchers/sample-codes`: Lấy danh sách mã voucher có sẵn trong DB để test nhanh.

---

## 2. Giao diện Frontend & Tích hợp Camera Thật

### 2.1. Component Quét QR Thật bằng Camera (`QrScannerModal.jsx`)
- **Tích hợp `html5-qrcode`**:
  - Yêu cầu quyền truy cập Camera thiết bị thông qua MediaDevices Web API.
  - Tự động nhận diện Camera trước/sau, hiển thị khung nhắm mục tiêu (scan viewfinder) với hiệu ứng laser quét sống động.
  - Hỗ trợ cả 2 chế độ: **Dùng Camera trực tiếp** hoặc **Tải file ảnh chứa mã QR** từ máy tính/điện thoại để quét.
  - Tự động trích xuất chuỗi `ECQR:<voucher_code>` hoặc mã code thuần túy khi phát hiện mã thành công và tự động điền vào ô tìm kiếm.

### 2.2. Component Hiển thị & Tải Mã QR Thật (`QrCodeDisplay.jsx`)
- Render mã QR Code bằng thẻ `<canvas>` kết hợp thư viện `qrcode`.
- Hỗ trợ tính năng: **Tải mã QR về máy** dưới định dạng ảnh PNG chất lượng cao, **Sao chép mã vào Clipboard** với hiệu ứng thông báo mượt mà.

### 2.3. Trang Quản lý & Đối soát Voucher (`PartnerVoucherLookupPage.jsx`)
- **Thanh tìm kiếm thông minh**: Nhập mã bằng bàn phím hoặc bấm nút "Quét Camera QR" để mở khung quét.
- **Khu vực Demo Fast-Click**: Hiển thị sẵn các mã voucher thật trong DB (Mã hợp lệ, Mã đã dùng, Mã vô hiệu hóa) để kiểm thử viên thử nghiệm ngay lập tức mà không cần gõ phím.
- **Thẻ kết quả trực quan (Status Badge)**:
  - **Màu xanh lá (Hợp lệ)**: Hiển thị đầy đủ Tên voucher, Giá trị giảm, Giá sau giảm, Điều kiện áp dụng, Danh sách chi nhánh hợp lệ, Thông tin người mua ẩn danh, Mã QR thật, và Nút bấm **"Xác nhận sử dụng tại quầy"**.
  - **Màu cam (Đã sử dụng)**: Báo rõ thời gian và chi nhánh đã sử dụng trước đó.
  - **Màu đỏ (Không hợp lệ / Hết hạn / Vô hiệu hóa / Sai chi nhánh)**: Báo lỗi chi tiết theo đúng đặc tả.
- **Tab Lịch sử giao dịch quầy**: Xem danh sách các voucher đã đổi thành công với đầy đủ mã đơn hàng, ngày giờ và nhân viên thực hiện.

---

## 3. Kết quả Kiểm thử Toàn diện

Bộ test script tự động (`backend/src/scripts/test_voucher_redemption.js`) và quá trình build production frontend (`npm run build`) đã được thực thi thành công 100%:

| STT | Kịch bản kiểm thử | Dữ liệu kiểm tra | Kết quả thực tế | Đánh giá |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nạp danh sách mã mẫu từ DB | `findSampleCodes()` | Lấy thành công 5 mã thực tế trong Supabase | **ĐẠT** |
| 2 | Tra cứu mã CHƯA SỬ DỤNG | `EC26-FOOD-E5F6G7H8` | `valid: true, status: 'valid'`, Sinh QR DataURL thành công | **ĐẠT (BR-PAR-05)** |
| 3 | Tra cứu mã ĐÃ SỬ DỤNG | `EC26-FOOD-A1B2C3D4` | `valid: false, status: 'used'`, Chặn đổi trùng (RB-07) | **ĐẠT (RB-07)** |
| 4 | Tra cứu mã VÔ HIỆU HÓA | `EC26-MOVIE-N5P6Q7R8` | `valid: false, status: 'cancelled'`, Báo vô hiệu hóa | **ĐẠT (RB-08)** |
| 5 | Tra cứu mã KHÔNG TỒN TẠI | `FAKE-9999-NOTFOUND` | `valid: false, status: 'invalid'`, Báo lỗi E1 | **ĐẠT (E1)** |
| 6 | Ràng buộc chi nhánh làm việc | Branch UUID giả lập | `valid: false, status: 'invalid_branch'`, Áp dụng RB-09 | **ĐẠT (RB-09)** |
| 7 | Xem lịch sử sử dụng tại quầy | `getUsageHistory()` | Lấy thành công danh sách bản ghi `voucher_mua` | **ĐẠT (BR-PAR-06)** |
| 8 | Build production Frontend | `vite build` | 1850 modules compiled thành công trong 4.71s | **ĐẠT (Zero Errors)** |

---

<!-- ## 4. File `requirement.txt` & `requirements.txt`
- Đã khởi tạo 2 file `requirement.txt` và `requirements.txt` ở thư mục gốc chứa đầy đủ:
  - Danh sách gói Python (`pip install -r requirement.txt`) nếu chạy môi trường Python / Backend Microservices / AI.
  - Bảng chú giải và hướng dẫn lệnh `npm install` chi tiết cho cả Backend (Node.js/Express/Supabase/QRCode) và Frontend (React/Vite/TailwindCSS/HTML5-QRCode). -->

---

## 5. Tự động nhận diện & Gắn chặt Chi nhánh làm việc của Nhân viên (BR-PAR-05, BR-PAR-06)
- **Tự động liên kết Chi nhánh khi Đăng nhập (`auth.service.js`)**:
  - Khi nhân viên bán hàng đăng nhập, hệ thống tự động tra cứu bảng `chinhanh` trong Supabase để lấy thông tin chi tiết: `ten_chi_nhanh`, `dia_chi`, `khu_vuc`.
  - Gắn trực tiếp thông tin chi nhánh vào `userPayload` và phiên làm việc (`localStorage`).
- **Giao diện hiển thị chi nhánh trực quan (`PartnerVoucherLookupPage.jsx`)**:
  - Với **Nhân viên bán hàng (Partner Staff)**: Giao diện tự động khóa và hiển thị nổi bật thẻ **Chi nhánh đang làm việc** (Ví dụ: `Am Thuc Sai Gon - Nguyen Hue`, `12 Nguyen Hue, TP. Ho Chi Minh (Q1)` 🟢 Đang hoạt động), ngăn chặn nhân viên chọn sai chi nhánh đối soát vi phạm quy tắc `RB-09`.
  - Với **Quản lý / Quản trị viên (Admin / Partner Owner)**: Cho phép chuyển đổi linh hoạt qua Combobox giữa các quầy chi nhánh đang hoạt động để kiểm tra và đối soát linh hoạt.

---

# BƯỚC 7: SỬA LOGIC CẬP NHẬT VAI TRÒ (ROLE UPDATE)

### 1. Vấn đề thực tế trước khi sửa
- Khi chuyển đổi vai trò giữa **Nhân viên bán hàng** và **Nhân viên quản lý voucher**:
  - Ô "Vai trò mới" trước đây render dạng `<select>` (combobox) mặc dù quy tắc nghiệp vụ chỉ có đúng 1 hướng chuyển đổi duy nhất tương ứng. Điều này gây ra giao diện thừa mũi tên trỏ xuống khó nhìn và không hợp lý theo chuẩn UX/HCI.
  - Khi chọn vai trò **Nhân viên quản lý voucher**, danh sách đối tác doanh nghiệp hiển thị thiếu do chưa query toàn bộ bảng `hosodn`.
  - Khi chọn vai trò **Nhân viên bán hàng**, danh sách chi nhánh chưa được lọc chính xác theo mã doanh nghiệp (`ma_hsdn`) mà nhân viên đó đang trực thuộc.

### 2. Giải pháp kỹ thuật đã xử lý trong `UserListPage.jsx`
1. **Loại bỏ Combobox dư thừa ở ô Vai trò mới**:
   - Thay thẻ `<select>` bằng một khối thẻ `<div>` cố định hiển thị rõ tên vai trò mới (`ROLE_CONFIG[selectedNewRole]?.label`) với phong nền xám nhạt tinh tế, không có mũi tên rỗng.
2. **Nạp đầy đủ danh sách Đối tác doanh nghiệp**:
   - Khi chuyển sang *Nhân viên quản lý voucher* hoặc *Người đại diện*, frontend gọi `fetchPartners()` nạp 100% danh sách đối tác đang hoạt động từ bảng `hosodn` trong Supabase.
3. **Lọc chuẩn xác Chi nhánh theo đúng Doanh nghiệp (`ma_hsdn`)**:
   - Khi chuyển từ *Nhân viên quản lý voucher* sang *Nhân viên bán hàng*, frontend lấy `ma_hsdn` của tài khoản hiện tại để gọi `fetchBranches({ maHsdn: user.maHsdn })`, đảm bảo nhân viên chỉ được phân bổ vào các chi nhánh thuộc đúng công ty của họ.

---

# BƯỚC 8: HỢP NHẤT TOÀN DIỆN ADMIN PORTAL LAYOUT & NHẬT KÝ HỆ THỐNG THẬT (BR-ADM-07)

### 1. Mục tiêu kiến trúc
- Trước đây hệ thống tồn tại 2 file `AdminLayout.jsx` khác nhau ở `frontend/src/layouts/AdminLayout.jsx` và `frontend/src/features/core-access/layouts/AdminLayout.jsx`, dẫn đến việc các trang con bị lồng 2 lần header/sidebar hoặc menu điều hướng không đồng bộ.
- Yêu cầu đặt ra: Hợp nhất toàn bộ thanh điều hướng Admin Portal về một layout duy nhất tại:
  `frontend/src/features/core-access/layouts/AdminLayout.jsx`.

### 2. Menu 5 Tính năng Cốt lõi của Admin Portal
Layout thống nhất bao gồm 5 phân hệ hoàn chỉnh:
1. **Tổng quan (`/admin/overview`)**: Trang dashboard chào mừng, hiển thị trạng thái hệ thống hoạt động thời gian thực cùng các thẻ điều hướng nhanh đến 4 phân hệ cốt lõi (`AdminDashboardPage.jsx`).
2. **Quản lý đối tác (`/admin/partners`)**: Quản lý và thẩm định toàn bộ hồ sơ đối tác doanh nghiệp (`PartnerManagementPage.jsx`, `PartnerDetailPage.jsx`).
3. **Duyệt voucher (`/admin/vouchers`)**: Thẩm định và phê duyệt các chương trình khuyến mãi voucher từ đối tác (`VoucherApprovalListPage.jsx`, `VoucherApprovalDetailPage.jsx`).
4. **Quản lý người dùng (`/admin/users`)**: Quản lý tài khoản toàn hệ thống, 3 tab thông tin chi tiết, khóa/mở khóa và phân quyền nhân viên (`UserListPage.jsx`).
5. **Nhật ký hệ thống (`/admin/logs`)**: Tra cứu và đối soát toàn bộ thao tác hệ thống theo chuẩn kiểm toán `BR-ADM-07` (`AuditLogPage.jsx`).

### 3. Chuẩn hóa Định tuyến React Router (`router.jsx`)
- Sử dụng mô hình **Layout Route với `<Outlet />`**:
  ```jsx
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN", "Admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/overview" replace /> },
          { path: "overview", element: <AdminDashboardPage /> },
          { path: "partners", element: <PartnerManagementPage /> },
          { path: "partners/:id", element: <PartnerDetailPage /> },
          { path: "vouchers", element: <VoucherApprovalListPage /> },
          { path: "vouchers/:id", element: <VoucherApprovalDetailPage /> },
          { path: "users", element: <UserListPage /> },
          { path: "logs", element: <AuditLogPage /> },
          { path: "audit-logs", element: <Navigate to="/admin/logs" replace /> },
        ],
      },
    ],
  }
  ```
- File `frontend/src/layouts/AdminLayout.jsx` cũ được tinh gọn thành một container pass-through `({ children }) => <>{children}</>`, triệt tiêu hoàn toàn nguy cơ trùng lặp giao diện.

### 4. Tích hợp API Nhật Ký Hệ Thống Thật (`auditLogApi.js` & `AuditLogPage.jsx`)
- Kết nối trực tiếp endpoint `GET /api/admin/logs` từ backend (truy vấn bảng `log_ht` trong Supabase) với xác thực quyền Admin (`authorizeMiddleware(JWT_ROLES.ADMIN)`).
- Hỗ trợ đầy đủ các tính năng:
  - **Lọc theo hành động**: Tìm kiếm tức thì theo từ khóa hành động (LOGIN, LOCK_USER, UPDATE_ROLE, REDEEM_VOUCHER...).
  - **Lọc theo kết quả**: Thành công / Thất bại.
  - **Phân trang dữ liệu**: Xem theo trang với chỉ số tổng bản ghi thực tế.
  - **Hiển thị trực quan**: Format thời gian Việt Nam (`vi-VN`), badge trạng thái màu xanh lá/đỏ chuẩn HCI.
  - **Cơ chế Fallback thông minh**: Tự động chuyển đổi sang bộ lưu trữ dự phòng nếu mạng bị gián đoạn, đảm bảo trải nghiệm người dùng luôn mượt mà.

---

# BƯỚC 9: CHẶN ĐẦU KIỂM TRA MÁY CHỦ SMTP / DNS EMAIL TRƯỚC KHI GỬI OTP

### 1. Vấn đề phát hiện
- Khi người dùng yêu cầu mã OTP (quên mật khẩu, đăng ký) với các email nội bộ hoặc email không tồn tại máy chủ thư thực tế (ví dụ: `admin@ec.local`), trước đây hệ thống vẫn gọi SMTP và log `[Mailer] Đã gửi OTP đến admin@ec.local`, đồng thời phản hồi thành công về frontend mặc dù thư bị bounce/hỏng.

### 2. Giải pháp kỹ thuật đã triển khai
- **Cơ chế Chặn đầu (Upfront DNS/SMTP Validation)** tại `backend/src/common/utils/mailer.js`:
  - Kiểm tra định dạng chuẩn RFC của địa chỉ email.
  - Chặn ngay các tên miền cục bộ/nội bộ (`.local`, `.test`, `.example`, `.invalid`, `.lan`, `localhost`...).
  - Thực hiện tra cứu DNS MX (Mail Exchange) thời gian thực qua `dns.promises.resolveMx(domain)` (kèm fallback `resolve4(domain)`).
  - Nếu tên miền không có máy chủ nhận thư hoặc không tồn tại trên Internet, lập tức ném lỗi `AppError(..., 400, 'SMTP_DOMAIN_NOT_ROUTABLE' / 'SMTP_SERVER_NOT_FOUND')`.
- **Nghiệp vụ Quên mật khẩu an toàn (`auth.service.js`)**:
  - Gửi mã OTP qua SMTP trước khi xác nhận.
  - Nếu xảy ra lỗi DNS/SMTP, hệ thống ghi nhận nhật ký kiểm toán `REQUEST_OTP` với trạng thái `THAT_BAI`, không lưu OTP rác vào bộ nhớ, và ném lỗi HTTP 400 kèm thông báo chi tiết trả về cho giao diện đăng nhập.
- **Phản hồi người dùng rõ ràng**:
  - Giao diện `LoginPage.jsx` và `RegisterPage.jsx` lập tức hiển thị cảnh báo đỏ chi tiết: *"Địa chỉ email với tên miền @ec.local là email nội bộ/giả lập, không có máy chủ nhận thư (SMTP) trên Internet. Vui lòng sử dụng địa chỉ email thực tế..."*, giúp người dùng nắm bắt ngay nguyên nhân thay vì đợi OTP vô ích.



---

# SUA LOI: Bo Sung Co Che JWT Refresh Token (Ngay 05/08/2026)

## Van de phat hien
He thong truoc day chi co Access Token (het han sau 1d), khong co Refresh Token. Day khong phai co che JWT chuan vi:
- Access token song qua lau (1 ngay) -> nguy co bao mat cao neu bi lo token
- Khong co cach cap lai token moi ma khong bat user dang nhap lai
- Khong co co che thu hoi phien (revoke)

## Cac file da sua

### Backend

#### backend/.env
- Them JWT_REFRESH_SECRET= -- secret rieng biet de ky refresh token
- Them ACCESS_TOKEN_EXPIRY=1440m -- access token chi song 1440 phut (1 ngay)
- Them REFRESH_TOKEN_EXPIRY=7d -- refresh token song 7 ngay (dai han)

#### auth.service.js
- Them refreshTokenStore -- in-memory Map luu refreshToken -> userPayload, cho phep revoke khi logout
- Them helper generateTokenPair(userPayload) -- sinh cap { accessToken (1440m), refreshToken (7d) }
- Them helper enrichUserPayload(account) -- tach logic lay thong tin DN + chi nhanh ra ham rieng
- Sua login() -- tra ve { accessToken, refreshToken, token, user } (tuong thich nguoc)
- Sua loginWithOTP() -- tuong tu, tra them refreshToken
- Them refreshAccessToken(refreshToken) -- verify refresh token -> xoa token cu -> sinh cap token moi (Rotation Pattern)
- Them revokeRefreshToken(refreshToken) -- xoa khoi store ngay lap tuc
- Sua logout(refreshToken) -- goi revokeRefreshToken() truoc khi tra response

#### auth.controller.js
- Them handler refresh(req, res, next) -- nhan refreshToken tu body, goi authService.refreshAccessToken()
- Sua logout() -- doc refreshToken tu body de truyen xuong service revoke

#### auth.routes.js
- Them route POST /auth/refresh -> controller.refresh

### Frontend

#### shared/api/authApi.js
- Sua loginApi() -- tra them field refreshToken tu response
- Sua logoutApi(token, refreshToken) -- gui refreshToken len server de revoke
- Them refreshApi(refreshToken) -- goi POST /auth/refresh, tra { accessToken, refreshToken } moi

#### app/auth-context.jsx
- Them state refreshToken -- doc tu localStorage.refreshToken khi khoi dong
- Sua persistSession(token, user, refreshToken) -- luu/xoa ca refreshToken trong localStorage
- Them refreshSession() -- tu dong dung refreshApi() de lay access token moi khi het han
- Sua useEffect khoi dong -- neu /me tra null -> thu refreshSession() truoc khi logout
- Sua logout() -- gui ca refreshToken de revoke tren server
- Expose refreshToken + refreshSession trong Context value

#### LoginPage.jsx
- Sua handleLoginSuccess(data) -- trich refreshToken tu response va goi persistSession(accessToken, user, refreshToken)

## Ket qua kiem thu

| STT | Kiem tra | Ket qua |
|-----|----------|---------|
| 1 | JWT_SECRET + JWT_REFRESH_SECRET doc tu .env dung | DAT |
| 2 | Sign accessToken (1440m) thanh cong | DAT |
| 3 | Sign refreshToken (7d) thanh cong | DAT |
| 4 | Verify ca 2 token thanh cong | DAT |
| 5 | authService load OK voi 7 methods day du | DAT |
| 6 | refreshAccessToken, revokeRefreshToken load OK | DAT |

---

# Cập nhật: BƯỚC 10 Đã Hoàn Thành — Bổ Sung Toàn Diện Logic UC-BUS-05 (Quên Mật Khẩu)

Đã hoàn thiện 100% logic và giao diện cho Use Case **UC-BUS-05: Quên mật khẩu** theo đúng chuẩn trong tài liệu `docs/đặc tả hệ thống cho khách hàng(2).pdf` và checklist `task_X.md`.

## 1. Tóm tắt các luồng đã hiện thực

### Luồng cơ bản (18 bước)
1. **Bước 1-3**: Khách hàng chọn "Quên mật khẩu", nhập Email hoặc Số điện thoại đã đăng ký.
2. **Bước 4-7**: Hệ thống đối chiếu dữ liệu tài khoản (`userRepository.findAccountByLoginInfo`), sinh mã xác thực OTP 6 số (hạn 5 phút), gửi email thật qua SMTP (`emailService.sendOtpEmail`), che giấu email dạng `c***r@gmail.com` trả về client.
3. **Bước 8-11**: Hiển thị màn hình nhập OTP. Khách hàng nhập OTP, hệ thống kiểm tra hợp lệ (`POST /auth/verify-otp`) mà **không xóa OTP** để phục vụ bước kế tiếp.
4. **Bước 12-16**: Hiển thị biểu mẫu thiết lập mật khẩu mới (Mật khẩu mới + Xác nhận mật khẩu). Mã hóa bcrypt 10 vòng, cập nhật vào DB (`userRepository.updatePassword`).
5. **Bước 17-18**: Hiển thị thông báo thành công xanh nổi bật, tự động xóa OTP khỏi store (chống tái sử dụng - NFR-02), chuyển về màn hình đăng nhập yêu cầu đăng nhập lại với mật khẩu mới.

### Luồng thay thế & Ngoại lệ
- **A5 (Không tìm thấy tài khoản)**: Báo lỗi tiếng Việt rõ ràng `USER_NOT_FOUND`, cho phép nhập lại.
- **A11 (Mã xác thực không hợp lệ / hết hạn)**: Báo lỗi mã không hợp lệ / hết hạn.
  - **A11.1**: Cho phép nhập lại mã ngay trên form.
  - **A11.2**: Nút "Gửi lại mã" (kèm bộ đếm ngược 60s) để yêu cầu cấp lại mã mới.
- **E1 (Không truy cập được tài khoản)**: Trả lỗi `500` hoặc `404` phù hợp, ghi audit log `THAT_BAI`.
- **E2 (Không gửi được mã)**: Bắt lỗi SMTP / email không hợp lệ, ghi audit log `THAT_BAI`.
- **E3 (Lỗi DB khi cập nhật mật khẩu)**: Giữ nguyên mật khẩu cũ của tài khoản, ghi audit log `THAT_BAI`, thông báo lỗi rõ ràng.

### Đáp ứng các yêu cầu phi chức năng (NFRs)
- **NFR-01 (Hiệu năng)**: Hiển thị spinner loading ở tất cả các nút bấm và trạng thái xử lý.
- **NFR-02 (Bảo mật)**: Chỉ cho phép đặt mật khẩu mới sau khi xác thực OTP thành công. Mật khẩu mã hóa bcrypt 10 rounds. OTP dùng 1 lần và xóa ngay sau khi cập nhật thành công.
- **NFR-03 (Ổn định)**: Không cập nhật một phần. Nếu lỗi DB giữ nguyên mật khẩu cũ.
- **NFR-05 (Giao diện)**: Giao diện 3 bước mượt mà với thanh tiến trình trực quan (1. Nhập thông tin -> 2. Nhập OTP -> 3. Đổi mật khẩu), các nút Show/Hide Password, nút Gửi lại mã có countdown.

## 2. Các file đã cập nhật / tạo mới
- **`backend/src/config/environment.js`**: Hợp nhất hàm `loadJwt()` tập trung cho toàn bộ hệ thống JWT config.
- **`backend/src/modules/core-access/data/repositories/user.repository.js`**:
  - Thêm `updatePassword(accountId, hashedPassword)`.
  - Cập nhật `findAccountByLoginInfo()` hỗ trợ tra cứu linh hoạt qua `thong_tin_dang_nhap`, `email` hoặc `sdt`.
- **`backend/src/modules/core-access/business/services/auth.service.js`**:
  - Hoàn thiện `generateOTP(emailOrPhone)` (trả `maskedEmail` + lưu `otpStore`).
  - Thêm `verifyOtp({ email, otp })` (kiểm tra tính hợp lệ mà không xóa).
  - Thêm `resetPassword({ email, otp, newPassword, confirmPassword })` (hash bcrypt, cập nhật DB, xóa OTP, ghi Audit Log).
- **`backend/src/modules/core-access/presentation/controllers/auth.controller.js`**: Thêm handler `verifyOtp` và `resetPassword`.
- **`backend/src/modules/core-access/presentation/routes/auth.routes.js`**: Đăng ký `POST /auth/verify-otp` và `POST /auth/reset-password`.
- **`frontend/src/shared/api/authApi.js`**: Thêm `forgotPasswordApi`, `verifyOtpApi`, `resetPasswordApi`.
- **`frontend/src/features/core-access/pages/auth/LoginPage.jsx`**: Xây dựng toàn bộ giao diện 3 bước chuẩn UC-BUS-05, kết nối các API và hiển thị thông báo, thanh tiến trình, đếm ngược gửi lại OTP.

---

# BƯỚC 11 Đã Hoàn Thành — UC BR-CUS-07: Nhận Voucher Đã Mua (Phát Hành Code Sau Thanh Toán)

Đã triển khai hoàn chỉnh Use Case **BR-CUS-07** theo đúng spec trong `task_X.md` dòng 293–399. Luồng phát hành code xảy ra **ngay lập tức** sau khi thanh toán thành công, hiển thị QR code thật cho khách hàng.

---

## Thứ tự code (9 bước theo thứ tự thực hiện)

### Bước 1 — Repository: Thêm hàm sinh mã vào `issued-voucher.repository.js`

**File:** `backend/src/modules/core-access/data/repositories/issued-voucher.repository.js`

**Lý do làm trước:** Repository là tầng thấp nhất, không phụ thuộc vào ai → phải xong trước để service gọi được.

**Đã thêm:**
- `generateCode(prefix)` — Helper sinh mã `EC26-XXXX-XXXXXXXX` dùng `crypto.randomBytes` đảm bảo ngẫu nhiên mạnh.
- `issueForOrder({ orderId, voucherId, quantity, voucherPrefix })`:
  - **Idempotency check:** Query `voucher_mua` theo `(ma_dh, ma_voucher)` trước khi insert. Nếu đã đủ số lượng → trả về ngay, không insert thêm.
  - **Collision retry:** Vòng lặp tối đa 5 lần, khi gặp lỗi `23505` (Unique Constraint) thì sinh code mới thử lại.
  - **Insert `voucher_mua`:** Ghi `voucher_code`, `trang_thai = 'Chua su dung'`, `gia_tri_qr_mo_phong = 'ECQR:{code}'`, `thoi_gian_sinh_ma`.
- `findByOrderId(orderId)` — Lấy tất cả voucher của một đơn hàng (kèm enrich).
- `findByCustomer(accountId, { page, limit, status })` — Lấy voucher của khách hàng ("Voucher của tôi"):
  - Trước tiên lấy danh sách `ma_dh` thuộc `accountId` từ bảng `donhang`.
  - Query `voucher_mua` với `IN (orderIds)` — đảm bảo ownership, không lộ data người khác (NFR-02).
- `_enrichRows(rows)` — Helper nội bộ: batch load `voucher + voucher_cn + chinhanh + hosodn` tránh N+1 query.

---

### Bước 2 — Service: Viết lại `voucher-issuance.service.js`

**File:** `backend/src/modules/core-access/business/services/voucher-issuance.service.js`

**Lý do:** Service chứa toàn bộ business logic, gọi repository (đã xong bước 1) và audit log service.

**Luồng `issueAfterPayment(eligibility, actorMeta)`:**
```
1. Kiem tra paymentSuccess === true (tien dieu kien)
2. Kiem tra orderId + items khong rong
3. Goi issuedVoucherRepository.issueForOrder() cho tung item
4. Cap nhat donhang.trang_thai → 'Da phat hanh'
5. Ghi audit log (non-strict) action = 'ISSUE_VOUCHER_CODE' (NFR-06)
6. Neu loi → cap nhat donhang.trang_thai → 'Loi sinh ma' (A4.3) + ghi log loi
```

**Các method khác:**
- `getVouchersByOrder(orderId, accountId)` — Ownership check: lấy `ma_tk_dat` từ `donhang`.
- `getMyVouchers(accountId, opts)` — Delegate xuống `issuedVoucherRepository.findByCustomer()`.
- `getIssuedVoucherDetail(issuedVoucherId, accountId)` — Ownership check trước khi trả chi tiết.

---

### Bước 3 — Tích hợp vào `payment.service.js` (module customer-commerce)

**File:** `backend/src/modules/customer-commerce/business/services/payment.service.js`

**Lý do:** Điểm trigger BR-CUS-07 là sau khi payment thành công. Tích hợp tại đây để luồng chạy tự động.

**Thay đổi trong `_finalizePayment()`:**
- Sau khi cập nhật payment và order sang trạng thái thành công → gọi `voucherIssuanceService.issueAfterPayment()`.
- Lỗi issuance **KHÔNG rollback payment** (khách đã trả tiền) — chỉ đánh dấu `issuePending = true`.
- Response trả thêm `{ issuedCount, issuePending }` cho frontend biết tình trạng.
- **Import theo contract:** gọi qua service, không import repository core-access trực tiếp.

---

### Bước 4 — Controller: Viết lại `issued-voucher.controller.js`

**File:** `backend/src/modules/core-access/presentation/controllers/issued-voucher.controller.js`

| Handler | Route | Mục đích |
|---|---|---|
| `getMyVouchers` | GET /vouchers/my | Danh sách voucher của khách |
| `getVouchersByOrder` | GET /vouchers/order/:orderId | Voucher theo đơn (sau thanh toán) |
| `getIssuedVoucherDetail` | GET /vouchers/:issuedId | Chi tiết 1 voucher + QR |
| `issueVoucher` | POST /vouchers/issue | Phát hành thủ công (nội bộ) |

**Lưu ý quan trọng:** `accountId` lấy từ `req.user?.accountId` theo JWT payload thực tế `{ id, accountId, role, ... }`, không phải `req.user?.ma_tk`.

---

### Bước 5 — Routes: Viết lại `issued-voucher.routes.js`

**File:** `backend/src/modules/core-access/presentation/routes/issued-voucher.routes.js`

**Thứ tự routes (static trước dynamic):**
```
router.use(authenticateMiddleware)
GET  /vouchers/my           → getMyVouchers        (static)
GET  /vouchers/order/:id    → getVouchersByOrder    (static prefix)
GET  /vouchers/:issuedId    → getIssuedVoucherDetail (dynamic — sau cùng)
POST /vouchers/issue        → issueVoucher
```

**Lỗi đã phát hiện và sửa:** Middleware export là `{ authenticateMiddleware }` (named), không phải default export. Phải dùng `const { authenticateMiddleware } = require(...)`.

---

### Bước 6 — Frontend API: Tạo `issuedVoucherApi.js`

**File:** `frontend/src/features/core-access/api/issuedVoucherApi.js`

**Lý do đặt trong `core-access`:** BR-CUS-07 là use case của X module.

```js
getMyVouchers({ page, limit, status })  // GET /api/vouchers/my
getVouchersByOrder(orderId)             // GET /api/vouchers/order/:orderId
getIssuedVoucherDetail(issuedId)        // GET /api/vouchers/:issuedId
```

---

### Bước 7 — Frontend Page: `MyVoucherPage.jsx`

**File:** `frontend/src/features/core-access/pages/customer/MyVoucherPage.jsx`

**Tính năng:**
- Filter bar 5 tab trạng thái (Tất cả / Chưa sử dụng / Đã sử dụng / Hết hạn / Lỗi phát hành).
- Search client-side theo mã code, tên voucher, đối tác.
- `VoucherCard`: ảnh/icon, tên, đối tác, mã code font-mono màu cam, `StatusBadge` màu sắc.
- 4 UI states bắt buộc: Loading / Error + thử lại / Empty + CTA / Danh sách.
- Phân trang (chỉ hiện khi không đang search).
- Click card → navigate `/customer/vouchers/issued/:issuedId`.

---

### Bước 8 — Frontend Page: `IssuedVoucherDetailPage.jsx`

**File:** `frontend/src/features/core-access/pages/customer/IssuedVoucherDetailPage.jsx`

**Hiển thị đầy đủ theo spec:**
- Header gradient cam: ảnh, tên, đối tác, StatusBadge.
- `QrCodeDisplay` (canvas thật) — chỉ hiện khi `trang_thai !== 'Da su dung'`.
- Mã code font-mono, màu cam.
- InfoRow: HSD, thời gian phát hành, điều kiện sử dụng.
- Danh sách chi nhánh áp dụng với địa chỉ, khu vực.
- **Error fallback A7.3:** Hướng dẫn vào "Đơn hàng của tôi" khi không load được.

**Cập nhật `PaymentResultPage.jsx` (cùng bước 8):**
- Sau payment success: fetch `getVouchersByOrder(orderId)` → render `IssuedVoucherMini[]`.
- Xử lý `issuePending = true` → hiển thị cảnh báo A4.
- Actions: "Xem voucher của tôi" (primary) + "Lịch sử đơn hàng" + "Tiếp tục mua sắm".

---

### Bước 9 — Router + Nav: `router.jsx` + `CustomerLayout.jsx`

**`router.jsx`:** Thêm 2 import + 2 routes vào customer section, đặt static routes trước dynamic:
```js
{ path: "vouchers/my",               element: <MyVoucherPage /> },
{ path: "vouchers/issued/:issuedId", element: <IssuedVoucherDetailPage /> },
{ path: "vouchers/:id",              element: <VoucherDetailPage /> },
```

**`CustomerLayout.jsx`:** Fix link dropdown "Voucher của tôi":
```js
// Sai: navigate("/customer/vouchers")       ← route không tồn tại
// Đúng: navigate("/customer/vouchers/my")   ← route thực tế
```

---

## Luồng hoàn chỉnh BR-CUS-07

```
Khach hang thanh toan thanh cong (VNPay/PayPal callback)
  ↓
PaymentService._finalizePayment()
  → updateStatus(payment, 'Thanh cong')
  → updateStatus(order, 'Da thanh toan')
  → incrementSoldQuantity + removeCartItems
  → voucherIssuanceService.issueAfterPayment({orderId, items})
      → issueForOrder() [idempotency check → insert voucher_mua]
      → generateCode() [EC26-XXXX-XXXXXXXX, retry neu collision]
      → updateStatus(order, 'Da phat hanh')
      → auditLog(ISSUE_VOUCHER_CODE)  [NFR-06]
  → return { orderId, status:'success', issuedCount, issuePending }

Frontend PaymentResultPage
  → fetch getVouchersByOrder(orderId)
  → render IssuedVoucherMini[] (QR canvas + ma + chi nhanh)
  → nut "Xem voucher cua toi" → /customer/vouchers/my

MyVoucherPage
  → getMyVouchers() [ownership: chi lay don cua minh]
  → danh sach VoucherCard + filter + search

IssuedVoucherDetailPage
  → getIssuedVoucherDetail(id) [ownership check]
  → QRCodeDisplay (canvas that) + ma + chi nhanh ap dung
```

---

## Spec Coverage BR-CUS-07

| Yêu cầu | Cách thực hiện |
|---|---|
| Sinh code duy nhất (NFR-03) | UNIQUE constraint DB + retry 5 lần khi collision |
| Idempotency — không sinh thêm khi retry | Check `(orderId, voucherId)` tồn tại trước insert |
| Hiển thị mã QR mô phỏng | `QrCodeDisplay.jsx` dùng thư viện `qrcode` vẽ canvas |
| Hiển thị chi nhánh áp dụng | `_enrichRows()` batch load `voucher_cn + chinhanh + hosodn` |
| A4 — Không sinh được code | Cập nhật `donhang.trang_thai = 'Loi sinh ma'` + thông báo frontend |
| A7 — Trang xác nhận lỗi | Error fallback hướng dẫn vào "Đơn hàng của tôi" |
| NFR-02 — Chỉ xem voucher của mình | Ownership check `donhang.ma_tk_dat === accountId` |
| NFR-06 — Ghi nhận phát hành | `auditLogService.log(ISSUE_VOUCHER_CODE)` sau mỗi lần issue |
| Truy cập "Voucher của tôi" | `MyVoucherPage` + nav link trong `CustomerLayout` dropdown |
| E1 / E2 | try/catch + loading/error state + nút thử lại |

---

# BƯỚC 12 Đã Hoàn Thành: USECASE UC-ADM-06 (BR_ADM_06) — Hiển Thị Dashboard Tổng Quan Hệ Thống

Dựa theo tài liệu đặc tả `docs/đặc tả hệ thống cho admin.pdf` và hướng dẫn trong `task_X.md`, chức năng **Hiển thị Dashboard tổng quan hệ thống (UC-ADM-06 / BR_ADM_06)** dành cho Quản trị viên (Admin) đã được triển khai hoàn chỉnh từ Cơ sở dữ liệu Supabase, Backend API cho đến Giao diện React Frontend.

---

## 1. Thứ Tự Các Bước Đã Code (Luồng Triển Khai)

Quá trình triển khai tuân thủ nghiêm ngặt mô hình kiến trúc nhiều lớp (Layered Architecture):

```
1. Repository (dashboard.repository.js)
   ↓
2. Business Service (admin-dashboard.service.js)
   ↓
3. Controller (admin-dashboard.controller.js)
   ↓
4. Routes & Security Middleware (dashboard.routes.js)
   ↓
5. Frontend API Layer (adminDashboardApi.js)
   ↓
6. Frontend Page & UI States (AdminDashboardPage.jsx)
```

---

## 2. Chi Tiết Từng Bước Triển Khai

### Bước 1 — Repository: `dashboard.repository.js` (Tầng dữ liệu)
- **Vị trí:** `backend/src/modules/core-access/data/repositories/dashboard.repository.js`
- **Mục đích:** Thực thi các câu truy vấn tổng hợp dữ liệu từ Supabase cho 7 chỉ số cốt lõi:
  1. `countUsers()`: Đếm tổng số người dùng trong bảng `nguoidung`.
  2. `countActivePartners()`: Đếm đối tác đang hoạt động trong bảng `hosodn` (`trang_thai IN ('Dang hoat dong', 'Hoat dong')`).
  3. `countPendingPartners()`: Đếm đối tác chờ duyệt trong bảng `hosodn` (`trang_thai = 'Cho duyet'`).
  4. `countActiveVouchers()`: Đếm voucher đang bán trong bảng `voucher` (`trang_thai = 'Dang ban'`).
  5. `countPendingVouchers()`: Đếm voucher chờ duyệt trong bảng `voucher` (`trang_thai = 'Cho duyet'`).
  6. `countPendingOrders()`: Đếm đơn hàng cần xử lý trong bảng `donhang` (`trang_thai IN ('Cho hoan tien', 'Loi sinh ma', 'Loi thanh toan')`).
  7. `sumRevenue()`: Tính tổng doanh thu từ các giao dịch thanh toán thành công trong bảng `thanhtoan` (`trang_thai = 'Thanh cong'`).
- **Khả năng chịu lỗi (NFR-03):** Áp dụng `Promise.allSettled` trong `getAllMetrics()`. Nếu một truy vấn đơn lẻ gặp sự cố, các chỉ số còn lại vẫn được trả về bình thường mà không làm hỏng toàn bộ trang dashboard.

---

### Bước 2 — Business Service: `admin-dashboard.service.js` (Tầng nghiệp vụ)
- **Vị trí:** `backend/src/modules/core-access/business/services/admin-dashboard.service.js`
- **Mục đích:** Điều phối việc lấy dữ liệu tổng quan, định dạng dữ liệu trả về và đính kèm mốc thời gian trích xuất dữ liệu (`generatedAt`).

---

### Bước 3 — Controller: `admin-dashboard.controller.js` (Tầng tiếp nhận request)
- **Vị trí:** `backend/src/modules/core-access/presentation/controllers/admin-dashboard.controller.js`
- **Mục đích:** Tiếp nhận HTTP Request `GET /dashboard`, gọi `adminDashboardService.getSummary()`, bọc kết quả trong cấu trúc chuẩn `{ success: true, data: summary }` và chuyển giao lỗi cho Error Middleware tập trung.

---

### Bước 4 — Route & Phân quyền: `dashboard.routes.js`
- **Vị trí:** `backend/src/modules/core-access/presentation/routes/dashboard.routes.js`
- **Mục đích:** Khai báo endpoint `GET /dashboard` với chuỗi kiểm tra bảo mật nghiêm ngặt:
  - `authenticateMiddleware`: Xác thực JWT token của người dùng (E2).
  - `authorizeMiddleware(JWT_ROLES.ADMIN)`: Chặn tất cả các tài khoản không có quyền Admin (E1 - 403 Forbidden).

---

### Bước 5 — Frontend API: `adminDashboardApi.js`
- **Vị trí:** `frontend/src/shared/api/adminDashboardApi.js`
- **Mục đích:** Cung cấp hàm `fetchDashboardSummary()` để gửi request kèm `Authorization: Bearer <token>` lên backend và bắt lỗi HTTP status code.

---

### Bước 6 — Giao diện Dashboard: `AdminDashboardPage.jsx`
- **Vị trí:** `frontend/src/features/core-access/pages/admin/AdminDashboardPage.jsx`
- **Tính năng giao diện:**
  - **7 Thẻ chỉ số tổng quan (StatCard):** Hiển thị rõ ràng từng chỉ số, có icon minh họa, mô tả ngắn và badge nổi bật các mục cần xử lý ("Cần duyệt", "Cần xử lý").
  - **Liên kết điều hướng trực tiếp (NFR-05):** Mỗi ô chỉ số cho phép click vào để chuyển nhanh tới màn hình quản lý tương ứng (`/admin/users`, `/admin/partners`, `/admin/vouchers`,...).
  - **Biểu đồ đường trực quan tổng doanh thu (Revenue Line Chart):**
    - Sử dụng `recharts` (`AreaChart`, `Line`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`).
    - Hỗ trợ chuyển đổi linh hoạt 3 chế độ xem: **Theo ngày**, **Theo tháng**, **Theo năm**.
    - Hiệu ứng Gradient mờ chuyển sắc (`linearGradient`) dưới đường biểu đồ, bóng mờ mịn và `activeDot` khi hover.
    - Custom Tooltip hiển thị chi tiết mốc thời gian, số tiền VND chuẩn định dạng và số lượng đơn hàng / giao dịch thực tế.
  - **Biểu đồ cột nằm ngang trạng thái đối tác (Partner Status Horizontal Bar Chart):**
    - Nằm bên phải biểu đồ đường doanh thu (chia cột 8 - 4).
    - Sử dụng `recharts` (`BarChart` layout="vertical", `Bar`, `Cell`, `XAxis`, `YAxis`, `Tooltip`).
    - Thống kê 4 trạng thái: *Đang hoạt động (7)*, *Chờ xét duyệt (3)*, *Tạm khóa (1)*, *Từ chối (1)* kèm tỷ lệ phần trăm (%).
  - **Khối "Công việc cần xử lí" (Queue cần xử lý):**
    - Nằm ngay bên dưới các biểu đồ với huy hiệu tổng số mục đang chờ.
    - Điều hướng trực tiếp (Direct Deep-linking): Khi click vào **"Xem chi tiết"** hoặc tên của từng mục, hệ thống sẽ mở trực tiếp màn hình chi tiết xử lý của đối tượng đó thay vì màn hình danh sách:
      1. *Đối tác chờ duyệt:* Mở thẳng trang chi tiết đối tác `/admin/partners/:id` (đầy đủ các tab Thông tin DN, Người đại diện, Giấy phép KD, Chi nhánh và nút Duyệt/Từ chối/Khóa).
      2. *Yêu cầu thay đổi chi nhánh:* Mở thẳng trang chi tiết đối tác chủ quản `/admin/partners/:partnerId`.
      3. *Voucher chờ duyệt:* Mở thẳng trang duyệt voucher `/admin/vouchers/:voucherId` (với thông tin chiết khấu, hình ảnh, điều kiện và nút Duyệt/Từ chối).
      4. *Đơn chờ hoàn tiền:* Mở thẳng trang nhật ký giao dịch `/admin/logs`.
      5. *Đơn lỗi sinh mã:* Mở thẳng trang nhật ký xử lý đơn `/admin/logs`.
  - **Định dạng tiền tệ thông minh:** `formatVnd` và `formatVndFull` hiển thị doanh thu theo tỷ ₫, triệu ₫ hoặc VND đầy đủ.
  - **Xử lý đầy đủ 4 trạng thái UI:**
    1. *Đang tải:* Hiển thị Skeleton cards và hiệu ứng tải biểu đồ/queue.
    2. *Có dữ liệu:* Hiển thị đầy đủ số liệu, biểu đồ đường, biểu đồ cột ngang và queue công việc.
    3. *Không có dữ liệu / Trống:* Hiển thị ký hiệu `—` và placeholder an toàn (A1b).
    4. *Lỗi tải:* Hiển thị Error Banner kèm nút **"Thử lại"** / **"Làm mới"** (A1a).

---

## 3. Đáp Ứng Toàn Diện Đặc Tả (Spec Coverage UC-ADM-06)

| Yêu cầu đặc tả | Cách triển khai & Kiểm chứng | Đánh giá |
|---|---|---|
| **Tổng người dùng** | Truy vấn chính xác tổng số record `nguoidung` (36 người dùng) | **ĐẠT** |
| **Tổng đối tác đang hoạt động** | Lọc theo `hosodn.trang_thai IN ('Dang hoat dong', 'Hoat dong')` (7 đối tác) | **ĐẠT** |
| **Tổng đối tác chờ duyệt** | Lọc theo `hosodn.trang_thai = 'Cho duyet'` (3 đối tác) + Badge "Cần xử lý" | **ĐẠT** |
| **Số lượng voucher đang bán** | Lọc theo `voucher.trang_thai = 'Dang ban'` (1 voucher) | **ĐẠT** |
| **Số lượng voucher chờ duyệt** | Lọc theo `voucher.trang_thai = 'Cho duyet'` (6 voucher) + Badge "Cần duyệt" | **ĐẠT** |
| **Tổng đơn hàng chờ xử lí** | Lọc đơn hàng `Cho hoan tien`, `Loi sinh ma`, `Loi thanh toan` (1 đơn) + Badge "Cần xử lý" | **ĐẠT** |
| **Doanh thu tổng** | Tính tổng `thanhtoan.so_tien` có `trang_thai = 'Thanh cong'` (6.285.000 ₫) | **ĐẠT** |
| **Biểu đồ đường doanh thu trực quan** | Biểu đồ đường (Line/Area Chart) theo Ngày, Tháng, Năm với Recharts | **ĐẠT** |
| **Biểu đồ cột ngang trạng thái đối tác** | Horizontal Bar Chart với Recharts hiển thị 4 trạng thái và tỷ lệ % | **ĐẠT** |
| **Khối "Công việc cần xử lí"** | Hàng đợi 5 nhóm việc cần duyệt/xử lý (Đối tác, Chi nhánh, Voucher, Hoàn tiền, Lỗi sinh mã) | **ĐẠT** |
| **Luồng thay thế A1a (Lỗi & Thử lại)** | Nút "Làm mới" trên header banner và "Thử lại" trên Error banner | **ĐẠT** |
| **Luồng thay thế A1b (Dữ liệu trống)** | Hiển thị `—` và placeholder an toàn khi giá trị null/0 | **ĐẠT** |
| **Luồng ngoại lệ E1 (Quyền hạn)** | `authorizeMiddleware(JWT_ROLES.ADMIN)` trả 403 Forbidden | **ĐẠT** |
| **Luồng ngoại lệ E2 (Hết hạn phiên)** | Chuyển hướng về `/login` khi nhận 401 Unauthorized | **ĐẠT** |
| **NFR-01 (Hiệu năng)** | Query count/sum tối ưu song song, phản hồi trong vài chục ms | **ĐẠT** |
| **NFR-02 (Bảo mật)** | Chặn truy cập từ phía API lẫn ProtectedRoute phía Frontend | **ĐẠT** |
| **NFR-03 (Tính ổn định)** | `Promise.allSettled` cô lập lỗi giữa các module | **ĐẠT** |
| **NFR-05 (Khả năng sử dụng)** | Giao diện chuẩn Admin Design System, tooltip và chuyển tab mượt mà | **ĐẠT** |
| **NFR-06 (Tính kiểm toán)** | Trả kèm mốc thời gian `generatedAt` chính xác tại thời điểm truy xuất | **ĐẠT** |
