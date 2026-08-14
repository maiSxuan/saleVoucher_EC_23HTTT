# Đặc tả hệ thống Admin

> Chuyển đổi từ PDF sang Markdown. Nội dung văn bản được giữ nguyên theo từng trang để hạn chế mất dữ liệu và sai lệch cấu trúc.


## Trang 1

```text
Tên UC           Tra cứu và kiểm tra đơn hàng

Use Case ID      UC-ADM-04

Actor            Quản trị viên

Độ ưu tiên       Cao

Trigger          Quản trị viên chọn chức năng Quản lý đơn hàng.

Mô tả
                 Hệ thống cho phép Quản trị viên tra cứu danh sách đơn hàng,
                 xem thông tin chi tiết và đối chiếu trạng thái đơn hàng, thanh
                 toán, voucher code, lịch sử phát hành/gửi mã, yêu cầu hủy và
                 khiếu nại liên quan.

                 Use case này chỉ thực hiện chức năng tra cứu và kiểm tra,
                 không trực tiếp thay đổi trạng thái nghiệp vụ của đơn hàng.

Tiền điều kiện      -​ Quản trị viên đã đăng nhập.
                    -​ Phiên đăng nhập còn hiệu lực.
                    -​ Tài khoản có quyền truy cập chức năng Quản lý đơn
                       hàng.
                    -​ Hệ thống có quyền truy xuất dữ liệu đơn hàng.

Hậu điều kiện
                    Trường hợp tra cứu thành công

                    1.​ Hệ thống hiển thị danh sách hoặc chi tiết đơn hàng.
                    2.​ Hệ thống hiển thị các dữ liệu liên quan nếu tồn tại.
                    3.​ Không có trạng thái nghiệp vụ nào bị thay đổi.

                    Trường hợp không tìm thấy dữ liệu

                    1.​ Không có dữ liệu bị thay đổi.
                    2.​ Hệ thống giữ nguyên điều kiện tra cứu để Admin chỉnh
                        sửa.

Luồng cơ bản        1.​ Quản trị viên chọn Quản lý đơn hàng.
                    2.​ Hệ thống kiểm tra phiên đăng nhập và quyền truy cập.
```


## Trang 2

```text
                    3.​ Hệ thống truy xuất danh sách đơn hàng.
                    4.​ Hệ thống hiển thị danh sách đơn hàng: Mã đơn hàng,
                        khách hàng, Voucher, Đối tác, Trạng thái đơn hàng,
                        Trạng thái thanh toán, Trạng thái voucher code.
                    5.​ Quản trị viên nhập hoặc chọn điều kiện tra cứu.
                    6.​ Hệ thống tìm các đơn hàng phù hợp.
                    7.​ Hệ thống hiển thị kết quả.
                    8.​ Quản trị viên chọn một đơn hàng.
                    9.​ Hệ thống truy xuất chi tiết đơn hàng.
                    10.​Hệ thống hiển thị: Mã đơn hàng, Khách hàng, Voucher,
                        Đối tác, Tổng tiền, Phương thức thanh toán, Trạng thái
                        đơn hàng, Trạng thái thanh toán, Trạng thái voucher
                        code.
                    11.​Hệ thống hiển thị riêng: Lịch sử thanh toán, Lịch sử
                        sinh voucher code, Lịch sử gửi voucher code, Yêu cầu
                        hủy nếu có, Hoàn tiền nếu có, Khiếu nại nếu có.
                    12.​Quản trị viên kiểm tra thông tin.
                    13.​Nếu không có vấn đề cần xử lý, Quản trị viên kết thúc
                        kiểm tra.
                    14.​Hệ thống giữ nguyên dữ liệu.
                    15.​Hệ thống ghi nhật ký kiểm tra đơn hàng.
                    16.​Use Case kết thúc.

Luồng thay thế
                 A8 — Không tìm thấy đơn hàng

                    1.​ Hệ thống không tìm thấy đơn phù hợp.
                    2.​ Hệ thống hiển thị:

                 “Không có dữ liệu đơn hàng phù hợp.”

                    3.​ Hệ thống giữ nguyên bộ lọc.
                    4.​ Quản trị viên thay đổi điều kiện.
                    5.​ Quay lại bước 6

Luồng ngoại lệ
                 E1 — Không có quyền truy cập

                    1.​ Hệ thống phát hiện tài khoản không có quyền.
                    2.​ Hệ thống không truy xuất dữ liệu đơn hàng.
                    3.​ Hệ thống hiển thị: “Bạn không có quyền truy cập
```


## Trang 3

```text
                         chức năng này.”

                   E2 — Không thể truy xuất dữ liệu

                      1.​ Hệ thống không thể tải danh sách hoặc chi tiết đơn
                          hàng.
                      2.​ Hệ thống không thay đổi dữ liệu.
                      3.​ Hệ thống hiển thị: “Không thể tải dữ liệu đơn hàng.
                          Vui lòng thử lại.”

Yêu cầu phi chức
năng               NFR-01 — Hiệu năng

                      1.​ Hệ thống phải phản hồi trong thời gian hợp lý khi:
                              ○​ Tải danh sách đơn hàng.
                              ○​ Tìm kiếm và lọc đơn hàng.
                              ○​ Mở thông tin chi tiết đơn hàng.
                              ○​ Tải lịch sử thanh toán.
                              ○​ Tải lịch sử phát hành và gửi voucher code.
                              ○​ Tải yêu cầu hủy, thông tin hoàn tiền và khiếu nại
                                 liên quan.
                      2.​ Việc tìm kiếm hoặc áp dụng bộ lọc không được làm
                          gián đoạn toàn bộ giao diện quản trị.
                      3.​ Trong thời gian truy xuất dữ liệu, hệ thống phải hiển thị
                          trạng thái đang tải.
                      4.​ Hệ thống không được tự động gửi lại yêu cầu tra cứu
                          nhiều lần khi người dùng thao tác liên tiếp.

                   NFR-02 — Bảo mật

                      1.​ Chỉ tài khoản có quyền Quản trị viên mới được truy cập
                          chức năng tra cứu đơn hàng.
                      2.​ Hệ thống phải kiểm tra quyền trước khi hiển thị:
                             ○​ Thông tin khách hàng.
                             ○​ Thông tin thanh toán.
                             ○​ Voucher code.
                             ○​ Khiếu nại.
                             ○​ Thông tin hoàn tiền.
                      3.​ Voucher code không được hiển thị cho tài khoản không
                          có quyền phù hợp.
```


## Trang 4

```text
   4.​ Việc ẩn dữ liệu trên giao diện không được thay thế cho
       kiểm tra quyền tại backend.

NFR-03 — Tính ổn định và toàn vẹn dữ liệu

   1.​ Use case tra cứu không được tự động thay đổi:
          ○​ Trạng thái đơn hàng.
          ○​ Trạng thái thanh toán.
          ○​ Trạng thái hoàn tiền.
          ○​ Trạng thái voucher code.
          ○​ Trạng thái khiếu nại.
   2.​ Nếu không thể tải một phần dữ liệu liên quan, hệ thống
       không được hiển thị dữ liệu sai như thể đã tải đầy đủ.
   3.​ Lỗi tra cứu không được làm thay đổi dữ liệu hiện có.
   4.​ Tải lại giao diện không được kích hoạt bất kỳ thao tác
       cập nhật nghiệp vụ nào.

NFR-05 — Khả năng sử dụng

   1.​ Giao diện phải phân biệt rõ:
          ○​ Trạng thái đơn hàng.
          ○​ Trạng thái thanh toán.
          ○​ Trạng thái hoàn tiền.
          ○​ Trạng thái voucher code.
          ○​ Trạng thái yêu cầu hủy.
          ○​ Trạng thái khiếu nại.
   2.​ Các khu vực lịch sử phải được tách riêng:
          ○​ Lịch sử thanh toán.
          ○​ Lịch sử phát hành/gửi voucher code.
          ○​ Lịch sử hoàn tiền.
          ○​ Lịch sử xử lý khiếu nại.
   3.​ Bộ lọc phải có nhãn rõ ràng và giữ nguyên dữ liệu khi
       không tìm thấy kết quả.
   4.​ Hệ thống phải hiển thị thông báo rõ ràng khi không có
       đơn hàng phù hợp.
   5.​ Giao diện phải hỗ trợ màn hình laptop và thiết bị di
       động.

NFR-06 — Khả năng kiểm toán

   1.​ Việc truy cập hoặc kiểm tra chi tiết đơn hàng có thể
```


## Trang 5

```text
                        được ghi nhận vào nhật ký quản trị theo yêu cầu hệ
                        thống.
                    2.​ Nhật ký tối thiểu gồm:
                           ○​ Quản trị viên thực hiện.
                           ○​ Thời gian.
                           ○​ Mã đơn hàng.
                           ○​ Loại thao tác.
                    3.​ Việc chỉ tra cứu không được ghi nhận như một thao tác
                        thay đổi trạng thái




Tên UC           Xử lý yêu cầu hủy đơn đã thanh toán

Use case ID      UC-ADM-05

Actor            Quản trị viên

Độ ưu tiên       Cao

Trigger          Quản trị viên mở một yêu cầu hủy đơn đang chờ xử lý.

Mô tả               -​ Hệ thống cho phép Quản trị viên kiểm tra yêu cầu hủy
                       của khách hàng đối với đơn hàng đã thanh toán thành
                       công và quyết định chấp nhận hoặc từ chối dựa trên
                       chính sách của voucher hoặc chính sách sàn.
                    -​ Đơn hàng chưa thanh toán thành công do khách hàng tự
                       hủy và không thuộc use case này.
                    -​ Nếu yêu cầu hủy được chấp nhận, hệ thống chuyển đơn
                       sang Chờ hoàn tiền, tạo bản ghi hoàn tiền Chờ xử lý và
                       chuyển sang UC-ADM-06.

Tiền điều kiện      1.​ Quản trị viên đã đăng nhập và có quyền.
                    2.​ Đơn hàng tồn tại.
                    3.​ Thanh toán của đơn đã Thành công.
                    4.​ Khách hàng đã gửi yêu cầu hủy.
                    5.​ Yêu cầu hủy đang ở trạng thái Chờ xử lý.
                    6.​ Đơn hàng chưa được hoàn tiền thành công trước đó.
                    7.​ Hệ thống có thông tin chính sách hủy/hoàn tiền của
                        voucher hoặc chính sách sàn.
```


## Trang 6

```text
Hậu điều kiện   1.​ Trường hợp chấp nhận
                       a.​ Yêu cầu hủy → Đã chấp nhận.
                       b.​ Đơn hàng → Chờ hoàn tiền.
                       c.​ Hoàn tiền → Chờ xử lý.
                       d.​ Bản ghi hoàn tiền liên kết đúng đơn hàng.
                       e.​ Hệ thống ghi lý do.
                       f.​ Hệ thống ghi nhật ký.
                       g.​ Đơn có thể được xử lý tại UC-ADM-06.
                2.​ Trường hợp từ chối
                       a.​ Yêu cầu hủy → Đã từ chối.
                       b.​ Đơn hàng giữ nguyên.
                       c.​ Thanh toán giữ nguyên.
                       d.​ Voucher code giữ nguyên.
                       e.​ Không đụng tới hoàn tiền.
                       f.​ Lý do từ chối được lưu.
                       g.​ Hệ thống ghi nhật ký.

Luồng cơ bản    1.​ Quản trị viên mở yêu cầu hủy.
                2.​ Hệ thống hiển thị: Nội dung yêu cầu, Lý do khách hàng
                    yêu cầu hủy, Đơn hàng, Thanh toán, Voucher code, Lịch
                    sử phát hành/gửi mã, Chính sách hủy/hoàn tiền.
                3.​ Quản trị viên kiểm tra: Đơn đã thanh toán thành công,
                    Voucher code chưa được sử dụng hoặc chưa tồn tại mã
                    hợp lệ, Đơn chưa hoàn tiền, Yêu cầu đáp ứng chính sách
                    hủy.
                4.​ Quản trị viên xác định yêu cầu đủ điều kiện.
                5.​ Quản trị viên chọn Chấp nhận yêu cầu hủy.
                6.​ Hệ thống hiển thị hộp thoại xác nhận.
                7.​ Hệ thống yêu cầu nhập Lý do chấp nhận hủy.
                8.​ Quản trị viên nhập lý do.
                9.​ Quản trị viên xác nhận.
                10.​Hệ thống cập nhật yêu cầu hủy → Đã chấp nhận.
                11.​Hệ thống cập nhật đơn hàng → Chờ hoàn tiền.
                12.​Hệ thống ngăn tiếp tục phát hành voucher code mới cho
                    đơn hàng.
                13.​Hệ thống tạo bản ghi hoàn tiền gồm: Đơn hàng,Thanh
                    toán gốc, Số tiền hoàn, Nguồn phát sinh = Yêu cầu hủy.
                14.​Lý do hoàn tiền, Trạng thái = Chờ xử lý.
                15.​Hệ thống ghi nhật ký.
                16.​Hệ thống hiển thị: “Yêu cầu hủy đã được chấp nhận.
                    Đơn hàng đang chờ hoàn tiền.”
```


## Trang 7

```text
                    17.​Use Case kết thúc
                    18.​Sau đó Admin có thể thực hiện UC-ADM-06 — Thực
                        hiện hoàn tiền qua cổng thanh toán Sandbox.

Luồng thay thế
                 A1 — Yêu cầu hủy không đủ điều kiện

                 Xảy ra khi:

                    ●​ Voucher code đã sử dụng.
                    ●​ Quá thời hạn được phép hủy.
                    ●​ Khách hàng chỉ đổi ý nhưng chính sách sàn không cho
                       phép.
                    ●​ Các điều kiện khác theo chính sách không được đáp
                       ứng.

                 Flow:

                    1.​ Quản trị viên xác định yêu cầu không đủ điều kiện.
                    2.​ Quản trị viên chọn Từ chối yêu cầu hủy.
                    3.​ Hệ thống yêu cầu nhập Lý do từ chối hủy.
                    4.​ Quản trị viên nhập lý do.
                    5.​ Quản trị viên xác nhận.
                    6.​ Hệ thống cập nhật yêu cầu → Đã từ chối.
                    7.​ Hệ thống giữ nguyên: Đơn hàng, Thanh toán, Voucher
                        code.
                    8.​ Hệ thống không tạo bản ghi hoàn tiền.
                    9.​ Hệ thống gửi thông báo kết quả cho khách hàng.
                    10.​Hệ thống ghi nhật ký.
                    11.​Hệ thống hiển thị: “Yêu cầu hủy đơn đã bị từ chối.”

Luồng ngoại lệ
                 E1 — Không thể cập nhật yêu cầu hủy

                 Không thay đổi đơn hàng và không tạo hoàn tiền.

                 E2 — Không thể cập nhật đơn hàng sang Chờ hoàn tiền

                 Không tạo bản ghi hoàn tiền và không thông báo chấp nhận
                 thành công.
```


## Trang 8

```text
                   E3 — Không thể tạo bản ghi hoàn tiền

                      1.​ Hệ thống không hoàn tất thao tác chấp nhận.
                      2.​ Không để dữ liệu ở trạng thái cập nhật một phần.
                      3.​ Hệ thống hiển thị: “Không thể tạo yêu cầu hoàn tiền.”

                   E4 — Không thể ghi nhật ký

                   Nếu nhật ký bắt buộc, toàn bộ thao tác không được xác nhận
                   thành công.

Yêu cầu phi chức
năng               NFR-01 — Hiệu năng

                      1.​ Hệ thống phải phản hồi trong thời gian hợp lý khi:
                             ○​ Mở yêu cầu hủy.
                             ○​ Tải thông tin đơn hàng và thanh toán.
                             ○​ Kiểm tra voucher code.
                             ○​ Tải chính sách hủy/hoàn tiền.
                             ○​ Chấp nhận hoặc từ chối yêu cầu hủy.
                      2.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng thái
                          đang thực hiện.
                      3.​ Sau khi Quản trị viên xác nhận, hệ thống phải vô hiệu
                          hóa nút thao tác cho đến khi yêu cầu hoàn tất để tránh
                          xử lý lặp.

                   NFR-02 — Bảo mật

                      1.​ Chỉ Quản trị viên có quyền phù hợp mới được xử lý yêu
                          cầu hủy.
                      2.​ Hệ thống phải kiểm tra lại quyền trước khi:
                             ○​ Chấp nhận yêu cầu hủy.
                             ○​ Từ chối yêu cầu hủy.
                      3.​ Quản trị viên không được thay đổi trực tiếp trạng thái
                          đơn hàng bằng dropdown hoặc thao tác ngoài luồng
                          nghiệp vụ.
                      4.​ Hệ thống không được cho phép khách hàng hoặc đối tác
                          thực hiện thao tác phê duyệt yêu cầu hủy.

                   NFR-03 — Tính ổn định và toàn vẹn dữ liệu
```


## Trang 9

```text
  1.​ Đơn chưa thanh toán thành công không thuộc use case
      này và do khách hàng tự hủy.
  2.​ Việc khách hàng gửi yêu cầu hủy không tự động làm
      thay đổi trạng thái đơn hàng.
  3.​ Chỉ sau khi Quản trị viên chấp nhận yêu cầu hủy:
         ○​ Yêu cầu hủy mới chuyển thành Đã chấp nhận.
         ○​ Đơn hàng mới chuyển thành Chờ hoàn tiền.
         ○​ Hệ thống mới tạo bản ghi trong bảng
             HOANTIEN với trạng thái Chờ xử lý.
  4.​ Nếu yêu cầu bị từ chối:
         ○​ Đơn hàng giữ nguyên.
         ○​ Thanh toán giữ nguyên.
         ○​ Voucher code giữ nguyên.
         ○​ Không tạo bản ghi hoàn tiền.
  5.​ Voucher code đã sử dụng không được phép chuyển đơn
      sang quy trình hoàn tiền.
  6.​ Khi đơn hàng đã chuyển sang Chờ hoàn tiền, voucher
      code của đơn không được phép sử dụng trong thời gian
      chờ refund.
  7.​ Nếu không thể đồng thời:
         ○​ Cập nhật yêu cầu hủy.
         ○​ Cập nhật đơn hàng.
         ○​ Tạo bản ghi hoàn tiền.​
              thì hệ thống không được để dữ liệu ở trạng thái
             cập nhật một phần.
  8.​ Hệ thống không được hiển thị thông báo thành công nếu
      dữ liệu chưa được lưu hoàn tất.

NFR-05 — Khả năng sử dụng

  1.​ Giao diện phải hiển thị rõ:
         ○​ Lý do khách yêu cầu hủy.
         ○​ Trạng thái đơn hàng.
         ○​ Trạng thái thanh toán.
         ○​ Trạng thái voucher code.
         ○​ Chính sách hủy/hoàn tiền.
  2.​ Phải có hai hành động rõ ràng:
         ○​ Chấp nhận yêu cầu hủy.
         ○​ Từ chối yêu cầu hủy.
```


