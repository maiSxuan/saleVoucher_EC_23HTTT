# Đặc tả hệ thống cho khách hàng

> Chuyển đổi từ PDF sang Markdown. Nội dung văn bản được giữ nguyên theo từng trang để hạn chế mất dữ liệu và sai lệch cấu trúc.


## Trang 1

```text
Tên UC           Đăng ký tài khoản

Use case ID      UC-CUS-01

Mô tả            Hệ thống tiếp nhận thông tin đăng ký của khách hàng, kiểm tra định
                 dạng và tính trùng lặp của Email hoặc Số điện thoại, phát hành mã
                 xác thực mô phỏng, xác thực quyền sở hữu thông tin liên lạc và
                 khởi tạo hồ sơ khách hàng mới.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng chọn chức năng “Đăng ký tài khoản” trên hệ thống

Tiền điều kiện      1.​ Khách hàng chưa đăng nhập vào hệ thống.
                    2.​ Khách hàng chưa có tài khoản hoặc chưa hoàn tất quá trình
                        đăng ký.
                    3.​ Hệ thống sẵn sàng tiếp nhận yêu cầu đăng ký tài khoản.

Hậu điều kiện       1.​ Trường hợp đăng ký thành công
                           a.​ Hồ sơ khách hàng mới được tạo trên hệ thống.
                           b.​ Email hoặc số điện thoại được lưu là thông tin đăng
                               nhập của khách hàng.
                           c.​ Thông tin bảo mật ban đầu được lưu trữ.
                           d.​ Hệ thống xác nhận khách hàng đã trở thành thành
                               viên của sàn.
                    2.​ Trường hợp đăng ký không thành công
                           a.​ Không tạo hồ sơ khách hàng.
                           b.​ Không lưu tài khoản mới vào hệ thống.

Luồng cơ bản        1.​ Khách hàng chọn chức năng “Đăng ký tài khoản”.
                    2.​ Hệ thống hiển thị biểu mẫu đăng ký gồm Email hoặc Số
                        điện thoại và thông tin bảo mật ban đầu.
                    3.​ Khách hàng cung cấp Email hoặc Số điện thoại và thiết lập
                        thông tin bảo mật ban đầu.
                    4.​ Hệ thống tiếp nhận thông tin đăng ký.
                    5.​ Hệ thống kiểm tra định dạng Email hoặc Số điện thoại.
                    6.​ Hệ thống đối chiếu Email hoặc Số điện thoại với cơ sở dữ
                        liệu để kiểm tra trùng lặp.
                    7.​ Hệ thống phát hành mã xác thực mô phỏng.
                    8.​ Hệ thống gửi mã xác thực đến Email hoặc Số điện thoại mà
                        khách hàng đã cung cấp.
                    9.​ Hệ thống hiển thị màn hình nhập mã xác thực.
```


## Trang 2

```text
                    10.​Khách hàng nhập mã xác thực nhận được.
                    11.​Hệ thống tiếp nhận mã xác thực.
                    12.​Hệ thống kiểm tra tính chính xác và hiệu lực của mã xác
                        thực.
                    13.​Hệ thống khởi tạo hồ sơ khách hàng mới.
                    14.​Hệ thống lưu hồ sơ khách hàng vào cơ sở dữ liệu.
                    15.​Hệ thống hiển thị thông báo đăng ký thành công và xác
                        nhận khách hàng đã trở thành thành viên chính thức của sàn.
                    16.​Kết thúc Use Case

Luồng thay thế   A5: Thông tin đăng ký không đúng định dạng
                    ●​ Hệ thống phát hiện Email hoặc Số điện thoại không đúng
                       định dạng.
                    ●​ Hệ thống hiển thị thông báo thông tin đăng ký không đúng
                       định dạng.
                    ●​ Hệ thống hiển thị lại biểu mẫu đăng ký và quay lại bước 3
                       của luồng cơ bản.

                 A6: Thông tin đăng ký đã tồn tại
                    ●​ Hệ thống phát hiện Email hoặc Số điện thoại đã tồn tại
                       trong hệ thống.
                    ●​ Hệ thống hiển thị thông báo thông tin đã được đăng ký.
                    ●​ Hệ thống hiển thị lựa chọn thực hiện chức năng Quên mật
                       khẩu (BR_CUS_02) hoặc kết thúc đăng ký.
                    ●​ Nếu khách hàng lựa chọn thực hiện chức năng Quên mật
                       khẩu.
                    ●​ Hệ thống chuyển sang Use Case “Quên mật khẩu”
                       (BR_CUS_02).
                    ●​ Nếu khách hàng lựa chọn kết thúc đăng ký, hệ thống kết
                       thúc Use Case.

                 A12: Mã xác thực không hợp lệ hoặc hết hạn
                    ●​ Hệ thống phát hiện mã xác thực không chính xác hoặc đã
                       hết hiệu lực.
                    ●​ Hệ thống hiển thị thông báo mã xác thực không hợp lệ.
                    ●​ Hệ thống hiển thị lựa chọn nhập lại mã xác thực hoặc yêu
                       cầu gửi lại mã xác thực.
                    +​ A12.1: Nhập lại mã xác thực
                           ●​ Khách hàng nhập lại mã xác thực.
                           ●​ Hệ thống tiếp nhận mã xác thực và quay lại bước 12
                               của luồng cơ bản.
                    +​ A12.1: Gửi lại mã xác thực
                           ●​ Khách hàng chọn gửi lại mã xác thực.
                           ●​ Hệ thống phát hành và gửi mã xác thực mới đến
                               Email hoặc Số điện thoại đã đăng ký, sau đó quay lại
                               bước 9 của luồng cơ bản.
```


## Trang 3

```text
                           +​ A12.1: Nhập sai quá 3 lần
                                       ●​ Hệ thống ghi nhận số lần nhập mã xác thực
                                           không hợp lệ.
                                       ●​ Hệ thống phát hiện khách hàng đã nhập sai
                                           quá 03 lần.
                                       ●​ Hệ thống hiển thị thông báo kết thúc quá
                                           trình đăng ký do vượt quá số lần xác thực
                                           cho phép.
                                       ●​ Hệ thống kết thúc Use Case.

Luồng ngoại lệ          E1: Không thể truy cập cơ sở dữ liệu
                           ●​ Hệ thống không thể truy cập cơ sở dữ liệu để kiểm tra thông
                              tin đăng ký.
                           ●​ Hệ thống hiển thị thông báo không thể xử lý yêu cầu đăng
                              ký.
                           ●​ Hệ thống kết thúc Use Case thất bại.

                        E2: Không thể gửi mã xác thực
                           ●​ Hệ thống không thể phát hành hoặc gửi mã xác thực đến
                              Email hoặc Số điện thoại đã cung cấp.
                           ●​ Hệ thống hiển thị thông báo không thể gửi mã xác thực.
                           ●​ Hệ thống kết thúc Use Case thất bại.

                        E3: Không thể tạo hồ sơ khách hàng
                           ●​ Hệ thống không thể lưu hồ sơ khách hàng vào cơ sở dữ liệu.
                           ●​ Hệ thống không tạo tài khoản mới.
                           ●​ Hệ thống hiển thị thông báo đăng ký thất bại.
                           ●​ Hệ thống kết thúc Use Case thất bại.

Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải phản hồi nhanh khi kiểm tra định dạng Email
                               hoặc Số điện thoại.
                           2.​ Hệ thống phải xử lý việc kiểm tra trùng lặp trước khi phát
                               hành mã xác thực.
                           3.​ Trong thời gian gửi hoặc kiểm tra mã xác thực, hệ thống
                               phải hiển thị trạng thái đang xử lý để người dùng biết yêu
                               cầu vẫn đang được thực hiện.


                        NFR-02 – Bảo mật

                           1.​ Thông tin bảo mật ban đầu của khách hàng phải được lưu
                               trữ an toàn.
                           2.​ Mã xác thực chỉ được sử dụng để xác minh quyền sở hữu
                               Email hoặc Số điện thoại đã cung cấp.
```


## Trang 4

```text
            3.​ Hệ thống chỉ tạo tài khoản khi mã xác thực được kiểm tra
                hợp lệ.


         NFR-03 – Tính ổn định

            1.​ Nếu xảy ra lỗi trong quá trình kiểm tra hoặc tạo tài khoản,
                hệ thống không được tạo hồ sơ khách hàng chưa hoàn
                chỉnh.
            2.​ Khi quá trình đăng ký thất bại, dữ liệu không được lưu một
                phần.
            3.​ Hệ thống phải xử lý an toàn khi việc gửi mã xác thực hoặc
                lưu dữ liệu không thành công.


         NFR-05 – Khả năng sử dụng

            1.​ Giao diện đăng ký phải hiển thị rõ các trường:
                   ○​ Email hoặc Số điện thoại.
                   ○​ Thông tin bảo mật ban đầu.
            2.​ Thông báo lỗi phải chỉ rõ nguyên nhân:
                   ○​ Sai định dạng.
                   ○​ Thông tin đã tồn tại.
                   ○​ Mã xác thực không hợp lệ.
                   ○​ Mã xác thực hết hạn.
            3.​ Giao diện nhập mã xác thực phải cho phép:
                   ○​ Nhập lại mã xác thực.
                   ○​ Yêu cầu gửi lại mã xác thực.
            4.​ Sau khi đăng ký thành công, hệ thống phải hiển thị thông
                báo xác nhận khách hàng đã trở thành thành viên của sàn.


         NFR-06 – Toàn vẹn dữ liệu

            1.​ Email hoặc Số điện thoại phải là duy nhất trong hệ thống.
            2.​ Hồ sơ khách hàng chỉ được tạo sau khi hoàn thành toàn bộ
                quy trình xác thực.
            3.​ Hệ thống phải đảm bảo mỗi tài khoản chỉ được khởi tạo một
                lần từ cùng một Email hoặc Số điện thoại.




Tên UC   Đăng nhập
```


## Trang 5

