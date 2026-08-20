# Snow UI Color System — Light Mode

Tài liệu này là nguồn tham chiếu màu sắc cho toàn bộ Snow Voucher. Hệ thống chỉ hoạt động ở Light Mode, ưu tiên cảm giác mát, sạch, cao cấp và đủ tương phản khi làm việc lâu.

## 1. Nguyên tắc thiết kế

- Dùng nền tuyết off-white cho vùng lớn; `#FFFFFF` chỉ dùng cho card, bảng, modal và vùng nội dung có ranh giới.
- Sky Blue là màu hành động, không phải màu trang trí phủ khắp giao diện.
- Màu trạng thái chỉ mang ý nghĩa nghiệp vụ: xanh lá = thành công/khả dụng, vàng nâu = cần chú ý, đỏ đất = lỗi/hết hạn.
- Không truyền đạt trạng thái chỉ bằng màu. Tag phải có nhãn, icon hoặc chấm trạng thái.
- Bo góc chuẩn: 8px cho control nhỏ, 12px cho button/card, 16px chỉ dành cho panel hoặc hero nổi bật.

## 2. Primary và Accent tokens

| Token | HEX | Vai trò | Lý do chọn |
|---|---:|---|---|
| `brand.primary` | `#1E9EDB` | CTA chính, navigation active, link quan trọng | Màu đậm nhất của dải Sky Pastel, tươi nhưng vẫn sạch và chuyên nghiệp. |
| `brand.primary-hover` | `#1887BC` | Hover | Biến thể dẫn xuất đậm hơn để phản hồi tương tác rõ ràng. |
| `brand.primary-active` | `#126C97` | Pressed/active | Tạo chiều sâu khi nhấn mà không đổi hue khỏi hệ xanh da trời. |
| `brand.primary-soft` | `#E2F3FB` | Nền active nhẹ, chip thông tin, selected row | Màu sáng nhất trong bảng, phù hợp cho mảng nền pastel lớn. |
| `brand.accent` | `#53B7E8` | Điểm nhấn, chart và badge nổi bật | Cầu nối mềm giữa primary và các bề mặt xanh nhạt. |
| `brand.accent-soft` | `#E2F3FB` | Deal độc quyền, VIP, highlight dịu | Nhấn nội dung mà không tạo thêm một hue ngoài hệ thống. |
| `brand.accent-border` | `#B1E0F4` | Viền highlight, input active | Tách bề mặt rõ nhưng không tạo đường viền gắt. |
| `brand.accent-foreground` | `#126C97` | Chữ/icon trên accent soft | Đậm vừa đủ để đọc rõ trên nền xanh pastel. |

Dải màu vật lý chuẩn: `#E2F3FB`, `#B1E0F4`, `#80CCEE`, `#53B7E8`, `#1E9EDB`. Hover và active dùng hai biến thể dẫn xuất `#1887BC`, `#126C97` để giữ phản hồi tương tác.

## 3. Neutral và Surface tokens

| Token | HEX | Vai trò | Quy tắc |
|---|---:|---|---|
| `surface.app` | `#F7FCFE` | Nền chính toàn ứng dụng | Off-white pha xanh rất nhẹ, giữ độ dịu khi nhìn lâu. |
| `surface.soft` | `#E2F3FB` | Nền section, filter bar, table header | Dùng để phân tầng bằng màu pastel thay vì shadow đậm. |
| `surface.default` | `#FFFFFF` | Card, modal, bảng, input | Chỉ dùng trên một nền off-white hoặc có border rõ. |
| `ink.default` | `#0F172A` | Tiêu đề, nội dung chính | Xám xanh đen, dịu hơn đen tuyền; 17.85:1 trên trắng. |
| `ink.secondary` | `#475569` | Mô tả, ngày hết hạn, label | 7.58:1 trên trắng, đạt AA/AAA cho nội dung thông thường. |
| `ink.muted` | `#64748B` | Metadata, placeholder | 4.76:1 trên trắng; không dùng cho chữ quá nhỏ trên nền xám. |
| `border.default` | `rgba(15, 23, 42, 0.08)` | Viền card tinh tế | Có thể dùng `snow-200 / #E2E8F0` khi cần ranh giới mạnh hơn. |

## 4. Semantic tokens

| Trạng thái | Foreground | Soft background | Border | Ví dụ nghiệp vụ |
|---|---:|---:|---:|---|
| Success | `#287A52` | `#E7F5ED` | `#B7DFC8` | Voucher khả dụng, thanh toán thành công. |
| Warning | `#9A5B13` | `#FFF4DE` | `#EFD29B` | Sắp hết hạn, chờ duyệt, cần chú ý. |
| Error | `#A63F4C` | `#FDECEF` | `#EFBDC5` | Hết hạn, lỗi phát hành, từ chối. |
| Info | `#1E9EDB` | `#E2F3FB` | `#B1E0F4` | Bản nháp, thông tin hệ thống. |

