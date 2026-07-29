# Giải thích cấu trúc và luồng code Backend cho các chức năng dùng chung

## 1. Phạm vi tài liệu

Tài liệu này được viết dựa trên mã nguồn trong file `backend.zip`, tập trung vào các task dùng chung mà bạn đã thực hiện:

1. Đăng nhập dùng chung.
2. Phân quyền theo vai trò.
3. Middleware kiểm tra quyền.
4. Audit log service.
5. Chuẩn response API.
6. Exception handler.
7. Cấu hình transaction.
8. Các enum và trạng thái dùng chung.

Ngoài việc giải thích từng file, tài liệu còn trình bày:

- Thứ tự nên đọc code.
- Luồng request đi qua các tầng.
- Quan hệ giữa các file.
- Lý do thiết kế theo cách hiện tại.
- Phần nào đã được tích hợp thật.
- Phần nào mới là hạ tầng hoặc scaffold.
- Các lỗi và điểm cần hoàn thiện trong phiên bản hiện tại.

> Kết quả kiểm tra: tất cả file JavaScript trong thư mục `src/` đều vượt qua kiểm tra cú pháp bằng `node --check`.

---

# 2. Kiến trúc tổng thể của backend

Backend sử dụng Express.js, Supabase và cách tổ chức theo module kết hợp mô hình ba lớp.

```text
Client / Frontend
       |
       v
Route
       |
       v
Middleware
       |
       v
Controller                 presentation layer
       |
       v
Service                    business layer
       |
       v
Repository                 data layer
       |
       v
Supabase / PostgreSQL
```

Các thành phần dùng chung được đặt trong `src/common`:

```text
src/common/
├── constants/       Enum, role và trạng thái dùng chung
├── database/        Transaction helper
├── errors/          Các lớp exception có cấu trúc
├── middleware/      Xác thực, phân quyền và xử lý lỗi
└── utils/           Chuẩn response và utility dùng chung
```

Các nghiệp vụ đăng nhập và audit log nằm trong module `core-access`:

```text
src/modules/core-access/
├── presentation/
│   ├── routes/
│   ├── controllers/
│   ├── dtos/
│   └── validators/
├── business/
│   └── services/
├── data/
│   ├── repositories/
│   └── models/
└── index.js
```

## Vì sao chia như vậy?

Mỗi tầng chỉ chịu một nhóm trách nhiệm:

| Tầng | Trách nhiệm chính | Không nên làm |
|---|---|---|
| Route | Khai báo URL, HTTP method và middleware | Không viết business rule |
| Middleware | Kiểm tra điều kiện chung trước controller | Không truy vấn nghiệp vụ phức tạp |
| Controller | Nhận request, gọi service, trả response | Không trực tiếp truy vấn database |
| Service | Xử lý quy tắc nghiệp vụ | Không phụ thuộc chi tiết HTTP |
| Repository | Đọc và ghi database | Không quyết định quyền hoặc nghiệp vụ |
| Model/DTO | Mô tả cấu trúc dữ liệu | Không điều khiển luồng xử lý |

Cách chia này giúp:

- Dễ thay đổi database mà ít ảnh hưởng controller.
- Dễ kiểm thử từng tầng.
- Dễ dùng chung authentication, error handling và response format.
- Giảm việc mỗi thành viên tự tạo một kiểu xử lý khác nhau.

---

# 3. Thứ tự nên đọc các file code

Không nên bắt đầu từ `auth.service.js` ngay lập tức. Nên đọc theo thứ tự từ lúc server khởi động đến lúc request hoàn tất.

## Thứ tự đọc tổng quát

```text
1. package.json
2. src/server.js
3. src/app.js
4. src/routes/index.js
5. src/modules/core-access/index.js
6. File route của use case
7. Middleware được gắn trong route
8. Controller
9. Validator và DTO
10. Service
11. Repository
12. Supabase configuration
13. Response helper và exception handler
14. Constants, enum và transaction helper
```

## Thứ tự đọc riêng cho luồng đăng nhập

```text
POST /auth/login
    |
    v
src/routes/index.js
    |
    v
src/modules/core-access/index.js
    |
    v
presentation/routes/auth.routes.js
    |
    v
presentation/controllers/auth.controller.js
    |
    v
business/services/auth.service.js
    |                         |
    |                         +--> business/services/audit-log.service.js
    v                                      |
data/repositories/user.repository.js       v
    |                         data/repositories/audit-log.repository.js
    v                                      |
src/config/supabase.js                     v
    |                                  bảng log_ht
    v
Supabase: taikhoan + nguoidung
```

## Thứ tự đọc riêng cho một API có phân quyền

Ví dụ `GET /admin/logs`:

```text
Route
  -> authenticateMiddleware
  -> authorizeMiddleware(ADMIN)
  -> AuditLogController.list
  -> AuditLogService.listLogs
  -> AuditLogRepository.list
  -> paginatedResponse
```

---

# 4. Các file khởi động và đăng ký route

## 4.1. `package.json`

### Vai trò

File này khai báo:

- Tên project.
- File khởi động là `src/server.js`.
- Lệnh chạy production.
- Lệnh chạy development với Nodemon.
- Các thư viện mà backend sử dụng.

### Các dependency chính

| Package | Mục đích |
|---|---|
| `express` | Xây dựng HTTP API |
| `@supabase/supabase-js` | Kết nối Supabase/PostgreSQL |
| `bcryptjs` | So sánh mật khẩu với password hash |
| `jsonwebtoken` | Tạo và xác minh JWT |
| `cors` | Cho phép frontend khác origin gọi backend |
| `dotenv` | Đọc biến môi trường từ `.env` |

### Luồng chạy

```bash
npm run dev
```

sẽ chạy:

```bash
nodemon src/server.js
```

Nodemon tự khởi động lại server khi source code thay đổi.

---

## 4.2. `src/server.js`

### Vai trò

`server.js` là file thực sự mở cổng mạng cho backend.

```js
const app = require("./app");
const { loadEnvironment } = require("./config/environment");

const config = loadEnvironment();

app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}...`);
});
```

### Giải thích

1. Import Express app đã được cấu hình từ `app.js`.
2. Đọc port từ environment.
3. Gọi `app.listen()` để backend bắt đầu nhận request.

### Vì sao tách `server.js` và `app.js`?

Nếu tạo app và gọi `listen()` trong cùng một file thì khó kiểm thử. Khi tách ra:

- Test có thể import `app` mà không mở port thật.
- `server.js` chỉ chịu trách nhiệm khởi động process.
- `app.js` chỉ chịu trách nhiệm cấu hình Express.

---

## 4.3. `src/app.js`

### Vai trò

File này tạo Express app, cài middleware toàn cục, đăng ký route và exception handler.

```js
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", routes);
app.use(errorMiddleware);
```

### Thứ tự middleware

Thứ tự này có ý nghĩa:

1. `cors()` xử lý quyền truy cập giữa frontend và backend.
2. `express.json()` đọc JSON body.
3. `express.urlencoded()` đọc form body.
4. `routes` nhận và xử lý endpoint.
5. `errorMiddleware` được đặt cuối cùng để nhận lỗi từ tất cả route phía trên.

### Vì sao `errorMiddleware` phải ở cuối?

Express xử lý middleware theo thứ tự đăng ký. Khi controller gọi:

```js
next(error);
```

Express sẽ tìm middleware xử lý lỗi tiếp theo. Nếu `errorMiddleware` đặt trước route, nó không thể bắt lỗi được phát sinh sau đó.

---

## 4.4. `src/routes/index.js`

### Vai trò

Đây là router tổng của ứng dụng.

```js
const contentFeedbackModule = require("../modules/content-feedback");
const coreAccessModule = require("../modules/core-access");