```text
Use case ID      UC-CUS-02

Mô tả            Hệ thống xác thực thông tin đăng nhập của khách hàng, kiểm tra
                 trạng thái hoạt động của tài khoản, thiết lập phiên làm việc an toàn
                 và cấp quyền truy cập vào các chức năng dành cho thành viên.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng chọn chức năng “Đăng nhập”.

Tiền điều kiện      1.​ Khách hàng đã có tài khoản trên hệ thống.
                    2.​ Hệ thống sẵn sàng tiếp nhận yêu cầu đăng nhập.

Hậu điều kiện       1.​ Trường hợp đăng nhập thành công
                           a.​ Phiên làm việc an toàn được thiết lập.
                           b.​ Khách hàng được cấp quyền truy cập các chức năng
                               dành cho thành viên.
                           c.​ Hệ thống hiển thị giao diện cá nhân hóa của khách
                               hàng.
                    2.​ Trường hợp đăng nhập thất bại
                           a.​ Không thiết lập phiên làm việc.
                           b.​ Không cấp quyền truy cập vào hệ thống.

Luồng cơ bản        1.​ Khách hàng chọn chức năng “Đăng nhập”.
                    2.​ Hệ thống hiển thị biểu mẫu đăng nhập gồm email hoặc số
                        điện thoại và mật khẩu.
                    3.​ Khách hàng nhập email hoặc số điện thoại và mật khẩu đã
                        đăng ký.
                    4.​ Hệ thống tiếp nhận thông tin đăng nhập.
                    5.​ Hệ thống mã hóa mật khẩu và đối chiếu thông tin đăng nhập
                        với dữ liệu tài khoản đã lưu trữ.
                    6.​ Hệ thống xác nhận thông tin đăng nhập hợp lệ.
                    7.​ Hệ thống kiểm tra trạng thái hoạt động của tài khoản.
                    8.​ Hệ thống thiết lập phiên làm việc an toàn.
                    9.​ Hệ thống cấp quyền truy cập các chức năng dành cho thành
                        viên.
                    10.​Hệ thống hiển thị giao diện cá nhân hóa của khách hàng.
                    11.​Hệ thống kết thúc Use Case.

Luồng thay thế   A5: Xác thực thất bại do sai thông tin đăng nhập
                    ●​ Hệ thống phát hiện email, số điện thoại hoặc mật khẩu
                       không khớp với dữ liệu lưu trữ.
                    ●​ Hệ thống ghi nhận số lần đăng nhập không thành công liên
                       tiếp.
                    ●​ Hệ thống hiển thị thông báo thông tin đăng nhập không
```


## Trang 6

```text
                              chính xác.
                           ●​ Hệ thống kiểm tra số lần đăng nhập thất bại liên tiếp.
                           +​ A5.1: Chưa vượt quá số lần cho phép
                                  ●​ Hệ thống cho phép khách hàng tiếp tục đăng nhập.
                                  ●​ Hệ thống hiển thị lại biểu mẫu đăng nhập và quay lại
                                     bước 3 của luồng cơ bản.
                           +​ A5.2: Nhập sai quá 05 lần liên tiếp
                                  ●​ Hệ thống cập nhật trạng thái tài khoản sang “Tạm
                                     khóa”.
                                  ●​ Hệ thống hiển thị thông báo tài khoản đã bị tạm
                                     khóa do đăng nhập sai quá số lần cho phép.
                                  ●​ Hệ thống kết thúc Use Case.

                        A7: Tài khoản đang ở trạng thái tạm khóa
                           ●​ Hệ thống phát hiện tài khoản đang ở trạng thái “Tạm khóa”.
                           ●​ Hệ thống từ chối thiết lập phiên làm việc.
                           ●​ Hệ thống hiển thị thông báo tài khoản đang bị tạm khóa.
                           ●​ Hệ thống kết thúc Use Case.

Luồng ngoại lệ          E1: Không thể truy cập dữ liệu tài khoản
                           ●​ Hệ thống không thể truy cập dữ liệu tài khoản để xác thực
                              thông tin đăng nhập.
                           ●​ Hệ thống hiển thị thông báo không thể xử lý yêu cầu đăng
                              nhập.
                           ●​ Hệ thống kết thúc Use Case thất bại.

                        E2: Không thể thiết lập phiên làm việc
                           ●​ Hệ thống không thể thiết lập phiên làm việc sau khi xác
                              thực thành công.
                           ●​ Hệ thống không cấp quyền truy cập cho khách hàng.
                           ●​ Hệ thống hiển thị thông báo không thể đăng nhập vào hệ
                              thống.
                           ●​ Hệ thống kết thúc Use Case thất bại.

Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải phản hồi nhanh khi xác thực thông tin đăng
                               nhập.
                           2.​ Quá trình kiểm tra trạng thái tài khoản và thiết lập phiên
                               làm việc phải được thực hiện liên tục, không yêu cầu khách
                               hàng thao tác lại.
                           3.​ Trong thời gian xác thực, hệ thống phải hiển thị trạng thái
                               đang xử lý.


                        NFR-02 – Bảo mật
```


## Trang 7

```text
   1.​ Mật khẩu khách hàng phải được mã hóa trước khi đối chiếu
       với dữ liệu lưu trữ.
   2.​ Hệ thống chỉ cấp quyền truy cập sau khi hoàn thành xác
       thực và kiểm tra trạng thái tài khoản.
   3.​ Phiên làm việc chỉ được tạo đối với tài khoản có trạng thái
       hoạt động.
   4.​ Sau 05 lần đăng nhập sai liên tiếp, hệ thống phải tự động
       chuyển tài khoản sang trạng thái Tạm khóa.


NFR-03 – Tính ổn định

   1.​ Khi xảy ra lỗi xác thực hoặc lỗi hệ thống, không được tạo
       phiên đăng nhập.
   2.​ Nếu không thể thiết lập phiên làm việc, hệ thống không
       được cấp quyền truy cập.
   3.​ Các lỗi xử lý không được làm thay đổi thông tin tài khoản
       của khách hàng.


NFR-05 – Khả năng sử dụng

   1.​ Giao diện đăng nhập phải hiển thị các trường:
          ○​ Email hoặc Số điện thoại.
          ○​ Mật khẩu.
   2.​ Hệ thống phải hiển thị thông báo rõ ràng trong các trường
       hợp:
          ○​ Sai thông tin đăng nhập.
          ○​ Tài khoản bị tạm khóa.
          ○​ Không thể đăng nhập.
   3.​ Sau khi đăng nhập thành công, hệ thống phải chuyển khách
       hàng đến giao diện cá nhân hóa.


NFR-06 – Quản lý phiên làm việc

   1.​ Mỗi lần đăng nhập thành công phải tạo một phiên làm việc
       mới.
   2.​ Phiên làm việc chỉ được tạo sau khi hoàn tất quá trình xác
       thực và kiểm tra trạng thái tài khoản.
   3.​ Phiên làm việc phải được liên kết với đúng tài khoản đã
       đăng nhập để phục vụ các chức năng dành cho thành viên.
```


## Trang 8

```text
Tên UC           Cập nhật hồ sơ

Use case ID      UC-CUS-03

Mô tả            Hệ thống cho phép khách hàng cập nhật thông tin hồ sơ cá nhân sau
                 khi đăng nhập. Hệ thống kiểm tra tính hợp lệ của dữ liệu mới trước
                 khi lưu vào hồ sơ khách hàng và thông báo kết quả cập nhật.

Actor            Khách hàng

Độ ưu tiên       Trung bình

Trigger          Khách hàng chọn chức năng “Quản lý hồ sơ” trên giao diện cá
                 nhân.

Tiền điều kiện      1.​ Khách hàng đã đăng nhập thành công.
                    2.​ Phiên làm việc của khách hàng còn hiệu lực.
                    3.​ Hồ sơ khách hàng đã tồn tại trên hệ thống.

Hậu điều kiện       1.​ Trường hợp cập nhật thành công
                           a.​ Hồ sơ khách hàng được cập nhật với dữ liệu mới.
                           b.​ Thông tin mới được lưu vào cơ sở dữ liệu.
                           c.​ Hệ thống hiển thị thông báo cập nhật thành công.
                    2.​ Trường hợp cập nhật không thành công
                           a.​ Hồ sơ khách hàng không bị thay đổi.
                           b.​ Hệ thống giữ nguyên dữ liệu trước khi cập nhật.

Luồng cơ bản        1.​ Khách hàng chọn chức năng “Quản lý hồ sơ”.
                    2.​ Hệ thống truy xuất thông tin hồ sơ của khách hàng.
                    3.​ Hệ thống hiển thị thông tin hồ sơ hiện tại.
                    4.​ Khách hàng chỉnh sửa các thông tin cần cập nhật.
                    5.​ Khách hàng xác nhận cập nhật hồ sơ.
                    6.​ Hệ thống tiếp nhận dữ liệu cập nhật.
                    7.​ Hệ thống kiểm tra tính hợp lệ của dữ liệu mới.
                    8.​ Hệ thống cập nhật thông tin mới vào hồ sơ khách hàng.
                    9.​ Hệ thống lưu thông tin cập nhật vào cơ sở dữ liệu.
                    10.​Hệ thống hiển thị thông báo cập nhật hồ sơ thành công.
                    11.​Hệ thống hiển thị lại hồ sơ với thông tin đã được cập nhật.
                    12.​Hệ thống kết thúc Use Case.

Luồng thay thế   A4: Khách hàng hủy cập nhật
                    ●​ Khách hàng chọn hủy cập nhật.
                    ●​ Hệ thống hủy các thay đổi chưa được lưu.
                    ●​ Hệ thống hiển thị lại thông tin hồ sơ hiện tại.
                    ●​ Hệ thống kết thúc Use Case.
                 A7: Dữ liệu cập nhật không hợp lệ
                    ●​ Hệ thống phát hiện dữ liệu cập nhật không hợp lệ.
```


## Trang 9

