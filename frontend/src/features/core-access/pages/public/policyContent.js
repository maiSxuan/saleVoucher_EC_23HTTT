export const policyNavigation = [
  { id: "principles", label: "Nguyên tắc áp dụng" },
  { id: "customer-policy", label: "Khách hàng & Sàn" },
  { id: "partner-policy", label: "Đối tác & Sàn" },
  { id: "cancellation-policy", label: "Hủy đơn hàng" },
  { id: "refund-policy", label: "Hoàn tiền" },
  { id: "complaint-policy", label: "Khiếu nại" },
  { id: "decision-table", label: "Bảng xử lý nhanh" },
];

export const principles = [
  "Mọi voucher được kinh doanh trên Sàn phải tuân thủ Chính sách Sàn.",
  {
    text: "Đối tác được phép khai báo chính sách hoàn/hủy riêng cho từng voucher để làm rõ:",
    children: [
      "thời hạn được phép hủy;",
      "điều kiện sử dụng;",
      "chi nhánh áp dụng;",
      "thời hạn sử dụng;",
      "các giới hạn riêng của chương trình.",
    ],
  },
  "Chính sách riêng của voucher không được trái với các nguyên tắc bắt buộc của Chính sách Sàn.",
  "Trường hợp chính sách voucher không quy định một nội dung cụ thể thì áp dụng Chính sách Sàn.",
  "Trường hợp chính sách voucher có điều khoản có lợi hơn cho Khách hàng thì được áp dụng điều khoản có lợi hơn đó.",
  "Các thông tin ảnh hưởng trực tiếp đến quyền sử dụng voucher phải được hiển thị cho Khách hàng trước khi mua.",
];

export const customerPolicy = [
  {
    title: "1. Quyền của Khách hàng",
    intro: "Khách hàng có quyền:",
    items: [
      "Tìm kiếm và xem thông tin voucher đang được phép kinh doanh trên Sàn.",
      {
        text: "Được cung cấp đầy đủ thông tin trước khi mua, bao gồm:",
        children: [
          "tên voucher;",
          "Đối tác cung cấp;",
          "giá gốc;",
          "giá bán;",
          "thời gian bán;",
          "thời hạn sử dụng;",
          "chi nhánh áp dụng;",
          "điều kiện sử dụng;",
          "chính sách hủy và hoàn tiền.",
        ],
      },
      "Nhận voucher code sau khi giao dịch thanh toán thành công.",
      "Xem trạng thái đơn hàng, thanh toán và voucher đã mua.",
      "Sử dụng voucher tại đúng Đối tác, chi nhánh và trong thời hạn được công bố.",
      "Gửi yêu cầu hủy đối với giao dịch đáp ứng điều kiện hủy.",
      "Gửi khiếu nại khi quyền lợi voucher không được cung cấp đúng như thông tin đã công bố.",
      "Được gửi lại hoặc cấp lại voucher code khi lỗi phát sinh thuộc hệ thống và đáp ứng điều kiện xử lý.",
      "Được hoàn tiền khi yêu cầu hủy hoặc khiếu nại được xác định đủ điều kiện hoàn tiền theo chính sách.",
    ],
  },
  {
    title: "2. Nghĩa vụ của Khách hàng",
    intro: "Khách hàng có trách nhiệm:",
    items: [
      "Cung cấp thông tin tài khoản chính xác.",
      "Tự bảo vệ thông tin đăng nhập và voucher code của mình.",
      "Kiểm tra thông tin voucher và điều kiện sử dụng trước khi thanh toán.",
      {
        text: "Sử dụng voucher:",
        children: ["đúng thời hạn;", "đúng chi nhánh;", "đúng điều kiện;", "đúng phạm vi quyền lợi được công bố."],
      },
      "Không chuyển giao, sao chép hoặc sử dụng voucher code trái với điều kiện chương trình.",
      "Không sử dụng lại voucher đã được ghi nhận là Đã sử dụng, trừ trường hợp voucher được thiết kế cho phép nhiều lượt sử dụng.",
      "Cung cấp thông tin trung thực khi gửi yêu cầu hủy hoặc khiếu nại.",
    ],
  },
  {
    title: "3. Trách nhiệm của Sàn đối với Khách hàng",
    intro: "Sàn có trách nhiệm:",
    items: [
      "Chỉ cho phép voucher đã được kiểm duyệt và đủ điều kiện được đưa ra bán.",
      "Kiểm tra khả năng cung cấp voucher tại thời điểm đặt mua và thanh toán.",
      "Chỉ phát hành voucher code sau khi thanh toán thành công.",
      "Bảo đảm mỗi voucher code được phát hành là duy nhất.",
      "Lưu thông tin đơn hàng, thanh toán và trạng thái voucher.",
      "Tiếp nhận yêu cầu hủy và khiếu nại của Khách hàng.",
      "Kiểm tra thông tin giao dịch trước khi quyết định phương án xử lý.",
      "Không tự động từ chối hoặc hoàn tiền khi chưa kiểm tra điều kiện liên quan.",
      "Ghi nhận kết quả xử lý để Khách hàng có thể theo dõi.",
    ],
  },
  {
    title: "4. Các trường hợp Sàn không chịu trách nhiệm hoàn tiền",
    intro: "Khách hàng thông thường không được hoàn tiền nếu:",
    tone: "warning",
    items: [
      "Voucher đã được sử dụng.",
      "Voucher hết hạn đúng với thời hạn đã được công bố.",
      "Khách hàng sử dụng sai chi nhánh.",
      "Khách hàng không đáp ứng điều kiện sử dụng đã được công bố.",
      "Khách hàng chỉ thay đổi ý định và không muốn sử dụng voucher sau khi mua, trong khi chính sách voucher không cho phép hủy vì lý do này.",
      "Khách hàng yêu cầu hủy sau thời hạn hủy được công bố.",
      "Không phát hiện lỗi từ Sàn hoặc Đối tác và voucher vẫn có thể được sử dụng bình thường.",
    ],
  },
];