## Trang 10

```text
                3.​ Cả hai thao tác phải có hộp thoại xác nhận.
                4.​ Khi chấp nhận, hệ thống phải yêu cầu Lý do chấp nhận
                    hủy.
                5.​ Khi từ chối, hệ thống phải yêu cầu Lý do từ chối hủy.
                6.​ Sau khi xử lý, giao diện phải hiển thị trạng thái mới của
                    yêu cầu.
                7.​ Không hiển thị chức năng xử lý hủy Admin đối với đơn
                    chưa thanh toán thành công.

              NFR-06 — Khả năng kiểm toán

                1.​ Các thao tác sau phải được ghi nhật ký:
                       ○​ Chấp nhận yêu cầu hủy.
                       ○​ Từ chối yêu cầu hủy.
                       ○​ Chuyển đơn hàng sang Chờ hoàn tiền.
                       ○​ Tạo bản ghi hoàn tiền.
                2.​ Nhật ký phải gồm:
                       ○​ Người thực hiện.
                       ○​ Thời gian.
                       ○​ Mã đơn hàng.
                       ○​ Mã yêu cầu hủy.
                       ○​ Quyết định xử lý.
                       ○​ Lý do.
                       ○​ Trạng thái yêu cầu trước/sau.
                       ○​ Trạng thái đơn hàng trước/sau.
                       ○​ Kết quả.
                3.​ Thao tác thất bại không được ghi nhận là thành công




Tên UC        Thực hiện hoàn tiền qua cổng thanh toán Sandbox

Use Case ID   UC-ADM-06

Actor         Quản trị viên

Độ ưu tiên    Cao

Trigger       Quản trị viên chọn Xử lý hoàn tiền trên bản ghi hoàn tiền đang
              chờ xử lý.
```


## Trang 11

```text
Mô tả               -​ Hệ thống cho phép Quản trị viên thực hiện hoàn tiền
                       đối với một yêu cầu đã được chấp nhận về mặt nghiệp
                       vụ.
                    -​ Hệ thống xác định cổng thanh toán ban đầu và gửi yêu
                       cầu refund đến:
                           -​ VNPay Sandbox nếu giao dịch gốc sử dụng
                              VNPay.
                           -​ PayPal Sandbox nếu giao dịch gốc sử dụng
                              PayPal.
                    -​ Use case này không thực hiện xét duyệt lại điều kiện
                       hoàn tiền.

Tiền điều kiện      1.​ Quản trị viên đã đăng nhập và có quyền.
                    2.​ Đơn hàng đang Chờ hoàn tiền.
                    3.​ Có bản ghi hoàn tiền liên kết với đơn.
                    4.​ Hoàn tiền đang Chờ xử lý.
                    5.​ Thanh toán gốc đã Thành công.
                    6.​ Có mã giao dịch thanh toán gốc.
                    7.​ Xác định được cổng thanh toán.
                    8.​ Cổng thuộc VNPay Sandbox hoặc PayPal Sandbox.
                    9.​ Chưa tồn tại giao dịch hoàn tiền thành công trước đó.
                    10.​Không có voucher code hoặc voucher code chưa được
                        sử dụng.

Hậu điều kiện
                 Hoàn tiền thành công

                    1.​ Trạng thái Hoàn tiền = Thành công.
                    2.​ Trạng thái Đơn hàng = Đã hoàn tiền.
                    3.​ Voucher code chưa sử dụng → Vô hiệu hóa.
                    4.​ Giao dịch hoàn tiền Sandbox được lưu.
                    5.​ Nếu nguồn hoàn tiền là khiếu nại: Khiếu nại → Đã giải
                        quyết.
                    6.​ Nhật ký được ghi nhận.

Luồng cơ bản
                    1.​ Quản trị viên mở bản ghi hoàn tiền.
                    2.​ Hệ thống hiển thị: Mã đơn, Khách hàng, Tổng tiền, Số
                       tiền hoàn, Cổng thanh toán, Mã giao dịch gốc, Thời
                       gian thanh toán, Lý do hoàn tiền, nguồn yêu cầu hoàn
                       tiền, Trạng thái voucher code.
```


## Trang 12

```text
3.​ Hệ thống kiểm tra kỹ thuật:
       a.​ Đơn vẫn Chờ hoàn tiền.
       b.​ Hoàn tiền chưa thành công (trạng thái chờ xử lí)
       c.​ Giao dịch gốc tồn tại.
       d.​ Cổng thanh toán hợp lệ.
4.​ Quản trị viên chọn Hoàn tiền.
5.​ Hệ thống hiển thị hộp thoại xác nhận:
       a.​ Cổng thanh toán.
       b.​ Mã giao dịch.
       c.​ Số tiền hoàn.
       d.​ Lý do.
6.​ Quản trị viên xác nhận.
7.​ Hệ thống cập nhật trạng thái hoàn tiền = Đang xử lý.
8.​ Hệ thống khóa thao tác gửi lại cùng yêu cầu.
9.​ Hệ thống xác định cổng thanh toán.
10.​Hệ thống gửi yêu cầu refund đến VNPay Sandbox hoặc
    PayPal Sandbox.
11.​Cổng Sandbox xử lý giao dịch.
12.​Cổng Sandbox trả kết quả thành công.
13.​Hệ thống lưu:
        ○​ Cổng thanh toán.
        ○​ Mã giao dịch thanh toán gốc.
        ○​ Mã giao dịch hoàn tiền.
        ○​ Số tiền.
        ○​ Thời gian.
        ○​ Mã phản hồi.
        ○​ Kết quả.
14.​Hệ thống cập nhật:
        ○​ trạng thái hoàn tiền = Thành công
        ○​ Trạng thái đơn hàng = Đã hoàn tiền
        ○​ Nếu voucher code tồn tại và chưa sử dụng: trạng
           thái vouhcer code = Vô hiệu hóa
        ○​ Nếu hoàn tiền xuất phát từ khiếu nại: trạng thái
           khiếu nại = Đã giải quyết
17.​Hệ thống ghi nhật ký: Admin thực hiện, Thời gian, Đơn
    hàng, Cổng thanh toán, Transaction gốc, Transaction
    refund, Số tiền, Lý do, Kết quả, Trạng thái trước/sau.
18.​Hệ thống hiển thị: “Hoàn tiền thành công qua
    VNPay/PayPal Sandbox.”
```


## Trang 13

```text
                 19.​Use Case kết thúc.

Luồng ngoại lệ   -​ E1 — Không kết nối được Sandbox trước khi gửi yêu
                    cầu
                       -​ Không xác nhận hoàn tiền thành công.
                       -​ Trạng thái đơn hàng giữ Chờ hoàn tiền.
                       -​ Trạng thái thanh toán giữ Thành công.
                       -​ Hoàn tiền được ghi nhận thất bại hoặc quay về
                          trạng thái cho phép thử lại.
                       -​ Hệ thống hiển thị: “Không thể kết nối đến cổng
                          thanh toán. Vui lòng thử lại.”
                 -​ E2 — Sandbox từ chối refund
                       -​ Cổng trả kết quả thất bại.
                       -​ Trạng thái hoàn tiền = Thất bại.
                       -​ Trạng thái đơn hàng = Chờ hoàn tiền.
                       -​ Khiếu nại liên quan tiếp tục Đang xử lý.
                       -​ Hệ thống lưu mã lỗi.
                       -​ Hệ thống ghi nhật ký.
                       -​ Hiển thị: “Hoàn tiền không thành công. Cổng
                          thanh toán đã từ chối yêu cầu.”
                 -​ E3 — Không xác định được kết quả refund
                       -​ Áp dụng khi yêu cầu có thể đã gửi nhưng hệ
                          thống không nhận được kết quả cuối cùng.
                       -​ Hệ thống không được coi giao dịch là thành
                          công hoặc thất bại.
                       -​ Trạng thái hoàn tiền = Cần kiểm tra.
                       -​ Đơn tiếp tục Chờ hoàn tiền.
                       -​ Hệ thống khóa thao tác refund lại.
                       -​ Hệ thống phải kiểm tra trạng thái giao dịch với
                          cổng trước khi cho phép thao tác tiếp.
                       -​ Hiển thị: “Chưa xác định được kết quả hoàn tiền.
                          Vui lòng kiểm tra trạng thái giao dịch.”
                 -​ E4 — Giao dịch đã được hoàn tiền trước đó
                       -​ Không gọi hoàn tiền lần nữa.
                       -​ Hệ thống hiển thị giao dịch refund đã tồn tại.
                       -​ Ghi nhật ký kiểm tra.
                 -​ E5 — Không tìm thấy giao dịch thanh toán gốc
                       -​ Không gọi Sandbox.
                       -​ Đơn giữ Chờ hoàn tiền.
                       -​ Hiển thị: “Không tìm thấy giao dịch thanh toán
```


## Trang 14

```text
                                 gốc.”
                        -​ E6 — Sandbox báo thành công nhưng hệ thống không
                           cập nhật được dữ liệu nội bộ
                              -​ Không gửi lại hoàn tiền lần nữa.
                              -​ Hệ thống giữ thông tin giao dịch refund Sandbox
                                 đã nhận được.
                              -​ Trạng thái hoàn tiền = Cần kiểm tra
                              -​ Hệ thống ghi lỗi đồng bộ.
                              -​ Hệ thống yêu cầu đối soát trạng thái trước khi
                                 cho phép thao tác tiếp.
                              -​ Không được tự động gọi refund lại.

Yêu cầu phi chức năng
                        NFR-01 — Hiệu năng

                        1.​ Hệ thống phải phản hồi hợp lý khi:
                                ○​ Tải thông tin hoàn tiền.
                                ○​ Truy xuất giao dịch thanh toán gốc.
                                ○​ Gửi yêu cầu refund đến VNPay Sandbox hoặc
                                   PayPal Sandbox.
                                ○​ Tiếp nhận và xử lý kết quả trả về.
                        2.​ Trong thời gian gọi cổng Sandbox, hệ thống phải hiển
                            thị: “Đang xử lý hoàn tiền…”
                        3.​ Hệ thống phải vô hiệu hóa nút hoàn tiền sau khi yêu cầu
                            đã được gửi để ngăn gửi lặp.
                        4.​ Hệ thống phải có cơ chế xử lý timeout mà không làm
                            treo toàn bộ giao diện quản trị.

                        NFR-02 — Bảo mật

                        1.​ Chỉ Quản trị viên có quyền xử lý hoàn tiền mới được
                            thực hiện refund.
                        2.​ Hệ thống phải kiểm tra lại quyền ngay trước khi gọi
                            cổng thanh toán.
                        3.​ Thông tin giao dịch Sandbox phải được bảo vệ.
                        4.​ Thông tin bí mật dùng để kết nối VNPay/PayPal không
                            được lưu hoặc hiển thị trên frontend.
                        5.​ Hệ thống không được cho phép người dùng thay đổi tùy
                            ý:
                               ○​ Mã giao dịch thanh toán gốc.
                               ○​ Cổng thanh toán.
```


## Trang 15

```text
       ○​ Số tiền hoàn đã được xác định từ giao dịch.
6.​ Giao dịch thanh toán qua VNPay phải hoàn qua VNPay
    Sandbox.
7.​ Giao dịch thanh toán qua PayPal phải hoàn qua PayPal
    Sandbox.

NFR-03 — Tính ổn định và toàn vẹn dữ liệu

1.​ Use case này chỉ xử lý các bản ghi HOANTIEN đã
    được tạo từ một quyết định nghiệp vụ hợp lệ.
2.​ Use case không thực hiện xét duyệt lại yêu cầu hoàn
    tiền.
3.​ Hệ thống phải ngăn refund nhiều lần cho cùng một giao
    dịch.
4.​ Trước khi gọi Sandbox phải kiểm tra:
        ○​ Đơn hàng đang Chờ hoàn tiền.
        ○​ Bản ghi hoàn tiền chưa Thành công.
        ○​ Giao dịch thanh toán gốc tồn tại.
5.​ Khi bắt đầu gửi refund: HOANTIEN.TrangThai = Đang
    xử lý.
6.​ Chỉ khi cổng Sandbox xác nhận refund thành công mới
    được cập nhật:
        ●​ HOANTIEN.TrangThai = Thành công
        ●​ THANHTOAN.TrangThai = Đã hoàn tiền mô
           phỏng
        ●​ DONHANG.TrangThai = Đã hoàn tiền
7.​ Nếu voucher code tồn tại và chưa sử dụng, sau refund
    thành công: VOUCHER_CODE.TrangThai = Vô hiệu
    hóa.
8.​ Nếu hoàn tiền xuất phát từ khiếu nại, chỉ sau refund
    thành công: KHIEUNAI.TrangThai = Đã giải quyết.
9.​ Nếu Sandbox trả kết quả thất bại:
        ○​ HOANTIEN.TrangThai = Thất bại.
        ○​ Đơn hàng vẫn Chờ hoàn tiền.
        ○​ Thanh toán không được cập nhật thành đã hoàn
           tiền.
10.​Timeout hoặc mất kết nối sau khi đã gửi yêu cầu không
    được tự động coi là thất bại.
11.​Khi kết quả không xác định:
        ●​ HOANTIEN.TrangThai = Cần kiểm tra.
```


## Trang 16

```text
       ●​ Không được gửi lại refund trước khi kiểm tra kết
           quả.
12.​Nếu Sandbox đã refund thành công nhưng hệ thống lỗi
    khi cập nhật DB, hệ thống không được gọi refund lần
    thứ hai.
13.​Không được để dữ liệu nội bộ mâu thuẫn với kết quả từ
    cổng Sandbox.

NFR-05 — Khả năng sử dụng

1.​ Giao diện hoàn tiền phải hiển thị rõ:
       ○​ Mã đơn hàng.
       ○​ Cổng thanh toán.
       ○​ Mã giao dịch gốc.
       ○​ Số tiền đã thanh toán.
       ○​ Số tiền hoàn.
       ○​ Lý do hoàn tiền.
       ○​ Trạng thái hoàn tiền.
2.​ Nút thao tác nên hiển thị theo đúng cổng:
       ○​ Hoàn tiền qua VNPay Sandbox.
       ○​ Hoàn tiền qua PayPal Sandbox.
3.​ Trước khi refund phải có hộp thoại xác nhận.
4.​ Giao diện phải cảnh báo voucher code sẽ không còn
    khả năng sử dụng sau khi hoàn tiền thành công.
5.​ Sau xử lý phải hiển thị rõ một trong các kết quả:
       ○​ Hoàn tiền thành công.
       ○​ Hoàn tiền thất bại.
       ○​ Cần kiểm tra kết quả.
6.​ Không hiển thị nút Từ chối hoàn tiền trong use case
    này.

NFR-06 — Khả năng kiểm toán

1.​ Mỗi lần gửi yêu cầu refund phải được ghi nhận.
2.​ Nhật ký phải gồm:
      ○​ Quản trị viên.
      ○​ Thời gian.
      ○​ Mã đơn hàng.
      ○​ Mã hoàn tiền.
      ○​ Cổng thanh toán.
```


## Trang 17

```text
                       ○​ Môi trường Sandbox.
                       ○​ Mã giao dịch thanh toán gốc.
                       ○​ Mã giao dịch refund nếu có.
                       ○​ Số tiền hoàn.
                       ○​ Lý do.
                       ○​ Mã phản hồi.
                       ○​ Kết quả.
                       ○​ Trạng thái trước/sau.
                3.​ Trường hợp timeout hoặc chưa xác định kết quả phải
                    được ghi đúng là Cần kiểm tra, không ghi Thất bại.
                4.​ Nếu cổng đã hoàn tiền thành công nhưng hệ thống nội
                    bộ chưa đồng bộ, nhật ký phải lưu đủ thông tin để đối
                    soát.
                5.​ Không được ghi giao dịch thất bại thành hoàn tiền
                    thành công.




Tên UC        Xử lý khiếu nại đơn hàng và voucher code

Use Case ID   UC-ADM-07

Actor         Quản trị viên

Độ ưu tiên    Cao

Trigger       Quản trị viên mở một khiếu nại của khách hàng đang chờ xử
              lý.

Mô tả
              Hệ thống cho phép Quản trị viên kiểm tra khiếu nại liên quan
              đến đơn hàng hoặc voucher code và lựa chọn phương án:

                 ●​ Gửi lại voucher code hiện tại.
                 ●​ Cấp lại voucher code mới.
                 ●​ Chấp nhận khiếu nại và chuyển sang hoàn tiền.
                 ●​ Từ chối khiếu nại.

              Việc mở khiếu nại không tự động thay đổi trạng thái đơn
              hàng, thanh toán hoặc voucher code.
```


## Trang 18

