# Hệ thống tra cứu & thêm văn bản / công văn

## Mô tả  
Ứng dụng web tĩnh gồm:
- Trang `index.html`: Tra cứu văn bản theo số hiệu, trích yếu, cơ quan.
- Trang `add.html`: Form thêm mới bản ghi (hiện tại chỉ là giả lập, cần backend hoặc tích hợp với Google Sheets để lưu).

## Hướng dẫn triển khai  
1. Tạo một repository trên GitHub, bật **GitHub Pages** từ branch `main` hoặc `gh-pages`.
2. Upload các file `index.html`, `add.html`, `README.md` vào repository.
3. Sửa dữ liệu mẫu trong `index.html` thành dữ liệu thực:
   - Có thể dùng Google Sheets + API hoặc JSON tĩnh.
4. Nếu muốn lưu dữ liệu từ form `add.html`, cần:
   - Sử dụng Google Apps Script hoặc một backend REST API để lưu vào Google Sheets hoặc database.
   - Thay `console.log` trong `add.html` bằng gọi `fetch()` tới endpoint lưu dữ liệu.

## Tương lai mở rộng  
- Phân quyền người dùng (chỉ admin được thêm/sửa xoá).
- Tìm kiếm nâng cao: lọc theo ngày, cơ quan, loại văn bản.
- Phân trang kết quả nếu có nhiều bản ghi.
- Dashboard thống kê số lượng văn bản theo năm, cơ quan,…

## Liên kết dữ liệu Google Sheets  
Bạn có thể dùng link Google Sheets:  
> `https://docs.google.com/spreadsheets/d/13fYs5ggfFPfPjFOUil2EdoBb4FzUTIlGEfhjl5oQHY4/edit?usp=sharing`

Để truy cập và sử dụng API, cần bật **Google Sheets API** và tạo key/credentials.  
Sau đó bạn có thể chuyển đổi sheet thành JSON hoặc sử dụng `Tabletop.js`, `SheetJS` hoặc `gapi` để lấy dữ liệu.

---

Chúc bạn triển khai thành công!  
Nếu bạn muốn mình hỗ trợ thêm phần kết nối Google Sheets hoặc tạo backend nhỏ (ví dụ với Firebase, Google Apps Script), mình sẵn sàng nhé.
# mywebsite1