contentFeedbackModule.registerModule(router);
coreAccessModule.registerModule(router);
```

Mỗi module tự cung cấp hàm `registerModule()` để đăng ký route của mình.

### Lý do dùng module entry point

`src/routes/index.js` không cần biết chi tiết module có bao nhiêu controller hoặc service. Nó chỉ gọi contract:

```js
module.registerModule(router);
```

Nhờ đó, cấu trúc bên trong module có thể thay đổi mà router tổng ít bị ảnh hưởng.

### Trạng thái hiện tại

Hai module sau chưa được đăng ký vào router tổng:

- `customer-commerce`
- `partner-voucher`

Hai file `index.js` của các module này hiện chỉ export service, chưa có hàm `registerModule()`.

Điều này có nghĩa là dù các route file tồn tại, chúng chưa chắc được Express mount và chưa thể được gọi từ frontend qua router tổng.

---

## 4.5. `src/modules/core-access/index.js`

### Vai trò

Đây là entry point của module `core-access`.

Nó thực hiện hai nhiệm vụ:

1. Mount các route thuộc module.
2. Export các service để module khác có thể sử dụng.

```js
function registerModule(app) {
  app.use('/auth', authRoutes);
  app.use('/', auditLogRoutes);
  app.use('/', dashboardRoutes);
  app.use('/', userRoutes);
  app.use('/', issuedVoucherRoutes);
  app.use('/', redemptionRoutes);
}
```

### Cách ghép URL

Trong `core-access/index.js`:

```js
app.use('/auth', authRoutes);
```

Trong `auth.routes.js`:

```js
router.post('/login', ...);
```

URL cuối cùng là:

```text
POST /auth/login
```

Với audit log:

```js
app.use('/', auditLogRoutes);
```

và:

```js
router.get('/admin/logs', ...);
```

URL cuối cùng là:

```text
GET /admin/logs
```

---

# 5. Task 1 — Đăng nhập dùng chung

## 5.1. Ý nghĩa của “đăng nhập dùng chung”

Hệ thống không tạo endpoint đăng nhập riêng cho từng vai trò như:

```text
/admin/login
/customer/login
/partner/login
```

Thay vào đó, tất cả người dùng sử dụng:

```text
POST /auth/login
```

Sau khi xác thực thành công, backend đọc vai trò trong database rồi đưa role vào JWT.

Frontend và các API phía sau dựa vào role này để quyết định quyền truy cập.

## 5.2. Luồng đăng nhập đầy đủ

```text
Frontend
   |
   | POST /auth/login
   | { email, password }
   v
AuthRoute
   v
AuthController.login
   v
AuthService.login
   |
   +--> kiểm tra email/password có tồn tại
   |
   +--> UserRepository.findAccountByLoginInfo(email)
   |       |
   |       +--> Supabase: taikhoan JOIN nguoidung
   |
   +--> kiểm tra trạng thái tài khoản
   |
   +--> bcrypt.compare(password, hash)
   |
   +--> DB_TO_JWT[databaseRole]
   |
   +--> jwt.sign(userPayload)
   |
   +--> AuditLogService.log(LOGIN, thành công/thất bại)
   v
{ token, user }
```

---

## 5.3. `presentation/routes/auth.routes.js`

```js
const router = express.Router();
const controller = new AuthController(authService);

router.post("/login", controller.login.bind(controller));
```

### Giải thích

- Tạo router con cho authentication.
- Khởi tạo controller và truyền `authService` vào constructor.
- Khi có `POST /login`, Express gọi `controller.login`.

### Vì sao truyền service vào controller?

Đây là dạng dependency injection đơn giản:

```js
new AuthController(authService)
```

Controller không tự tạo service ở bên trong. Điều này giúp:

- Dễ mock service khi test controller.
- Controller phụ thuộc vào contract, không phụ thuộc cách khởi tạo service.
- Giảm coupling.

### Vì sao cần `.bind(controller)`?

Khi truyền method như callback:

```js
router.post('/login', controller.login);
```

JavaScript có thể làm mất context `this`. Khi đó `this.authService` có thể là `undefined`.

Dùng:

```js
controller.login.bind(controller)
```

đảm bảo bên trong `login()`, `this` vẫn là instance của `AuthController`.

---

## 5.4. `presentation/controllers/auth.controller.js`

### Trách nhiệm đúng của controller

Controller nên:

1. Lấy input từ `req`.
2. Gọi service.
3. Trả response thành công.
4. Chuyển lỗi cho global exception handler.

Code hiện tại:

```js
async login(req, res, next) {
  try {
    const result = await this.authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    res.status(400).json({ success: false, message: error.message });
  }
}
```

### Vấn đề trong code hiện tại

Các lớp lỗi dùng thuộc tính:

```js
error.statusCode
```

nhưng controller lại kiểm tra:

```js
error.status
```

Do đó:

- `error.status` thường là `undefined`.
- Các lỗi `UnauthorizedError` đáng lẽ là 401 có thể bị trả thành 400.
- `ForbiddenError` đáng lẽ là 403 có thể bị trả thành 400.
- Response không có `errorCode` chuẩn.
- Lỗi không đi qua `errorMiddleware`.

### Cách sửa phù hợp với kiến trúc hiện tại

```js
const { successResponse } = require('../../../../common/utils/response');