```text
Tiền điều kiện      1.​ Quản trị viên đã đăng nhập và có quyền.
                    2.​ Khiếu nại tồn tại.
                    3.​ Khiếu nại liên kết với đúng khách hàng và đơn hàng.
                    4.​ Đơn hàng tồn tại.
                    5.​ Hệ thống truy xuất được: Thanh toán, Voucher code,
                        Lịch sử phát hành, Lịch sử gửi mã, Thông tin voucher.

Hậu điều kiện
                 1. Trường hợp khiếu nại đang được kiểm tra nhưng chưa
                 có kết quả xử lý

                    1.​ Trạng thái khiếu nại được cập nhật từ Mới thành Đang
                        xử lý.
                    2.​ Trạng thái đơn hàng không thay đổi.
                    3.​ Trạng thái thanh toán không thay đổi.
                    4.​ Trạng thái voucher code không thay đổi.
                    5.​ Chưa tạo bản ghi trong bảng HOANTIEN.
                    6.​ Hệ thống lưu thông tin về việc Quản trị viên đã tiếp
                        nhận/xử lý khiếu nại.
                    7.​ Hệ thống ghi nhật ký hoạt động.

                 2. Trường hợp gửi lại voucher code hiện tại thành công

                    1.​ Voucher code hiện tại được giữ nguyên.
                    2.​ Hệ thống không sinh voucher code mới.
                    3.​ Hệ thống gửi lại voucher code hiện tại cho khách hàng.
                    4.​ Kết quả gửi được ghi nhận vào lịch sử gửi voucher
                        code.
                    5.​ Trạng thái khiếu nại được cập nhật thành Đã xử lý.
                    6.​ Trạng thái đơn hàng không thay đổi.
                    7.​ Trạng thái thanh toán không thay đổi.
                    8.​ Trạng thái voucher code không thay đổi.
                    9.​ Không tạo bản ghi trong bảng HOANTIEN.
                    10.​Hệ thống ghi nhật ký hoạt động.

                 3. Trường hợp cấp lại voucher code mới thành công

                    1.​ Nếu voucher code cũ tồn tại nhưng không còn hợp lệ,
                        mã cũ được cập nhật thành Vô hiệu hóa.
                    2.​ Hệ thống sinh voucher code mới.
                    3.​ Voucher code mới được liên kết với đúng:
                           ○​ Đơn hàng.
```


## Trang 19

```text
          ○​ Khách hàng.
          ○​ Voucher sản phẩm.
   4.​ Hệ thống gửi voucher code mới cho khách hàng.
   5.​ Lịch sử phát hành và gửi voucher code được cập nhật.
   6.​ Trạng thái khiếu nại được cập nhật thành Đã xử lý.
   7.​ Trạng thái đơn hàng không thay đổi.
   8.​ Trạng thái thanh toán không thay đổi.
   9.​ Không tạo bản ghi trong bảng HOANTIEN.
   10.​Hệ thống ghi nhật ký hoạt động, bao gồm mã cũ và mã
       mới.

4. Trường hợp khiếu nại được chấp nhận và chuyển sang
hoàn tiền

   1.​ Khiếu nại được xác định là hợp lệ và đủ điều kiện hoàn
       tiền.
   2.​ Trạng thái khiếu nại tiếp tục được giữ ở Đang xử lý.
   3.​ Trạng thái đơn hàng được cập nhật thành Chờ hoàn
       tiền.
   4.​ Hệ thống tạo một bản ghi mới trong bảng HOANTIEN.
   5.​ Bản ghi HOANTIEN được liên kết với giao dịch thanh
       toán của đơn hàng.
   6.​ Trạng thái bản ghi hoàn tiền được thiết lập thành:

Chờ xử lý.

   7.​ Bản ghi hoàn tiền lưu tối thiểu:
           ○​ Số tiền hoàn.
           ○​ Lý do hoàn tiền.
           ○​ Phương thức/cổng thanh toán.
           ○​ Thông tin giao dịch thanh toán gốc.
           ○​ Nguồn phát sinh hoàn tiền = Khiếu nại.
   8.​ Khiếu nại được liên kết với quá trình hoàn tiền tương
       ứng.
   9.​ Trạng thái thanh toán chưa thay đổi tại thời điểm này.
   10.​Voucher code chưa chuyển thành Vô hiệu hóa chỉ vì
       Admin chấp nhận khiếu nại, nhưng hệ thống không
       cho phép voucher code của đơn đang Chờ hoàn tiền
       tiếp tục được sử dụng.
   11.​Khiếu nại chưa được cập nhật thành Đã xử lý.
   12.​Hệ thống ghi nhật ký hoạt động.
```


## Trang 20

```text
   13.​Đơn hàng có thể tiếp tục được xử lý tại UC-ADM-04.3
       — Thực hiện hoàn tiền qua cổng thanh toán
       Sandbox.

     Khi VNPay Sandbox hoặc PayPal Sandbox xác
     nhận hoàn tiền thành công ở UC-ADM-04.3 thì
     mới cập nhật:

        ●​ HOANTIEN.TrangThai = Thành công
        ●​ DONHANG.TrangThai = Đã hoàn tiền
        ●​ VOUCHER_CODE.TrangThai = Vô hiệu
           hóa nếu có mã chưa sử dụng
        ●​ KHIEUNAI.TrangThai = Đã xử lý

5. Trường hợp khiếu nại bị từ chối

   1.​ Trạng thái khiếu nại được cập nhật thành Từ chối.
   2.​ Hệ thống lưu lý do từ chối khiếu nại.
   3.​ Trạng thái đơn hàng không thay đổi.
   4.​ Trạng thái thanh toán không thay đổi.
   5.​ Trạng thái voucher code không thay đổi.
   6.​ Không tạo bản ghi trong bảng HOANTIEN.
   7.​ Hệ thống gửi thông báo kết quả xử lý cho khách hàng.
   8.​ Hệ thống ghi nhật ký hoạt động gồm:
          ○​ Quản trị viên thực hiện.
          ○​ Thời gian.
          ○​ Mã khiếu nại.
          ○​ Mã đơn hàng.
          ○​ Lý do từ chối.
          ○​ Trạng thái trước.
          ○​ Trạng thái sau.
          ○​ Kết quả xử lý.

6. Trường hợp xử lý khiếu nại không thành công do lỗi hệ
thống

   1.​ Hệ thống không được ghi nhận khiếu nại là Đã xử lý
       hoặc Từ chối nếu thao tác tương ứng chưa hoàn tất.
   2.​ Không được để dữ liệu ở trạng thái cập nhật một phần.
   3.​ Trạng thái đơn hàng, thanh toán và voucher code phải
       giữ ở trạng thái nhất quán trước lỗi.
```


## Trang 21

```text
                 4.​ Nếu thao tác chuyển sang hoàn tiền thất bại trước khi
                     tạo hoàn chỉnh bản ghi HOANTIEN, hệ thống không
                     được xem khiếu nại là đã chuyển sang hoàn tiền.
                 5.​ Hệ thống ghi nhận lỗi để phục vụ kiểm tra và truy vết.

Luồng cơ bản     1.​ Quản trị viên mở khiếu nại.
                 2.​ Hệ thống hiển thị: Mã khiếu nại, Khách hàng, Đơn
                     hàng ,Loại khiếu nại, Nội dung, Thời gian gửi, Trạng
                     thái khiếu nại, Thanh toán, Voucher code, Lịch sử
                     sinh/gửi mã.
                 3.​ Hệ thống cập nhật khiếu nại từ Mới → Đang xử lý.
                 4.​ Quản trị viên kiểm tra nguyên nhân.
                 5.​ Quản trị viên lựa chọn phương án xử lý thích hợp.

Luồng thay thế   -​ A1 — Khách chưa nhận mã nhưng code hiện tại
                    hợp lệ
                       -​ Điều kiện:
                             -​ Thanh toán thành công.
                             -​ Code tồn tại.
                             -​ Code hợp lệ.
                             -​ Code chưa sử dụng.
                             -​ Lần gửi trước thất bại hoặc khách chưa
                                nhận được.
                       -​ Flow:
                             -​ Quản trị viên chọn Gửi lại mã.
                             -​ Hệ thống hiển thị xác nhận.
                             -​ Quản trị viên xác nhận.
                             -​ Hệ thống gửi lại chính code hiện tại.
                             -​ Không sinh code mới.
                             -​ Hệ thống cập nhật lịch sử gửi.
                             -​ Nếu gửi thành công: Khiếu nại → Đã xử
                                lý.
                             -​ Đơn hàng và thanh toán giữ nguyên.
                             -​ Hệ thống ghi nhật ký.
                             -​ Hiển thị: “Đã gửi lại voucher code cho
                                khách hàng.”
                 -​ A2 — Không có code hợp lệ hoặc lỗi sinh mã
                       -​ Điều kiện:
                             -​ Thanh toán thành công.
                             -​ Không có code hợp lệ hoặc code Lỗi sinh
```


## Trang 22

```text
                mã.
      -​ Flow:
            -​ Quản trị viên chọn Cấp lại mã mới.
            -​ Hệ thống hiển thị xác nhận.
            -​ Quản trị viên xác nhận.
            -​ Nếu mã cũ tồn tại nhưng không còn hợp
                lệ, hệ thống vô hiệu hóa mã cũ.
            -​ Hệ thống sinh code mới.
            -​ Hệ thống liên kết code mới với: Đơn
                hàng, Khách hàng, Voucher, Hệ thống gửi
                mã mới, Hệ thống cập nhật lịch sử
            -​ Nếu thành công:
                    -​ Khiếu nại → Đã xử lí.
                    -​ Đơn hàng và thanh toán giữ
                        nguyên.
            -​ Hệ thống ghi nhật ký.
            -​ Hiển thị: “Cấp lại voucher code thành
                công.”
-​ A3 — Khiếu nại hợp lệ và đủ điều kiện hoàn tiền
      -​ Xảy ra khi:
            -​ Thanh toán thành công.
            -​ Khiếu nại được xác minh hợp lệ.
            -​ Voucher code chưa sử dụng.
            -​ Không thể giải quyết hợp lý bằng gửi lại
                mã.
            -​ Không thể giải quyết hợp lý bằng cấp lại
                mã.
            -​ Nguyên nhân thuộc trường hợp được
                hoàn tiền theo chính sách.
      -​ Ví dụ:
            -​ Đối tác không còn cung cấp dịch vụ.
            -​ Đối tác từ chối voucher hợp lệ và không
                thể khắc phục.
            -​ Voucher không thể sử dụng đúng quyền
                lợi đã công bố.
            -​ Hệ thống không thể cung cấp voucher
                hợp lệ sau khi đã thử xử lý.
      -​ Flow:
            -​ Quản trị viên xác định khiếu nại đủ điều
                kiện hoàn tiền.
```


## Trang 23

```text
            -​ Quản trị viên chọn Chấp nhận khiếu nại
               và hoàn tiền.
            -​ Hệ thống hiển thị hộp thoại xác nhận.
            -​ Hệ thống yêu cầu nhập lý do.
            -​ Quản trị viên nhập lý do.
            -​ Quản trị viên xác nhận.
            -​ Hệ thống giữ: trạng thái khiếu nại = Đang
               xử lý.
            -​ Hệ thống cập nhật: trạng thái đơn hàng =
               Chờ hoàn tiền.
            -​ Hệ thống tạo bản ghi hoàn tiền: Đơn
               hàng, Thanh toán gốc, Khiếu nại liên
               quan, Nguồn = Khiếu nại, Số tiền, Lý do,
               trạng thái hoàn tiền = Chờ xử lý.
            -​ Hệ thống ghi nhật ký.
            -​ Hệ thống hiển thị: “Khiếu nại đã được
               chấp nhận và chuyển sang xử lý hoàn
               tiền.”
            -​ Use Case kết thúc, sau đó thực hiện
               UC-ADM-06. Khiếu nại chưa được
               chuyển thành Đã giải quyết ở bước này,
               chỉ khi hoàn tiền Sandbox thành công:
                   -​ Trạng thái hoàn tiền = Thành công
                   -​ Trạng thái đơn hàng = Đã hoàn
                      tiền
                   -​ Trạng thái khiếu nại = Đã xử lí
                   -​ Trạng thái voucherCode= Vô hiệu
                      hóa (nếu có)
-​ A4 — Khiếu nại không hợp lệ
      -​ Xảy ra khi:
            -​ Voucher đã sử dụng.
            -​ Voucher hết hạn đúng chính sách.
            -​ Khách sử dụng sai chi nhánh.
            -​ Không đáp ứng điều kiện voucher.
            -​ Không phát hiện lỗi hệ thống hoặc đối
               tác.
            -​ Khiếu nại không thuộc chính sách hỗ trợ.
      -​ Flow:
            -​ Quản trị viên chọn Từ chối khiếu nại.
            -​ Hệ thống yêu cầu nhập lý do.
```


## Trang 24

```text
                                 -​ Quản trị viên nhập lý do.
                                 -​ Quản trị viên xác nhận.
                                 -​ Hệ thống cập nhật: trạng thái khiếu nại =
                                    Từ chối.
                                 -​ Hệ thống giữ nguyên: Đơn hàng, Thanh
                                    toán, Voucher code, Không tạo bản ghi
                                    hoàn tiền.
                                 -​ Hệ thống gửi thông báo cho khách hàng.
                                 -​ Hệ thống ghi nhật ký.
                                 -​ Hiển thị: “Khiếu nại đã bị từ chối.”

Luồng ngoại lệ
                 E1 — Không thể gửi lại code

                    ●​ Giữ code hiện tại.
                    ●​ Không tạo code mới.
                    ●​ Khiếu nại tiếp tục Đang xử lý.

                 E2 — Không thể sinh code mới

                    ●​ Không cập nhật khiếu nại thành Đã xử lí.
                    ●​ Không thay đổi đơn hàng/thanh toán.

                 E3 — Sinh code thành công nhưng gửi thất bại

                    ●​ Giữ code mới.
                    ●​ Không sinh thêm code khác.
                    ●​ Ghi lịch sử gửi thất bại.
                    ●​ Khiếu nại tiếp tục Đang xử lý.

                 E4 — Không thể cập nhật khiếu nại

                    ●​ Không thông báo xử lý thành công.
                    ●​ Không ghi trạng thái mới nếu dữ liệu chưa được lưu.

                 E5 — Không thể tạo bản ghi hoàn tiền

                 Áp dụng A3:

                    1.​ Không cập nhật đơn sang Chờ hoàn tiền nếu toàn bộ
                        thao tác không thể hoàn tất nhất quán.
                    2.​ Khiếu nại tiếp tục Đang xử lý.
```


## Trang 25

```text
                           3.​ Hiển thị: “Không thể chuyển khiếu nại sang xử lý
                               hoàn tiền.”

Yêu cầu phi chức năng
                        NFR-01 — Hiệu năng

                           1.​ Hệ thống phải phản hồi hợp lý khi:
                                  ○​ Tải nội dung khiếu nại.
                                  ○​ Tải thông tin đơn hàng.
                                  ○​ Tải thanh toán.
                                  ○​ Tải voucher code.
                                  ○​ Tải lịch sử sinh/gửi mã.
                                  ○​ Gửi lại voucher code.
                                  ○​ Cấp lại voucher code.
                                  ○​ Chuyển khiếu nại sang hoàn tiền.
                           2.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng thái
                               đang thực hiện.
                           3.​ Hệ thống phải ngăn Quản trị viên thực hiện lặp cùng
                               một thao tác khi yêu cầu trước chưa hoàn tất.

                        NFR-02 — Bảo mật

                           1.​ Chỉ Quản trị viên có quyền mới được xem và xử lý
                               khiếu nại.
                           2.​ Hệ thống phải kiểm tra lại quyền trước khi:
                                   ○​ Gửi lại voucher code.
                                   ○​ Cấp lại voucher code.
                                   ○​ Chấp nhận khiếu nại để hoàn tiền.
                                   ○​ Từ chối khiếu nại.
                           3.​ Voucher code chỉ được hiển thị cho tài khoản quản trị
                               có quyền phù hợp.
                           4.​ Khiếu nại chỉ được xử lý nếu liên kết đúng với khách
                               hàng và đơn hàng tương ứng.
                           5.​ Hệ thống không được cho phép thay đổi trực tiếp trạng
                               thái khiếu nại ngoài các hành động nghiệp vụ được
                               định nghĩa.

                        NFR-03 — Tính ổn định và toàn vẹn dữ liệu

                           1.​ Việc tiếp nhận khiếu nại không tự động thay đổi:
```


## Trang 26

```text
          ○​ Đơn hàng.
          ○​ Thanh toán.
          ○​ Voucher code.
   2.​ Khi bắt đầu xử lý, khiếu nại có thể được cập nhật:

Mới tiếp nhận → Đang xử lý.

   3.​ Nếu khách chỉ chưa nhận được mã nhưng mã hiện tại
       hợp lệ:
           ○​ Phải gửi lại mã hiện tại.
           ○​ Không được sinh code mới.
   4.​ Nếu không có mã hợp lệ hoặc mã Lỗi sinh mã:
           ○​ Có thể cấp code mới.
           ○​ Nếu mã cũ tồn tại và không còn hợp lệ, mã cũ
              phải được vô hiệu hóa.
   5.​ Không được tồn tại đồng thời hai voucher code hợp lệ
       có khả năng sử dụng cho cùng một quyền lợi nếu
       nghiệp vụ chỉ cho phép một mã.
   6.​ Sinh code mới thành công nhưng gửi thất bại không
       được tự động sinh thêm code khác.
   7.​ Khiếu nại chỉ được cập nhật Đã giải quyết khi phương
       án xử lý hoàn tất thành công.
   8.​ Khi khiếu nại được chấp nhận để hoàn tiền:
           ○​ Khiếu nại tiếp tục Đang xử lý.
           ○​ Đơn hàng → Chờ hoàn tiền.
           ○​ Hệ thống tạo một bản ghi trong HOANTIEN →
              Chờ xử lý.
   9.​ Khiếu nại chuyển sang hoàn tiền chỉ được Đã giải
       quyết sau khi UC-ADM-06 refund thành công.
   10.​Nếu khiếu nại bị từ chối:
           ○​ Đơn hàng giữ nguyên.
           ○​ Thanh toán giữ nguyên.
           ○​ Voucher code giữ nguyên.
           ○​ Không tạo bản ghi hoàn tiền.
   11.​Không để thao tác cập nhật một phần nếu xử lý thất
       bại.

NFR-05 — Khả năng sử dụng

   1.​ Giao diện phải hiển thị:
```


## Trang 27