```text
                           ●​ Hệ thống hiển thị thông báo dữ liệu không hợp lệ.
                           ●​ Hệ thống đánh dấu các trường thông tin cần chỉnh sửa.
                           ●​ Khách hàng chỉnh sửa lại các thông tin theo yêu cầu.
                           ●​ Khách hàng xác nhận cập nhật lại hồ sơ.
                           ●​ Hệ thống tiếp nhận dữ liệu mới và quay lại bước 7 của
                              luồng cơ bản.

Luồng ngoại lệ          E1: Không thể truy xuất hồ sơ khách hàng
                           ●​ Hệ thống không thể truy xuất thông tin hồ sơ khách hàng.
                           ●​ Hệ thống hiển thị thông báo không thể tải thông tin hồ sơ.
                           ●​ Hệ thống kết thúc Use Case thất bại.
                        E2: Không thể cập nhật hồ sơ
                           ●​ Hệ thống không thể lưu thông tin cập nhật vào cơ sở dữ
                              liệu.
                           ●​ Hệ thống hủy quá trình cập nhật.
                           ●​ Hệ thống giữ nguyên dữ liệu hồ sơ trước khi cập nhật.
                           ●​ Hệ thống hiển thị thông báo cập nhật hồ sơ thất bại.
                           ●​ Hệ thống kết thúc Use Case thất bại.

Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải phản hồi nhanh khi tải thông tin hồ sơ khách
                               hàng.
                           2.​ Quá trình kiểm tra dữ liệu và cập nhật hồ sơ phải được thực
                               hiện liên tục sau khi khách hàng xác nhận cập nhật.
                           3.​ Trong thời gian xử lý cập nhật, hệ thống phải hiển thị trạng
                               thái đang xử lý để tránh việc khách hàng thực hiện lặp lại
                               thao tác.


                        NFR-02 – Bảo mật

                           1.​ Chỉ khách hàng đã đăng nhập mới được phép cập nhật hồ sơ
                               của chính mình.
                           2.​ Hệ thống chỉ cho phép cập nhật hồ sơ thuộc tài khoản đang
                               đăng nhập.
                           3.​ Hệ thống phải kiểm tra quyền truy cập trước khi thực hiện
                               cập nhật hồ sơ.


                        NFR-03 – Tính ổn định

                           1.​ Nếu quá trình cập nhật thất bại, hệ thống không được lưu dữ
                               liệu chưa hoàn chỉnh.
                           2.​ Hồ sơ khách hàng phải được giữ nguyên nếu xảy ra lỗi
                               trong quá trình lưu dữ liệu.
                           3.​ Hệ thống không được hiển thị thông báo cập nhật thành
```


## Trang 10

```text
                        công khi dữ liệu chưa được lưu thành công.


                 NFR-05 – Khả năng sử dụng

                    1.​ Giao diện phải hiển thị đầy đủ thông tin hồ sơ hiện tại trước
                        khi khách hàng chỉnh sửa.
                    2.​ Hệ thống phải hiển thị rõ các trường dữ liệu không hợp lệ
                        để khách hàng dễ dàng chỉnh sửa.
                    3.​ Sau khi cập nhật thành công, hệ thống phải hiển thị thông
                        báo xác nhận và thông tin hồ sơ mới.
                    4.​ Thông báo lỗi phải mô tả rõ nguyên nhân dữ liệu không hợp
                        lệ.


                 NFR-06 – Toàn vẹn dữ liệu

                    1.​ Chỉ các dữ liệu hợp lệ mới được lưu vào hồ sơ khách hàng.
                    2.​ Hệ thống phải đảm bảo việc cập nhật được thực hiện toàn
                        vẹn; nếu xảy ra lỗi trong quá trình lưu, toàn bộ thay đổi phải
                        được hủy.
                    3.​ Dữ liệu sau khi cập nhật phải được đồng bộ với hồ sơ khách
                        hàng đang sử dụng.




Tên UC           Thay đổi mật khẩu

Use case ID      UC-CUS-04

Mô tả            Hệ thống cho phép khách hàng thay đổi mật khẩu tài khoản sau khi
                 đăng nhập bằng cách xác thực mật khẩu hiện tại và kiểm tra tính
                 hợp lệ của mật khẩu mới trước khi cập nhật vào hồ sơ tài khoản.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng chọn chức năng “Thay đổi mật khẩu” trên giao diện tài
                 khoản.

Tiền điều kiện      1.​ Khách hàng đã đăng nhập thành công.
                    2.​ Phiên làm việc của khách hàng còn hiệu lực.
                    3.​ Tài khoản khách hàng đang hoạt động.

Hậu điều kiện       1.​ Trường hợp thay đổi mật khẩu thành công
```


## Trang 11

```text
                           a.​ Mật khẩu mới được cập nhật vào hồ sơ tài khoản.
                           b.​ Mật khẩu cũ không còn được sử dụng để xác thực.
                           c.​ Hệ thống hiển thị thông báo thay đổi mật khẩu thành
                               công.
                    2.​ Trường hợp thay đổi mật khẩu không thành công
                           a.​ Mật khẩu hiện tại của tài khoản không thay đổi.
                           b.​ Hệ thống không cập nhật dữ liệu tài khoản.

Luồng cơ bản        1.​ Khách hàng chọn chức năng “Thay đổi mật khẩu”.
                    2.​ Hệ thống hiển thị biểu mẫu thay đổi mật khẩu gồm: Mật
                        khẩu hiện tại, mật khẩu mới và mật khẩu xác nhận.
                    3.​ Khách hàng nhập mật khẩu hiện tại, mật khẩu mới và mật
                        khẩu xác nhận.
                    4.​ Hệ thống tiếp nhận thông tin thay đổi mật khẩu.
                    5.​ Hệ thống kiểm tra tính hợp lệ của thông tin đã nhập.
                    6.​ Hệ thống xác nhận mật khẩu hiện tại chính xác và mật khẩu
                        xác nhận trùng khớp với mật khẩu mới.
                    7.​ Hệ thống cập nhật mật khẩu mới vào hồ sơ tài khoản.
                    8.​ Hệ thống lưu mật khẩu mới vào cơ sở dữ liệu.
                    9.​ Hệ thống hiển thị thông báo thay đổi mật khẩu thành công.
                    10.​Hệ thống kết thúc Use Case.

Luồng thay thế   A5.1: Mật khẩu hiện tại không chính xác
                    ●​ Hệ thống phát hiện mật khẩu hiện tại không chính xác.
                    ●​ Hệ thống hiển thị thông báo mật khẩu hiện tại không đúng.
                    ●​ Hệ thống hiển thị lại biểu mẫu thay đổi mật khẩu.
                    ●​ Khách hàng nhập lại thông tin thay đổi mật khẩu.
                    ●​ Hệ thống tiếp nhận thông tin và quay lại bước 5 của luồng
                       cơ bản.
                 A5.2: Mật khẩu xác nhận không khớp
                    ●​ Hệ thống phát hiện mật khẩu xác nhận không trùng khớp
                       với mật khẩu mới.
                    ●​ Hệ thống hiển thị thông báo mật khẩu xác nhận không khớp.
                    ●​ Hệ thống hiển thị lại biểu mẫu thay đổi mật khẩu.
                    ●​ Khách hàng nhập lại thông tin thay đổi mật khẩu.
                    ●​ Hệ thống tiếp nhận thông tin và quay lại bước 5 của luồng
                       cơ bản.

Luồng ngoại lệ   E1: Không thể truy cập dữ liệu tài khoản hoặc không thể cập
                 nhật mật khẩu
                    ●​ Hệ thống không thể lưu mật khẩu mới vào cơ sở dữ liệu.
                    ●​ Hệ thống hủy quá trình cập nhật mật khẩu.
                    ●​ Hệ thống giữ nguyên mật khẩu hiện tại của tài khoản.
                    ●​ Hệ thống hiển thị thông báo thay đổi mật khẩu thất bại.
                    ●​ Hệ thống kết thúc Use Case thất bại.
```


## Trang 12

```text
Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải phản hồi nhanh khi xác thực mật khẩu hiện
                               tại và cập nhật mật khẩu mới.
                           2.​ Quá trình thay đổi mật khẩu phải được thực hiện liên tục
                               sau khi khách hàng xác nhận.
                           3.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng thái đang
                               xử lý để tránh khách hàng thực hiện lặp lại thao tác.


                        NFR-02 – Bảo mật

                           1.​ Hệ thống phải mã hóa mật khẩu trước khi đối chiếu và lưu
                               trữ.
                           2.​ Hệ thống chỉ cho phép thay đổi mật khẩu đối với tài khoản
                               đang đăng nhập.
                           3.​ Mật khẩu mới chỉ được cập nhật sau khi hoàn thành quá
                               trình xác thực mật khẩu hiện tại.
                           4.​ Hệ thống không được hiển thị giá trị mật khẩu đã lưu trong
                               bất kỳ trường hợp nào.


                        NFR-03 – Tính ổn định

                           1.​ Nếu xảy ra lỗi trong quá trình cập nhật, hệ thống phải giữ
                               nguyên mật khẩu hiện tại.
                           2.​ Hệ thống không được cập nhật một phần dữ liệu tài khoản.
                           3.​ Hệ thống không được hiển thị thông báo thành công khi mật
                               khẩu chưa được lưu thành công.


                        NFR-05 – Khả năng sử dụng

                           1.​ Giao diện phải hiển thị các trường:
                                  ○​ Mật khẩu hiện tại.
                                  ○​ Mật khẩu mới.
                                  ○​ Mật khẩu xác nhận.
                           2.​ Hệ thống phải hiển thị rõ thông báo trong các trường hợp:
                                  ○​ Mật khẩu hiện tại không chính xác.
                                  ○​ Mật khẩu xác nhận không khớp.
                                  ○​ Thay đổi mật khẩu thành công.
                                  ○​ Thay đổi mật khẩu thất bại.
                           3.​ Các trường mật khẩu phải được che ký tự trong quá trình
                               nhập.
```


## Trang 13

```text
                 NFR-06 – Toàn vẹn dữ liệu

                    1.​ Mật khẩu mới chỉ được lưu khi toàn bộ thông tin hợp lệ.
                    2.​ Sau khi cập nhật thành công, chỉ mật khẩu mới được sử
                        dụng để xác thực các lần đăng nhập tiếp theo.
                    3.​ Nếu quá trình lưu dữ liệu thất bại, hệ thống phải giữ nguyên
                        mật khẩu trước khi thay đổi.




Tên UC           Quên mật khẩu

Use case ID      UC-CUS-05

Mô tả            Hệ thống hỗ trợ khách hàng thiết lập mật khẩu mới khi quên mật
                 khẩu bằng cách xác minh email hoặc số điện thoại đã đăng ký, xác
                 thực mã xác nhận và cập nhật mật khẩu mới cho tài khoản.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng chọn chức năng “Quên mật khẩu” trên màn hình đăng
                 nhập.

Tiền điều kiện      1.​ Khách hàng đã có tài khoản trên hệ thống.
                    2.​ Hệ thống sẵn sàng tiếp nhận yêu cầu khôi phục mật khẩu.

Hậu điều kiện       1.​ Trường hợp khôi phục mật khẩu thành công
                           a.​ Mật khẩu mới được cập nhật vào tài khoản.
                           b.​ Mật khẩu cũ không còn được sử dụng để đăng nhập.
                           c.​ Khách hàng có thể đăng nhập bằng mật khẩu mới.
                    2.​ Trường hợp khôi phục mật khẩu không thành công
                           a.​ Mật khẩu của tài khoản không thay đổi.
                           b.​ Không cập nhật dữ liệu tài khoản.

Luồng cơ bản        1.​ Khách hàng chọn chức năng “Quên mật khẩu”.
                    2.​ Hệ thống hiển thị biểu mẫu nhập email hoặc số điện thoại
                        đã đăng ký.
                    3.​ Khách hàng nhập email hoặc số điện thoại đã đăng ký.
                    4.​ Hệ thống tiếp nhận thông tin.
                    5.​ Hệ thống đối chiếu email hoặc số điện thoại với dữ liệu tài
                        khoản.
                    6.​ Hệ thống phát hành mã xác thực.
                    7.​ Hệ thống gửi mã xác thực đến email hoặc số điện thoại đã
                        đăng ký.
```