async login(req, res, next) {
  try {
    const result = await this.authService.login(req.body);
    return successResponse(res, result, 'Đăng nhập thành công');
  } catch (error) {
    return next(error);
  }
}
```

Khi đó:

- Thành công dùng response helper.
- Thất bại dùng exception handler tập trung.
- HTTP status và `errorCode` được giữ đúng.

---

## 5.5. `presentation/validators/auth.validator.js`

### Vai trò dự kiến

Validator kiểm tra input trước khi business service xử lý.

```js
function validateLoginPayload(payload) {
  if (!payload || !payload.email || !payload.password) {
    throw new Error("Email and password are required");
  }

  return payload;
}
```

### Trạng thái hiện tại

File này chưa được import hoặc sử dụng trong `auth.routes.js`, `auth.controller.js` hoặc `auth.service.js`.

Hiện tại việc kiểm tra input được thực hiện trực tiếp trong `auth.service.js`:

```js
if (!email || !password) {
  throw new AppError(...);
}
```

### Nên thiết kế như thế nào?

Có hai lựa chọn hợp lệ:

#### Cách 1: Validator middleware ở route

```js
router.post('/login', validateLoginMiddleware, controller.login.bind(controller));
```

#### Cách 2: Controller gọi validator

```js
const payload = validateLoginPayload(req.body);
const result = await this.authService.login(payload);
```

Không nên vừa có validator riêng nhưng lại để file không được dùng, vì điều này làm người đọc hiểu nhầm rằng request đã được validate ở presentation layer.

Validator cũng nên throw `ValidationError`, không nên throw `Error` thường:

```js
throw new ValidationError('Email và mật khẩu là bắt buộc');
```

---

## 5.6. `presentation/dtos/auth.dto.js`

```js
class AuthDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}
```

### Mục đích

DTO xác định dữ liệu nào được phép đi từ presentation layer vào business layer.

Ví dụ frontend gửi thêm:

```json
{
  "email": "a@example.com",
  "password": "123456",
  "role": "ADMIN",
  "isAdmin": true
}
```

Nếu tạo `AuthDto`, service chỉ nhận:

```json
{
  "email": "a@example.com",
  "password": "123456"
}
```

Nhờ đó frontend không thể tự truyền role để chiếm quyền.

### Trạng thái hiện tại

`AuthDto` chưa được sử dụng. `req.body` đang được chuyển thẳng vào service.

### Cách dùng đề xuất

```js
const payload = new AuthDto(req.body);
const result = await this.authService.login(payload);
```

---

## 5.7. `business/services/auth.service.js`

Đây là file trung tâm của nghiệp vụ đăng nhập.

### Bước 1: Kiểm tra input

```js
if (!email || !password) {
  throw new AppError('Email và mật khẩu là bắt buộc', 400, 'VALIDATION_ERROR');
}
```

Mục đích là dừng sớm nếu dữ liệu đầu vào không đủ.

Nên dùng trực tiếp `ValidationError` để code rõ nghĩa hơn:

```js
throw new ValidationError('Email và mật khẩu là bắt buộc');
```

### Bước 2: Tìm tài khoản

```js
const account = await userRepository.findAccountByLoginInfo(email);
```

Service không tự viết câu truy vấn Supabase. Nó giao việc truy cập dữ liệu cho repository.

### Bước 3: Xử lý tài khoản không tồn tại

```js
if (!account || !account.nguoidung) {
  await auditLogService.log({ ... });
  throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
}
```

Backend cố ý không trả:

```text
Email không tồn tại
```

mà trả thông báo chung:

```text
Email hoặc mật khẩu không đúng
```

Điều này giảm khả năng kẻ xấu dò xem email nào đã tồn tại trong hệ thống.

### Bước 4: Kiểm tra trạng thái tài khoản

```js
if (account.nguoidung.trang_thai !== 'Dang hoat dong') {
  ...
  throw new ForbiddenError('Tài khoản đã bị khóa hoặc không hoạt động');
}
```

Tài khoản tồn tại nhưng bị khóa không được phép đăng nhập.

Đây là lỗi 403 vì:

- Danh tính tài khoản được xác định.
- Hệ thống từ chối quyền hoạt động của tài khoản.

Điểm cần hoàn thiện: chuỗi `'Dang hoat dong'` đang được hard-code. Nên có một enum trạng thái người dùng dùng chung.

### Bước 5: Kiểm tra mật khẩu

```js
if (account.mat_khau.startsWith('$2a$') || account.mat_khau.startsWith('$2b$')) {
  isMatch = await bcrypt.compare(password, account.mat_khau);
} else {
  isMatch = password === account.mat_khau;
}
```

Nếu mật khẩu là bcrypt hash, backend dùng `bcrypt.compare()`.

Nhánh so sánh plain text được thêm để hỗ trợ seed/test data, nhưng không nên tồn tại trong production vì:

- Khuyến khích database lưu mật khẩu dạng rõ.
- Làm giảm mức an toàn của toàn hệ thống.
- Có thể che giấu lỗi seed hoặc migration.

Nên bảo đảm tất cả tài khoản đều dùng bcrypt và loại bỏ fallback plain text.

### Bước 6: Mapping role database sang role JWT

```js
const dbVaiTro = account.nguoidung.vai_tro;
const mappedRole = DB_TO_JWT[dbVaiTro] || 'CUSTOMER';
```

Database dùng tên vai trò theo nghiệp vụ tiếng Việt, còn JWT dùng role ngắn gọn.

Ví dụ:

```text
'Admin'                       -> 'ADMIN'
'Nguoi dai dien'              -> 'PARTNER_OWNER'
'Nhan vien ban hang'          -> 'PARTNER_STAFF'
'Nhan vien quan ly voucher'   -> 'PARTNER_STAFF'
'Khach hang'                  -> 'CUSTOMER'
```

Điểm cần sửa: không nên mặc định role không nhận diện thành `CUSTOMER`.

Code an toàn hơn:

```js
const mappedRole = DB_TO_JWT[dbVaiTro];

if (!mappedRole) {
  throw new ForbiddenError('Vai trò tài khoản không hợp lệ');
}
```

Nếu database có dữ liệu role sai, hệ thống nên từ chối thay vì âm thầm biến người dùng thành customer.

### Bước 7: Tạo JWT payload

```js
const userPayload = {
  id: account.nguoidung.ma_nguoi_dung,
  accountId: account.ma_tk,
  role: mappedRole,
  email: account.nguoidung.email,
  name: account.nguoidung.ho_ten,
  vai_tro_he_thong: dbVaiTro,
  ma_chi_nhanh: account.nguoidung.ma_chi_nhanh ?? null,
};
```

JWT lưu các thông tin cần cho các request sau:

| Field | Mục đích |
|---|---|
| `id` | ID người dùng nghiệp vụ |
| `accountId` | ID tài khoản đăng nhập |
| `role` | Role chuẩn dùng cho middleware |
| `email` | Thông tin nhận diện |
| `name` | Hiển thị tên người dùng |
| `vai_tro_he_thong` | Role gốc trong database |
| `ma_chi_nhanh` | Giới hạn dữ liệu theo chi nhánh nếu có |

### Bước 8: Ký JWT

```js
const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });
```

JWT có thời hạn một ngày.

Mỗi request sau đó gửi:

```http
Authorization: Bearer <token>
```

### Điểm bảo mật cần sửa

Code hiện tại có fallback:

```js
const JWT_SECRET = process.env.JWT_SECRET || 'saleVoucher_EC';
```

Không nên dùng secret mặc định trong production. Nếu `.env` thiếu, server nên dừng:

```js
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
```

### Bước 9: Ghi audit log

Mọi kết quả đăng nhập đều được ghi log:

- Không tìm thấy tài khoản.
- Tài khoản bị khóa.
- Sai mật khẩu.
- Đăng nhập thành công.

### Bước 10: Trả kết quả

```js
return { token, user: userPayload };
```

Service trả dữ liệu thuần, không gọi `res.json()`. Đây là đúng trách nhiệm của business layer.

---

## 5.8. `data/repositories/user.repository.js`

### Truy vấn chính

```js
const { data, error } = await supabase
  .from('taikhoan')
  .select(`
    *,
    nguoidung:ma_nguoi_dung (
      ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, ma_chi_nhanh
    )
  `)
  .eq('thong_tin_dang_nhap', loginInfo)
  .single();