```text
         ○​ Mã khiếu nại.
         ○​ Loại khiếu nại.
         ○​ Nội dung.
         ○​ Khách hàng.
         ○​ Đơn hàng.
         ○​ Trạng thái khiếu nại.
         ○​ Thanh toán.
         ○​ Voucher code.
         ○​ Lịch sử sinh/gửi mã.
  2.​ Các hành động phải phân biệt rõ:
         ○​ Gửi lại mã.
         ○​ Cấp lại mã mới.
         ○​ Chấp nhận khiếu nại và hoàn tiền.
         ○​ Từ chối khiếu nại.
  3.​ Các thao tác thay đổi dữ liệu phải có xác nhận.
  4.​ Khi từ chối khiếu nại phải bắt buộc nhập Lý do từ chối.
  5.​ Khi chuyển sang hoàn tiền phải bắt buộc nhập Lý do
      hoàn tiền.
  6.​ Hệ thống phải hiển thị rõ kết quả:
         ○​ Gửi lại mã thành công.
         ○​ Cấp lại mã thành công.
         ○​ Khiếu nại chuyển sang hoàn tiền.
         ○​ Khiếu nại bị từ chối.
         ○​ Thao tác thất bại.
  7.​ Giao diện phải phân biệt Đang xử lý và Đã xử lí.

NFR-06 — Khả năng kiểm toán

  1.​ Các thao tác sau phải được lưu nhật ký:
         ○​ Bắt đầu xử lý khiếu nại.
         ○​ Gửi lại voucher code.
         ○​ Cấp lại voucher code.
         ○​ Vô hiệu hóa code cũ.
         ○​ Chuyển khiếu nại sang hoàn tiền.
         ○​ Từ chối khiếu nại.
  2.​ Nhật ký phải gồm:
         ○​ Quản trị viên.
         ○​ Thời gian.
         ○​ Mã khiếu nại.
```


## Trang 28

```text
                                     ○​ Mã đơn hàng.
                                     ○​ Loại thao tác.
                                     ○​ Lý do.
                                     ○​ Trạng thái khiếu nại trước/sau.
                                     ○​ Trạng thái voucher code trước/sau nếu có.
                                     ○​ Mã cũ/mã mới khi cấp lại code.
                                     ○​ Kết quả.
                             3.​ Khi chuyển sang hoàn tiền, nhật ký phải thể hiện liên
                                 kết giữa:
                                     ○​ Khiếu nại.
                                     ○​ Đơn hàng.
                                     ○​ Bản ghi HOANTIEN.
                             4.​ Thao tác gửi/cấp lại mã thất bại không được ghi là
                                 khiếu nại đã xử lí




Adm phân quyền người dùng Quản lý voucher khi owner (người đại diện) liên hệ Adm (cập
nhật, xóa tài khoản người dùng)
 Tên UC                   Quản lý người dùng

 Use case ID              UC-ADM-01

 Mô tả                    Hệ thống cho phép quản trị viên xem danh sách tài khoản, tìm
                          kiếm, xem chi tiết hồ sơ, cập nhật vai trò, khóa tài khoản và mở
                          khóa tài khoản. Các thao tác thay đổi vai trò hoặc trạng thái tài
                          khoản phải được xác nhận và lưu vào nhật ký hệ thống

 Actor                    Quản trị viên

 Độ ưu tiên               Cao

 Trigger                  Quản trị viên chọn chức năng Quản lý người dùng trên giao diện
                          quản trị

 Tiền điều kiện              1.​ Quản trị viên đã đăng nhập vào hệ thống
                             2.​ Tài khoản đăng nhập có vai trò Quản trị viên
                             3.​ Phiên đăng nhập của Quản trị viên còn hiệu lực
                             4.​ Hệ thống có quyền truy cập dữ liệu tài khoản

 Hậu điều kiện               1.​ Trường hợp chỉ tra cứu thông tin
                                    a.​ Hệ thống đã hiển thị danh sách hoặc thông tin chi
                                        tiết tài khoản theo yêu cầu
```


## Trang 29

```text
                      b.​ Không có dữ liệu tài khoản nào bị thay đổi
               2.​ Trường hợp cập nhật vai trò
                      a.​ Vai trò mới của tài khoản được lưu trên hệ thống
                      b.​ Hệ thống ghi nhận vào nhật ký: Quản trị viên thực
                          hiện, thời gian thực hiện, vai trò trước khi thay đổi,
                          vai trò sau khi thay đổi
               3.​ Trường hợp khóa tài khoản:
                      a.​ Trạng thái tài khoản được cập nhật thành “Bị khóa”
                      b.​ Hệ thống ghi nhận vào nhật ký: Quản trị viên thực
                          hiện, thời gian thực hiện, nội dung thao tác, lý do
                          khóa tài khoản
               4.​ Trường hợp mở khóa tài khoản:
                      a.​ Trạng thái tài khoản được cập nhật thành “Đang
                          hoạt động”
                      b.​ Hệ thống ghi nhận vào nhật ký: Quản trị viên thực
                          hiện, thời gian thực hiện, nội dung thao tác, lý do
                          mở khóa tài khoản

Luồng cơ bản   1.​ Quản trị viên chọn chức năng “Quản lý người dùng” trên
                   giao diện quản trị
               2.​ Hệ thống kiểm tra phiên đăng nhập và quyền truy cập của
                   tài khoản hiện tại
               3.​ Hệ thống truy xuất danh sách tài khoản người dùng
               4.​ Hệ thống hiển thị màn hình danh sách người dùng, gồm các
                   thông tin: họ tên, email, số điện thoại, vai trò tài khoản,
                   trạng thái tài khoản
               5.​ Hệ thống cho phép tìm kiếm theo các tiêu chí: họ tên, số
                   điện thoại, vai trò tài khoản, trạng thái tài khoản
               6.​ Quản trị viên nhập thông tin tìm kiếm
               7.​ Hệ thống tiếp nhận điều kiện tìm kiếm do Quản trị viên
                   cung cấp
               8.​ Hệ thống tra cứu các tài khoản phù hợp với điều kiện đã
                   nhập
               9.​ Hệ thống hiển thị danh sách tài khoản phù hợp
               10.​Quản trị viên chọn 1 tài khoản trong danh sách để xem
                   thông tin chi tiết
               11.​Hệ thống truy xuất thông tin chi tiết của tài khoản được
                   chọn
               12.​Hệ thống hiển thị hồ sơ tài khoản theo từng vai trò:
                        a.​ Đối với khách hàng: hiển thị các thông tin cá nhân,
                            và lịch sử đã mua voucher
                        b.​ Đối với nhân viên quản lý voucher: hiển thị các
                            thông tin cá nhân, thông tin công ty mà họ đang làm,
                            và lịch sử quản trị
                        c.​ Đối với nhân viên bán hàng: hiển thị các thông tin cá
                            nhân, thông tin chi nhánh mà họ đang làm, và lịch sử
```


## Trang 30

```text
                             quản trị
                         d.​ Đối với người đại diện: hiển thị các thông tin cá
                             nhân, thông tin công ty mà họ đang làm, và lịch sử
                             quản trị
                 13.​Quản trị viên kiểm tra thông tin tài khoản được hệ thống
                     hiển thị
                 14.​Quản trị viên không thực hiện thêm thao tác nếu tài khoản
                     không có vấn đề cần xử lý
                 15.​Hệ thống giữ nguyên thông tin, vai trò và trạng thái hiện tại
                     của tài khoản
                 16.​Hệ thống kết thúc use case

Luồng thay thế   -​ A8: Hệ thống không tìm thấy tài khoản phù hợp với điều
                    kiện tìm kiếm: Hệ thống hiển thị thông báo “Không có tài
                    khoản phù hợp” và quay lại bước 6
                 -​ A13a: Quản trị viên phát hiện vai trò hiện tại chưa phù hợp
                    và cập nhật vai trò tài khoản (lưu ý: chỉ cập nhật vai trò khi
                    nhân viên quản lí voucher sang nhân viên bán hàng có kèm
                    hiển thị mã chi nhánh ở dạng combobox để chọn, ngược lại
                    khi chuyển từ nhân viên bán hàng thành nhân viên quản lý
                    cần kèm hiển thị mã đối tác ở dạng combobox để chọn)
                        -​ Quản trị viên chọn chức năng “Cập nhật vai trò” tại
                            hồ sơ tài khoản
                        -​ Hệ thống hiển thị vai trò hiện tại của tài khoản và
                            trường cho phép chọn vai trò mới
                        -​ Quản trị viên chọn vai trò mới cho tài khoản và bắt
                            buộc nhập lý do
                        -​ Quản trị viên chọn thao tác xác nhận cập nhật vai trò
                        -​ Quản trị viên xác nhận thao tác: “Xác nhận cập
                            nhật”:
                                -​ Hệ thống kiểm tra vai trò mới đã được chọn
                                    và cập nhật vai trò mới cho tài khoản
                                -​ Hệ thống ghi nhật ký gồm quản trị viên, thực
                                    hiện, thời gian thực hiện, vai trò trước khi
                                    thay đổi và vai trò sau khi thay đổi
                                -​ Hệ thống hiển thị thông báo: “Cập nhật vai
                                    trò thành công” và hiển thị lại hồ sơ tài
                                    khoản với vai trò mới
                        -​ Quản trị viên chọn “Hủy”
                                -​ Hệ thống đóng hộp thoại xác nhận
                                -​ Hệ thống không thay đổi vai trò tài khoản và
                                    không tạo nhật ký thay đổi vai trò
                                -​ Hệ thống hiển thị lại hồ sơ tài khoản
                 -​ A13b: Quản trị viên xác định tài khoản có dấu hiệu vi
                    phạm:
                        -​ Quản trị viên chọn chức năng “Khóa tài khoản”
```


## Trang 31

```text
      -​ A13b1: Hệ thống hiển thị ô nhập để quản trị viên
          nhập lý do khóa tài khoản
              -​ Quản trị viên xác nhận thao tác khóa tài
                  khoản
              -​ Hệ thống ghi nhận lý do đã được nhập
              -​ Hệ thống cập nhật trạng thái tài khoản thành
                  “Tạm khóa”
              -​ Hệ thống ghi nhật ký gồm: quản trị viên thực
                  hiện, thời gian thực hiện, nội dung thao tác
                  và lý do khóa
              -​ Hệ thống hiển thị thông báo: “Khóa tài
                  khoản thành công” và hiển thị lại hồ sơ tài
                  khoản với trạng thái bị khóa
      -​ A13b2: Quản trị viên quên nhập lý do khóa tài
          khoản:
              -​ Hệ thống phát hiện quản trị viên chưa nhập
                  lý do khóa
              -​ Hệ thống hiển thị yêu cầu nhập lý do khóa
                  khóa tài khoản
              -​ Hệ thống quay lại bước A13b1​
      -​ A13b3: Quản trị viên hủy thao tác:
              -​ Quản trị viên chọn “Hủy”
              -​ Hệ thống đóng hộp thoại xác nhận
              -​ Hệ thống giữ nguyên trạng thái hiện tại của
                  tài khoản, không ghi nhật ký khóa sau đó
                  hiển thị lại hồ sơ tài khoản
-​ A13c: Tài khoản đang có trạng thái bị khóa và Quản trị viên
   xác nhận tài khoản không còn rủi ro, mở tài khoản
      -​ Quản trị viên chọn chức năng “Mở khóa tài khoản”
      -​ A13c1: Hệ thống hiển thị ô nhập để quản trị viên
          nhập lý do mở tài khoản
              -​ Quản trị viên nhập lí do và xác nhận thao tác
                  mở khóa
              -​ Hệ thống ghi nhận lý do mở khóa đã được
                  nhập
              -​ Hệ thống cập nhật trạng thái tài khoản thành
                  “Đang hoạt động”
              -​ Hệ thống ghi nhật ký gồm: quản trị viên thực
                  hiện, thời gian thực hiện, nội dung thao tác
                  và lý do mở khóa, loại thao tác
              -​ Hệ thống hiển thị thông báo “mở tài khoản
                  thành công” và hiển thị lại hồ sơ tài khoản
                  với trạng thái Đang hoạt động​
      -​ A13c2: Quản trị viên quên nhập lý do mở tài khoản:
              -​ Hệ thống phát hiện quản trị viên chưa nhập
                  lý do mở khóa
```


## Trang 32

```text
                                     -​ Hệ thống hiển thị yêu cầu nhập lý do mở
                                        khóa
                                     -​ Hệ thống quay lại bước A13c1
                               -​ A13c3: Quản trị viên hủy thao tác:
                                     -​ Quản trị viên chọn “Hủy”
                                     -​ Hệ thống đóng hộp thoại xác nhận
                                     -​ Hệ thống giữ nguyên trạng thái “bị khóa”
                                        của tài khoản, không ghi nhật ký khóa sau đó
                                        hiển thị lại hồ sơ tài khoản

Luồng ngoại lệ          1.​ Quản trị viên không có quyền truy cập:
                               a.​ Hệ thống phát hiện tài khoản hiện tại không có vai
                                   trò quản trị viên hoặc không có quyền truy cập chức
                                   năng
                               b.​ Hệ thống từ chối hiển thị dữ liệu quản lý người dùng
                               c.​ Hệ thống hiển thị thông báo ngay tại trang đăng
                                   nhập: “Bạn không có quyền truy cập chức năng này”
                        2.​ Cập nhật vai trò hoặc trạng thái tài khoản thất bại:
                               a.​ Hệ thống không thể hoàn tất việc cập nhật vai trò,
                                   khóa tài khoản hoặc mở khóa
                               b.​ Hệ thống không hiển thị thông báo thành công
                               c.​ Hệ thống giữ nguyên vai trò hoặc trạng thái trước
                                   khi thực hiện thao tác
                               d.​ Hệ thống hiển thị thông báo “không thể cập nhật tài
                                   khoản. Vui lòng thử lại”
                        3.​ Không thể ghi nhật ký thao tác quản trị
                               a.​ Hệ thống không thể ghi nhận đầy đủ thao tác quản
                                   trị vào nhật ký hệ thống.
                               b.​ Hệ thống không xác nhận thao tác đã hoàn tất thành
                                   công
                               c.​ Hệ thống không lưu thay đổi vai trò hoặc trạng thái
                                   nếu nhật ký bắt buộc chưa được ghi nhận
                               d.​ Hệ thống hiển thị “không thể hoàn tất thao tác do lỗi
                                   ghi nhận nhật ký”
                               e.​ Hệ thống giữ nguyên dữ liệu tài khoản trước khi
                                   thao tác được thực hiện

Yêu cầu phi chức năng   1.​ Hiệu năng (NFR-01)
                               a.​ Hệ thống phải phản hồi hợp lý trong môi trường
                                   demo đối với các thao tác: tải danh sách người dùng,
                                   tìm kiếm người dùng, mở hồ sơ chi tiết, cập nhật vai
                                   trò, khóa hoặc mở tài khoản
                               b.​ Quá trình tra cứu không được làm gián đoạn toàn bộ
                                   giao diện quản trị
                               c.​ Trong thời gian xử lý, hệ thống phải thể hiện rõ
                                   trạng thái đang xử lý để tránh việc quản trị viên thực
```


## Trang 33

```text
           hiện cùng 1 thao tác nhiều lần
2.​ Bảo mật (NFR-02)
       a.​ Chỉ tài khoản có vai trò Quản trị viên mới được truy
           cập chức năng Quản lý người dùng
       b.​ Hệ thống phải kiểm tra quyền truy cập trước khi
           hiển thị danh sách hoặc hồ sơ người dùng
       c.​ Hệ thống phải kiểm tra lại quyền trước khi thực
           hiện: cập nhật vai trò, mở khóa tài khoản, khóa tài
           khoản
       d.​ Dữ liệu quản trị không được hiển thị cho tài khoản
           không có quyền
       e.​ Việc ẩn nút thao tác trên giao diện không được thay
           thế cho việc kiểm tra quyền tại hệ thống xử lý
3.​ Tính ổn định(NFR-03)
       a.​ Hệ thống phải xử lý lỗi khi không thể tải danh sách,
           tìm kiếm, xem chi tiết hoặc cập nhật tài khoản.
       b.​ Khi thao tác cập nhật thất bại, hệ thống không được
           để dữ liệu ở trạng thái cập nhật một phần.
       c.​ Hệ thống không được thông báo thành công khi dữ
           liệu chưa được lưu hoàn tất.
       d.​ Việc tải lại giao diện không được tự động lặp lại
           thao tác khóa, mở khóa hoặc cập nhật vai trò đã xác
           nhận trước đó
       e.​ Các lỗi xử lý không được làm mất dữ liệu tài khoản
           đang có
4.​ Khả năng sử dụng (NFR-05)
       a.​ Giao diện phải phân biệt rõ: tài khoản đang hoạt
           động, tài khoản bị khóa, vai trò hiện tại của tài
           khoản
       b.​ Nút khóa tài khoản chỉ được hiển thị hoặc cho phép
           sử dụng khi tài khoản đang hoạt động
       c.​ Nút mở khóa tài khoản chỉ được hiển thị hoặc cho
           phép khi tài khoản đang bị khóa
       d.​ Giao diện phải hỗ trợ hiển thị phù hợp trên kích
           thước màn hình khác nhau (trên thiết bị di động hoặc
           màn hình laptop)
5.​ Khả năng kiểm toán(NFR-06)
       a.​ Các thao tác sau phải được lưu vào nhật ký: cập nhật
           vai trò, mở khóa tài khoản, khóa tài khoản
       b.​ Nhật ký cập nhật vai trò phải có: người thực hiện,
           thời gian thực hiện, vai trò cũ, vai trò mới
       c.​ Nhật ký khóa hoặc mở tài khoản phải có: người thực
           hiện, thời gian thực hiện, loại thao tác, lý do thực
           hiện
       d.​ Nhật ký phải phản ánh đúng kết quả cuối cùng; thao
           tác thất bại không được ghi nhận là thành công.
```


## Trang 34