export const partnerPolicy = [
  {
    title: "1. Điều kiện tham gia Sàn",
    intro: "Đối tác muốn kinh doanh voucher phải:",
    items: [
      "Đăng ký hồ sơ doanh nghiệp.",
      "Cung cấp thông tin pháp lý và thông tin người đại diện.",
      "Khai báo các chi nhánh cung cấp dịch vụ.",
      "Được Sàn phê duyệt trước khi chính thức hoạt động.",
    ],
    note: "Sàn có quyền từ chối hoặc khóa Đối tác nếu hồ sơ không hợp lệ hoặc Đối tác vi phạm quy định vận hành.",
  },
  {
    title: "2. Trách nhiệm của Đối tác khi đăng voucher",
    intro: "Đối tác phải cung cấp chính xác:",
    items: [
      "Tên và mô tả voucher.",
      "Giá gốc và giá bán.",
      "Thời gian bắt đầu và kết thúc bán.",
      "Thời gian bắt đầu và kết thúc sử dụng.",
      "Số lượng phát hành.",
      "Chi nhánh áp dụng.",
      "Điều kiện sử dụng.",
      "Chính sách hoàn/hủy áp dụng cho voucher.",
    ],
    note: "Giá bán voucher phải nhỏ hơn giá gốc. Voucher chỉ được đưa ra bán sau khi được Sàn phê duyệt. Đối tác không được bán vượt quá số lượng voucher đã khai báo.",
  },
  {
    title: "3. Chính sách hoàn/hủy do Đối tác khai báo",
    intro: "Đối tác được phép khai báo điều kiện hoàn/hủy cụ thể cho voucher nhưng:",
    items: [
      "Không được trái Chính sách Sàn.",
      "Không được loại bỏ quyền khiếu nại của Khách hàng đối với lỗi thuộc Đối tác hoặc hệ thống.",
      {
        text: "Không được lấy lý do “voucher không hoàn/hủy” để từ chối trách nhiệm trong trường hợp:",
        children: [
          "Đối tác không còn cung cấp dịch vụ;",
          "Đối tác từ chối một voucher hợp lệ;",
          "quyền lợi thực tế không đúng với thông tin đã công bố;",
          "voucher không thể sử dụng do lỗi thuộc phía Đối tác.",
        ],
      },
    ],
    note: "Điều khoản “không hoàn/hủy” chỉ áp dụng đối với trường hợp giao dịch và dịch vụ được cung cấp đúng cam kết, nhưng Khách hàng không còn nhu cầu sử dụng hoặc không đáp ứng điều kiện sử dụng.",
  },
  {
    title: "4. Trách nhiệm khi Khách hàng sử dụng voucher",
    intro: "Đối tác và nhân viên Đối tác phải:",
    items: [
      "Kiểm tra voucher code trước khi xác nhận sử dụng.",
      "Chỉ xác thực voucher thuộc chương trình và chi nhánh của mình.",
      "Chỉ xác nhận Đã sử dụng khi Khách hàng thực tế sử dụng quyền lợi.",
      "Không được xác nhận lại một voucher đã sử dụng.",
      "Không được từ chối voucher đang hợp lệ nếu Khách hàng đáp ứng đầy đủ điều kiện được công bố.",
    ],
  },
  {
    title: "5. Voucher đã bán khi Đối tác tạm ngưng hoặc ngừng bán",
    paragraphs: [
      "Việc Đối tác tạm ngưng hoặc ngừng bán một chương trình chỉ ngăn phát sinh giao dịch mua mới.",
      "Voucher code đã được phát hành cho Khách hàng không tự động mất hiệu lực chỉ vì voucher sản phẩm bị tạm ngưng hoặc ngừng bán.",
      "Đối tác vẫn phải thực hiện quyền lợi đối với voucher code đã bán còn hợp lệ, trừ trường hợp Sàn đã chính thức hủy hoặc vô hiệu hóa voucher đó theo quy trình xử lý hủy, hoàn tiền hoặc khiếu nại.",
    ],
  },
  {
    title: "6. Trách nhiệm của Đối tác khi phát sinh khiếu nại",
    paragraphs: [
      "Khi có khiếu nại liên quan đến voucher do mình cung cấp, Đối tác phải phối hợp cung cấp thông tin để Sàn xác minh.",
      "Nếu xác định lỗi thuộc Đối tác và không thể khắc phục quyền lợi cho Khách hàng, giao dịch có thể được chuyển sang quy trình hoàn tiền theo Chính sách Sàn.",
    ],
    intro: "Các vi phạm nghiêm trọng hoặc lặp lại có thể dẫn đến việc Sàn:",
    items: ["tạm ngưng chi nhánh;", "tạm ngưng voucher;", "ngừng bán voucher;", "khóa quyền hoạt động của Đối tác."],
  },
];