```

### Ý nghĩa

- Đọc tài khoản từ bảng `taikhoan`.
- Join người dùng liên quan thông qua `ma_nguoi_dung`.
- Tìm theo `thong_tin_dang_nhap`.
- Mong đợi đúng một bản ghi với `.single()`.

### Vì sao repository trả cả tài khoản và người dùng?

Login cần dữ liệu từ hai khái niệm:

- `taikhoan`: mật khẩu, thông tin đăng nhập, account ID.
- `nguoidung`: họ tên, email, role, trạng thái, chi nhánh.

Repository gom truy vấn để service nhận đủ dữ liệu trong một lần gọi database.

### Điểm cần hoàn thiện

Hiện tại mọi lỗi Supabase đều bị chuyển thành `null`:

```js
if (error) {
  console.error(...);
  return null;
}
```

Điều này làm hai trường hợp khác nhau bị xem như nhau:

1. Không tìm thấy tài khoản.
2. Database bị lỗi hoặc mất kết nối.

Kết quả là lỗi hệ thống có thể bị trả thành “Email hoặc mật khẩu không đúng”.

Nên phân biệt mã lỗi “không có dòng dữ liệu” với lỗi database thực sự. Lỗi database cần throw để exception handler trả 500.

---

# 6. Task 2 — Phân quyền theo vai trò

## 6.1. `src/common/constants/roles.js`

File này định nghĩa ba nhóm giá trị:

```js
const DB_ROLES = { ... };
const JWT_ROLES = { ... };
const DB_TO_JWT = { ... };
```

## DB roles

Là giá trị khớp với dữ liệu và CHECK constraint trong database.

```js
const DB_ROLES = {
  CUSTOMER: 'Khach hang',
  PARTNER_OWNER: 'Nguoi dai dien',
  PARTNER_STAFF_SALES: 'Nhan vien ban hang',
  PARTNER_STAFF_VOUCHER: 'Nhan vien quan ly voucher',
  ADMIN: 'Admin',
};
```

## JWT roles

Là giá trị kỹ thuật ngắn gọn dùng trong token và middleware.

```js
const JWT_ROLES = {
  ADMIN: 'ADMIN',
  PARTNER_OWNER: 'PARTNER_OWNER',
  PARTNER_STAFF: 'PARTNER_STAFF',
  CUSTOMER: 'CUSTOMER',
};
```

## Mapping DB sang JWT

```js
const DB_TO_JWT = {
  [DB_ROLES.ADMIN]: JWT_ROLES.ADMIN,
  [DB_ROLES.PARTNER_OWNER]: JWT_ROLES.PARTNER_OWNER,
  [DB_ROLES.PARTNER_STAFF_SALES]: JWT_ROLES.PARTNER_STAFF,
  [DB_ROLES.PARTNER_STAFF_VOUCHER]: JWT_ROLES.PARTNER_STAFF,
  [DB_ROLES.CUSTOMER]: JWT_ROLES.CUSTOMER,
};
```

## Vì sao không dùng trực tiếp DB role trong middleware?

Tách DB role và JWT role có các lợi ích:

- Database giữ tên nghiệp vụ dễ hiểu.
- Backend/frontend dùng mã role ổn định.
- Có thể gộp nhiều vai trò database thành một nhóm quyền kỹ thuật.
- Nếu đổi cách hiển thị role trong database, middleware ít bị ảnh hưởng.

Ví dụ hai loại nhân viên đối tác được gộp thành:

```text
PARTNER_STAFF
```

Tuy nhiên, nếu hai loại nhân viên cần quyền khác nhau, việc gộp này sẽ không đủ chi tiết. Khi đó nên giữ hai JWT role riêng hoặc bổ sung permission.

---

# 7. Task 3 — Middleware kiểm tra quyền

Có hai bước khác nhau:

1. Authentication: người gửi request là ai?
2. Authorization: người đó có được làm thao tác này không?

Không được đảo hai khái niệm này.

---

## 7.1. `authenticate.middleware.js`

### Vai trò

Middleware này đọc JWT từ header:

```http
Authorization: Bearer <token>
```

### Các bước

```js
const authHeader = req.headers.authorization;
```

Đọc authorization header.

```js
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return next(new UnauthorizedError(...));
}
```

Nếu thiếu token hoặc sai định dạng, tạo lỗi 401.

```js
const token = authHeader.split(' ')[1];
```

Tách phần token ra khỏi chuỗi `Bearer ...`.

```js
const decoded = jwt.verify(token, JWT_SECRET);
req.user = decoded;
next();
```

Nếu token hợp lệ:

- Kiểm tra chữ ký.
- Kiểm tra hạn token.
- Giải mã payload.
- Gắn payload vào `req.user`.
- Cho request đi tiếp.

Sau bước này controller có thể dùng:

```js
req.user.id
req.user.accountId
req.user.role
req.user.ma_chi_nhanh
```

### Token hết hạn và token không hợp lệ

```js
if (error.name === 'TokenExpiredError') {
  return next(new UnauthorizedError('Token đã hết hạn...'));
}
```

Token hết hạn được trả thông báo riêng. Các lỗi xác minh khác trả “Token không hợp lệ”.

---

## 7.2. `authorize.middleware.js`

### Vai trò

Middleware này kiểm tra role trong `req.user`.

```js
function authorizeMiddleware(...allowedRoles) {
  return (req, res, next) => {
    ...
  };
}
```

Đây là middleware factory: hàm bên ngoài nhận danh sách role và trả về middleware thật.

Ví dụ:

```js
authorizeMiddleware(JWT_ROLES.ADMIN)
```

hoặc:

```js
authorizeMiddleware(
  JWT_ROLES.ADMIN,
  JWT_ROLES.PARTNER_OWNER
)
```

### Kiểm tra chưa xác thực

```js
if (!req.user) {
  return next(new UnauthorizedError(...));
}
```

Nếu route quên gắn `authenticateMiddleware`, authorize vẫn chặn request.

### Kiểm tra role

```js
if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
  return next(new ForbiddenError(...));
}
```

Người dùng đã đăng nhập nhưng role không phù hợp sẽ nhận 403.

### Dữ liệu details

```js
{ requiredRoles: allowedRoles }
```

Thông tin này đi vào `details` của response lỗi, giúp frontend hoặc developer biết endpoint yêu cầu role nào.

---

## 7.3. Thứ tự middleware bắt buộc

Đúng:

```js
router.get(
  '/admin/logs',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.list
);
```

Sai:

```js
router.get(
  '/admin/logs',
  authorizeMiddleware(JWT_ROLES.ADMIN),
  authenticateMiddleware,
  controller.list
);
```

Lý do: `authorizeMiddleware` cần `req.user`, nhưng `req.user` chỉ được tạo sau khi JWT được xác minh.

---

## 7.4. Ví dụ luồng quyền của `GET /admin/logs`

### Trường hợp 1: Không có token

```text
authenticateMiddleware
  -> UnauthorizedError
  -> errorMiddleware
  -> HTTP 401
```

### Trường hợp 2: Token customer hợp lệ

```text
authenticateMiddleware
  -> req.user.role = CUSTOMER
  -> authorizeMiddleware(ADMIN)
  -> ForbiddenError
  -> errorMiddleware
  -> HTTP 403
```

### Trường hợp 3: Token admin hợp lệ

```text
authenticateMiddleware
  -> authorizeMiddleware(ADMIN)
  -> controller
  -> service
  -> repository
  -> HTTP 200
```

---

## 7.5. Trạng thái tích hợp hiện tại

`GET /admin/logs` đã dùng đúng cả hai middleware.

Tuy nhiên, các route sau trong `core-access` hiện chưa được bảo vệ dù comment của module mô tả chúng là route cần authentication:

- `GET /dashboard`
- `GET /profile`
- `POST /issue`
- `POST /verify`

Các route này hiện chỉ gọi controller trực tiếp.

Ví dụ hiện tại:

```js
router.get("/dashboard", controller.getSummary.bind(controller));
```

Nếu dashboard chỉ dành cho Admin, nên là:

```js
router.get(
  '/dashboard',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.getSummary.bind(controller)
);
```

---

# 8. Task 4 — Audit log service

Audit log ghi lại ai đã làm gì, với đối tượng nào, trước và sau thay đổi ra sao, kết quả thành công hay thất bại.

## 8.1. Cấu trúc luồng audit log

```text
Business service khác
       |
       | auditLogService.log(...)
       v
