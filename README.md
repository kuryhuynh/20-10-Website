# 💐 20/10 Website - Tri Ân Ngày Phụ Nữ Việt Nam (Vietnamese Women's Day)

> Một món quà công nghệ ý nghĩa, tinh tế và ngập tràn tình cảm nhân ngày Phụ nữ Việt Nam 20/10.  
> Lấy cảm hứng thiết kế từ video của kênh TikTok [@saphocit](https://www.tiktok.com/@saphocit/video/7695735036376616213).

---

## ✨ Tính Năng Nổi Bật

- 🧩 **Trái Tim Ghép Hình Nghệ Thuật (Jigsaw Puzzle Heart)**:
  - Dựng bằng đồ họa vector SVG gồm 27 mảnh ghép có khớp nối (knobs & sockets) tinh xảo.
  - **Tương tác**: Nhấp vào từng mảnh ghép để khám phá 27 lời khen tặng ngọt ngào, ấm áp dành cho phái đẹp.
  - **Hiệu ứng tháo rời & lắp ráp**: Nhấn *"Ghép Hình"* để xem các mảnh bay tản ra và tự động ráp nối lại hoàn hảo với âm thanh huyền ảo.

- 🖼️ **Khung Thiệp Hoàng Kim (Golden Luxury Frame)**:
  - Thiết kế viền vàng kim đôi phát sáng dạ quang trên nền vũ trụ sao đêm và mưa cánh hoa hồng rơi lãng mạn.
  - Tiêu đề thư pháp *"Anh ❤️ Em"* (hỗ trợ nhấp đúp hoặc bấm *"Đổi Tên"* để tùy biến người gửi/người nhận).

- 📅 **Lịch Tháng 10/2026 & Điểm Nhấn Ngày 20/10**:
  - Bảng lịch thiết kế trang trọng với font chữ nghệ thuật cổ điển.
  - Ngày **20** được làm nổi bật với huy hiệu trái tim phát sáng rung rinh và vòng sóng xung điện.
  - Nhấp vào ngày 20 để bắn pháo hoa, thả tim và mở bức thư chúc mừng.

- 🌼 **Vườn Hoa Cúc Họa Mi & Hoa Chuông (Flora Garden)**:
  - Thảm hoa cúc trắng nhụy vàng, hoa chuông tím biếc và những cánh bướm dập dờn bay lượn ở chân thiệp theo từng nhịp gió lay.

- 💌 **Bức Thư Tri Ân Vintage (Wax Seal Parchment Letter)**:
  - Bức thư mở ra với phong cách giấy da cổ điển, đóng dấu sáp nổi đỏ *20/10*.
  - **3 Bộ lời chúc chọn sẵn**: Dành cho *Người yêu / Vợ*, *Mẹ kính yêu*, hoặc *Chị em / Bạn bè*.
  - **Chế độ tự viết lời chúc**: Cho phép bạn nhập tâm tư riêng và lưu trực tiếp trên trình duyệt.
  - Nút bắn tim pháo hoa và sao chép lời chúc một chạm.

- 🎵 **Nhạc Nền Acoustic & Trình Phát Đĩa Than**:
  - Tích hợp bài hát acoustic chính gốc từ video TikTok (*"Chờ chút thôi, rồi anh sẽ tìm tới"*).
  - Đĩa than xoay đồng bộ theo nhịp bài hát.
  - Tích hợp Web Audio API phát tiếng chuông trong trẻo khi tương tác.

- 📷 **Tùy Biến Ảnh Linh Hoạt**:
  - 4 bộ ảnh preset sẵn có (Cặp đôi, Thiếu nữ, Mẹ & con, Hoa tươi).
  - Tải ảnh kỷ niệm riêng từ máy tính hoặc điện thoại (lưu trữ an toàn trên trình duyệt qua LocalStorage).

- 🔗 **Tạo Link Chia Sẻ Cá Nhân Hóa**:
  - Hỗ trợ tham số URL (`?from=Anh&to=Em&cat=lover`) để tạo đường dẫn cá nhân hóa gửi tặng trực tiếp người thương.

---

## 🚀 Hướng Dẫn Sử Dụng & Khởi Chạy

### 1. Mở trực tiếp (Không cần cài đặt)
Chỉ cần nhấp đúp vào tệp `index.html` để mở trên bất kỳ trình duyệt web nào (Chrome, Safari, Edge, Cốc Cốc, Firefox...).

### 2. Chạy qua Local Server
Nếu bạn muốn trải nghiệm qua HTTP server:
```bash
# Sử dụng Node.js (npx serve)
npx serve .

# Hoặc sử dụng Python
python -m http.server 3000
```
Truy cập: `http://localhost:3000`

### 3. Xuất bản lên GitHub Pages (Miễn phí)
1. Vào repository của bạn trên GitHub: `Settings` > `Pages`.
2. Tại mục **Branch**, chọn nhánh `main` (hoặc `master`) và thư mục `/(root)`.
3. Nhấn **Save**. Sau khoảng 1-2 phút, trang web sẽ được kích hoạt tại:  
   `https://kuryhuynh.github.io/20-10-Website/`

---

## 🛠️ Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc ngữ nghĩa hiện đại, thẻ native `<dialog>`.
- **CSS3**: Modern CSS Variables, `@starting-style`, `transition-behavior: allow-discrete`, Glassmorphism, Responsive Media Queries.
- **JavaScript (ES6+)**: Thuần (Vanilla JS), không phụ thuộc thư viện nặng.
- **SVG & Canvas API**: Đồ họa vector mảnh ghép jigsaw, hệ thống hạt sao lấp lánh và mưa cánh hoa hồng rơi tự nhiên.
- **Web Audio API**: Bộ tổng hợp âm thanh arpeggio và hiệu ứng chuông chime.

---

❤️ *Chúc tất cả những người phụ nữ Việt Nam luôn ngập tràn niềm vui, xinh đẹp và hạnh phúc trọn vẹn mỗi ngày!*