## Trang 14

```text
                    8.​ Hệ thống hiển thị màn hình nhập mã xác thực.
                    9.​ Khách hàng nhập mã xác thực.
                    10.​Hệ thống tiếp nhận mã xác thực.
                    11.​Hệ thống kiểm tra tính hợp lệ của mã xác thực.
                    12.​Hệ thống hiển thị biểu mẫu thiết lập mật khẩu mới.
                    13.​Khách hàng nhập mật khẩu mới và xác nhận mật khẩu mới.
                    14.​Hệ thống tiếp nhận thông tin mật khẩu mới.
                    15.​Hệ thống cập nhật mật khẩu mới vào tài khoản.
                    16.​Hệ thống lưu mật khẩu mới vào cơ sở dữ liệu.
                    17.​Hệ thống hiển thị thông báo đặt lại mật khẩu thành công và
                        yêu cầu khách hàng đăng nhập lại.
                    18.​Hệ thống kết thúc Use Case.

Luồng thay thế   A5: Không tìm thấy tài khoản
                    ●​ Hệ thống không tìm thấy tài khoản tương ứng với email
                       hoặc số điện thoại đã cung cấp.
                    ●​ Hệ thống hiển thị thông báo không tìm thấy tài khoản.
                    ●​ Hệ thống hiển thị lại biểu mẫu nhập email hoặc số điện
                       thoại.
                    ●​ Khách hàng nhập lại email hoặc số điện thoại.
                    ●​ Hệ thống tiếp nhận thông tin và quay lại bước 5 của luồng
                       cơ bản.
                 A11: Mã xác thực không hợp lệ
                    ●​ Hệ thống phát hiện mã xác thực không hợp lệ.
                    ●​ Hệ thống hiển thị thông báo mã xác thực không hợp lệ.
                    ●​ Hệ thống hiển thị lựa chọn nhập lại mã xác thực hoặc yêu
                       cầu gửi lại mã xác thực.
                    +​ A11.1: Nhập lại mã xác thực
                           ●​ Khách hàng nhập lại mã xác thực.
                           ●​ Hệ thống tiếp nhận mã xác thực và quay lại bước 11
                               của luồng cơ bản.
                    +​ A11.2: Gửi lại mã xác thực
                           ●​ Khách hàng chọn gửi lại mã xác thực.
                           ●​ Hệ thống phát hành và gửi mã xác thực mới, sau đó
                               quay lại bước 8 của luồng cơ bản.

Luồng ngoại lệ   E1: Không thể truy cập dữ liệu tài khoản
                    ●​ Hệ thống không thể truy cập dữ liệu tài khoản để kiểm tra
                       thông tin.
                    ●​ Hệ thống hiển thị thông báo không thể thực hiện yêu cầu
                       khôi phục mật khẩu.
                    ●​ Hệ thống kết thúc Use Case thất bại.
                 E2: Không thể gửi mã xác thực
                    ●​ Hệ thống không thể phát hành hoặc gửi mã xác thực đến
                       Email hoặc Số điện thoại đã đăng ký.
                    ●​ Hệ thống hiển thị thông báo không thể gửi mã xác thực.
```


## Trang 15

```text
                           ●​ Hệ thống kết thúc Use Case thất bại.
                        E3: Không thể cập nhật mật khẩu mới
                           ●​ Hệ thống không thể lưu mật khẩu mới vào cơ sở dữ liệu.
                           ●​ Hệ thống giữ nguyên mật khẩu hiện tại của tài khoản.
                           ●​ Hệ thống hiển thị thông báo đặt lại mật khẩu thất bại.
                           ●​ Hệ thống kết thúc Use Case thất bại.

Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải phản hồi nhanh khi kiểm tra Email hoặc Số
                               điện thoại đã đăng ký.
                           2.​ Quá trình gửi và xác thực mã xác thực phải được thực hiện
                               liên tục sau khi khách hàng gửi yêu cầu.
                           3.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng thái đang
                               xử lý.


                        NFR-02 – Bảo mật

                           1.​ Hệ thống chỉ cho phép thiết lập mật khẩu mới sau khi mã
                               xác thực được kiểm tra hợp lệ.
                           2.​ Mật khẩu mới phải được mã hóa trước khi lưu vào cơ sở dữ
                               liệu.
                           3.​ Mã xác thực chỉ được sử dụng cho yêu cầu khôi phục mật
                               khẩu đang thực hiện.
                           4.​ Sau khi cập nhật thành công, mật khẩu cũ không còn được
                               sử dụng để đăng nhập.


                        NFR-03 – Tính ổn định

                           1.​ Nếu xảy ra lỗi trong quá trình cập nhật mật khẩu, hệ thống
                               phải giữ nguyên mật khẩu hiện tại.
                           2.​ Hệ thống không được cập nhật một phần dữ liệu tài khoản.
                           3.​ Hệ thống không được hiển thị thông báo thành công khi mật
                               khẩu chưa được lưu thành công.


                        NFR-05 – Khả năng sử dụng

                           1.​ Giao diện phải hiển thị lần lượt:
                                  ○​ Biểu mẫu nhập Email hoặc Số điện thoại.
                                  ○​ Biểu mẫu nhập mã xác thực.
                                  ○​ Biểu mẫu thiết lập mật khẩu mới.
                           2.​ Hệ thống phải hiển thị rõ các thông báo:
                                  ○​ Không tìm thấy tài khoản.
                                  ○​ Mã xác thực không hợp lệ.
```


## Trang 16

```text
                           ○​ Không thể gửi mã xác thực.
                           ○​ Đặt lại mật khẩu thành công.
                    3.​ Giao diện nhập mã xác thực phải cho phép:
                           ○​ Nhập lại mã xác thực.
                           ○​ Yêu cầu gửi lại mã xác thực.


                 NFR-06 – Toàn vẹn dữ liệu

                    1.​ Hệ thống chỉ cập nhật mật khẩu sau khi hoàn thành toàn bộ
                        quy trình xác thực.
                    2.​ Mật khẩu mới phải được lưu toàn vẹn; nếu xảy ra lỗi, hệ
                        thống phải giữ nguyên mật khẩu cũ.
                    3.​ Sau khi khôi phục mật khẩu thành công, khách hàng phải sử
                        dụng mật khẩu mới trong các lần đăng nhập tiếp theo.




Tên UC           Đăng xuất

Use case ID      UC-CUS-06

Mô tả            Hệ thống cho phép khách hàng kết thúc phiên làm việc hiện tại
                 bằng cách hủy phiên đăng nhập và ngăn chặn việc tiếp tục truy cập
                 các chức năng dành cho thành viên cho đến khi khách hàng đăng
                 nhập lại.

Actor            Khách hàng

Độ ưu tiên       Trung bình

Trigger
                 Khách hàng chọn chức năng “Đăng xuất” trên giao diện hệ thống.


Tiền điều kiện      1.​ Khách hàng đã đăng nhập thành công.
                    2.​ Phiên làm việc của khách hàng còn hiệu lực.

Hậu điều kiện       1.​ Trường hợp đăng xuất thành công
                           a.​ Phiên làm việc hiện tại được kết thúc.
                           b.​ Khách hàng không còn quyền truy cập vào các chức
                               năng dành cho thành viên.
                           c.​ Hệ thống hiển thị giao diện đăng nhập hoặc trang
                               chủ của hệ thống.
                    2.​ Trường hợp đăng xuất không thành công
```


## Trang 17

```text
                                  a.​ Phiên làm việc vẫn còn hiệu lực.
                                  b.​ Khách hàng vẫn đang ở trạng thái đăng nhập.

Luồng cơ bản               1.​ Khách hàng chọn chức năng “Đăng xuất”.
                           2.​ Hệ thống tiếp nhận yêu cầu đăng xuất.
                           3.​ Hệ thống kết thúc phiên làm việc hiện tại của khách hàng.
                           4.​ Hệ thống thu hồi quyền truy cập các chức năng dành cho
                               thành viên.
                           5.​ Hệ thống hiển thị giao diện đăng nhập hoặc trang chủ của
                               hệ thống.
                           6.​ Hệ thống kết thúc Use Case.

Luồng thay thế

Luồng ngoại lệ          E1 – Không thể kết thúc phiên làm việc
                           ●​ Hệ thống không thể kết thúc phiên làm việc hiện tại.
                           ●​ Hệ thống hiển thị thông báo không thể đăng xuất.
                           ●​ Hệ thống giữ nguyên phiên làm việc hiện tại.
                           ●​ Hệ thống kết thúc Use Case thất bại.

Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải kết thúc phiên làm việc trong thời gian ngắn
                               sau khi khách hàng gửi yêu cầu đăng xuất.
                           2.​ Sau khi đăng xuất thành công, hệ thống phải chuyển sang
                               giao diện đăng nhập hoặc trang chủ mà không yêu cầu
                               khách hàng tải lại trang.


                        NFR-02 – Bảo mật

                           1.​ Hệ thống phải hủy phiên làm việc hiện tại ngay sau khi
                               đăng xuất thành công.
                           2.​ Sau khi đăng xuất, khách hàng không được tiếp tục truy cập
                               các chức năng yêu cầu xác thực.
                           3.​ Mọi yêu cầu sử dụng phiên làm việc đã kết thúc phải bị từ
                               chối.


                        NFR-03 – Tính ổn định

                           1.​ Nếu quá trình đăng xuất xảy ra lỗi, hệ thống không được tạo
                               phiên làm việc mới.
                           2.​ Hệ thống phải đảm bảo trạng thái phiên làm việc nhất quán
                               trong suốt quá trình đăng xuất.
```