AuditLogService
       |
       | chuẩn hóa tên field nghiệp vụ
       v
AuditLogRepository
       |
       | insert/select Supabase
       v
Bảng log_ht
```

Luồng đọc log:

```text
GET /admin/logs
  -> authenticate
  -> authorize ADMIN
  -> AuditLogController.list
  -> AuditLogService.listLogs
  -> AuditLogRepository.list
  -> paginatedResponse
```

---

## 8.2. `business/services/audit-log.service.js`

### Hàm `log()`

Hàm nhận dữ liệu theo tên dễ hiểu ở business layer:

```js
{
  actorId,
  actorRole,
  action,
  targetType,
  targetId,
  before,
  after,
  result,
  reason
}
```

Sau đó mapping sang tên cột database:

```js
{
  vai_tro_thuc_hien: actorRole,
  hanh_dong: action,
  du_lieu_truoc: before,
  du_lieu_sau: after,
  ket_qua: result,
  ly_do_thuc_hien: reason,
  ma_tk_thuc_hien: actorId,
  doi_tuong: targetType,
  ma_doi_tuong: targetId
}
```

### Vì sao mapping ở service?

Service cung cấp interface dễ dùng cho toàn bộ backend, trong khi repository giữ cấu trúc gần với database.

Nhờ đó service khác không phải nhớ tên cột tiếng Việt của bảng `log_ht`.

### Chế độ non-strict

Mặc định:

```js
strict = false
```

Nếu ghi log thất bại:

```js
console.warn(...)
```

nhưng nghiệp vụ chính vẫn tiếp tục.

Cách này phù hợp với log không bắt buộc, ví dụ ghi nhận đăng nhập thất bại. Không nên làm API login bị hỏng chỉ vì bảng log tạm thời gặp lỗi.

### Chế độ strict

Nếu gọi:

```js
await auditLogService.log(data, true);
```

thì lỗi ghi log sẽ được throw.

Dùng strict khi business rule yêu cầu thao tác quản trị bắt buộc phải có dấu vết. Ví dụ:

- Khóa tài khoản.
- Duyệt hoặc từ chối đối tác.
- Vô hiệu hóa voucher.
- Thay đổi quyền người dùng.

### Trạng thái hiện tại

`auth.service.js` gọi `auditLogService.log()` nhưng không truyền `true`, vì vậy tất cả log đăng nhập đang dùng chế độ non-strict.

Chưa thấy nơi nào trong source hiện tại gọi strict mode.

### Hàm `listLogs()`

Hàm này:

1. Chuyển `page`, `limit` thành number.
2. Gọi repository với bộ lọc.
3. Tạo metadata phân trang.

```js
return {
  logs,
  pagination: {
    page,
    limit,
    total,
    totalPages
  }
};
```

---

## 8.3. `data/repositories/audit-log.repository.js`

### Hàm `create()`

```js
const { data, error } = await supabase
  .from('log_ht')
  .insert([logData])
  .select()
  .single();
```

- Insert một log.
- `.select()` lấy lại bản ghi vừa tạo.
- `.single()` trả một object thay vì array.

Nếu Supabase trả lỗi, repository throw lỗi lên service.

### Hàm `list()`

```js
const offset = (page - 1) * limit;
```

Ví dụ:

- Page 1, limit 20 → offset 0.
- Page 2, limit 20 → offset 20.

Query:

```js
.select('*', { count: 'exact' })
.order('thoi_diem_thuc_hien', { ascending: false })
.range(offset, offset + limit - 1)
```

Ý nghĩa:

- Lấy dữ liệu và tổng số bản ghi.
- Log mới nhất đứng trước.
- Chỉ lấy phạm vi thuộc page hiện tại.

Các bộ lọc được thêm động:

```js
if (maTkThucHien) ...
if (doiTuong) ...
if (hanhDong) ...
if (ketQua) ...
```

`hanhDong` dùng `ilike` để tìm gần đúng, không phân biệt hoa thường.

---

## 8.4. `presentation/routes/audit-log.routes.js`

```js
router.get(
  '/admin/logs',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.list
);
```

Route thể hiện rõ policy:

- Phải đăng nhập.
- Phải có role Admin.
- Sau đó mới được đọc log.

Đây là ví dụ hoàn chỉnh nhất trong source hiện tại về kết hợp authentication và authorization.

---

## 8.5. `presentation/controllers/audit-log.controller.js`

Controller lấy query parameter:

```js
const {
  page,
  limit,
  maTkThucHien,
  doiTuong,
  hanhDong,
  ketQua
} = req.query;
```

Sau đó gọi service và trả response phân trang:

```js
return paginatedResponse(
  res,
  result.logs,
  result.pagination,
  'Lấy nhật ký hệ thống thành công'
);
```

Khi lỗi:

```js
next(error);
```

Đây là cách controller nên được viết nhất quán trong toàn backend.

---

## 8.6. `data/models/audit-log.model.js`

Model chuyển field database từ `snake_case` sang property JavaScript dễ dùng:

```text
log_id                -> logId
vai_tro_thuc_hien     -> vaiTroThucHien
ma_tk_thuc_hien       -> maTkThucHien
```

### Trạng thái hiện tại

Repository đang trả trực tiếp object từ Supabase và chưa tạo `new AuditLogModel(data)`.

Vì vậy model hiện chủ yếu đóng vai trò tài liệu/schema mẫu, chưa tham gia vào runtime flow.

Nếu muốn dùng model thật:

```js
return new AuditLogModel(data);
```

hoặc với danh sách:

```js
return data.map((row) => new AuditLogModel(row));
```

---

# 9. Task 5 — Chuẩn response API

## 9.1. `src/common/utils/response.js`

File này tạo một format thống nhất để frontend không phải xử lý mỗi API theo một kiểu.

## Response thành công

```js
successResponse(res, data, message, statusCode)
```

Kết quả:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {}
}
```

## Response có phân trang

```js
paginatedResponse(res, data, pagination, message)
```

Kết quả:

```json
{
  "success": true,
  "message": "Lấy dữ liệu thành công",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Response lỗi

```js
errorResponse(res, message, statusCode, errorCode, details)
```

Kết quả:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errorCode": "VALIDATION_ERROR",
  "details": {}
}
```

### Khi nào nên dùng `errorResponse()`?

Trong kiến trúc hiện tại, hướng tốt hơn là:

```js
throw new ValidationError(...)
```

hoặc:

```js
next(error)
```

để `errorMiddleware` xử lý tập trung.

`errorResponse()` chỉ nên dùng khi có lý do đặc biệt cần kết thúc response ngay tại controller hoặc middleware.

---

## 9.2. Lý do cần response chuẩn

Nếu không có chuẩn chung, các API có thể trả nhiều dạng:

```json
{ "data": {} }
```

```json
{ "result": {} }
```

```json
{ "ok": true, "value": {} }
```

Frontend phải viết nhiều nhánh xử lý khác nhau.

Khi chuẩn hóa, frontend chỉ cần kiểm tra:

```js
if (response.success) {
  use(response.data);
} else {
  showError(response.message);
}
```

---

## 9.3. Trạng thái tích hợp hiện tại

`audit-log.controller.js` đã sử dụng `paginatedResponse()`.

