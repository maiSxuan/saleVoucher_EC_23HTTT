# Shared

Purpose:
- Chứa code chung dùng được ở mọi nơi trong ứng dụng.
- Tránh lặp lại code và giữ codebase sạch sẽ.

Folders:
- **components/**: component tái sử dụng (Header, Footer, Button, Modal, etc.)
- **hooks/**: custom React hook (useAuth, useFetch, etc.)
- **utils/**: hàm tiện ích (API client, formatter, parser, etc.)
- **constants/**: hằng số ứng dụng (role, status, API URL, etc.)

Rules:
- Chỉ đặt code THỰC SỰ CHUNG vào đây.
- Nếu code chỉ dùng trong 1-2 feature, đặt trong feature đó thay vì shared.
- Khi thêm file mới, hãy thêm comment giải thích mục đích.
