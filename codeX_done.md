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