Phần lớn controller khác vẫn trả trực tiếp:

```js
res.json({ success: true, data: result });
```

`auth.controller.js` cũng tự tạo response lỗi và chưa đi qua global exception handler.

Vì vậy task “chuẩn response API” đã có helper dùng chung, nhưng chưa được áp dụng nhất quán trên toàn backend.

---

# 10. Task 6 — Exception handler

Exception handler gồm hai phần:

1. Các lớp lỗi có cấu trúc.
2. Middleware chuyển lỗi thành HTTP response.

---

## 10.1. `AppError.js`

```js
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}
```

### Các field quan trọng

| Field | Ý nghĩa |
|---|---|
| `message` | Thông báo cho người gọi API |
| `statusCode` | HTTP status code |
| `errorCode` | Mã lỗi ổn định cho frontend |
| `details` | Thông tin chi tiết tùy chọn |

### Vì sao cần `errorCode` ngoài HTTP status?

HTTP 400 có thể đại diện cho nhiều lỗi:

- Thiếu email.
- Email sai định dạng.
- Voucher hết hạn.
- Số lượng không hợp lệ.

Frontend cần `errorCode` để phân biệt chính xác mà không phụ thuộc vào chuỗi message.

---

## 10.2. Các subclass

### `ValidationError`

```text
HTTP 400
errorCode = VALIDATION_ERROR
```

Dùng khi body, params hoặc query không hợp lệ.

### `UnauthorizedError`

```text
HTTP 401
errorCode = UNAUTHORIZED
```

Dùng khi:

- Chưa đăng nhập.
- Token thiếu.
- Token sai.
- Token hết hạn.
- Thông tin đăng nhập không đúng.

### `ForbiddenError`

```text
HTTP 403
errorCode = ACCESS_FORBIDDEN
```

Dùng khi đã xác định người dùng nhưng người đó không đủ quyền hoặc tài khoản bị cấm hoạt động.

### `NotFoundError`

```text
HTTP 404
errorCode = RESOURCE_NOT_FOUND
```

Dùng khi entity hoặc tài nguyên không tồn tại.

---

## 10.3. `error.middleware.js`

### Xử lý lỗi nghiệp vụ có cấu trúc

```js
if (err instanceof AppError) {
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errorCode: err.errorCode,
    ...(err.details ? { details: err.details } : {}),
  });
}
```

Các subclass như `UnauthorizedError` và `ForbiddenError` đều là `AppError`, nên được xử lý tại đây.

### Xử lý lỗi không mong đợi

```js
console.error('[UNHANDLED ERROR]', err);

return res.status(500).json({
  success: false,
  message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
  errorCode: 'INTERNAL_ERROR',
  ...(isDev ? { stack: err.stack } : {}),
});
```

- Production không trả stack trace cho client.
- Development có thể trả stack để debug.
- Lỗi thật được log ở server.

### Vì sao không trả `err.message` cho lỗi 500?

Lỗi hệ thống có thể chứa:

- Tên bảng.
- Nội dung câu query.
- Đường dẫn source.
- Thông tin cấu hình.
- Chi tiết nội bộ không nên lộ.

Do đó client chỉ nhận thông báo chung.

---

## 10.4. Luồng exception chuẩn

```text
Repository hoặc Service
        |
        | throw Error/AppError
        v
Controller catch
        |
        | next(error)
        v
errorMiddleware
        |
        +--> AppError      -> statusCode + errorCode
        |
        +--> Error thường  -> 500 INTERNAL_ERROR
```

### Mẫu controller chuẩn

```js
async handler(req, res, next) {
  try {
    const result = await service.execute(req.body);
    return successResponse(res, result, 'Thành công');
  } catch (error) {
    return next(error);
  }
}
```

---

# 11. Task 7 — Cấu hình transaction

## 11.1. `src/common/database/transaction.js`

Supabase JavaScript client không cho backend mở transaction theo kiểu truyền thống qua nhiều request riêng như:

```sql
BEGIN;
INSERT ...;
UPDATE ...;
COMMIT;
```

File transaction hiện cung cấp hai chiến lược.

---

## 11.2. `withSupabaseTransaction()`

```js
async function withSupabaseTransaction(operations) {
  const completed = [];

  for (const op of operations) {
    try {
      const result = await op.execute(supabase);
      completed.push({ op, result });
    } catch (error) {
      for (const done of completed.reverse()) {
        if (done.op.rollback) {
          await done.op.rollback(supabase, done.result);
        }
      }
      throw error;
    }
  }

  return completed.map((c) => c.result);
}
```

### Cách hoạt động

Mỗi operation có dạng:

```js
{
  execute: async (supabase) => { ... },
  rollback: async (supabase, result) => { ... }
}
```

Luồng:

1. Chạy operation thứ nhất.
2. Lưu kết quả vào `completed`.
3. Chạy operation tiếp theo.
4. Nếu một bước lỗi, gọi rollback các bước đã hoàn thành theo thứ tự ngược.

### Ví dụ khái niệm

```js
await withSupabaseTransaction([
  {
    execute: createOrder,
    rollback: deleteCreatedOrder,
  },
  {
    execute: createPayment,
    rollback: deleteCreatedPayment,
  },
]);
```

Nếu `createPayment` lỗi, helper cố xóa order đã tạo.

### Bản chất kỹ thuật

Đây không phải database transaction thật. Đây là compensating transaction hoặc rollback thủ công.

Hạn chế:

- Dữ liệu trung gian có thể được transaction khác nhìn thấy.
- Rollback cũng có thể thất bại.
- Nếu process chết giữa các bước, rollback không chạy.
- Có thể xảy ra race condition.
- Logic undo phải được viết chính xác cho từng operation.

Vì vậy chỉ nên dùng cho luồng đơn giản hoặc trường hợp chấp nhận eventual consistency.

---

## 11.3. `withRpcTransaction()`

```js
async function withRpcTransaction(rpcName, params = {}) {
  const { data, error } = await supabase.rpc(rpcName, params);
  if (error) {
    throw new Error(`[RPC Transaction] ${rpcName} thất bại: ${error.message}`);
  }
  return data;
}
```

### Cách hoạt động

Backend gọi một PostgreSQL function thông qua Supabase RPC.

Toàn bộ thao tác nhiều bảng được viết trong function ở database. PostgreSQL thực hiện chúng trong cùng transaction.

### Vì sao đây là lựa chọn tốt hơn cho nghiệp vụ quan trọng?

Các nghiệp vụ như:

- Tạo đơn hàng và chi tiết đơn hàng.
- Thanh toán và cập nhật trạng thái đơn.
- Phát hành voucher code.
- Trừ số lượng voucher.
- Ghi usage log.

cần atomicity thật:

```text
Hoặc tất cả cùng thành công
Hoặc tất cả cùng thất bại
```

RPC đặt toàn bộ logic trong một lần gọi database nên bảo đảm transaction tốt hơn rollback thủ công từ Node.js.

---

## 11.4. Trạng thái tích hợp hiện tại

Trong source hiện tại chưa có service nào import hoặc gọi:

```js
withSupabaseTransaction
withRpcTransaction
```

Do đó task transaction hiện đã có helper/configuration, nhưng chưa được áp dụng vào use case cụ thể.

Để chứng minh task hoàn thành ở mức nghiệp vụ, cần tích hợp nó vào ít nhất một luồng nhiều bảng, ví dụ tạo đơn hàng hoặc phát hành voucher.