## Trang 18

```text
                 NFR-05 – Khả năng sử dụng

                    1.​ Chức năng Đăng xuất phải dễ dàng truy cập từ giao diện
                        người dùng sau khi đăng nhập.
                    2.​ Sau khi đăng xuất thành công, hệ thống phải hiển thị giao
                        diện đăng nhập hoặc trang chủ để khách hàng tiếp tục sử
                        dụng hệ thống nếu cần.
                    3.​ Khi đăng xuất không thành công, hệ thống phải hiển thị
                        thông báo rõ ràng để khách hàng biết trạng thái hiện tại.


                 NFR-06 – Quản lý phiên làm việc

                    1.​ Mỗi yêu cầu đăng xuất chỉ được áp dụng cho phiên làm việc
                        hiện tại của khách hàng.
                    2.​ Sau khi đăng xuất thành công, phiên làm việc phải được
                        đánh dấu là không còn hiệu lực.
                    3.​ Hệ thống không được cho phép sử dụng lại phiên làm việc
                        đã kết thúc.




Tên UC           Tìm kiếm voucher

Use case ID      UC-CUS-07

Mô tả            Hệ thống hỗ trợ khách hàng tìm kiếm và lọc các voucher đang được
                 phép bán dựa trên từ khóa hoặc các tiêu chí lọc, sau đó hiển thị
                 danh sách voucher phù hợp để khách hàng lựa chọn xem chi tiết.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng chọn chức năng “Tìm kiếm voucher” hoặc thực hiện
                 tìm kiếm trên hệ thống.

Tiền điều kiện      1.​ Hệ thống đang hoạt động bình thường.
                    2.​ Hệ thống có dữ liệu voucher đang được phép bán.

Hậu điều kiện       1.​ Trường hợp thành công
                           a.​ Danh sách voucher phù hợp được hiển thị.
                           b.​ Khách hàng có thể lựa chọn một voucher để chuyển
                               sang Use Case “Xem chi tiết voucher”
                               (UC-CUS-08) hoặc kết thúc việc tìm kiếm.
                    2.​ Trường hợp không thành công
```


## Trang 19

```text
                           a.​ Không có danh sách voucher phù hợp được hiển thị.
                           b.​ Hệ thống thông báo không tìm thấy kết quả phù hợp.

Luồng cơ bản
                    1.​ Khách hàng nhập từ khóa tìm kiếm hoặc lựa chọn các tiêu
                        chí lọc.
                    2.​ Hệ thống tiếp nhận yêu cầu tìm kiếm.
                    3.​ Hệ thống đối chiếu yêu cầu tìm kiếm với các voucher đang
                        được phép bán.
                    4.​ Hệ thống áp dụng các điều kiện tìm kiếm và lọc.
                    5.​ Hệ thống hiển thị danh sách các voucher phù hợp.
                    6.​ Khách hàng xem danh sách kết quả và lựa chọn một
                        voucher quan tâm.
                    7.​ Hệ thống chuyển sang Use Case “Xem chi tiết voucher”
                        (UC-CUS-08).
                    8.​ Use Case kết thúc.


Luồng thay thế   A4: Không tìm thấy voucher phù hợp
                    ●​ Hệ thống không tìm thấy voucher phù hợp với điều kiện tìm
                       kiếm.
                    ●​ Hệ thống thông báo không có kết quả phù hợp.
                    ●​ Khách hàng thay đổi từ khóa hoặc tiêu chí lọc.
                    ●​ Quay lại bước 2 của luồng cơ bản.

                 A6: Khách hàng chỉ xem danh sách kết quả

                    ●​ Khách hàng xem danh sách voucher nhưng không lựa chọn
                       voucher nào.
                    ●​ Hệ thống giữ nguyên danh sách kết quả tìm kiếm.
                    ●​ Use Case kết thúc.


Luồng ngoại lệ   E1: Không thể truy xuất dữ liệu voucher

                    ●​ Hệ thống không thể truy xuất dữ liệu voucher để thực hiện
                       tìm kiếm.
                    ●​ Hệ thống thông báo không thể xử lý yêu cầu tìm kiếm.
                    ●​ Use Case kết thúc thất bại.

                 E2. Xảy ra lỗi trong quá trình tìm kiếm

                    ●​ Hệ thống gặp lỗi khi áp dụng điều kiện tìm kiếm hoặc lọc.
                    ●​ Hệ thống thông báo có lỗi xảy ra trong quá trình tìm kiếm.
                    ●​ Use Case kết thúc thất bại.
```


## Trang 20

```text
Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải phản hồi nhanh khi tiếp nhận yêu cầu tìm
                               kiếm.
                           2.​ Kết quả tìm kiếm phải được hiển thị trong thời gian ngắn
                               sau khi áp dụng điều kiện tìm kiếm và lọc.
                           3.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng thái đang
                               tìm kiếm.


                        NFR-02 – Độ chính xác

                           1.​ Hệ thống chỉ tìm kiếm trên các voucher đang được phép
                               bán.
                           2.​ Kết quả hiển thị phải phù hợp với từ khóa hoặc các tiêu chí
                               lọc mà khách hàng đã cung cấp.
                           3.​ Hệ thống không được hiển thị các voucher không thỏa mãn
                               điều kiện tìm kiếm.


                        NFR-03 – Tính ổn định

                           1.​ Nếu xảy ra lỗi trong quá trình tìm kiếm, hệ thống không
                               được hiển thị dữ liệu không đầy đủ hoặc sai lệch.
                           2.​ Việc tìm kiếm không được làm thay đổi dữ liệu voucher trên
                               hệ thống.


                        NFR-04 – Khả năng sử dụng

                           1.​ Giao diện phải cho phép khách hàng tìm kiếm bằng từ khóa
                               hoặc lựa chọn các tiêu chí lọc.
                           2.​ Hệ thống phải hiển thị rõ thông báo khi không tìm thấy kết
                               quả phù hợp.
                           3.​ Danh sách kết quả phải được trình bày rõ ràng để khách
                               hàng dễ dàng lựa chọn voucher.
                           4.​ Khi khách hàng chọn một voucher trong danh sách, hệ
                               thống phải chuyển sang Use Case “Xem chi tiết voucher”.




Tên UC                  Xem chi tiết voucher
```


## Trang 21

```text
Use case ID      UC-CUS-08

Mô tả            Hệ thống cung cấp đầy đủ thông tin chi tiết của voucher để khách
                 hàng đánh giá trước khi quyết định mua. Sau khi xem thông tin,
                 khách hàng có thể lựa chọn thêm voucher vào giỏ hàng để tiếp tục
                 quá trình mua sắm.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng chọn một voucher từ danh sách tìm kiếm hoặc danh
                 sách đề xuất.

Tiền điều kiện      1.​ Voucher tồn tại trên hệ thống.
                    2.​ Voucher đang được hiển thị trong danh sách tìm kiếm hoặc
                        danh sách đề xuất.

Hậu điều kiện       1.​ Trường hợp thành công
                           a.​ Thông tin chi tiết của voucher được hiển thị cho
                               khách hàng.
                           b.​ Nếu khách hàng chọn thêm voucher vào giỏ hàng và
                               voucher còn khả dụng, hệ thống chuyển sang Use
                               Case “Quản lý giỏ hàng” (UC-CUS-09).
                    2.​ Trường hợp không thành công
                           a.​ Voucher không được thêm vào giỏ hàng.
                           b.​ Hệ thống hiển thị thông báo nếu voucher không còn
                               khả dụng để bán.

Luồng cơ bản
                    1.​ Khách hàng chọn một voucher cần xem.
                    2.​ Hệ thống tiếp nhận yêu cầu và truy xuất thông tin chi tiết
                        của voucher.
                    3.​ Hệ thống hiển thị đầy đủ thông tin chi tiết của voucher.
                    4.​ Khách hàng xem thông tin chi tiết của voucher.
                    5.​ Khách hàng chọn chức năng "Thêm vào giỏ hàng".
                    6.​ Hệ thống kiểm tra trạng thái của voucher.
                    7.​ Hệ thống xác nhận voucher còn khả dụng để bán.
                    8.​ Hệ thống chuyển sang Use Case “Quản lý giỏ hàng”
                        (UC-CUS-09).
                    9.​ Use Case kết thúc.


Luồng thay thế   A4: Khách hàng không thêm voucher vào giỏ hàng

                    ●​ Khách hàng xem thông tin chi tiết của voucher nhưng
                       không chọn chức năng "Thêm vào giỏ hàng".
```


## Trang 22

```text
                           ●​ Use Case kết thúc.

                        A6: Voucher không còn khả dụng để bán

                           ●​ Hệ thống phát hiện voucher không còn khả dụng để bán.
                           ●​ Hệ thống thông báo voucher hiện không khả dụng do hết số
                              lượng, hết thời gian bán hoặc đã ngừng bán.
                           ●​ Use Case kết thúc.


Luồng ngoại lệ          E1: Không thể truy xuất thông tin voucher

                           ●​ Hệ thống không thể truy xuất thông tin chi tiết của voucher.
                           ●​ Hệ thống thông báo không thể hiển thị thông tin voucher.
                           ●​ Use Case kết thúc thất bại.

                        E2: Xảy ra lỗi khi kiểm tra trạng thái voucher

                           ●​ Hệ thống không thể kiểm tra trạng thái của voucher.
                           ●​ Hệ thống thông báo không thể xử lý yêu cầu thêm voucher
                              vào giỏ hàng.
                           ●​ Use Case kết thúc thất bại.


Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải hiển thị thông tin chi tiết của voucher trong
                               thời gian ngắn sau khi khách hàng lựa chọn.
                           2.​ Quá trình kiểm tra trạng thái voucher phải được thực hiện
                               ngay khi khách hàng yêu cầu thêm voucher vào giỏ hàng.
                           3.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng thái đang
                               xử lý.


                        NFR-02 – Độ chính xác

                           1.​ Hệ thống phải hiển thị đầy đủ và chính xác thông tin chi tiết
                               của voucher.
                           2.​ Trạng thái khả dụng của voucher phải được kiểm tra tại thời
                               điểm khách hàng thêm voucher vào giỏ hàng.
                           3.​ Hệ thống chỉ cho phép chuyển sang UC-CUS-09 – Quản lý
                               giỏ hàng khi voucher còn khả dụng để bán.


                        NFR-03 – Tính ổn định

                           1.​ Nếu xảy ra lỗi khi truy xuất thông tin voucher hoặc kiểm tra
```