export const cancellationPolicy = [
  {
    title: "1. Đơn hàng chưa thanh toán thành công",
    paragraphs: ["Khách hàng được phép hủy đơn nếu giao dịch chưa thanh toán thành công."],
    intro: "Khi hủy:",
    items: [
      "Đơn hàng được ghi nhận Đã hủy.",
      "Không phát hành voucher code.",
      "Số lượng voucher đang được giữ cho giao dịch được giải phóng nếu có.",
      "Không phát sinh hoàn tiền vì chưa có giao dịch thanh toán thành công.",
    ],
    note: "Trường hợp này không cần Quản trị viên xét duyệt.",
  },
  {
    title: "2. Đơn hàng đã thanh toán thành công",
    paragraphs: [
      "Sau khi thanh toán thành công, Khách hàng không thể tự động hủy đơn.",
      "Khách hàng phải gửi Yêu cầu hủy đơn để Sàn kiểm tra.",
    ],
    intro: "Yêu cầu được chấp nhận khi đồng thời đáp ứng:",
    items: [
      "Giao dịch thanh toán đã thành công.",
      "Voucher code chưa được sử dụng hoặc chưa tồn tại mã hợp lệ.",
      "Đơn hàng chưa được hoàn tiền trước đó.",
      "Yêu cầu được gửi trong thời hạn cho phép hủy được công bố.",
      "Lý do hủy thuộc phạm vi được chính sách voucher hoặc Chính sách Sàn hỗ trợ.",
    ],
    note: "Nếu được chấp nhận: Yêu cầu hủy → Được chấp nhận → Đơn hàng chuyển sang Chờ hoàn tiền → tiến hành hoàn tiền. Trong thời gian chờ hoàn tiền, voucher code liên quan không được phép tiếp tục sử dụng.",
  },
  {
    title: "3. Các trường hợp từ chối hủy đơn",
    intro: "Yêu cầu hủy có thể bị từ chối nếu:",
    tone: "warning",
    items: [
      "Voucher đã được sử dụng.",
      "Đã quá thời hạn được phép hủy.",
      "Khách hàng chỉ thay đổi ý định nhưng voucher không cho phép hủy vì lý do này.",
      "Khách hàng không đáp ứng các điều kiện hủy đã được công bố.",
      "Giao dịch đã được hoàn tiền trước đó.",
    ],
    note: "Khi yêu cầu bị từ chối: Đơn hàng giữ nguyên; Thanh toán giữ nguyên; Voucher code giữ nguyên; Không tạo giao dịch hoàn tiền; Khách hàng được thông báo lý do từ chối.",
  },
];

