# BlindBag Marketplace - Hướng dẫn Khởi chạy Hệ thống

Dự án **BlindBag Marketplace** sử dụng nền tảng .NET (backend), React / Frontend tương úng và hệ quản trị CSDL SQL Server 2019 (chạy trên Docker) để vận hành.

Tài liệu này hướng dẫn cách thiết lập và chạy CSDL.

---

## 🚀 1. Khởi chạy Database (SQL Server 2019)

Hệ thống dùng `docker-compose` tự động cấu hình môi trường, khởi tạo cơ sở dữ liệu (`BlindBagDb`) và tạo lược đồ (schema) gồm Users, Categories, Orders, OrderItems, Reviews, Wallets...

### 📋 Yêu cầu tiên quyết
- Cài đặt **Docker Desktop** (trên Windows/Mac) hoặc **Docker Engine & Docker Compose** (trên Linux).
- Đảm bảo service Docker đã chạy.
- Đảm bảo cổng **1433** trên máy chưa bị ứng dụng khác chiếm dụng.

### ⚙️ Các bước cài đặt và khởi chạy

**Bước 1: Cấu hình biến môi trường**

1. Ở thư mục gốc `Project`, bạn sẽ thấy tệp `.env.example`.
2. Sao chép và đổi tên tệp thành `.env`:
   ```bash
   cp .env.example .env
   ```
3. (Tùy chọn) Mở tệp `.env` vừa tạo để kiểm tra hoặc đổi mật khẩu tài khoản `SA` của CSDL (`SA_PASSWORD`) nếu muốn (mặc định đã an toàn cho môi trường test).

**Bước 2: Build và chạy container với Docker Compose**

Chạy cmd/terminal tại cùng cấp thư mục với `docker-compose.yml` (`Project/`):

```bash
docker-compose up --build -d
```
*Ghi chú: Cờ `-d` giúp container chạy ngầm (detached mode).*

**Bước 3: Xác minh SQL Server đã hoạt động ổn định**

Bạn có thể kiểm tra bằng lệnh:

```bash
docker-compose ps
```

Nếu mục `STATUS` hiện chữ `Up (healthy)` nghĩa là CSDL đã sẵn sàng.

> CSDL `BlindBagDb` sẽ tự động khởi tạo (bảng biểu và dữ liệu seed mặc định) trong vỏn vẹn vài giây sau khi trạng thái chuyển sang "healthy".

### 🔎 Kiểm tra bằng công cụ SSMS / Azure Data Studio

Để có cái nhìn trực quan, bạn có thể sử dụng các công cụ quản trị CSDL quen thuộc:

- **Server Name:** `localhost,1433` *(Lưu ý: trên SSMS thường dùng dấu phẩy `,`)*
- **Authentication:** `SQL Server Authentication`
- **Login:** `SA`
- **Password:** `BlindBag@SA_2024!` *(Hoặc mật khẩu bạn đã đặt lại trong `.env`)*

### 🛑 Lệnh quản lý Database Container

- **Xem logs khởi tạo:**
  ```bash
  docker-compose logs -f sqlserver
  ```
- **Dừng database (giữ nguyên dữ liệu cũ để chạy lần sau):**
  ```bash
  docker-compose down
  ```
- **Xóa database (⚠️ Cảnh báo: Sẽ mất toàn bộ data trong bảng):**
  ```bash
  docker-compose down -v
  ```