## Trang 23

```text
                         trạng thái voucher, hệ thống không được thêm voucher vào
                         giỏ hàng.
                     2.​ Việc xem thông tin chi tiết voucher không được làm thay
                         đổi dữ liệu của voucher trên hệ thống.


                 NFR-04 – Khả năng sử dụng

                     1.​ Giao diện phải hiển thị đầy đủ các thông tin của voucher,
                         bao gồm mô tả chương trình ưu đãi, giá bán, điều kiện sử
                         dụng, thời hạn hiệu lực, số lượng còn lại, chi nhánh áp dụng
                         và chính sách hoàn hủy.
                     2.​ Hệ thống phải hiển thị rõ thông báo khi voucher không còn
                         khả dụng để bán.
                     3.​ Giao diện phải cung cấp chức năng "Thêm vào giỏ hàng"
                         để khách hàng tiếp tục quá trình mua sắm.
                     4.​ Khi khách hàng chọn thêm voucher vào giỏ hàng và
                         voucher còn khả dụng, hệ thống phải chuyển sang
                         UC-CUS-09 – Quản lý giỏ hàng.




Tên UC           Quản lý giỏ hàng

Use case ID      UC-CUS-09

Mô tả            Hệ thống hỗ trợ khách hàng quản lý các voucher trong giỏ hàng
                 trước khi tạo đơn hàng, bao gồm xem danh sách voucher đã chọn,
                 điều chỉnh số lượng hoặc xóa toàn bộ voucher trong giỏ hàng để
                 chuẩn bị cho quá trình đặt mua.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng chọn chức năng “Giỏ hàng”.

Tiền điều kiện       1.​ Khách hàng đã đăng nhập vào hệ thống.
                     2.​ Giỏ hàng của khách hàng đã được khởi tạo.

Hậu điều kiện        1.​ Trường hợp thành công
                            a.​ Giỏ hàng được cập nhật theo thao tác của khách
                                hàng.
                            b.​ Giá trị tổng tạm tính được cập nhật tương ứng.
                            c.​ Nếu khách hàng xác nhận đặt mua, hệ thống chuyển
```


## Trang 24

```text
                               sang Use case “Tạo đơn hàng” (UC-CUS-10).
                    2.​ Trường hợp không thành công
                           a.​ Giỏ hàng giữ nguyên trạng thái trước khi thao tác.
                           b.​ Khách hàng không thể tiếp tục tạo đơn hàng nếu giỏ
                               hàng trống.

Luồng cơ bản
                    1.​ Khách hàng truy cập giỏ hàng.
                    2.​ Hệ thống truy xuất danh sách voucher trong giỏ hàng.
                    3.​ Hệ thống hiển thị danh sách voucher trong giỏ hàng và giá
                        trị tổng tạm tính.
                    4.​ Khách hàng xác nhận tiến hành đặt mua.
                    5.​ Hệ thống chuyển sang Use case “Tạo đơn hàng”
                        (UC-CUS-10).
                    6.​ Use Case kết thúc.


Luồng thay thế   A3.1: Khách hàng điều chỉnh số lượng voucher

                    ●​ Khách hàng thay đổi số lượng voucher trong giỏ hàng.
                    ●​ Hệ thống tiếp nhận số lượng mới.
                    ●​ Hệ thống kiểm tra tính hợp lệ của số lượng yêu cầu.
                    -​ A3.1.1: Số lượng hợp lệ
                          ●​ Hệ thống cập nhật số lượng voucher trong giỏ hàng.
                          ●​ Hệ thống tính lại giá trị tổng tạm tính.
                          ●​ Hệ thống hiển thị thông tin giỏ hàng đã được cập
                              nhật.
                          ●​ Quay lại bước 3 của luồng cơ bản.
                    -​ A3.1.2: Số lượng không hợp lệ
                          ●​ Hệ thống phát hiện số lượng yêu cầu vượt quá số
                              lượng khả dụng.
                          ●​ Hệ thống thông báo số lượng không hợp lệ.
                          ●​ Khách hàng lựa chọn nhập lại số lượng hoặc hủy
                              thao tác chỉnh sửa.
                          +​ A3.1.2.1: Khách hàng nhập lại số lượng
                                  ●​ Khách hàng nhập số lượng mới.
                                  ●​ Hệ thống tiếp nhận số lượng và quay lại
                                      bước kiểm tra số lượng của A1.
                          +​ A3.1.2.2: Khách hàng hủy thao tác chỉnh sửa
                                  ●​ Khách hàng hủy thao tác chỉnh sửa.
                                  ●​ Hệ thống giữ nguyên số lượng voucher trước
                                      khi chỉnh sửa.
                                  ●​ Hệ thống hiển thị lại thông tin giỏ hàng.
                                  ●​ Quay lại bước 3 của luồng cơ bản.

                 A3.2. Khách hàng xóa toàn bộ voucher trong giỏ hàng
```


## Trang 25

```text
                           ●​ Khách hàng chọn chức năng "Xóa tất cả voucher".
                           ●​ Hệ thống xóa toàn bộ voucher khỏi giỏ hàng.
                           ●​ Hệ thống cập nhật giỏ hàng rỗng.
                           ●​ Hệ thống thông báo không có voucher nào trong giỏ hàng.
                           ●​ Hệ thống không cho phép khách hàng tiếp tục thực hiện đặt
                              hàng khi giỏ hàng trống.
                           ●​ Use Case kết thúc.


Luồng ngoại lệ          E1: Không thể truy xuất giỏ hàng

                           ●​ Hệ thống không thể truy xuất thông tin giỏ hàng.
                           ●​ Hệ thống thông báo không thể hiển thị giỏ hàng.
                           ●​ Use Case kết thúc thất bại.

                        E2: Không thể cập nhật giỏ hàng

                           ●​ Hệ thống không thể cập nhật thông tin giỏ hàng.
                           ●​ Hệ thống giữ nguyên dữ liệu giỏ hàng trước khi thao tác.
                           ●​ Hệ thống thông báo không thể cập nhật giỏ hàng.
                           ●​ Use Case kết thúc thất bại.


Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải hiển thị thông tin giỏ hàng trong thời gian
                               ngắn sau khi khách hàng truy cập.
                           2.​ Việc cập nhật số lượng voucher và tính lại tổng tạm tính
                               phải được thực hiện ngay sau khi dữ liệu hợp lệ.
                           3.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng thái đang
                               xử lý.


                        NFR-02 – Độ chính xác

                           1.​ Hệ thống phải hiển thị chính xác danh sách voucher và giá
                               trị tổng tạm tính.
                           2.​ Hệ thống phải kiểm tra số lượng yêu cầu với số lượng
                               voucher còn khả dụng trước khi cập nhật giỏ hàng.
                           3.​ Hệ thống chỉ cho phép chuyển sang Use case “Tạo đơn
                               hàng” (UC-CUS-10) khi giỏ hàng có ít nhất một voucher.


                        NFR-03 – Tính ổn định

                           1.​ Nếu xảy ra lỗi trong quá trình cập nhật giỏ hàng, hệ thống
                               phải giữ nguyên dữ liệu trước khi thao tác.
```


## Trang 26

```text
                    2.​ Việc điều chỉnh số lượng hoặc xóa voucher không được làm
                        mất dữ liệu ngoài phạm vi giỏ hàng của khách hàng.


                 NFR-04 – Khả năng sử dụng

                    1.​ Giao diện phải hiển thị đầy đủ danh sách voucher trong giỏ
                        hàng và giá trị tổng tạm tính.
                    2.​ Hệ thống phải cho phép khách hàng điều chỉnh số lượng
                        voucher hoặc xóa toàn bộ voucher trong giỏ hàng.
                    3.​ Hệ thống phải hiển thị rõ thông báo khi số lượng yêu cầu
                        không hợp lệ hoặc khi giỏ hàng không còn voucher.
                    4.​ Khi khách hàng xác nhận đặt mua, hệ thống phải chuyển
                        sang Use case “Tạo đơn hàng” (UC-CUS-10).




Tên UC           Tạo đơn hàng

Use case ID      UC-CUS-10

Mô tả            Hệ thống hỗ trợ khách hàng tạo đơn hàng từ các voucher đã chọn
                 trong giỏ hàng bằng cách kiểm tra tính khả dụng của voucher, hiển
                 thị thông tin đơn hàng, thực hiện thanh toán và ghi nhận đơn hàng
                 sau khi thanh toán thành công.

Actor            Khách hàng

Độ ưu tiên       Cao

Trigger          Khách hàng xác nhận tiến hành đặt mua các voucher trong giỏ
                 hàng.

Tiền điều kiện      1.​ Khách hàng đã đăng nhập vào hệ thống.
                    2.​ Giỏ hàng có ít nhất một voucher.
                    3.​ Các voucher trong giỏ hàng đang được lưu trên hệ thống.

Hậu điều kiện       1.​ Trường hợp thành công
                           a.​ Đơn hàng được tạo.
                           b.​ Đơn hàng được ghi nhận ở trạng thái “Đã thanh
                               toán”.
                           c.​ Hệ thống chuyển sang Use case “Nhận voucher đã
                               mua” (UC-CUS-11).
                    2.​ Trường hợp không thành công
```


## Trang 27