export const refundPolicy = [
  {
    title: "1. Nguyên tắc",
    paragraphs: ["Hoàn tiền không phải là thao tác tự động ngay khi Khách hàng gửi yêu cầu."],
    intro: "Hoàn tiền chỉ được thực hiện khi:",
    items: [
      "yêu cầu hủy đã được Sàn chấp nhận; hoặc",
      "khiếu nại đã được xác minh và xác định đủ điều kiện hoàn tiền.",
    ],
  },
  {
    title: "2. Các trường hợp có thể được hoàn tiền",
    cases: [
      { title: "Trường hợp 1 — Hủy đơn hợp lệ", text: "Khách hàng yêu cầu hủy đơn đã thanh toán và đáp ứng đầy đủ điều kiện hủy." },
      {
        title: "Trường hợp 2 — Không thể cung cấp voucher hợp lệ",
        items: [
          "Thanh toán thành công nhưng hệ thống không thể cung cấp voucher code hợp lệ.",
          "Đã thử gửi lại hoặc cấp lại mã nhưng quyền lợi vẫn không thể được cung cấp.",
        ],
      },
      {
        title: "Trường hợp 3 — Đối tác không thực hiện quyền lợi",
        items: [
          "Đối tác không còn cung cấp dịch vụ.",
          "Chi nhánh hợp lệ không còn khả năng thực hiện voucher.",
          "Đối tác từ chối voucher hợp lệ và vấn đề không thể được khắc phục.",
        ],
      },
      {
        title: "Trường hợp 4 — Voucher không đúng nội dung đã công bố",
        items: [
          "Voucher hợp lệ nhưng không thể sử dụng đúng quyền lợi được mô tả trên Sàn.",
          "Điều kiện thực tế của Đối tác khác với điều kiện đã được công bố và làm Khách hàng không thể sử dụng voucher.",
        ],
      },
    ],
  },
  {
    title: "3. Điều kiện bắt buộc trước khi hoàn tiền",
    intro: "Trước khi hoàn tiền:",
    items: [
      "Thanh toán gốc phải tồn tại và đã thành công.",
      "Giao dịch chưa được hoàn tiền thành công trước đó.",
      "Voucher code chưa được sử dụng.",
      "Yêu cầu hoàn tiền phải xuất phát từ một quyết định hủy hoặc khiếu nại hợp lệ.",
      "Voucher code còn khả năng sử dụng phải được vô hiệu hóa khi giao dịch hoàn tiền hoàn tất.",
    ],
  },
  {
    title: "4. Thời điểm được xem là hoàn tiền thành công",
    paragraphs: ["Việc hoàn tiền chỉ được xem là hoàn tất khi hệ thống ghi nhận kết quả hoàn tiền Thành công."],
    intro: "Khi hoàn tiền thành công:",
    items: [
      "Đơn hàng → Đã hoàn tiền.",
      "Hoàn tiền → Đã hoàn tiền.",
      "Voucher code chưa sử dụng → Vô hiệu hóa.",
      "Yêu cầu liên quan được cập nhật kết quả.",
      "Khách hàng không thể tiếp tục sử dụng voucher đã được hoàn tiền.",
    ],
    note: "Nếu quá trình hoàn tiền gặp lỗi hoặc chưa xác định được kết quả, giao dịch chưa được xem là đã hoàn tiền.",
  },
];