```text
Tên UC           Quản lý đối tác

Use case ID      BR-ADM-02

Mô tả            Hệ thống hỗ trợ Quản trị viên xem và kiểm tra hồ sơ đối tác, thông
                 tin pháp lý, trạng thái hoạt động và danh sách chi nhánh; thực hiện
                 duyệt, từ chối, khóa hoặc mở khóa đối tác.
                 Đối với đối tác đã được duyệt, hệ thống hỗ trợ Quản trị viên kiểm
                 tra và phê duyệt các yêu cầu thêm mới, chỉnh sửa hoặc xóa chi
                 nhánh trước khi thay đổi được áp dụng vào danh sách chi nhánh
                 chính thức.

Actor            Quản trị viên

Độ ưu tiên       Cao

Trigger          Quản trị viên chọn chức năng “Quản lý đối tác” trên giao diện quản
                 trị

Tiền điều kiện      1.​ Quản trị viên đã đăng nhập vào hệ thống
                    2.​ Tài khoản đăng nhập có vai trò Quản trị viên
                    3.​ Phiên đăng nhập của quản trị viên còn hiệu lực
                    4.​ Hồ sơ đối tác cần kiểm tra đã tồn tại trong hệ thống
                    5.​ Đối với việc xử lý yêu cầu thay đổi chi nhánh:
                            a.​ Đối tác đã được duyệt
                            b.​ Yêu cầu thêm mới, chỉnh sửa hoặc xóa chi nhánh đã
                                được đối tác gửi lên hệ thống

Hậu điều kiện       1.​ Trường hợp chỉ xem và kiểm tra hồ sơ
                           a.​ Hệ thống đã hiển thị hồ sơ đối tác và danh sách chi
                               nhánh theo yêu cầu
                           b.​ Thông tin và trạng thái của đối tác, chi nhánh không
                               bị thay đổi
                    2.​ Trường hợp duyệt đối tác
                           a.​ Hệ thống cập nhật trạng thái hồ sơ đối tác theo kết
                               quả duyệt
                           b.​ Hệ thống cập nhật trạng thái của các chi nhánh hợp
                               lệ theo kết quả kiểm tra. Đối tác được phép hoạt
                               động và sử dụng các chi nhánh hợp lệ để áp dụng
                               voucher.
                           c.​ Hệ thống ghi nhận kết quả xử lí vào nhật ký, gồm:
                               người thực hiện, thời gian thực hiện, nội dung thay
                               đổi, lý do duyệt
                    3.​ Trường hợp từ chối hồ sơ đối tác
```


## Trang 35

```text
                      a.​ Hệ thống ghi nhận hồ sơ đối tác không được chấp
                          nhận hoạt động chính thức
                      b.​ Nếu hồ sơ không hợp lệ, hệ thống không cho phép
                          đối tác tạo hoặc bán voucher
                      c.​ Hệ thống ghi nhận: người thực hiện, thời gian thực
                          hiện, nội dung xử lý, lí do từ chối
               4.​ Trường hợp khóa đối tác:
                      a.​ Hệ thống cập nhật trạng thái hoạt động của đối tác
                          thành trạng thái bị khóa
                      b.​ Các chi nhánh thuộc đối tác bị khóa không được sử
                          dụng làm nơi áp dụng cho voucher mới
                      c.​ Hệ thống ghi nhận: người thực hiện, thời gian thực
                          hiện, nội dung khóa, lý do khóa
               5.​ Trường hợp mở khóa đối tác:
                      a.​ Hệ thống cho phép đối tác hoạt động bình thường
                          trở lại
                      b.​ Các chi nhánh thuộc đối tác được phép hoạt động để
                          áp dụng cho voucher mới theo quyết định mở khóa
                      c.​ Hệ thống ghi nhận lý do mở khóa và nhật ký xử lý
               6.​ Trường hợp xử lý yêu cầu thay đổi chi nhánh:
                      a.​ Tùy theo quyết định của quản trị viên, hệ thống:
                             i.​ Thêm chi nhánh vào danh sách chính thức;
                            ii.​ Cập nhật thông tin chi nhánh;
                           iii.​ Hoặc cập nhật danh sách chi nhánh theo yêu
                                  cầu xóa.
                      b.​ Yêu cầu chưa được Quản trị viên duyệt không làm
                          thay đổi danh sách chi nhánh chính thức.

Luồng cơ bản   1.​ Quản trị viên chọn chức năng “Quản trị đối tác” trên giao
                   diện quản trị
               2.​ Hệ thống kiểm tra phiên đăng nhập và quyền truy cập của
                   tài khoản hiện tại
               3.​ Hệ thống truy xuất danh sách đối tác trong hệ thống
               4.​ Hệ thống hiển thị danh sách đối tác để quản trị viên lựa
                   chọn hồ sơ cần kiểm tra
               5.​ Quản trị viên kiểm tra xem có yêu cầu thay đổi (thông tin)
                   chi nhánh từ đối tác
               6.​ Quản trị viên chọn 1 hồ sơ đối tác trong danh sách
               7.​ Hệ thống truy xuất thông tin hồ sơ đối tác được chọn
               8.​ Hệ thống hiển thị thông tin đối tác, gồm: tên doanh nghiệp,
                   mã số thuế hoặc mã đăng ký kinh doanh, người đại diện, số
                   điện thoại liên hệ, email, địa chỉ kinh doanh, thông tin pháp
                   lý liên quan và trạng thái hoạt động của đối tác
               9.​ Hệ thống truy xuất danh sách chi nhánh thuộc đối tác đang
                   được kiểm tra
               10.​Hệ thống hiển thị danh sách chi nhánh, gồm: tên chi nhánh,
```


## Trang 36

```text
                     địa chỉ chi nhánh, số điện thoại liên hệ, trạng thái hoạt động
                     và phạm vi áp dụng voucher tại chi nhánh
                 11.​Quản trị viên kiểm tra hồ sơ đối tác và điều kiện hoạt động
                 12.​Quản trị viên chọn hoặc xem thông tin từng chi nhánh cần
                     kiểm tra
                 13.​Quản trị viên xác định hồ sơ đối tác và các chi nhánh đều
                     hợp lệ
                 14.​Quản trị viên chọn chức năng “Duyệt đối tác”
                 15.​Hệ thống hiển thị hộp thoại xác nhận duyệt hồ sơ và trường
                     nhập lý do duyệt
                 16.​Quản trị viên nhập lý do duyệt và xác nhận thao tác
                 17.​Hệ thống kiểm tra thông tin xác nhận do quản trị viên cung
                     cấp
                 18.​Hệ thống cập nhật trạng thái hồ sơ đối tác theo kết quả
                     duyệt
                 19.​Hệ thống cập nhật trạng thái của các chi nhánh hợp lệ thuộc
                     hồ sơ đối tác
                 20.​Hệ thống ghi nhật ký gồm người thực hiện, thời gian thực
                     hiện, nội dung thay đổi và lý do duyệt
                 21.​Hệ thống hiển thị thông báo “Duyệt hồ sơ đối tác thành
                     công”
                 22.​Hệ thống hiển thị lại hồ sơ đối tác và danh sách chi nhánh
                     với trạng thái đã được cập nhật

Luồng thay thế   -​ A5a: Nếu có xử lý yêu cầu thay đổi chi nhánh
                    (thêm/xóa/sửa)
                        -​ Hệ thống hiển thị yêu cầu thay đổi chi nhánh trong
                           hồ sơ của đối tác đã duyệt
                        -​ Quản trị viên chọn 1 yêu cầu thay đổi chi nhánh cần
                           kiểm tra
                        -​ Hệ thống hiển thị loại yêu cầu và nội dung thay đổi
                           do đối tác cung cấp
                        -​ Quản trị viên kiểm tra thông tin chi nhánh và nội
                           dung thay đổi
                        -​ Quản trị viên chọn duyệt yêu cầu khi thông tin và
                           nội dung thay đổi hợp lệ
                        -​ Hệ thống hiển thị khu vực nhập lý do duyệt yêu cầu
                        -​ Quản trị viên nhập lý do và xác nhận duyệt
                        -​ Hệ thống áp dụng nội dung thay đổi đã được duyệt
                           vào danh sách chi nhánh chính thức.
                        -​ Hệ thống ghi nhật ký gồm người thực hiện, thời gian
                           thực hiện, loại yêu cầu, nội dung thay đổi và lý do
                           duyệt.
                        -​ Hệ thống hiển thị thông báo “Xử lý yêu cầu thay đổi
                           chi nhánh thành công
                        -​ Hệ thống hiển thị lại danh sách chi nhánh đã được
```


## Trang 37

```text
          cập nhật
-​ A11a: Quản trị viên xác định hồ sơ đối tác chưa duyệt có
   một trong các vấn đề: mã số thuế sai, thông tin pháp lý
   không trùng khớp, ngành nghề không phù hợp
       -​ Quản trị viên chọn chức năng “Từ chối hồ sơ”
       -​ Hệ thống hiển thị hộp thoại xác nhận từ chối “Có”
          hoặc “Không
       -​ Quản trị viên xác nhận từ chối: “Có”
       -​ A11a1: hệ thống hiển thị hộp thoại xác nhận từ chối
          và trường nhập lý do
              -​ Quản trị viên nhập lí do hồ sơ không hợp lệ
              -​ Quản trị viên xác nhận thao tác từ chối
              -​ Hệ thống ghi nhận lý do từ chối đã được
                  nhập
              -​ Hệ thống cập nhật hồ sơ đối tác theo kết quả
                  từ chối
              -​ Hệ thống không phép đối tác tạo hoặc bán
                  voucher
              -​ Hệ thống ghi nhật ký gồm: người thực hiện,
                  thời gian thực hiện, nội dung xử lý và lý do
                  từ chối
              -​ Hệ thống hiển thị thông báo “hồ sơ đối tác đã
                  bị từ chối”
              -​ Hệ thống hiển thị lại hồ sơ đối tác với kết
                  quả từ chối
       -​ A11a2: Quản trị viên quên nhập lý do:
              -​ Hệ thống phát hiện lý do từ chối chưa được
                  nhập
              -​ Hệ thống yêu cầu nhập lý do từ chối
              -​ Hệ thống quay lại bước A11a1
       -​ A11a3 Quản trị viên hủy thao tác:
              -​ Quản trị viên chọn “Không”
              -​ Hệ thống đóng hộp thoại xác nhận
              -​ Hệ thống giữ nguyên trạng thái của đối tác,
                  không ghi nhật ký khóa sau đó hiển thị lại hồ
                  sơ tài khoản
-​ A11b: Quản trị viên phát hiện đối tác đã duyệt có hành vi:
   đăng voucher sai sự thật, không thực hiện đúng cam kết, có
   nhiều khiếu nại hợp lệ, có hành vi gian lận
       -​ Quản trị viên chọn chức năng “Khóa đối tác”
       -​ Hệ thống hiển thị hộp thoại xác nhận từ chối “Có”
          hoặc “Không
       -​ Quản trị viên xác nhận từ chối: “Có”
       -​ A11b1: Hệ thống hiển thị hộp thoại xác nhận khóa
          đối tác và trường nhập lý do
              -​ Quản trị viên nhập lí do hồ sơ không hợp lệ
```


## Trang 38

```text
               -​ Quản trị viên xác nhận thao tác khóa đối tác
               -​ Hệ thống ghi nhận lý do khóa đối tác đã
                   được nhập
               -​ Hệ thống cập nhật trạng thái hoạt động của
                   đối tác thành bị khóa
               -​ Hệ thống không cho phép các chi nhánh
                   thuộc đối tác bị khóa được sử dụng làm nơi
                   áp dụng cho voucher mới
               -​ Hệ thống ghi nhật ký gồm: người thực hiện,
                   thời gian thực hiện, nội dung xử lý và lý do
                   khóa đối tác
               -​ Hệ thống hiển thị thông báo “Khóa đối tác
                   thành công”
               -​ Hệ thống hiển thị lại hồ sơ đối tác với trạng
                   thái đã được cập nhật
       -​ A11b2: Quản trị viên quên nhập lý do:
               -​ Hệ thống phát hiện lý do khóa chưa được
                   nhập
               -​ Hệ thống yêu cầu nhập lý do từ chối
               -​ Hệ thống quay lại bước A11b1
       -​ A11b3 Quản trị viên hủy thao tác:
               -​ Quản trị viên chọn “Không”
               -​ Hệ thống đóng hộp thoại xác nhận
               -​ Hệ thống giữ nguyên trạng thái của đối tác,
                   không ghi nhật ký khóa sau đó hiển thị lại hồ
                   sơ tài khoản
-​ A11c: Quản trị viên đã xem xét việc sửa đổi và cam kết tuân
   thủ điều khoản của đối tác, trước đó đối tác đã được duyệt
   và đang bị khóa
       -​ Quản trị viên chọn chức năng “Mở khóa đối tác”
       -​ Hệ thống hiển thị hộp thoại xác nhận từ chối “Có”
           hoặc “Không
       -​ Quản trị viên xác nhận từ chối: “Có”
       -​ A11c1: Hệ thống hiển thị hộp thoại xác nhận khóa
           đối tác và trường nhập lý do
               -​ Quản trị viên nhập lí do mở khóa
               -​ Quản trị viên xác nhận thao tác mở khóa đối
                   tác
               -​ Hệ thống ghi nhận lý do mở khóa đối tác đã
                   được nhập
               -​ Hệ thống cập nhật trạng thái đối tác để cho
                   phép đối tác hoạt động bình thường
               -​ Hệ thống cho phép các chi nhánh thuộc đối
                   tác hoạt động để áp dụng cho voucher mới
                   theo quyết định mở khóa
               -​ Hệ thống ghi nhật ký gồm: người thực hiện,
```


## Trang 39

```text
                   thời gian thực hiện, nội dung xử lý và lý do
                   mở khóa đối tác
               -​ Hệ thống hiển thị thông báo “Mở khóa đối
                   tác thành công”
               -​ Hệ thống hiển thị lại hồ sơ đối tác và danh
                   sách chi nhánh với trạng thái đã được cập
                   nhật
       -​ A11c2: Quản trị viên quên nhập lý do:
               -​ Hệ thống phát hiện lý do mở khóa chưa được
                   nhập
               -​ Hệ thống yêu cầu nhập lý do từ chối
               -​ Hệ thống quay lại bước A11c1
       -​ A11c3 Quản trị viên hủy thao tác:
               -​ Quản trị viên chọn “Không”
               -​ Hệ thống đóng hộp thoại xác nhận
               -​ Hệ thống giữ nguyên trạng thái của đối tác,
                   không ghi nhật ký khóa sau đó hiển thị lại hồ
                   sơ tài khoản
-​ A12a: Nếu quản trị viên thấy chi nhánh đang duyệt mà thiếu
   một hoặc nhiều thông tin: tên chi nhánh, địa chỉ, khu vực, số
   điện thoại, trạng thái hoạt động:
       -​ Quản trị viên chọn chức năng “Yêu cầu bổ sung
           thông tin”
       -​ Hệ thống hiển thị khu vực nhập nội dung cần bổ
           sung
       -​ Quản trị viên nhập nội dung yêu cầu bổ sung
       -​ Quản trị viên xác nhận yêu cầu bổ sung
       -​ Hệ thống ghi nhận yêu cầu bổ sung thông tin chi
           nhánh
       -​ Hệ thống ghi nhật ký gồm: người thực hiện, thời
           gian thực hiện, chi nhánh liên quan, nội dung cần bổ
           sung
       -​ Hệ thống hiển thị thông báo đã ghi nhận yêu cầu bổ
           sung thông tin
       -​ Hệ thống không áp dụng chi nhánh hoặc nội dung
           thay đổi chưa đầy đủ vào danh sách chi nhánh chính
           thức. Sau khi thông tin được bổ sung, hiển thị lại
           thông tin chi nhánh để quản trị viên tiếp tục kiểm tra
           (quay lại bước 12)
-​ A12b: Nếu quản trị viên thấy chi nhánh đang duyệt mà có 1
   trong các vấn đề: địa chỉ sai, khu vực ngoài phạm vi hỗ trợ,
   không thuộc đối tác đang xét, không còn hoạt động
       -​ Quản trị viên chọn chức năng “Từ chối chi nhánh”
       -​ Hệ thống hiển thị khu vực nhập lý do từ chối
       -​ Quản trị viên nhập lý do từ chối và xác nhận thao tác
       -​ Hệ thống ghi nhận lý do từ chối đã được cung cấp
```


## Trang 40

```text
                        -​ Hệ thống không cho phép chi nhánh bị từ chối được
                           sử dụng để tạo hoặc áp dụng cho voucher mới
                        -​ Hệ thống ghi nhật ký gồm: người thực hiện, thời
                           gian thực hiện, chi nhánh liên quan và lý do từ chối
                        -​ Hệ thống thông báo “Từ chối chi nhánh thành công”
                           và hiển thị lại danh sách chi nhánh với kết quả xử lý
                 -​ A12c: Nếu quản trị viên thấy chi nhánh đã duyệt mà chi
                    nhánh: đã đóng cửa, đang tạm ngưng, có địa chỉ không còn
                    chính xác
                        -​ Quản trị viên chọn chức năng “Tạm ngưng chi
                           nhánh”
                        -​ Hệ thống hiển thị khu vực nhập lý do tạm ngưng
                        -​ Quản trị viên nhập lý do tạm ngừng và xác nhận
                           thao tác
                        -​ Hệ thống ghi nhận lý do tạm ngừng đã được cung
                           cấp
                        -​ Hệ thống cập nhật trạng thái hoạt động của chi
                           nhánh thành “Tạm ngưng hoạt động”.
                        -​ Hệ thống không cho phép chi nhánh bị tạm ngưng
                           được sử dụng để tạo hoặc áp dụng cho voucher mới
                        -​ Hệ thống ghi nhật ký gồm: người thực hiện, thời
                           gian thực hiện, chi nhánh liên quan và lý do tạm
                           ngưng
                        -​ Hệ thống hiển thị thông báo “Tạm ngưng chi nhánh
                           thành công” và hiển thị lại danh sách chi nhánh với
                           kết quả xử lý

Luồng ngoại lệ   1.​ Quản trị viên không có quyền truy cập:
                        a.​ Hệ thống phát hiện tài khoản hiện tại không có vai
                            trò quản trị viên hoặc không có quyền truy cập chức
                            năng
                        b.​ Hệ thống từ chối hiển thị dữ liệu quản lý người dùng
                        c.​ Hệ thống hiển thị thông báo ngay tại trang đăng
                            nhập: “Bạn không có quyền truy cập chức năng này”
                 2.​ Cập nhật trạng thái thất bại:
                        a.​ Áp dụng cho:
                                ●​ Duyệt hoặc từ chối đối tác;
                                ●​ Khóa hoặc mở khóa đối tác;
                                ●​ Từ chối hoặc tạm ngưng chi nhánh;
                                ●​ Phê duyệt thêm, sửa hoặc xóa chi nhánh.
                        b.​ Luồng xử lý:
                                ●​ Hệ thống không thể hoàn tất việc cập nhật dữ
                                    liệu.
                                ●​ Hệ thống không hiển thị thông báo thành
                                    công.
                                ●​ Hệ thống giữ nguyên trạng thái và thông tin
```