```text
                           a.​ Đơn hàng không được tạo hoặc được ghi nhận ở
                               trạng thái “Chưa thanh toán”.
                           b.​ Khách hàng có thể thanh toán lại hoặc kết thúc giao
                               dịch.

Luồng cơ bản
                    1.​ Khách hàng yêu cầu tạo đơn hàng.
                    2.​ Hệ thống tiếp nhận yêu cầu tạo đơn hàng.
                    3.​ Hệ thống kiểm tra tính khả dụng của các voucher trong đơn
                        hàng.
                    4.​ Hệ thống hiển thị thông tin đơn hàng và số tiền cần thanh
                        toán.
                    5.​ Khách hàng xác nhận thanh toán.
                    6.​ Hệ thống thực hiện thanh toán trực tuyến.
                    7.​ Hệ thống xác nhận thanh toán thành công.
                    8.​ Hệ thống tạo đơn hàng ở trạng thái “Đã thanh toán”.
                    9.​ Hệ thống chuyển sang Use case “Nhận voucher đã mua”
                        (UC-CUS-11).
                    10.​Use Case kết thúc.


Luồng thay thế   A3: Voucher không còn đủ số lượng

                    ●​ Hệ thống phát hiện một hoặc nhiều voucher không còn đủ
                       số lượng.
                    ●​ Hệ thống thông báo voucher không còn đủ số lượng để thực
                       hiện giao dịch.
                    ●​ Khách hàng quay lại Use case “Quản lý giỏ hàng”
                       (UC-CUS-09) để điều chỉnh số lượng voucher trong giỏ
                       hàng.
                    ●​ Quay lại bước 3 của luồng cơ bản.

                 A6: Thanh toán thất bại

                    ●​ Hệ thống thông báo giao dịch thanh toán thất bại.
                    ●​ Hệ thống ghi nhận đơn hàng ở trạng thái “Chưa thanh toán”.
                    ●​ Khách hàng lựa chọn thanh toán lại hoặc hủy giao dịch.
                    +​ A6.1: Khách hàng thanh toán lại
                          ●​ Khách hàng xác nhận thực hiện thanh toán lại.
                          ●​ Quay lại bước 5 của luồng cơ bản.
                    +​ A6.2: Khách hàng hủy giao dịch
                          ●​ Khách hàng hủy giao dịch.
                          ●​ Use Case kết thúc.


Luồng ngoại lệ   E1: Không thể kiểm tra tính khả dụng của voucher
```


## Trang 28

```text
                           ●​ Hệ thống không thể kiểm tra tính khả dụng của các voucher
                              trong đơn hàng.
                           ●​ Hệ thống thông báo không thể tạo đơn hàng.
                           ●​ Use Case kết thúc thất bại.

                        E2: Không thể tạo đơn hàng

                           ●​ Hệ thống không thể ghi nhận đơn hàng sau khi thanh toán
                              thành công.
                           ●​ Hệ thống thông báo tạo đơn hàng thất bại.
                           ●​ Use Case kết thúc thất bại.

                        E3. Xảy ra lỗi trong quá trình thanh toán

                           ●​ Hệ thống gặp lỗi khi xử lý giao dịch thanh toán.
                           ●​ Hệ thống thông báo không thể thực hiện thanh toán.
                           ●​ Use Case kết thúc thất bại.


Yêu cầu phi chức năng   NFR-01 – Hiệu năng

                           1.​ Hệ thống phải kiểm tra tính khả dụng của voucher trong
                               thời gian ngắn sau khi khách hàng yêu cầu tạo đơn hàng.
                           2.​ Thông tin đơn hàng và số tiền thanh toán phải được hiển thị
                               ngay sau khi hoàn tất kiểm tra.
                           3.​ Trong thời gian xử lý thanh toán, hệ thống phải hiển thị
                               trạng thái đang xử lý để khách hàng theo dõi.


                        NFR-02 – Độ chính xác

                           1.​ Hệ thống chỉ cho phép tạo đơn hàng khi tất cả voucher trong
                               đơn hàng còn đủ số lượng.
                           2.​ Tổng số tiền thanh toán phải được tính chính xác từ các
                               voucher trong đơn hàng.
                           3.​ Hệ thống chỉ ghi nhận đơn hàng ở trạng thái “Đã thanh
                               toán” sau khi thanh toán thành công.


                        NFR-03 – Tính ổn định

                           1.​ Nếu quá trình thanh toán thất bại, hệ thống phải ghi nhận
                               đơn hàng ở trạng thái “Chưa thanh toán”.
                           2.​ Nếu xảy ra lỗi trong quá trình tạo đơn hàng, hệ thống không
                               được ghi nhận đơn hàng ở trạng thái “Đã thanh toán”.
                           3.​ Việc tạo đơn hàng phải đảm bảo dữ liệu đơn hàng được lưu
```


## Trang 29

```text
                       nhất quán.


                 NFR-04 – Khả năng sử dụng

                    1.​ Hệ thống phải hiển thị đầy đủ thông tin đơn hàng và số tiền
                        cần thanh toán trước khi khách hàng xác nhận thanh toán.
                    2.​ Hệ thống phải hiển thị rõ thông báo khi voucher không còn
                        đủ số lượng hoặc khi giao dịch thanh toán thất bại.
                    3.​ Khi thanh toán thất bại, hệ thống phải cho phép khách hàng
                        lựa chọn thanh toán lại hoặc hủy giao dịch.
                    4.​ Sau khi tạo đơn hàng thành công, hệ thống phải tự động
                        chuyển sang Use case “Nhận voucher đã mua”
                        (UC-CUS-11).



BR_CUS_07
Tên UC                 Nhận voucher đã mua

Use case ID            BR_CUS_07

Mô tả                  Hệ thống thực hiện phát hành voucher code điện tử sau khi đơn
                       hàng được thanh toán thành công, hiển thị thông tin voucher và cho
                       phép khách hàng xem lại voucher, trạng thái sử dụng và lịch sử đơn
                       hàng.

Actor                  Khách hàng

Độ ưu tiên             Cao

Trigger                BR_CUS_07 – Nhận voucher đã mua

Tiền điều kiện            1.​ Đơn hàng của khách hàng đã được thanh toán thành công.
                          2.​ Giao dịch thanh toán đã được hệ thống xác nhận hợp lệ.
                          3.​ Hệ thống có khả năng xử lý phát hành voucher code.

Hậu điều kiện          Trường hợp thành công
                          1.​ Voucher code được sinh và gắn với đơn hàng.
                          2.​ Hệ thống hiển thị:
                          ●​ Mã voucher;
                          ●​ Mã QR mô phỏng;
                          ●​ Thời hạn sử dụng;
                          ●​ Chi nhánh áp dụng.
                          3.​ Voucher được lưu trong hệ thống để khách hàng có thể truy
                              cập lại.
```


## Trang 30

```text
                    4.​ Khách hàng có thể xem:
                    ●​ Trạng thái sử dụng;
                    ●​ Lịch sử đơn hàng.
                 Trường hợp phát hành chưa hoàn tất
                    1.​ Đơn hàng được giữ ở trạng thái “Chờ phát hành mã”.
                    2.​ Voucher code chưa được tạo.
                    3.​ Hệ thống ghi nhận lỗi phát hành.

Luồng cơ bản        1.​ Hệ thống nhận xác nhận đơn hàng đã thanh toán thành công.
                    2.​ Hệ thống kiểm tra trạng thái thanh toán của đơn hàng.
                    3.​ Hệ thống xác nhận đơn hàng hợp lệ để phát hành voucher.
                    4.​ Hệ thống Sinh voucher code duy nhất gắn với đơn hàng.
                    5.​ Hệ thống Tạo mã QR mô phỏng tương ứng với voucher
                        code.
                    6.​ Hệ thống Lưu voucher code và thông tin liên quan vào hệ
                        thống.
                    7.​ Hệ thống Hiển thị trang xác nhận đơn hàng.
                    8.​ Hệ thống Hiển thị thông tin voucher gồm: mã voucher, mã
                        QR mô phỏng, thời hạn sử dụng, chi nhánh áp dụng, tên đối
                        tác, điều kiện sử dụng
                    9.​ khách hàng Xem thông tin voucher được hiển thị.
                    10.​Khách hàng Truy cập mục “Voucher của tôi”.
                    11.​Hệ thống Truy xuất danh sách voucher của khách hàng.
                    12.​Hệ thống Hiển thị danh sách voucher cùng trạng thái sử
                        dụng.
                    13.​Hệ thống Hiển thị lịch sử đơn hàng liên quan đến voucher.
                    14.​Hệ thống Kết thúc Use Case.

Luồng thay thế   A4 – Không sinh được voucher code
                    A4.1 Hệ thống Không thể sinh voucher code.
                    A4.2 Hệ thống Ghi nhận lỗi phát hành voucher.
                    A4.3 Hệ thống Cập nhật trạng thái đơn hàng thành “Lỗi sinh
                    mã”.
                    A4.4 Hệ thống Hiển thị thông báo cho khách hàng về việc chưa
                    thể phát hành voucher.
                    A4.5 Hệ thống Thông báo cho Quản trị viên để xử lý thủ công.
                    A4.6 Hệ thống Kết thúc Use Case.
                 A7 – Trang xác nhận không tải được
                    A7.1 Hệ thống Không thể hiển thị trang xác nhận đơn hàng.
                    A7.2 Hệ thống Không hiển thị thông tin voucher tại trang xác
                 nhận.
                    A7.3 Hệ thống Hiển thị hướng dẫn truy cập mục “Đơn hàng của
                 tôi”.
                    A7.4 Khách hàng Truy cập mục “Đơn hàng của tôi”.
                    A7.5 Hệ thống Truy xuất thông tin đơn hàng đã thanh toán.
                    A7.6 Hệ thống Hiển thị voucher code đã được phát hành.
```


## Trang 31