export const complaintPolicy = [
  {
    title: "1. Phạm vi khiếu nại",
    intro: "Khách hàng có thể gửi khiếu nại đối với voucher đã mua khi gặp một trong các vấn đề như:",
    items: [
      "Thanh toán thành công nhưng chưa nhận được voucher code.",
      "Voucher code được cung cấp bị lỗi hoặc không hợp lệ.",
      "Đối tác từ chối một voucher đang hợp lệ.",
      "Voucher không thể sử dụng tại chi nhánh đã được công bố.",
      "Quyền lợi thực tế không đúng với nội dung voucher được công bố.",
      "Đối tác không còn khả năng cung cấp dịch vụ.",
      "Các lỗi khác liên quan đến giao dịch, voucher code hoặc việc thực hiện quyền lợi.",
    ],
  },
  {
    title: "2. Nguyên tắc xử lý khiếu nại",
    paragraphs: ["Sàn ưu tiên khắc phục quyền lợi voucher trước khi hoàn tiền.", "Thứ tự xử lý được áp dụng như sau:"],
    cases: [
      {
        title: "Bước 1 — Kiểm tra voucher code",
        text: "Nếu Khách hàng chỉ chưa nhận được mã nhưng hệ thống đã có một mã hợp lệ: Sàn gửi lại chính voucher code hiện tại. Không sinh thêm mã mới.",
      },
      {
        title: "Bước 2 — Cấp lại voucher code",
        text: "Nếu chưa có mã hợp lệ hoặc mã hiện tại bị lỗi và không thể sử dụng, Sàn có thể cấp voucher code mới. Nếu tồn tại mã cũ không còn hợp lệ, mã cũ phải bị vô hiệu hóa. Tại một thời điểm không được tồn tại hai voucher code hợp lệ cho cùng một quyền lợi nếu giao dịch chỉ cho phép một mã.",
      },
      {
        title: "Bước 3 — Xem xét hoàn tiền",
        intro: "Chỉ chuyển khiếu nại sang hoàn tiền khi:",
        items: [
          "Thanh toán đã thành công.",
          "Khiếu nại đã được xác minh là hợp lệ.",
          "Voucher chưa được sử dụng.",
          "Không thể giải quyết hợp lý bằng gửi lại mã.",
          "Không thể giải quyết hợp lý bằng cấp lại mã.",
          "Nguyên nhân thuộc trường hợp được Chính sách Sàn hỗ trợ hoàn tiền.",
        ],
      },
    ],
  },
  {
    title: "3. Các trường hợp khiếu nại có thể dẫn đến hoàn tiền",
    intro: "Bao gồm:",
    items: [
      "Đối tác không còn cung cấp dịch vụ.",
      "Đối tác từ chối voucher hợp lệ và không thể khắc phục.",
      "Voucher không thể sử dụng đúng quyền lợi đã công bố.",
      "Hệ thống không thể cung cấp voucher hợp lệ sau khi đã thử xử lý.",
    ],
    note: "Khi đó: Khiếu nại → Đang xử lý → Đơn hàng Chờ hoàn tiền → thực hiện hoàn tiền. Khiếu nại chỉ được xem là Đã giải quyết sau khi phương án xử lý thực tế hoàn thành. Nếu phương án là hoàn tiền thì chỉ sau khi hoàn tiền thành công, khiếu nại mới được cập nhật Đã giải quyết.",
  },
  {
    title: "4. Các trường hợp khiếu nại có thể bị từ chối",
    intro: "Khiếu nại có thể bị từ chối nếu:",
    tone: "warning",
    items: [
      "Voucher đã được sử dụng.",
      "Voucher hết hạn đúng theo thời hạn đã công bố.",
      "Khách hàng sử dụng sai chi nhánh.",
      "Khách hàng không đáp ứng điều kiện voucher.",
      "Không phát hiện lỗi thuộc hệ thống hoặc Đối tác.",
      "Nội dung khiếu nại không thuộc phạm vi hỗ trợ của Chính sách Sàn.",
    ],
    note: "Khi khiếu nại bị từ chối: Đơn hàng giữ nguyên; Thanh toán giữ nguyên; Voucher code giữ nguyên; Không tạo yêu cầu hoàn tiền; Khách hàng được thông báo lý do từ chối.",
  },
];

export const decisionRows = [
  ["Chưa thanh toán, Khách hàng muốn hủy", "Được tự hủy, không hoàn tiền"],
  ["Đã thanh toán, voucher chưa sử dụng, còn trong điều kiện hủy", "Gửi yêu cầu hủy để Sàn xét duyệt"],
  ["Đã thanh toán nhưng Khách hàng chỉ đổi ý", "Không được hủy mặc định, trừ khi chính sách voucher cho phép"],
  ["Voucher đã sử dụng", "Không hủy/hoàn"],
  ["Voucher hết hạn đúng chính sách", "Không hoàn"],
  ["Khách dùng sai chi nhánh/không đúng điều kiện", "Không hoàn"],
  ["Thanh toán thành công nhưng chưa nhận mã, mã hiện tại vẫn hợp lệ", "Gửi lại mã cũ"],
  ["Mã bị lỗi hoặc không có mã hợp lệ", "Cấp lại mã mới"],
  ["Đối tác từ chối voucher hợp lệ", "Khiếu nại; khắc phục hoặc hoàn tiền"],
  ["Đối tác không còn cung cấp dịch vụ", "Có thể hoàn tiền nếu voucher chưa sử dụng"],
  ["Voucher không thể cung cấp quyền lợi đã công bố", "Có thể hoàn tiền"],
  ["Khiếu nại đủ điều kiện hoàn tiền", "Chuyển đơn sang Chờ hoàn tiền"],
  ["Hoàn tiền thành công", "Đơn Đã hoàn tiền, voucher code bị vô hiệu hóa"],
];