## Trang 41

```text
                                           trước khi thao tác.
                                        ●​ Hệ thống hiển thị thông báo không thể hoàn
                                           tất thao tác.
                        3.​ Không thể ghi nhật ký thao tác quản trị
                               a.​ Hệ thống không thể ghi nhận đầy đủ thao tác quản
                                   trị vào nhật ký hệ thống.
                               b.​ Hệ thống không xác nhận thao tác đã hoàn tất thành
                                   công
                               c.​ Hệ thống không lưu thay đổi vai trò hoặc trạng thái
                                   nếu nhật ký bắt buộc chưa được ghi nhận
                               d.​ Hệ thống hiển thị “không thể hoàn tất thao tác do lỗi
                                   ghi nhận nhật ký”
                               e.​ Hệ thống giữ nguyên dữ liệu tài khoản trước khi
                                   thao tác được thực hiện

Yêu cầu phi chức năng   1.​ Hiệu năng (NFR-01)
                               a.​ Hệ thống phải phản hồi hợp lý trong môi trường
                                   demo đối với các thao tác: tải danh sách đối tác, mở
                                   hồ sơ đối tác, tải danh sách chi nhánh, mở yêu cầu
                                   thêm/xóa/sửa chi nhánh, cập nhật trạng thái đối tác
                                   hoặc chi nhánh
                               b.​ Trong thời gian xử lý, hệ thống phải thể hiện rõ
                                   trạng thái đang xử lý để tránh việc quản trị viên thực
                                   hiện cùng 1 thao tác nhiều lần
                        2.​ Bảo mật (NFR-02)
                               a.​ Chỉ Quản trị viên mới được truy cập chức năng
                                   Quản lý đối tác.
                               b.​ Hệ thống phải kiểm tra quyền trước khi hiển thị hồ
                                   sơ doanh nghiệp, thông tin pháp lý và dữ liệu chi
                                   nhánh.
                               c.​ Hệ thống phải kiểm tra lại quyền trước khi thực hiện
                                   các thao tác duyệt, từ chối, khóa, mở khóa hoặc xử
                                   lý yêu cầu chi nhánh.
                               d.​ Việc ẩn nút trên giao diện không thay thế cho việc
                                   kiểm tra quyền tại hệ thống xử lý.
                        3.​ Tính ổn định(NFR-03)
                               a.​ Hệ thống không được để dữ liệu ở trạng thái cập
                                   nhật một phần.
                               b.​ Hệ thống không được thông báo thành công khi dữ
                                   liệu hoặc nhật ký chưa được lưu hoàn tất.
                               c.​ Yêu cầu thay đổi chi nhánh chưa được duyệt không
                                   được làm thay đổi dữ liệu chi nhánh chính thức.
                               d.​ Khi phê duyệt yêu cầu chỉnh sửa thất bại, hệ thống
                                   phải giữ nguyên thông tin hiện tại của chi nhánh.
                               e.​ Việc tải lại giao diện không được tự động lặp lại
                                   thao tác quản trị trước đó.
```


## Trang 42

```text
                 4.​ Khả năng sử dụng (NFR-05)
                       a.​ Giao diện phải phân biệt rõ: thông tin doanh nghiệp,
                           thông tin pháp lý, trạng thái hoạt động của đối tác,
                           danh sách chi nhánh, yêu cầu thay đổi chi nhánh
                       b.​ Đối với yêu cầu chỉnh sửa, hệ thống phải hiển thị
                           được thông tin hiện tại và nội dung đề nghị thay đổi.
                       c.​ Các thao tác duyệt, từ chối, khóa, mở khóa và xử lý
                           chi nhánh phải có nội dung rõ ràng.
                       d.​ Các trường lý do phải được gắn nhãn phù hợp với
                           từng thao tác.
                       e.​ Hệ thống phải hiển thị rõ kết quả thành công hoặc
                           thất bại.
                       f.​ Giao diện phải hỗ trợ hiển thị phù hợp trên kích
                           thước màn hình khác nhau (trên thiết bị di động hoặc
                           màn hình laptop)
                 5.​ Khả năng kiểm toán(NFR-06)
                       a.​ Các thao tác sau phải được lưu vào nhật ký: duyệt
                           hoặc từ chối đối tác, khóa hoăc mở khóa đối tác, yêu
                           cầu bổ sung thông tin chi nhánh, từ chối hoặc tạm
                           ngưng chi nhánh, duyệt thêm/sửa chi nhánh, duyệt
                           hoặc từ chối xóa chi nhánh
                       b.​ Nhật ký cập nhật vai trò phải có: người thực hiện,
                           thời gian thực hiện, đối tác hoặc chi nhánh liên quan,
                           nội dung thay đổi, lý do thực hiện
                       c.​ Đối với chỉnh sửa chi nhánh, nhật ký phải thể hiện
                           thông tin trước và sau khi thay đổi.
                       d.​ Thao tác thất bại không được ghi nhận là thành
                           công.




Tên UC        Duyệt voucher (đối tác phát hành voucher, adm duyệt)

Use case ID   UC-ADM-03

Mô tả         Hệ thống tiếp nhận yêu cầu duyệt voucher do Đối tác gửi, hiển thị
              voucher trong danh sách chờ duyệt và cung cấp đầy đủ thông tin để
              Quản trị viên kiểm tra. Quản trị viên có thể phê duyệt, từ chối hoặc
              chọn tạm ẩn voucher. Sau khi voucher được duyệt, hệ thống xác
              định trạng thái công bố dựa trên thời gian bán, số lượng còn lại và
              lựa chọn hiển thị của Quản trị viên.

Actor         Quản trị viên

Độ ưu tiên    Cao
```


## Trang 43

```text
Trigger          Đối tác gửi yêu cầu duyệt một voucher đã tạo lên hệ thống.

Tiền điều kiện      1.​ Quản trị viên đã đăng nhập vào hệ thống.
                    2.​ Tài khoản đăng nhập có quyền truy cập chức năng Duyệt
                        voucher.
                    3.​ Phiên đăng nhập của Quản trị viên còn hiệu lực.
                    4.​ Đối tác đã tạo voucher và gửi yêu cầu duyệt.
                    5.​ Voucher đang có trạng thái Chờ duyệt.
                    6.​ Dữ liệu voucher và thông tin liên quan đã tồn tại trên hệ
                        thống để Quản trị viên kiểm tra.

Hậu điều kiện       1.​ Trường hợp voucher được phê duyệt
                           a.​ Kết quả kiểm duyệt của voucher được chuyển từ
                               Chờ duyệt sang Đã duyệt.
                           b.​ Hệ thống thông báo kết quả phê duyệt cho Đối tác.
                           c.​ Hệ thống xác định trạng thái công bố của voucher:
                                  i.​ Đang bán nếu đã đến thời gian bán và còn số
                                       lượng;
                                 ii.​ Chờ hiển thị nếu chưa đến thời gian bán;
                                iii.​ Tạm ẩn nếu Quản trị viên chọn ẩn voucher.
                           d.​ Nếu voucher ở trạng thái Chờ hiển thị, hệ thống ghi
                               nhận lịch tự động để công bố voucher khi đến thời
                               gian bán.
                           e.​ Hệ thống ghi nhật ký xử lý.
                    2.​ Trường hợp voucher bị từ chối:
                           a.​ Hệ thống ghi nhận kết quả từ chối voucher.
                           b.​ Voucher không được chuyển sang trạng thái Đang
                               bán hoặc Chờ hiển thị.
                           c.​ Hệ thống lưu lý do từ chối.
                           d.​ Hệ thống ghi nhật ký xử lý.

Luồng cơ bản        1.​ Hệ thống tiếp nhận yêu cầu duyệt voucher
                    2.​ Quản trị viên truy cập chức năng Duyệt voucher
                    3.​ Hệ thống kiểm tra phiên đăng nhập và quyền truy cập của
                        quản trị viên
                    4.​ Hệ thống truy xuất danh sách voucher đang có trạng thái
                        “Chờ duyệt”
                    5.​ Hệ thống hiển thị danh sách voucher đang chờ duyệt
                    6.​ Quản trị viên chọn 1 voucher cần kiểm tra
                    7.​ Hệ thống truy xuất toàn bộ thông tin của voucher được chọn
                    8.​ Hệ thống hiển thị thông tin nhận diện gồm: tên voucher, mô
                        tả, danh mục, hình ảnh, đối tác phát hành và các chi nhánh
                        áp dụng
                    9.​ Quản trị viên kiểm tra thông tin nhận diện của voucher.
                    10.​Hệ thống hiển thị thông tin giá gồm: giá gốc, giá bán, giá
                        hiển thị
```


## Trang 44

```text
                        11.​Quản trị viên kiểm tra tính hợp lệ và thống nhất của thông
                            tin giá
                        12.​Hệ thống hiển thị thời gian bắt đầu và thời gian kết thúc của
                            voucher
                        13.​Quản trị viên kiểm tra thông tin thời gian của voucher
                        14.​Hệ thống hiển thị số lượng phát hành, số lượng đã bán và số
                            lượng tồn của voucher
                        15.​Quản trị viên kiểm tra số lượng phát hành và tồn kho của
                            voucher
                        16.​Hệ thống hiển thị danh sách chi nhánh và phạm vi áp dụng
                            voucher
                        17.​Quản trị viên kiểm tra phạm vi áp dụng và tình trạng của
                            các chi nhánh liên quan
                        18.​Hệ thống hiển thị các điều kiện sử dụng voucher, bao gồm
                            số lần sử dụng, số người và khung giờ nếu các thông tin này
                            được đối tác khai báo.
                        19.​Quản trị viên kiểm tra điều kiện sử dụng và đối chiếu với
                            mô tả, giá bán và phạm vi áp dụng.
                        20.​Quản trị viên xác định voucher có đầy đủ thông tin và tất cả
                            nội dung đều hợp lệ (thông qua checklist).
                        21.​Quản trị viên chọn chức năng “Phê duyệt voucher”
                        22.​Hệ thống hiển thị hộp thoại xác nhận phê duyệt
                        23.​Quản trị viên xác nhận phê duyệt voucher
                        24.​Hệ thống kiểm tra lại trạng thái hiện tại của voucher trước
                            khi cập nhật
                        25.​Hệ thống cập nhật kết quả kiểm duyệt từ “Chờ duyệt” sang
                            “Đã duyệt”
                        26.​Hệ thống ghi nhận và hiển thị thông báo kết quả phê duyệt
                            cho đối tác
                        27.​Hệ thống tự động quản lý:
                                a.​ Nếu Quản trị viên không chọn ẩn, voucher đã đến
                                    thời gian bán và còn số lượng, cập nhật trạng thái
                                    công bố thành Đang bán.
                                b.​ Nếu Quản trị viên chưa đến thời gian bán, cập nhật
                                    trạng thái công bố thành Đã duyệt.
                                c.​ Đối với voucher ở trạng thái đã duyệt, ghi nhận lịch
                                    tự động công bố voucher khi đến thời gian bán.
                        28.​Hệ thống ghi nhật ký gồm người thực hiện, thời gian thực
                            hiện, voucher được xử lý, kết quả duyệt và trạng thái công
                            bố sau khi duyệt.
                        29.​Hệ thống thông báo phê duyệt voucher thành công và trạng
                            thái hiện tại của voucher

Luồng thay thế (chỉnh   -​ A10: nếu quản trị viên kiểm tra thông tin nhận diện thấy
sửa thứ tự)                thông tin voucher gây hiểu nhầm: tên voucher không đúng
                           nội dung, mô tả không đúng dịch vụ, hình ảnh không đúng
```


## Trang 45

```text
   sản phẩm, voucher được gắn sai đối tác:
       -​ Quản trị viên chọn nút “Từ chối voucher”
       -​ Hệ thống hiển thị hộp thoại nhập lý do từ chối
       -​ Quản trị viên nhập nội dung gây hiểu lầm hoặc
           không trùng khớp
       -​ Quản trị viên xác nhận từ chối voucher
       -​ Hệ thống ghi nhận lý do từ chối
       -​ Hệ thống ghi nhật ký xử lý
       -​ Hệ thống hiển thị thông báo voucher đã bị từ chối và
           không công bố voucher để bán
-​ A12: Nếu quản trị viên phát hiện thông tin giá bị: thiếu giá
   gốc, thiếu giá bán, giá gốc hoặc giá bán nhỏ hơn hoặc bằng
   0, giá bán không nhỏ hơn giá gốc, giá hiển thị không khớp
   với thông tin giá của voucher
       -​ Quản trị viên chọn nút “Từ chối voucher”
       -​ Hệ thống hiển thị hộp thoại nhập lý do từ chối
       -​ Quản trị viên nhập lý do liên quan đến giá voucher
           và xác nhận thao tác
       -​ Hệ thống ghi nhận lý do từ chối voucher
       -​ Hệ thống lưu lý do từ chối
       -​ Hệ thống ghi nhật ký xử lý
       -​ Hệ thống hiển thị thông báo voucher đã bị từ chối và
           không công bố voucher để bán
-​ A14: Nếu quản trị viên phát hiện thông tin thời gian không
   hợp lệ: thiếu thời gian ban đầu, thiếu thời gian kết thúc, thời
   gian kết thúc trước thời gian bắt đầu, thời gian bắt đầu hoặc
   kết thúc nằm trong quá khứ:
       -​ Quản trị viên chọn nút “Từ chối voucher”
       -​ Hệ thống hiển thị hộp thoại nhập lý do từ chối
       -​ Quản trị viên nhập lý do liên quan đến thời gian và
           xác nhận thao tác
       -​ Hệ thống ghi nhận kết quả từ chối và lưu lý do
       -​ Hệ thống ghi nhận xử lý
       -​ Hệ thống hiển thị thông báo voucher đã bị từ chối và
           không tạo lịch tự động công bố voucher
-​ A16: Nếu quản trị viên phát hiện số lượng phát hành hoặc
   tồn kho không hợp lệ: không có số lượng phát hành, số
   lượng phát hành bằng 0, số lượng phát hành nhỏ hơn 0, số
   lượng đã bán vượt quá số lượng phát hành
       -​ Quản trị viên chọn nút “Từ chối voucher”
       -​ Hệ thống hiển thị hộp thoại nhập lý do từ chối
       -​ Quản trị viên nhập lý do liên quan đến số lượng phát
           hành hoặc tồn kho
       -​ Quản trị viên xác nhận từ chối voucher
       -​ Hệ thống ghi nhận kết quả từ chối và lưu lý do
       -​ Hệ thống ghi nhật kí xử lý
```


## Trang 46

```text
                        -​ Hệ thống hiển thị thông báo voucher đã bị từ chối và
                           không chuyển voucher sang trạng thái “Đang bán”
                 -​ A18: Nếu quản trị viên phát hiện phạm vi áp dụng voucher
                    không hợp lệ: voucher không có chi nhánh áp dụng, chi
                    nhánh không thuộc đối tác phát hành voucher, chi nhánh
                    đang bị tạm ngưng, chi nhánh không còn hoạt động
                        -​ Quản trị viên chọn nút “Từ chối voucher”
                        -​ Hệ thống hiển thị hộp thoại nhập lý do từ chối
                        -​ Quản trị viên nhập lý do liên quan đến chi nhánh
                           hoặc phạm vi áp dụng
                        -​ Quản trị viên xác nhận từ chối voucher
                        -​ Hệ thống ghi nhận kết quả từ chối và lưu lý do
                        -​ Hệ thống ghi nhật kí xử lý
                        -​ Hệ thống hiển thị thông báo voucher đã bị từ chối và
                           không công bố voucher tại các chi nhánh đã khai
                           báo
                 -​ A20: quản trị viên phát hiện điều kiện sử dụng không rõ
                    ràng hoặc mâu thuẫn: không xác định rõ số lần sử dụng, số
                    người áp dụng, khung giờ áp dụng; điều kiện sử dụng mâu
                    thuẫn với mô tả, giá bán, phạm vi áp dụng
                        -​ Quản trị viên chọn nút “Từ chối voucher”
                        -​ Hệ thống hiển thị hộp thoại nhập lý do từ chối
                        -​ Quản trị viên nhập nội dung điều kiện chưa rõ ràng
                           hoặc đang mâu thuẫn
                        -​ Quản trị viên xác nhận từ chối voucher
                        -​ Hệ thống ghi nhận kết quả từ chối và lưu lý do
                        -​ Hệ thống ghi nhật kí xử lý
                        -​ Hệ thống hiển thị thông báo voucher đã bị từ chối và
                           không công bố voucher để bán

Luồng ngoại lệ   1.​ Quản trị viên không có quyền truy cập:
                        a.​ Hệ thống phát hiện tài khoản hiện tại không có vai
                            trò quản trị viên hoặc không có quyền truy cập chức
                            năng
                        b.​ Hệ thống từ chối hiển thị dữ liệu quản lý người dùng
                        c.​ Hệ thống hiển thị thông báo ngay tại trang đăng
                            nhập: “Bạn không có quyền truy cập chức năng này”
                 2.​ Cập nhật kết quả duyệt thất bại:
                        a.​ Hệ thống không thể cập nhật kết quả phê duyệt hoặc
                            từ chối voucher
                        b.​ Hệ thống không hiển thị thông báo xử lý thành công
                        c.​ Hệ thống giữ nguyên trạng thái của voucher trước
                            khi thao tác được thực hiện
                        d.​ Hệ thống không công bố voucher để bán
                        e.​ Hệ thống hiển thị thông báo “không thể hoàn tất việc
                            xử lý voucher”
```