```text
                     A7.7 Hệ thống Kết thúc Use Case.

Luồng ngoại lệ     E1 – Không thể lưu voucher vào hệ thống
                      E1.1 Hệ thống Không thể lưu voucher code sau khi sinh.
                      E1.2 Hệ thống Không hiển thị thông tin voucher như một kết quả
                      thành công.
                      E1.3 Hệ thống Ghi nhận lỗi hệ thống.
                      E1.4 Hệ thống Hiển thị thông báo: “Không thể phát hành
                      voucher. Vui lòng thử lại.”
                      E1.5 Hệ thống Giữ trạng thái đơn hàng chưa hoàn tất phát hành
                      voucher.
                      E1.6 Hệ thống Kết thúc Use Case thất bại.
                   E2 – Không thể truy xuất danh sách voucher
                     E2.1 Hệ thống Không thể truy xuất danh sách voucher tại bước
                   11.
                     E2.2 Hệ thống Không hiển thị danh sách voucher.
                     E2.3 Hệ thống Hiển thị thông báo: “Không thể tải danh sách
                   voucher.”
                     E2.4 Hệ thống Kết thúc Use Case thất bại.

YC Phi chức năng   NFR-01 – Hiệu năng
                   Hệ thống phải tự động phát hành voucher ngay sau khi thanh toán
                   thành công.
                   Thời gian hiển thị trang xác nhận và thông tin voucher phải đảm
                   bảo không gây gián đoạn trải nghiệm người dùng.
                   Hệ thống phải thể hiện trạng thái xử lý khi đang sinh voucher.
                   NFR-02 – Bảo mật
                   Voucher code phải là duy nhất và gắn với đúng đơn hàng.
                   Hệ thống chỉ cho phép khách hàng truy cập voucher thuộc về tài
                   khoản của mình.
                   Hệ thống không hiển thị voucher của khách hàng khác.
                   NFR-03 – Tính ổn định
                   Hệ thống không được phát hành trùng voucher code.
                   Hệ thống phải đảm bảo dữ liệu voucher không bị mất sau khi sinh.
                   Khi xảy ra lỗi phát hành, hệ thống phải giữ trạng thái đơn hàng phù
                   hợp.
                   NFR-05 – Khả năng sử dụng
                   Hệ thống phải hiển thị rõ:
                   Mã voucher;
                   Mã QR mô phỏng;
                   Thời hạn sử dụng;
                   Chi nhánh áp dụng.
                   Khách hàng có thể dễ dàng truy cập:
                   “Voucher của tôi”;
                   “Đơn hàng của tôi”.Thông báo lỗi phải rõ ràng và dễ hiểu.
                   NFR-06 – Khả năng kiểm toán
```


## Trang 32

```text
                 Hệ thống phải ghi nhận việc phát hành voucher.
                 Ghi nhận phải bao gồm:
                 Thời gian phát hành;
                 Đơn hàng liên quan;
                 Trạng thái phát hành.
                 Các lỗi phát hành phải được ghi nhận để xử lý.


BR_CUS_08
Tên UC           Đánh giá và phản hồi

Use case ID      BR_CUS_08

Mô tả            Hệ thống cho phép Khách hàng chọn voucher từ đơn hàng đã thanh
                 toán để thực hiện đánh giá bằng cách nhập bình luận và gửi. Ngoài
                 ra, Khách hàng có thể gửi phản hồi hoặc khiếu nại thay cho đánh
                 giá.

Actor            Khách hàng

Độ ưu tiên       Trung bình – Cao

Trigger          Khách hàng truy cập vào danh sách đơn hàng của bản thân sau khi
                 đơn hàng đã thanh toán thành công.

Tiền điều kiện       1.​ Khách hàng đã đăng nhập vào hệ thống.
                     2.​ Khách hàng có ít nhất một đơn hàng đã thanh toán thành
                         công.
                     3.​ Hệ thống có dữ liệu đơn hàng và voucher tương ứng.
                     4.​ Phiên đăng nhập của khách hàng còn hiệu lực.

Hậu điều kiện    Trường hợp gửi đánh giá
                    1.​ Hệ thống lưu bình luận đánh giá của khách hàng.
                    2.​ Hệ thống hiển thị đánh giá trên trang chi tiết voucher.
                    3.​ Đánh giá được liên kết với voucher và tài khoản khách hàng.
                 Trường hợp gửi phản hồi/khiếu nại
                    1.​ Hệ thống ghi nhận nội dung phản hồi/khiếu nại.
                    2.​ Hệ thống chuyển nội dung phản hồi/khiếu nại đến quản trị
                        viên để xử lý.
                    3.​ Không tạo đánh giá cho voucher.

Luồng cơ bản     1   Khách hàng Truy cập vào chức năng Xem đơn hàng của tôi.
                 2   Hệ thống Kiểm tra phiên đăng nhập của khách hàng.
                 3   Hệ thống Truy xuất danh sách đơn hàng của khách hàng.
                 4   Hệ thống Hiển thị danh sách đơn hàng.
                 5   Khách hàng Chọn một voucher trong đơn hàng đã mua hoặc đã
```


## Trang 33

```text
                 sử dụng.
                 6 Hệ thống Truy xuất thông tin voucher được chọn.
                 7 Hệ thống Hiển thị trang chi tiết voucher kèm chức năng Đánh
                 giá.
                 8 Khách hàng Chọn chức năng Đánh giá.
                 9 Hệ thống Hiển thị giao diện nhập nội dung bình luận.
                 10 Khách hàng Nhập nội dung bình luận đánh giá.
                 11 Khách hàng Chọn thao tác Gửi bình luận.
                 12 Hệ thống Tiếp nhận nội dung bình luận từ khách hàng.
                 13 Hệ thống Lưu bình luận đánh giá vào hệ thống.
                 14 Hệ thống Liên kết bình luận với voucher và tài khoản khách
                 hàng.
                 15 Hệ thống Hiển thị lại trang chi tiết voucher kèm đánh giá vừa
                 gửi.
                 16 Hệ thống Kết thúc Use Case.

Luồng thay thế   A3 – Gửi phản hồi/khiếu nại thay vì đánh giá
                 A3.1 Khách hàng Chọn chức năng Gửi phản hồi/khiếu nại.
                 A3.2 Hệ thống Hiển thị giao diện nhập nội dung phản hồi/khiếu
                 nại.
                 A3.3 Khách hàng Nhập nội dung phản hồi/khiếu nại.
                 A3.4 Khách hàng Chọn thao tác Gửi phản hồi.
                 A3.5 Hệ thống Tiếp nhận nội dung phản hồi/khiếu nại.
                 A3.6 Hệ thống Ghi nhận nội dung phản hồi/khiếu nại vào hệ
                 thống.
                 A3.7 Hệ thống Chuyển nội dung phản hồi/khiếu nại đến quản trị
                 viên để xử lý.
                 A3.8 Hệ thống Hiển thị thông báo gửi phản hồi/khiếu nại thành
                 công.
                 A3.9 Hệ thống Kết thúc Use Case.

Luồng ngoại lệ   E1 – Phiên đăng nhập không hợp lệ
                 E1.1 Hệ thống Phát hiện phiên đăng nhập không còn hiệu lực.
                 E1.2 Hệ thống Không truy xuất danh sách đơn hàng.
                 E1.3 Hệ thống Hiển thị yêu cầu đăng nhập lại.
                 E1.4 Hệ thống Kết thúc Use Case thất bại.
                 E2 – Không thể tải danh sách đơn hàng
                 E2.1 Hệ thống Không thể truy xuất danh sách đơn hàng.
                 E2.2 Hệ thống Hiển thị thông báo lỗi tải dữ liệu.
                 E2.3 Hệ thống Không hiển thị dữ liệu không đầy đủ.
                 E2.4 Hệ thống Kết thúc Use Case thất bại.
                 E3 – Không thể tải thông tin voucher
                 E3.1 Hệ thống Không thể truy xuất thông tin voucher được chọn.
                 E3.2 Hệ thống Hiển thị thông báo lỗi.
                 E3.3 Hệ thống Không hiển thị trang chi tiết voucher.
                 E3.4 Hệ thống Kết thúc Use Case thất bại.
```


## Trang 34

```text
                   E4 – Gửi đánh giá thất bại
                   E4.1 Hệ thống Không thể lưu bình luận đánh giá.
                   E4.2 Hệ thống Không hiển thị thông báo thành công.
                   E4.3 Hệ thống Giữ nguyên trạng thái chưa có đánh giá.
                   E4.4 Hệ thống Hiển thị thông báo: “Không thể gửi đánh giá. Vui
                   lòng thử lại.”
                   E4.5 Hệ thống Kết thúc Use Case thất bại.
                   E5 – Gửi phản hồi/khiếu nại thất bại
                   E5.1 Hệ thống Không thể ghi nhận nội dung phản hồi/khiếu nại.
                   E5.2 Hệ thống Không chuyển được phản hồi đến quản trị viên.
                   E5.3 Hệ thống Hiển thị thông báo: “Không thể gửi phản hồi. Vui
                   lòng thử lại.”
                   E5.4 Hệ thống Không lưu dữ liệu phản hồi không hoàn chỉnh.
                   E5.5 Hệ thống Kết thúc Use Case thất bại.

YC Phi chức năng   NFR-01 – Hiệu năng
                   Hệ thống phải phản hồi nhanh đối với các thao tác:
                   Tải danh sách đơn hàng;
                   Mở chi tiết voucher;
                   Gửi đánh giá;
                   Gửi phản hồi/khiếu nại.
                   Hệ thống phải thể hiện trạng thái đang xử lý khi gửi dữ liệu.
                   NFR-02 – Bảo mật
                   Chỉ khách hàng đã đăng nhập mới được gửi đánh giá hoặc phản hồi.
                   Hệ thống phải kiểm tra quyền truy cập đơn hàng trước khi hiển thị.
                   Khách hàng chỉ được thao tác trên đơn hàng của chính mình.
                   NFR-03 – Tính ổn định
                   Hệ thống phải xử lý lỗi khi không thể tải dữ liệu hoặc gửi dữ liệu.
                   Không được lưu dữ liệu đánh giá hoặc phản hồi khi thao tác chưa
                   hoàn tất.
                   Không hiển thị thông báo thành công nếu dữ liệu chưa được lưu.
                   NFR-05 – Khả năng sử dụng
                   Giao diện phải phân biệt rõ:
                   Nút Đánh giá;
                   Nút Gửi phản hồi/khiếu nại.
                   Phải có khu vực nhập nội dung rõ ràng cho:
                   Bình luận đánh giá;
                   Phản hồi/khiếu nại.
                   Hệ thống phải hiển thị thông báo rõ ràng:
                   Gửi thành công;
                   Gửi thất bại.
                   Sau khi gửi đánh giá, nội dung phải hiển thị ngay trên trang chi tiết
                   voucher.
                   NFR-06 – Khả năng kiểm toán
                   Hệ thống phải lưu:
                   Nội dung đánh giá;
```


## Trang 35

```text
                             Thời gian gửi;
                             Tài khoản gửi;
                             Voucher liên quan.
                             Hệ thống phải lưu:
                             Nội dung phản hồi/khiếu nại;
                             Thời gian gửi;
                             Tài khoản gửi;
                             Voucher liên quan.
                             Dữ liệu phải phản ánh đúng trạng thái cuối cùng của thao tác.




Tên UC

Use case ID

Mô tả

Actor                   Khách hàng

Độ ưu tiên

Trigger

Tiền điều kiện

Hậu điều kiện

Luồng cơ bản

Luồng thay thế

Luồng ngoại lệ

Yêu cầu phi chức năng
```