---

# 12. Task 8 — Enum và trạng thái dùng chung

JavaScript không có enum runtime giống Java hoặc C#. Project đang dùng object hằng số để mô phỏng enum.

## 12.1. Vì sao cần enum dùng chung?

Không nên viết lặp lại chuỗi:

```js
if (status === 'Da thanh toan')
```

ở nhiều file vì:

- Dễ gõ sai.
- Khó đổi tên.
- Không biết tất cả trạng thái hợp lệ.
- Có thể lệch CHECK constraint của database.

Nên dùng:

```js
if (status === ORDER_STATUS.DA_THANH_TOAN)
```

---

## 12.2. Danh sách enum hiện có

### `roles.js`

| Nhóm | Giá trị |
|---|---|
| DB roles | Khách hàng, đại diện đối tác, nhân viên, Admin |
| JWT roles | `ADMIN`, `PARTNER_OWNER`, `PARTNER_STAFF`, `CUSTOMER` |
| Mapping | DB role → JWT role |

### `log-result.js`

| Constant | Database value |
|---|---|
| `THANH_CONG` | `Thanh cong` |
| `THAT_BAI` | `That bai` |

### `order-status.js`

| Constant | Database value |
|---|---|
| `CHO_THANH_TOAN` | `Cho thanh toan` |
| `DA_THANH_TOAN` | `Da thanh toan` |
| `DA_HUY` | `Da huy` |
| `CHO_HOAN_TIEN` | `Cho hoan tien` |
| `DA_HOAN_TIEN` | `Da hoan tien` |
| `HUY_YEU_CAU_HOAN_TIEN` | `Huy yeu cau hoan tien` |

### `payment-status.js`

| Constant | Database value |
|---|---|
| `DANG_XU_LY` | `Dang xu ly` |
| `THANH_CONG` | `Thanh cong` |
| `THAT_BAI` | `That bai` |

### `voucher-status.js`

| Constant | Database value |
|---|---|
| `NHAP` | `Nhap` |
| `CHO_DUYET` | `Cho duyet` |
| `DANG_BAN` | `Dang ban` |
| `TU_CHOI` | `Tu choi` |
| `TAM_NGUNG` | `Tam ngung` |
| `NGUNG_BAN` | `Ngung ban` |

### `issued-voucher-status.js`

| Constant | Database value |
|---|---|
| `CHUA_SU_DUNG` | `Chua su dung` |
| `DA_SU_DUNG` | `Da su dung` |
| `HET_HAN` | `Het han` |
| `LOI_SINH_MA` | `Loi sinh ma` |
| `VO_HIEU_HOA` | `Vo hieu hoa` |

### `partner-status.js`

`PARTNER_STATUS`:

| Constant | Database value |
|---|---|
| `CHO_DUYET` | `Cho duyet` |
| `DANG_HOAT_DONG` | `Dang hoat dong` |
| `TU_CHOI` | `Tu choi` |
| `TAM_KHOA` | `Tam khoa` |

`BRANCH_STATUS`:

| Constant | Database value |
|---|---|
| `CHO_DUYET` | `Cho duyet` |
| `DANG_HOAT_DONG` | `Dang hoat dong` |
| `TU_CHOI` | `Tu choi` |
| `TAM_NGUNG` | `Tam ngung hoat dong` |

---

## 12.3. Cách dùng đúng

Sai:

```js
if (order.trang_thai === 'Da thanh toan') {
  ...
}
```

Đúng:

```js
const ORDER_STATUS = require('../../../../common/constants/order-status');

if (order.trang_thai === ORDER_STATUS.DA_THANH_TOAN) {
  ...
}
```

### Lợi ích

- IDE gợi ý constant.
- Giảm typo.
- Một nguồn sự thật duy nhất.
- Dễ đối chiếu với database constraint.
- Dễ tái sử dụng giữa các module.

---

## 12.4. Trạng thái tích hợp hiện tại

Trong source hiện tại:

- `roles.js` đã được dùng trong authentication và authorization.
- `log-result.js` đã được dùng trong audit log và login.
- Các status còn lại hầu như chưa được import vào business service.
- `auth.service.js` vẫn hard-code `'Dang hoat dong'`.

Vì vậy phần enum đã được tạo tương đối đầy đủ, nhưng cần thay các chuỗi trạng thái hard-code trong service bằng constants để đạt mục tiêu dùng chung thật sự.

---

# 13. Luồng hoàn chỉnh của các task dùng chung

## 13.1. Luồng đăng nhập thành công

```text
1. Frontend gửi POST /auth/login.
2. Express parse JSON body.
3. Router tổng chuyển request vào core-access.
4. auth.routes.js chọn controller.login.
5. Controller gọi authService.login(req.body).
6. Service kiểm tra email và password.
7. Repository đọc taikhoan và nguoidung từ Supabase.
8. Service kiểm tra trạng thái tài khoản.
9. Service dùng bcrypt kiểm tra mật khẩu.
10. Service map DB role sang JWT role.
11. Service ký JWT có thời hạn 1 ngày.
12. Service gọi auditLogService ghi LOGIN thành công.
13. Service trả token và user payload.
14. Controller trả JSON cho frontend.
```

## 13.2. Luồng đăng nhập thất bại

```text
1. Service phát hiện tài khoản không tồn tại, bị khóa hoặc sai mật khẩu.
2. Service ghi audit log thất bại ở chế độ non-strict.
3. Service throw UnauthorizedError hoặc ForbiddenError.
4. Controller nên gọi next(error).
5. errorMiddleware chuyển exception thành response chuẩn.
```

Bước 4–5 là thiết kế mong muốn. `auth.controller.js` hiện tại chưa làm như vậy và cần được sửa.

## 13.3. Luồng gọi API Admin

```text
1. Frontend gửi Authorization: Bearer <JWT>.
2. authenticateMiddleware xác minh token.
3. Payload JWT được gắn vào req.user.
4. authorizeMiddleware kiểm tra req.user.role.
5. Nếu role đúng, controller được chạy.
6. Nếu role sai, ForbiddenError đi vào errorMiddleware.
```

## 13.4. Luồng xử lý lỗi

```text
Service/Repository throw error
        -> Controller next(error)
        -> errorMiddleware
        -> JSON lỗi thống nhất
```

## 13.5. Luồng transaction dự kiến

```text
Service nghiệp vụ
   |
   +--> Nghiệp vụ đơn giản: withSupabaseTransaction + rollback thủ công
   |
   +--> Nghiệp vụ quan trọng: withRpcTransaction
                                      |
                                      v
                              PostgreSQL function
                                      |
                                      v
                              transaction thật
```

---

# 14. Mức độ hoàn thành thực tế của từng task

| Task | Mức độ hiện tại | Nhận xét |
|---|---|---|
| Đăng nhập dùng chung | Đã có luồng thật | Có Supabase, bcrypt, JWT và audit log |
| Phân quyền theo vai trò | Đã có nền tảng và một ví dụ thật | Role mapping đã dùng; cần áp dụng thêm route |
| Middleware kiểm tra quyền | Đã hoạt động | `GET /admin/logs` dùng đúng; các route khác chưa dùng |
| Audit log service | Đã có đọc/ghi thật | Strict mode chưa được dùng trong nghiệp vụ |
| Chuẩn response API | Đã có helper | Chưa áp dụng nhất quán trên controller |
| Exception handler | Đã có cấu trúc tốt | `auth.controller.js` đang bypass handler |
| Transaction | Mới là helper/hạ tầng | Chưa có use case nào gọi helper |
| Enum và trạng thái dùng chung | Đã định nghĩa | Phần lớn status chưa được dùng trong service |