## Trang 47

```text
                        3.​ Không thể cập nhật trạng thái công bố: Áp dụng khi hệ
                            thống không thể chuyển voucher sang Đang bán, Đã duyệt
                               a.​ Hệ thống không thể cập nhật trạng thái công bố của
                                   voucher
                               b.​ Hệ thống không hiển thị kết quả công bố thành công
                               c.​ Hệ thống không đưa voucher vào trạng thái bán khi
                                   điều kiện công bố chưa được cập nhật đầy đủ
                               d.​ Hệ thống hiển thị thông báo “Không thể cập nhật
                                   trạng thái hiển thị của voucher”
                        4.​ Không thể ghi nhật ký thao tác quản trị
                               a.​ Hệ thống không thể ghi nhận đầy đủ thao tác quản
                                   trị vào nhật ký hệ thống.
                               b.​ Hệ thống không xác nhận thao tác đã hoàn tất thành
                                   công
                               c.​ Hệ thống không lưu thay đổi vai trò hoặc trạng thái
                                   nếu nhật ký bắt buộc chưa được ghi nhận
                               d.​ Hệ thống hiển thị “không thể hoàn tất thao tác do lỗi
                                   ghi nhận nhật ký”
                               e.​ Hệ thống giữ nguyên dữ liệu tài khoản trước khi
                                   thao tác được thực hiện

Yêu cầu phi chức năng   6.​ Hiệu năng (NFR-01)
                               a.​ Hệ thống phải phản hồi hợp lý trong môi trường
                                   demo đối với các thao tác: tải danh sách voucher chờ
                                   duyệt, mở thông tin chi tiết voucher, hiển thị hình
                                   ảnh và thông tin liên quan, phê duyệt hoặc từ chối
                                   voucher, cập nhật trạng thái công bố
                               b.​ Việc mở thông tin chi tiết voucher không được làm
                                   gián đoạn toàn bộ giao diện quản trị.
                               c.​ Trong thời gian xử lý, hệ thống phải hiển thị trạng
                                   thái đang tải hoặc đang cập nhật.
                               d.​ Hệ thống phải hạn chế việc Quản trị viên gửi lặp lại
                                   cùng một thao tác phê duyệt hoặc từ chối.
                        7.​ Bảo mật (NFR-02)
                               a.​ Chỉ tài khoản có quyền Quản trị viên mới được truy
                                   cập danh sách voucher chờ duyệt.
                               b.​ Hệ thống phải kiểm tra quyền trước khi hiển thị
                                   thông tin voucher và trước khi cập nhật trạng thái.
                               c.​ Hệ thống không được chỉ dựa vào việc ẩn nút trên
                                   giao diện để kiểm soát quyền.
                               d.​ Tài khoản không có quyền không được phê duyệt, từ
                                   chối hoặc thay đổi trạng thái hiển thị của voucher.
                               e.​ Hệ thống phải kiểm tra phiên đăng nhập tại thời
                                   điểm Quản trị viên xác nhận thao tác.
                        8.​ Tính ổn định(NFR-03)
                               a.​ Hệ thống không được để voucher ở trạng thái cập
```


## Trang 48

```text
          nhật một phần.
      b.​ Hệ thống không được hiển thị thông báo thành công
          khi kết quả duyệt, trạng thái công bố hoặc nhật ký
          chưa được lưu đầy đủ.
      c.​ Voucher chưa được duyệt không được chuyển sang
          trạng thái Đang bán.
      d.​ Voucher bị từ chối không được tạo lịch tự động hiển
          thị.
      e.​ Voucher không được chuyển sang Đang bán khi
          không còn số lượng.
      f.​ Voucher ở trạng thái Chờ hiển thị chỉ được tự động
          công bố theo thời gian đã được ghi nhận.
      g.​ Việc tải lại giao diện không được tự động lặp lại
          thao tác duyệt hoặc từ chối đã thực hiện trước đó.
9.​ Khả năng sử dụng (NFR-05)
      a.​ Giao diện phải phân biệt rõ: thông tin nhận diện, giá
          voucher, thời gian, số lượng và tồn kho, phạm vi áp
          dụng, điều kiện sử dụng, chính sách hủy và hoàn
          tiền
      b.​ Trạng thái Chờ duyệt, Đã duyệt, Đang bán, Chờ
          hiển thị, Tạm ẩn và kết quả Từ chối phải được thể
          hiện rõ ràng.
      c.​ Hộp thoại từ chối phải có trường nhập lý do.
      d.​ Hộp thoại phê duyệt phải thể hiện rõ tùy chọn Tạm
          ẩn voucher sau khi duyệt.
      e.​ Hệ thống phải hiển thị rõ kết quả xử lý và trạng thái
          tiếp theo của voucher.
      f.​ Giao diện phải hỗ trợ hiển thị phù hợp trên kích
          thước màn hình khác nhau (trên thiết bị di động hoặc
          màn hình laptop)
10.​Khả năng kiểm toán(NFR-06)
      a.​ Các thao tác sau phải được lưu vào nhật ký: phê
          duyệt voucher, từ chối voucher, chuyển voucher
          sang Đang bán/ Chờ hiển thị/ Tạm ẩn
      b.​ Nhật ký cập nhật vai trò phải có: người thực hiện,
          thời gian thực hiện, voucher liên quan, kết quả xử lý,
          trạng thái trước khi thay đổi, trạng thái sau khi thay
          đổi
      c.​ Đối với voucher bị từ chối, nhật ký phải bao gồm lý
          do từ chối.
      d.​ Thao tác thất bại không được ghi nhận là đã xử lý
          thành công.
```


## Trang 49

```text
Tên UC           Quản lý nội dung

Use case ID      UC-ADM-08

Mô tả            Hệ thống hỗ trợ Quản trị viên quản lý các nội dung hiển thị trên
                 sàn, bao gồm danh mục voucher, banner, bài viết, popup và nội
                 dung chính sách. Quản trị viên có thể tạo mới, cập nhật, công bố,
                 tạm ẩn hoặc ngừng hiển thị nội dung. Hệ thống cập nhật trạng thái
                 hiển thị và ghi nhật ký theo kết quả xử lý.

Actor            Quản trị viên

Độ ưu tiên       Trung bình

Trigger          Quản trị viên chọn chức năng Quản lý nội dung trên giao diện
                 quản trị.

Tiền điều kiện      1.​ Quản trị viên đã đăng nhập vào hệ thống
                    2.​ Tài khoản đăng nhập có quyền truy cập chức năng Quản lý
                        nội dung.
                    3.​ Phiên đăng nhập của Quản trị viên còn hiệu lực.
                    4.​ Hệ thống có thể truy xuất dữ liệu của các nhóm nội dung:
                        danh mục voucher, banner, bài viết, popup, chính sách
                    5.​ Đối với thao tác cập nhật, tạm ẩn hoặc ngừng hiển thị, nội
                        dung cần xử lý đã tồn tại trong hệ thống.

Hậu điều kiện       1.​ Trường hợp tạo mới và công bố nội dung
                           a.​ Nội dung mới được lưu vào hệ thống.
                           b.​ Nội dung được ghi nhận thuộc đúng nhóm đã chọn.
                           c.​ Trạng thái hiển thị của nội dung được cập nhật thành
                               Đang hiển thị.
                           d.​ Nội dung được hiển thị trên giao diện người dùng
                               theo nhóm nội dung tương ứng.
                           e.​ Hệ thống ghi nhật ký thao tác tạo mới và công bố.
                    2.​ Trường hợp cập nhật và công bố nội dung
                           a.​ Nội dung hiện tại được cập nhật theo thông tin Quản
                               trị viên đã chỉnh sửa.
                           b.​ Trạng thái hiển thị được cập nhật theo kết quả công
                               bố.
                           c.​ Nội dung mới sau khi cập nhật được hiển thị trên
                               giao diện người dùng.
                           d.​ Hệ thống ghi nhật ký thao tác cập nhật.
                    3.​ Trường hợp tạm ẩn nội dung:
                           a.​ Trạng thái nội dung được cập nhật thành Tạm ẩn.
                           b.​ Nội dung không còn hiển thị trên giao diện người
                               dùng.
                           c.​ Nội dung vẫn được lưu trong hệ thống.
```


## Trang 50

```text
                        d.​ Hệ thống ghi nhật ký thao tác tạm ẩn.
                 4.​ Trường hợp ngừng hiển thị:
                        a.​ Trạng thái nội dung hoặc danh mục được cập nhật
                            thành Ngừng hiển thị.
                        b.​ Nội dung hoặc danh mục bị ẩn khỏi toàn bộ giao
                            diện người dùng.
                        c.​ Hệ thống ghi nhật ký thao tác ngừng hiển thị.
                 5.​ Trường hợp hủy thao tác tạo mới hoặc cập nhật
                        a.​ Nội dung đang nhập không được công bố.
                        b.​ Nếu đang tạo mới, hệ thống không thêm nội dung
                            mới vào danh sách nội dung đã công bố.
                        c.​ Nếu đang cập nhật, hệ thống giữ nguyên nội dung
                            trước khi chỉnh sửa.
                        d.​ Không phát sinh thay đổi trạng thái hiển thị.

Luồng cơ bản     1.​ Quản trị viên chọn chức năng Quản lý nội dung trên giao
                     diện quản trị
                 2.​ Hệ thống kiểm tra phiên đăng nhập và quyền truy cập của
                     tài khoản hiện tại
                 3.​ Hệ thống hiển thị các nhóm nội dung có thể quản lý, gồm:
                     Danh mục voucher, Banner, Bài viết, Popup và Chính
                     sách
                 4.​ Quản trị viên chọn 1 nhóm nội dung cần quản lý
                 5.​ Hệ thống truy xuất danh sách nội dung hiện có thuộc nhóm
                     đã chọn
                 6.​ Hệ thống hiển thị danh sách nội dung cùng trạng thái hiển
                     thị hiện tại của từng nội dung
                 7.​ Quản trị viên chọn 1 nội dung để kiểm tra
                 8.​ Quản trị viên chọn thao tác xử lý tương ứng với thông tin và
                     nội dung được chọn quản lý
                 9.​ Hệ thống hiển thị lại danh sách nội dung với nội dung mới
                     và trạng thái đã được cập nhật

Luồng thay thế   -​ A8a: Tạo mới nội dung:
                       -​ Quản trị viên chọn chức năng “Tạo mới”
                       -​ Hệ thống hiển thị biểu mẫu tạo mới phù hợp với
                          nhóm nội dung đã chọn
                       -​ Quản trị viên nhập các thông tin cần thiết của nội
                          dung
                       -​ Hệ thống tiếp nhận và hiển thị dữ liệu do quản trị
                          viên nhập trên biểu mẫu
                       -​ Quản trị viên kiểm tra tính chính xác, định dạng và
                          mức độ phù hợp của nội dung trước khi công bố
                       -​ Quản trị viên chọn nút “Công bố nội dung”
                       -​ Hệ thống hiển thị hộp thoại yêu cầu xác nhận công
                          bố
```


## Trang 51

```text
       -​ Quản trị viên xác nhận công bố nội dung
              -​ Hệ thống lưu nội dung mới vào hệ thống
              -​ Hệ thống cập nhật trạng thái nội dung sang
                  “Đang hiển thị”
              -​ Hệ thống ghi nhật ký gồm: người thực hiện,
                  thời gian thực hiện, nhóm nội dung, nội dung
                  được tạo và kết quả công bố
              -​ Hệ thống hiển thị thông báo “Công bố nội
                  dung thành công”
       -​ Quản trị viên không xác nhận:
              -​ Quản trị viên chọn hủy tại hộp thoại xác
                  nhận
              -​ Hệ thống đóng hộp thoại xác nhận
-​ A8b: Tạm ẩn nội dung: khi nội dung không còn phù hợp tại
   thời điểm hiện tại nhưng có thể được sử dụng lại sau:
       -​ Quản trị viên chọn chức năng “Tạm ẩn”
       -​ Hệ thống hiển thị hộp thoại xác nhận tạm ẩn nội
           dung
       -​ Quản trị viên xác nhận thao tác tạm ẩn
              -​ Hệ thống kiểm tra trạng thái hiện tại của nội
                  dung trước khi cập nhật
              -​ Hệ thống cập nhật trạng thái nội dung thành
                  “Tạm ẩn”
              -​ Hệ thống ngừng hiển thị nội dung trên giao
                  diện người dùng
              -​ Hệ thống ghi nhật ký gồm người thực hiện,
                  thời gian thực hiện, nội dung liên quan và kết
                  quả tạm ẩn
              -​ Hệ thống hiển thị thông báo “Tạm ẩn nội
                  dung thành công”
       -​ Quản trị viên không xác nhận:
              -​ Quản trị viên chọn hủy tại hộp thoại xác
                  nhận
              -​ Hệ thống đóng hộp thoại xác nhận
-​ A8c: Ngừng hiển thị nội dung hoặc danh mục
       -​ Quản trị viên chọn chức năng “Ngừng hiển thị”
       -​ Hệ thống hiển thị hộp thoại xác nhận ngừng hiển thị
       -​ Quản trị viên xác nhận thao tác
              -​ Hệ thống kiểm tra trạng thái hiện tại của nội
                  dung hoặc danh mục
              -​ Hệ thống cập nhật trạng thái thành “Ngừng
                  hiển thị”
              -​ Hệ thống ẩn nội dung hoặc danh mục khỏi
                  toàn bộ giao diện người dùng.
              -​ Hệ thống ghi nhật ký gồm người thực hiện,
                  thời gian thực hiện, đối tượng được xử lý và
```


## Trang 52

```text
                                  kết quả ngừng hiển thị.
                               -​ Hệ thống hiển thị thông báo “Ngừng hiển thị
                                  thành công”
                       -​ Quản trị viên không xác nhận:
                               -​ Quản trị viên chọn hủy tại hộp thoại xác
                                  nhận
                               -​ Hệ thống đóng hộp thoại xác nhận
                 -​ A8d: cập nhật và công bố nội dung
                       -​ Quản trị viên chỉnh sửa các thông tin cần thiết
                       -​ Hệ thống tiếp nhận và hiển thị nội dung sau khi
                           chỉnh sửa trên biểu mẫu
                       -​ Quản trị viên kiểm tra tính chính xác, định dạng và
                           mức độ phù hợp của nội dung sau khi chỉnh sửa
                       -​ Quản trị viên chọn chức năng “Cập nhật và công bố”
                       -​ Hệ thống hiển thị hộp thoại xác nhận cập nhật và
                           công bố nội dung
                       -​ Quản trị viên xác nhận thao tác
                               -​ Hệ thống lưu các thông tin đã được chỉnh sửa
                               -​ Hệ thống cập nhật nội dung được công bố
                                  trên giao diện người dùng
                               -​ Hệ thống ghi nhật ký gồm người thực hiện,
                                  thời gian thực hiện, nội dung trước khi thay
                                  đổi và nội dung sua khi thay đổi
                               -​ Hệ thống hiển thị thông báo “Cập nhật và
                                  công bố nội dung thành công”
                       -​ Quản trị viên hủy xác nhận:
                               -​ Quản trị viên chọn hủy tại hộp thoại xác
                                  nhận
                               -​ Hệ thống đóng hộp thoại xác nhận
                               -​ Hệ thống không áp dụng các nội dung đang
                                  chỉnh sửa và giữ nguyên nội dung đã được
                                  công bố trước đó

Luồng ngoại lệ   1.​ Quản trị viên không có quyền truy cập:
                        a.​ Hệ thống phát hiện tài khoản hiện tại không có vai
                            trò quản trị viên hoặc không có quyền truy cập chức
                            năng
                        b.​ Hệ thống từ chối hiển thị dữ liệu quản lý người dùng
                        c.​ Hệ thống hiển thị thông báo ngay tại trang đăng
                            nhập: “Bạn không có quyền truy cập chức năng này”
                 2.​ Không thể cập nhật trạng thái hiển thị:
                        a.​ Hệ thống không thể cập nhật trạng thái hiển thị của
                            nội dung.
                        b.​ Hệ thống không hiển thị thông báo thao tác thành
                            công.
                        c.​ Hệ thống giữ nguyên trạng thái trước khi thao tác
```


## Trang 53

```text
                                   được thực hiện.
                               d.​ Hệ thống hiển thị thông báo: “Không thể cập nhật
                                   trạng thái hiển thị.”
                        3.​ Không thể ghi nhật ký thao tác quản trị
                               a.​ Hệ thống không thể ghi nhận đầy đủ thao tác quản
                                   trị vào nhật ký hệ thống.
                               b.​ Hệ thống không xác nhận thao tác đã hoàn tất thành
                                   công
                               c.​ Hệ thống không lưu thay đổi vai trò hoặc trạng thái
                                   nếu nhật ký bắt buộc chưa được ghi nhận
                               d.​ Hệ thống hiển thị “không thể hoàn tất thao tác do lỗi
                                   ghi nhận nhật ký”
                               e.​ Hệ thống giữ nguyên dữ liệu tài khoản trước khi
                                   thao tác được thực hiện

Yêu cầu phi chức năng   1.​ Hiệu năng (NFR-01)
                               a.​ Hệ thống phải phản hồi hợp lý trong môi trường
                                   demo đối với các thao tác: Hiển thị danh mục quản
                                   lý nội dung, tải danh sách nội dung, mở biểu mẫu
                                   tạo mới, mở biểu mẫu cập nhật, công bố nội dung,
                                   tạm ẩn hoặc ngừng hiển thị nội dung.
                               b.​ Trong thời gian tải hoặc cập nhật, hệ thống phải thể
                                   hiện rõ trạng thái đang xử lý.
                               c.​ Hệ thống phải hạn chế việc gửi lặp lại cùng một thao
                                   tác trong khi thao tác trước chưa hoàn tất.
                               d.​ Việc tải một nhóm nội dung không được làm gián
                                   đoạn toàn bộ giao diện quản trị.
                        2.​ Bảo mật (NFR-02)
                               a.​ Chỉ tài khoản có quyền Quản trị viên mới được truy
                                   cập chức năng Quản lý nội dung.
                               b.​ Hệ thống phải kiểm tra quyền trước khi hiển thị:
                                   Danh sách nội dung, biểu mẫu tạo mới, biểu mẫu
                                   cập nhật.
                               c.​ Hệ thống phải kiểm tra lại quyền trước khi: công bố,
                                   tạm ẩn, ngừng hiển thị, cập nhật nội dung.
                               d.​ Việc ẩn các nút thao tác trên giao diện không được
                                   thay thế cho việc kiểm tra quyền tại hệ thống xử lý.
                               e.​ Tài khoản không có quyền không được thay đổi nội
                                   dung bằng cách truy cập trực tiếp đường dẫn quản
                                   trị.
                        3.​ Tính ổn định(NFR-03)
                               a.​ Hệ thống không được công bố nội dung khi dữ liệu
                                   chưa được lưu thành công.
                               b.​ Hệ thống không được để nội dung ở trạng thái cập
                                   nhật một phần.
                               c.​ Khi cập nhật thất bại, nội dung đã công bố trước đó
```


