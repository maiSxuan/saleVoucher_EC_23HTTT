# saleVoucher_EC_23HTTT

- “Xây dựng hệ thống thương mại điện tử bán voucher giảm giá trực tuyến”
- link web: https://ec07-snowvoucher.onrender.com

## Mục tiêu cấu trúc dự án

Dự án đã được reorganize theo hướng module-based để các thành viên mới có thể dễ dàng hiểu:

- Backend: chứa API, middleware, module nghiệp vụ, route và cấu hình chung.
- Frontend: chứa giao diện theo role, layout, router và feature riêng.
- Database: chứa schema, migration và seed dữ liệu.
- Docs: chứa tài liệu API, ERD và test-case.

## Cấu trúc thư mục chính

```text
backend/
  src/
    app.js                 # khởi tạo Express app
    server.js              # file chạy thật của backend
    config/                # cấu hình env, cors, database
    common/                # middleware, error, constants, utils, database
    modules/               # module nghiệp vụ theo chức năng
    routes/                # định nghĩa route

frontend/
  src/
    main.jsx               # entry point React
    App.jsx                # màn hình chính
    app/                   # router, auth context, query client
    layouts/               # layout theo vai trò
    routes/                # route theo role (mẫu)
    shared/                # component chung, hook, utils
    features/              # feature riêng theo nghiệp vụ

database/
  migrations/             # file SQL migrate
  seeds/                  # dữ liệu mẫu
  schema.sql              # schema tổng hợp

docs/
  api/                    # tài liệu API
  erd/                    # sơ đồ dữ liệu
  test-cases/             # test case
  screenshots/            # ảnh giao diện
```

## Ý nghĩa từng tầng

- Backend: nơi xử lý request, validate, business logic và tương tác dữ liệu.
- Frontend: nơi render giao diện và điều hướng theo vai trò người dùng.
- Database: nơi lưu trữ dữ liệu và quy trình migration.
- Docs: nơi ghi lại hướng dẫn, API và quy trình test.

## Module hiện có

- core-access: module đăng nhập, phân quyền, quản lý tài khoản.
- partner-voucher: module quản lý đối tác, voucher và duyệt voucher.
- customer-commerce: module mua hàng, giỏ hàng, thanh toán và đơn hàng.
- content-feedback: module thu thập phản hồi, đánh giá nội dung và comment.

## Cách chạy local

Frontend:

- cd frontend
- npm install
- npm run dev

Backend:

- cd backend
- npm install
- npm run dev

## Môi trường chạy

- Frontend React + Vite + Tailwind: http://localhost:5173
- Backend Express + Nodemon: http://localhost:3001

## Hướng dẫn luồng code cho người mới

Nếu bạn chưa biết bắt đầu từ đâu, hãy nhớ quy tắc đơn giản này:

- Frontend làm gì? -> render giao diện, nhận dữ liệu từ người dùng, gọi API.
- Backend làm gì? -> nhận request, xử lý logic, đọc/ghi database, trả kết quả về.
- Database làm gì? -> lưu trữ dữ liệu thật.

### 1. Luồng cơ bản từ đầu đến cuối

Khi bạn mở một chức năng, hãy đọc theo thứ tự này:

1. Frontend: bắt đầu từ route và màn hình
   - Xem [frontend/src/app/router.jsx](frontend/src/app/router.jsx) để biết đường dẫn nào dẫn tới màn hình đó.
   - Xem [frontend/src/App.jsx](frontend/src/App.jsx) để biết app chính render gì.
   - Nếu cần thêm chức năng mới, hãy tìm component trong frontend/src/features/
2. Frontend gọi API ở đâu
   - Nếu có gọi backend, thường tìm trong thư mục feature của frontend hoặc file chung như [frontend/src/shared/utils/api-client.js](frontend/src/shared/utils/api-client.js).
   - Đầu ra của bước này là request đi tới backend.

3. Backend nhận request ở đâu
   - Request đầu tiên đi vào [backend/src/app.js](backend/src/app.js).
   - Sau đó được chuyển vào [backend/src/routes/index.js](backend/src/routes/index.js).
   - Từ đây, hệ thống sẽ đi vào module tương ứng, ví dụ route trong [backend/src/modules/content-feedback/presentation/routes/contentFeedbackRoutes.js](backend/src/modules/content-feedback/presentation/routes/contentFeedbackRoutes.js).

4. Backend xử lý theo tầng
   -(presentation) Route: định nghĩa endpoint, ví dụ GET/POST.
   -(presentation) Controller: nhận request, lấy dữ liệu đầu vào.
   -(business) Service: xử lý nghiệp vụ.
   -(data) Repository/Model: đọc hoặc ghi database.
   -(common/utils) Response: trả dữ liệu về client.

5. Database trả dữ liệu ngược lại
   - Dữ liệu đi ngược từ database -> repository/model -> service -> controller -> route -> frontend.
   - Nếu có lỗi, hệ thống sẽ đi qua middleware lỗi như [backend/src/common/middleware/error.middleware.js](backend/src/common/middleware/error.middleware.js).

### 2. Cách đọc một chức năng nhanh nhất

Nếu bạn muốn sửa một tính năng, hãy làm theo mẫu này:

- Bước A: Tìm màn hình hoặc nút người dùng bấm vào.
- Bước B: Tìm API được gọi từ frontend.
- Bước C: Tìm route tương ứng ở backend.
- Bước D: Đọc controller -> service -> database.
- Bước E: Kiểm tra response trả về có đúng không.

### 3. “Lấy gì, từ đâu, ra cái gì?”

- Lấy gì? -> dữ liệu từ request hoặc từ database.
- Từ đâu? -> từ body, params, query, headers ở request; hoặc từ database qua model/repository.
- Ra cái gì? -> response trả về frontend, hoặc dữ liệu được lưu vào database.

Ví dụ đơn giản:

- Người dùng bấm nút “Gửi phản hồi”.
- Frontend gửi request lên backend.
- Backend nhận request ở route.
- Controller lấy dữ liệu từ body.
- Service xử lý logic.
- Database lưu dữ liệu.
- Backend trả response về frontend.
- Frontend hiện thông báo thành công.

### 4. Nếu bạn không biết bắt đầu từ file nào

Hãy bắt đầu theo thứ tự này:

- Backend: [backend/src/server.js](backend/src/server.js) -> [backend/src/app.js](backend/src/app.js) -> [backend/src/routes/index.js](backend/src/routes/index.js)
- Frontend: [frontend/src/main.jsx](frontend/src/main.jsx) -> [frontend/src/app/router.jsx](frontend/src/app/router.jsx) -> màn hình tương ứng

### 5. Ghi chú cho thành viên mới

- Hãy bắt đầu từ file entry point:
  - Backend: [backend/src/server.js](backend/src/server.js)
  - Frontend: [frontend/src/main.jsx](frontend/src/main.jsx)
- Khi thêm tính năng mới, hãy đặt vào module tương ứng trong [backend/src/modules](backend/src/modules) hoặc [frontend/src/features](frontend/src/features).
- Nếu cần thêm API mới, hãy tạo route trong [backend/src/routes](backend/src/routes) và controller/service tương ứng.
- Code mẫu trong các file đã được comment ngắn để giải thích mục đích của file.