---

# 15. Các vấn đề cần sửa theo mức độ ưu tiên

## Mức 1 — Cần sửa trước

### 1. Sửa `auth.controller.js`

Hiện tại dùng sai `error.status` thay vì `statusCode` và bypass global error handler.

Nên chuyển sang:

```js
async login(req, res, next) {
  try {
    const result = await this.authService.login(req.body);
    return successResponse(res, result, 'Đăng nhập thành công');
  } catch (error) {
    return next(error);
  }
}
```

### 2. Không dùng JWT secret mặc định

Cả `auth.service.js` và `authenticate.middleware.js` đều có:

```js
process.env.JWT_SECRET || 'saleVoucher_EC'
```

Server nên từ chối khởi động nếu thiếu `JWT_SECRET`.

### 3. Loại bỏ fallback mật khẩu plain text

Production chỉ nên chấp nhận bcrypt hash.

### 4. Không mặc định role lạ thành CUSTOMER

Role không map được phải bị từ chối và ghi log lỗi dữ liệu.

### 5. Gắn middleware cho tất cả route cần bảo vệ

Đặc biệt:

- Dashboard Admin.
- Profile.
- Issue voucher.
- Verify/redeem voucher.

---

## Mức 2 — Hoàn thiện kiến trúc dùng chung

### 6. Dùng response helper trong tất cả controller

Thay:

```js
res.json({ success: true, data: result });
```

bằng:

```js
return successResponse(res, result, '...');
```

### 7. Dùng validator và DTO thật

`auth.dto.js` và `auth.validator.js` hiện chưa tham gia luồng request.

### 8. Phân biệt database error với account not found

Repository không nên trả `null` cho mọi lỗi Supabase.

### 9. Dùng enum thay cho status hard-code

Cần bổ sung `user-status.js` hoặc enum tương đương cho trạng thái tài khoản.

### 10. Tích hợp transaction vào use case nhiều bảng

Ưu tiên dùng RPC cho:

- Tạo order.
- Thanh toán.
- Phát hành voucher.
- Redeem voucher.

---

## Mức 3 — Hoàn thiện toàn project

### 11. Register route của `customer-commerce` và `partner-voucher`

Hai module này hiện chưa được mount trong `src/routes/index.js`.

### 12. Quyết định có dùng model hay không

Các model hiện chủ yếu là scaffold. Có thể:

- Dùng model để map dữ liệu từ repository; hoặc
- Loại bỏ model nếu project dùng object trực tiếp.

Không nên giữ nhiều file model nhưng không có runtime usage mà không giải thích.

### 13. Hạn chế ghi PII không cần thiết vào audit reason

Login thất bại hiện ghi trực tiếp login identifier trong lý do. Cần cân nhắc policy bảo mật và thời gian lưu log.

---

# 16. Phiên bản luồng code nên hướng tới

## Login route

```js
router.post(
  '/login',
  validateLoginMiddleware,
  controller.login.bind(controller)
);
```

## Login controller

```js
async login(req, res, next) {
  try {
    const dto = new AuthDto(req.body);
    const result = await this.authService.login(dto);
    return successResponse(res, result, 'Đăng nhập thành công');
  } catch (error) {
    return next(error);
  }
}
```

## Login service

```js
async login({ email, password }) {
  const account = await userRepository.findAccountByLoginInfo(email);

  if (!account) {
    await auditLogService.log(failedLoginData);
    throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
  }

  if (account.nguoidung.trang_thai !== USER_STATUS.DANG_HOAT_DONG) {
    throw new ForbiddenError('Tài khoản không hoạt động');
  }

  const isMatch = await bcrypt.compare(password, account.mat_khau);
  if (!isMatch) {
    throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
  }

  const role = DB_TO_JWT[account.nguoidung.vai_tro];
  if (!role) {
    throw new ForbiddenError('Vai trò tài khoản không hợp lệ');
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  await auditLogService.log(successLoginData);

  return { token, user: payload };
}
```

## Protected route

```js
router.get(
  '/admin/logs',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.list
);
```

## Global exception flow

```js
app.use('/', routes);
app.use(errorMiddleware);
```

---

# 17. Tóm tắt để trình bày với nhóm hoặc giảng viên

Bạn có thể trình bày phần mình làm như sau:

> Tôi xây dựng nhóm chức năng nền tảng dùng chung cho backend. Hệ thống sử dụng một endpoint đăng nhập chung cho mọi vai trò. Sau khi kiểm tra tài khoản và mật khẩu, backend ánh xạ vai trò trong database sang vai trò chuẩn trong JWT. Các route cần bảo vệ sử dụng hai middleware theo thứ tự: middleware xác thực token tạo `req.user`, sau đó middleware phân quyền kiểm tra `req.user.role`.
>
> Tôi xây dựng hệ thống exception có `AppError` và các lỗi con như 400, 401, 403, 404; mọi lỗi được chuyển về một global error middleware để chuẩn hóa response. Các API thành công có helper `successResponse` và `paginatedResponse`.
>
> Audit log được tách thành service và repository. Service khác chỉ cần truyền người thực hiện, hành động, đối tượng, dữ liệu trước/sau và kết quả. Audit log hỗ trợ chế độ non-strict cho log phụ và strict cho thao tác bắt buộc phải ghi nhận. Admin có endpoint riêng để xem log, được bảo vệ bằng JWT và role Admin.
>
> Tôi cũng tạo các constants dùng chung cho role, đơn hàng, thanh toán, voucher, đối tác và kết quả log nhằm đồng bộ với CHECK constraint trong database. Transaction helper hỗ trợ rollback bù trừ ở Node.js và hỗ trợ gọi PostgreSQL function qua Supabase RPC cho transaction thực sự.

Cần nói thêm một cách trung thực:

> Trong phiên bản hiện tại, đăng nhập, JWT, middleware Admin và audit log đã có luồng tích hợp thật. Response helper, validator, DTO, transaction và phần lớn enum đã được tạo nhưng cần được áp dụng đồng bộ hơn ở các module còn lại.

---

# 18. Kết luận

Phần code bạn thực hiện có định hướng kiến trúc đúng:

- Tách responsibility theo layer.
- Dùng JWT cho đăng nhập dùng chung.
- Tách authentication và authorization.
- Dùng exception có cấu trúc.
- Tạo response helper.
- Tách audit log service và repository.
- Tập trung constants dùng chung.
- Chuẩn bị hai chiến lược transaction cho Supabase.

Điểm còn thiếu chủ yếu không nằm ở cú pháp mà nằm ở mức độ tích hợp:

- Một số controller chưa dùng response và exception chuẩn.
- Nhiều route chưa gắn middleware.
- DTO/validator và transaction chưa tham gia luồng thật.
- Nhiều enum mới được định nghĩa nhưng chưa được sử dụng.
- Một số fallback trong authentication chưa an toàn cho production.

Sau khi sửa các điểm trên, tám task dùng chung sẽ trở thành một nền tảng thống nhất để các phân hệ Admin, Customer và Partner phát triển tiếp mà không phải tự tạo lại authentication, authorization, error handling, response format, audit log và status convention.