## Trang 54

```text
                        phải được giữ nguyên.
                    d.​ Khi thay đổi trạng thái thất bại, trạng thái hiển thị
                        trước đó phải được giữ nguyên.
                    e.​ Nội dung có trạng thái Tạm ẩn hoặc Ngừng hiển thị
                        không được xuất hiện trên giao diện người dùng.
                    f.​ Hệ thống không được hiển thị thông báo thành công
                        khi nội dung, trạng thái hoặc nhật ký chưa được lưu
                        đầy đủ.
                    g.​ Việc tải lại giao diện không được tự động lặp lại
                        thao tác công bố, tạm ẩn hoặc ngừng hiển thị trước
                        đó.
              4.​ Khả năng sử dụng (NFR-05)
                    a.​ Giao diện phải phân biệt rõ năm nhóm: Danh mục,
                        Banner, bài viết, popup, chính sách.
                    b.​ Trạng thái Đang hiển thị, Tạm ẩn và Ngừng hiển thị
                        phải được thể hiện rõ ràng.
                    c.​ Biểu mẫu phải hiển thị đúng các trường dữ liệu
                        thuộc nhóm nội dung đang được quản lý.
                    d.​ Các thao tác công bố, tạm ẩn và ngừng hiển thị phải
                        có bước xác nhận.
                    e.​ Hệ thống phải hiển thị rõ kết quả thành công hoặc
                        thất bại.
                    f.​ Giao diện phải hỗ trợ hiển thị phù hợp trên kích
                        thước màn hình khác nhau (trên thiết bị di động hoặc
                        màn hình laptop)
              5.​ Khả năng kiểm toán(NFR-06)
                    a.​ Các thao tác sau phải được ghi nhật ký: Tạo mới và
                        công bố nội dung, cập nhật và công bố nội dung, tạm
                        ẩn nội dung, ngừng hiển thị nội dung hoặc danh
                        mục.
                    b.​ Nhật ký phải bao gồm: người thực hiện, thời gian
                        thực hiện. nhóm nội dung, nội dung liên quan, loại
                        thao tác, trạng thái trước khi thay đổi, trạng thái sau
                        khi thay đổi.
                    c.​ Đối với thao tác cập nhật, nhật ký phải thể hiện nội
                        dung trước và sau khi thay đổi.
                    d.​ Thao tác thất bại không được ghi nhận là đã hoàn tất
                        thành công.




Tên UC           Hiển thị dashboard tổng quan hệ thống

Use case ID      UC_ADM_09
```


## Trang 55

```text
Mô tả            Hệ thống tổng hợp và hiển thị các chỉ số tổng quan về người dùng,
                 đối tác, voucher, đơn hàng và doanh thu; đồng thời hiển thị các mục
                 cần xử lý để Quản trị viên nắm bắt tình trạng vận hành và truy cập
                 nhanh vào các màn hình quản lý tương ứng.

Actor            Admin

Độ ưu tiên       Cao

Trigger          Quản trị viên đăng nhập vào hệ thống và truy cập giao diện Admin
                 Dashboard

Tiền điều kiện      1.​ Quản trị viên đã đăng nhập vào hệ thống.
                    2.​ Tài khoản có vai trò Quản trị viên.
                    3.​ Phiên đăng nhập còn hiệu lực.
                    4.​ Hệ thống có quyền truy xuất dữ liệu tổng hợp

Hậu điều kiện    3.1. Trường hợp hiển thị thành công
                     1.​ Hệ thống hiển thị đầy đủ các chỉ số tổng quan:
                        ●​ Tổng người dùng
                        ●​ Tổng đối tác đang hoạt động
                        ●​ Tổng đối tác chờ duyệt
                        ●​ Số lượng voucher đang bán
                        ●​ Số lượng voucher chờ duyệt
                        ●​ Tổng đơn hàng chờ xử lí (hoàn tiền, lỗi)
                        ●​ Doanh thu tổng
                 3.2. Trường hợp dữ liệu trống
                     1.​ Hệ thống hiển thị các khu vực dữ liệu với trạng thái trống.
                     2.​ Không hiển thị dữ liệu không tồn tại như một kết quả hợp lệ.
                 3.3. Trường hợp dữ liệu chưa tải được
                     1.​ Hệ thống hiển thị trạng thái đang tải.
                     2.​ Không hiển thị dữ liệu chưa xác định.

Luồng cơ bản     1 Quản trị viên Đăng nhập vào hệ thống và truy cập giao diện
                 Admin Dashboard.
                 2 Hệ thống Kiểm tra phiên đăng nhập và quyền truy cập của tài
                 khoản.
                 3 Hệ thống Khởi tạo quá trình tải dữ liệu dashboard.
                 4 Hệ thống Truy xuất dữ liệu tổng hợp từ các module: người dùng,
                 đối tác, voucher, đơn hàng và doanh thu.
                 5 Hệ thống Tính toán và truy xuất các chỉ số tổng quan gồm: Tổng
                 người dùng, , Tổng đối tác đang hoạt động, Tổng đối tác chờ duyệt,
                 Số lượng voucher đang bán, Số lượng voucher chờ duyệt, Tổng đơn
                 hàng chờ xử lí (hoàn tiền, lỗi), Doanh thu tổng
                 6 Hệ thống Hiển thị dashboard với các chỉ số tổng quan.
                 7 Hệ thống Kết thúc Use Case.
```


## Trang 56

```text
Luồng thay thế     A1a – Dữ liệu dashboard chưa tải được
                   A1a.1 Hệ thống Không thể hoàn tất việc truy xuất dữ liệu
                   dashboard trong thời gian chờ.
                   A1a.2 Hệ thống Hiển thị trạng thái đang tải dữ liệu.
                   A1a.3 Hệ thống Khi vượt quá thời gian chờ, hiển thị thông báo lỗi
                   tải dữ liệu.
                   A1a.4 Hệ thống Hiển thị lựa chọn cho phép tải lại dashboard.
                   A1a.5 Quản trị viên Chọn tải lại dashboard.
                   A1a.6 Hệ thống Thực hiện lại quá trình tải dữ liệu từ bước 3 của
                   Basic Flow.
                   A1a.7 Hệ thống Kết thúc Use Case nếu không tiếp tục thao tác.
                   A1b – Không có dữ liệu
                   A1b.1 Hệ thống Không có dữ liệu cho một hoặc nhiều chỉ số
                   dashboard.
                   A1b.2 Hệ thống Hiển thị các khu vực dữ liệu tương ứng với trạng
                   thái trống.
                   A1b.3 Hệ thống Không hiển thị dữ liệu không tồn tại như kết quả
                   hợp lệ.
                   A1b.4 Hệ thống Cho phép Quản trị viên tiếp tục xem các phần còn
                   lại của dashboard.
                   A1b.5 Hệ thống Kết thúc Use Case.

Luồng ngoại lệ     E1 – Không có quyền truy cập
                   E1.1 Hệ thống Phát hiện tài khoản không có vai trò Quản trị viên.
                   E1.2 Hệ thống Từ chối truy cập dashboard quản trị.
                   E1.3 Hệ thống Hiển thị thông báo: “Bạn không có quyền truy
                   cập.”
                   E1.4 Hệ thống Kết thúc Use Case thất bại.
                   E2 – Dữ liệu trả về không hợp lệ
                   E2.1 Hệ thống Phát hiện phiên đăng nhập không còn hiệu lực.
                   E2.2 Hệ thống Không thực hiện truy xuất dữ liệu dashboard.
                   E2.3 Hệ thống Hiển thị yêu cầu đăng nhập lại.
                   E2.4 Hệ thống Kết thúc Use Case thất bại.
                   E3 – Không thể truy xuất dữ liệu dashboard
                   E3.1 Hệ thống Không thể truy xuất dữ liệu từ một hoặc nhiều
                   module.
                   E3.2 Hệ thống Không hiển thị dữ liệu không đầy đủ như kết quả
                   hợp lệ.
                   E3.3 Hệ thống Hiển thị thông báo lỗi tải dữ liệu.
                   E3.4 Hệ thống Cho phép thực hiện lại thao tác tải dữ liệu.
                   E3.5 Hệ thống Kết thúc Use Case nếu không thể khôi phục dữ liệu.

YC Phi chức năng   NFR-01 – Hiệu năng
                   Dashboard phải hiển thị trong thời gian hợp lý sau khi Quản trị viên
                   truy cập.
                   Các chỉ số tổng quan phải được tính toán nhanh để không làm gián
```


## Trang 57

```text
              đoạn trải nghiệm.
              Hệ thống phải thể hiện trạng thái đang tải trong quá trình truy xuất
              dữ liệu.
              NFR-02 – Bảo mật
              Chỉ tài khoản có vai trò Quản trị viên mới được truy cập dashboard.
              Hệ thống phải kiểm tra quyền trước khi truy xuất dữ liệu tổng hợp.
              Không hiển thị dữ liệu dashboard cho tài khoản không có quyền.
              NFR-03 – Tính ổn định
              Hệ thống phải xử lý lỗi khi không thể truy xuất dữ liệu từ các
              module.
              Không được hiển thị dữ liệu sai hoặc chưa hoàn chỉnh như dữ liệu
              hợp lệ.
              Dashboard không được gây lỗi toàn bộ hệ thống nếu một phần dữ
              liệu bị lỗi.
              NFR-05 – Khả năng sử dụng
              Các chỉ số tổng quan phải được hiển thị rõ ràng và dễ phân biệt.
              Các mục cần xử lý phải được hiển thị riêng biệt.
              Hệ thống phải cho phép chọn trực tiếp vào từng chỉ số hoặc mục để
              chuyển sang màn hình quản lý tương ứng.
              Trạng thái giao diện phải rõ ràng:
              Đang tải
              Có dữ liệu
              Không có dữ liệu
              Lỗi tải dữ liệu
              NFR-06 – Khả năng kiểm toán
              Dashboard phải phản ánh dữ liệu tổng hợp chính xác tại thời điểm
              truy xuất.
              Không hiển thị dữ liệu không xác định hoặc chưa được hệ thống xác
              nhận.
              Các chỉ số hiển thị phải có nguồn dữ liệu rõ ràng từ các module
              tương ứng.




Tên UC        Tra cứu nhật ký thao tác hệ thống

Use case ID   UC-ADM-10

Mô tả         Hệ thống hỗ trợ Quản trị viên xem danh sách nhật ký thao tác, tìm
              kiếm và lọc theo loại thao tác, thời gian và tài khoản thực hiện, xem
              chi tiết bản ghi và (nếu được triển khai) xuất nhật ký phục vụ báo
              cáo.

Actor         Quản trị viên
```


## Trang 58

```text
Độ ưu tiên       Cao

Trigger          Quản trị viên chọn chức năng Tra cứu nhật ký hệ thống trên giao
                 diện quản trị.

Tiền điều kiện      1.​ Quản trị viên đã đăng nhập vào hệ thống.
                    2.​ Tài khoản có quyền truy cập chức năng tra cứu nhật ký.
                    3.​ Phiên đăng nhập còn hiệu lực.
                    4.​ Hệ thống có dữ liệu nhật ký thao tác.

Hậu điều kiện    Trường hợp tra cứu thành công
                    1.​ Hệ thống hiển thị danh sách nhật ký phù hợp với điều kiện
                        tìm kiếm/lọc.
                    2.​ Không có dữ liệu nhật ký bị thay đổi.
                 Trường hợp xem chi tiết
                    1.​ Hệ thống hiển thị đầy đủ thông tin chi tiết của bản ghi nhật
                        ký được chọn.
                    2.​ Không có dữ liệu nào bị chỉnh sửa.
                 Trường hợp xuất nhật ký (nếu được triển khai)
                    1.​ Hệ thống tạo file xuất nhật ký theo định dạng được hỗ trợ
                        (CSV hoặc PDF).
                    2.​ Nội dung file phản ánh đúng dữ liệu nhật ký tại thời điểm
                        xuất.

Luồng cơ bản     1 Quản trị viên Chọn chức năng Tra cứu nhật ký hệ thống.
                 2 Hệ thống Kiểm tra phiên đăng nhập và quyền truy cập.
                 3 Hệ thống Truy xuất danh sách nhật ký thao tác từ hệ thống.
                 4 Hệ thống Sắp xếp nhật ký theo thời gian giảm dần (mới nhất
                 trước).
                 5 Hệ thống Hiển thị danh sách nhật ký với các thông tin: Loại
                 thao tác, Tài khoản thực hiện, Thời điểm, Kết quả.
                 6 Hệ thống Hiển thị khu vực bộ lọc gồm: Loại thao tác, Khoảng
                 thời gian, Tài khoản thực hiện.
                 7 Quản trị viên Nhập hoặc chọn điều kiện lọc.
                 8 Hệ thống Tiếp nhận điều kiện lọc.
                 9 Hệ thống Lọc dữ liệu nhật ký theo điều kiện đã nhập.
                 10 Hệ thống Hiển thị danh sách nhật ký phù hợp với điều kiện
                 lọc.
                 11 Quản trị viên Chọn một bản ghi nhật ký.
                 12 Hệ thống Truy xuất thông tin chi tiết của bản ghi được chọn.
                 13 Hệ thống Hiển thị chi tiết nhật ký thao tác.
                 14 Hệ thống Kết thúc Use Case.

Luồng thay thế   A2 – Không tìm thấy bản ghi phù hợp
                 A2.1 Hệ thống Không tìm thấy bản ghi nhật ký phù hợp với điều
                 kiện lọc.
                 A2.2 Hệ thống Hiển thị thông báo: “Không tìm thấy kết quả.”
```


## Trang 59

```text
                 A2.3 Hệ thống Hiển thị gợi ý điều chỉnh bộ lọc.
                 A2.4 Quản trị viên Điều chỉnh lại điều kiện lọc.
                 A2.5 Hệ thống Thực hiện lại bước lọc dữ liệu và quay lại bước 9
                 của Basic Flow.
                 A2.6 Hệ thống Kết thúc Use Case nếu không tiếp tục thao tác.
                 A4 – Xuất nhật ký (nếu được triển khai)
                 A4.1 Quản trị viên Chọn chức năng Xuất nhật ký.
                 A4.2 Hệ thống Hiển thị lựa chọn định dạng xuất: CSV hoặc PDF.
                 A4.3 Quản trị viên Chọn định dạng xuất.
                 A4.4 Hệ thống Tiếp nhận lựa chọn định dạng.
                 A4.5 Hệ thống Trích xuất dữ liệu nhật ký theo điều kiện lọc hiện
                 tại.
                 A4.6 Hệ thống Tạo file dữ liệu theo định dạng đã chọn.
                 A4.7 Hệ thống Cung cấp file cho Quản trị viên.
                 A4.8 Hệ thống Kết thúc Use Case.

Luồng ngoại lệ   E1 – Không có quyền truy cập
                 E1.1 Hệ thống Phát hiện tài khoản không có quyền truy cập chức
                 năng.
                 E1.2 Hệ thống Không truy xuất dữ liệu nhật ký.
                 E1.3 Hệ thống Hiển thị thông báo: “Bạn không có quyền truy cập
                 chức năng này.”
                 E1.4 Hệ thống Kết thúc Use Case thất bại.
                 E2 – Phiên đăng nhập không hợp lệ
                 E2.1 Hệ thống Phát hiện phiên đăng nhập không còn hiệu lực.
                 E2.2 Hệ thống Ngừng xử lý yêu cầu.
                 E2.3 Hệ thống Hiển thị yêu cầu đăng nhập lại.
                 E2.4 Hệ thống Kết thúc Use Case thất bại.
                 E3 – Không thể truy xuất nhật ký
                 E3.1 Hệ thống Không thể truy xuất dữ liệu nhật ký.
                 E3.2 Hệ thống Không hiển thị dữ liệu không đầy đủ.
                 E3.3 Hệ thống Hiển thị thông báo: “Không thể tải nhật ký. Vui
                 lòng thử lại.”
                 E3.4 Hệ thống Kết thúc Use Case thất bại.
                 E4 – Không thể tải chi tiết bản ghi
                 E4.1 Hệ thống Không thể truy xuất chi tiết bản ghi.
                 E4.2 Hệ thống Hiển thị thông báo lỗi tải chi tiết.
                 E4.3 Hệ thống Không hiển thị dữ liệu không đầy đủ.
                 E4.4 Hệ thống Kết thúc Use Case thất bại.
                 E5 – Xuất file thất bại
                 E5.1 Hệ thống Không thể tạo file xuất nhật ký.
                 E5.2 Hệ thống Không cung cấp file lỗi cho người dùng.
                 E5.3 Hệ thống Hiển thị thông báo: “Không thể xuất nhật ký. Vui
                 lòng thử lại.”
                 E5.4 Hệ thống Kết thúc Use Case thất bại.
```