Với nhãn thông tin trên nền pastel, ưu tiên `brand.accent-foreground` thay vì dùng `brand.primary` cho chữ nhỏ.

## 5. Phân bổ 60–30–10 theo phân hệ

| Phân hệ | 60% — nền chủ đạo | 30% — bề mặt/nội dung | 10% — nhấn và trạng thái |
|---|---|---|---|
| Landing Page | `surface.app`, các section Snow 50/100 | Hero chuyển Sky Blue → Snow, card trắng và typography đậm | CTA, badge deal Mint, semantic tag. Chỉ một CTA chính trong mỗi vùng nhìn. |
| Customer Dashboard | Nền `#F7FCFE`, khoảng thở rộng | Card voucher trắng, border nhẹ, ảnh voucher | Nút `Sử dụng` Sky Blue; success/warning/error chỉ cho trạng thái voucher. |
| Partner Portal | Nền Snow và table header trung tính | Card/bảng trắng, chart grid Snow 100/200 | Sky Blue cho submit/active; semantic colors cho KPI. Không dùng mỗi KPI một màu rực. |
| Admin Dashboard | Nền Snow 50, sidebar/card trắng | Bảng, chart và queue panel trung tính | Tag trạng thái, selected nav và action. Tránh hero/nav nền đen hoặc gradient bão hòa lớn. |

### Landing trong 3 giây đầu

- Hero dùng gradient `#1E9EDB → #53B7E8 → #B1E0F4 → #E2F3FB` để tạo điểm hút ở trái và cảm giác “tuyết” ở phải.
- Headline tối đa hai ý, CTA chính có độ tương phản cao, CTA phụ chỉ dùng outline/translucent.
- Mint pastel dành cho nhãn VIP/độc quyền; không trộn thêm tím, cam, xanh lá rực trong cùng hero.

### Customer voucher list

- Tên voucher dùng `ink.default`; đối tác/ngày hết hạn dùng `ink.secondary` hoặc `ink.muted`.
- Card nền trắng, radius 12px, border Snow 200. Hover đổi border sang Sky 300 và tăng shadow nhẹ.
- Voucher chưa sử dụng phải có CTA `Sử dụng` nền primary; trạng thái đã dùng/hết hạn không hiển thị CTA primary.

### Partner và Admin data density

- Ưu tiên border và khoảng trắng để phân nhóm dữ liệu thay vì mảng nền rực.
- Chart dùng Primary cho chuỗi chính, Success cho “đã sử dụng/thành công”, Snow 200 cho dữ liệu nền.
- Admin tag luôn theo semantic token; lọc nhanh bằng nhãn + màu + icon/chấm tròn.

## 6. CSS và Tailwind

CSS variables nằm trong `frontend/src/index.css`:

```css
.voucher-cta {
  background: var(--brand-primary);
  color: #fff;
}

.voucher-cta:hover {
  background: var(--brand-primary-hover);
}

.voucher-status--warning {
  color: var(--brand-warning);
  background: var(--brand-warning-soft);
  border: 1px solid var(--brand-warning-border);
}
```

Tailwind semantic aliases nằm trong `frontend/tailwind.config.js`:

```jsx
<button className="bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white">
  Sử dụng
</button>

<span className="bg-semantic-warning-soft text-semantic-warning border border-semantic-warning-border">
  Sắp hết hạn
</span>

<article className="bg-surface border border-snow-200 text-ink rounded-xl">
  <p className="text-ink-secondary">Hạn dùng: 30/09/2026</p>
</article>
```

Các class tương thích hiện có như `bg-sky-600`, `hover:bg-sky-700`, `bg-snow-50` vẫn được giữ; code mới nên ưu tiên alias semantic để tránh phụ thuộc vào bậc màu.

Để toàn bộ giao diện cũ nhận theme mà không phải sửa hàng loạt logic component, Tailwind có lớp tương thích: `gray` ánh xạ về Snow; `sky/blue/cyan/orange/indigo/violet/purple` cùng ánh xạ về Sky Pastel; `emerald/green` về Success; `amber` về Warning; `red/rose` về Error. Đây chỉ là cầu nối cho code cũ; component mới nên dùng alias semantic.

## 7. Checklist review

- Không có `dark:` variant hoặc nền tối cố định cho vùng lớn.
- Không có `bg-white` trên toàn trang; trắng chỉ là surface.
- CTA dùng `brand.primary`; khi cần chuẩn AA nghiêm ngặt cho chữ nhỏ, dùng foreground đậm hoặc nền `brand.primary-active`.
- Focus ring nhìn thấy rõ, không phụ thuộc hover.
- Mọi semantic tag có text/icon và không chỉ có màu.
- Text thường đạt 4.5:1; text lớn đạt 3:1; border/focus quan trọng đạt 3:1 với nền lân cận.
- Mỗi màn hình giữ màu nhấn trong khoảng 10% diện tích nhìn thấy.
