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

---

## 💻 2. Cài đặt và khởi chạy Backend (.NET 8 Clean Architecture)

Dự án Backend được cấu trúc theo chuẩn Clean Architecture và sử dụng .NET 8.

### 📋 Yêu cầu tiên quyết
- Cài đặt **.NET 8 SDK** hoặc mới hơn.

### ⚙️ Cấu hình truy cập Database
Kết nối cơ sở dữ liệu đã được thiết lập sẵn trong `appsettings.json` và `appsettings.Development.json` tại thư mục `Backend/BlindBag.WebAPI/`. Chuỗi kết nối này trỏ đến Docker container SQL Server ở Mục 1:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=BlindBagDb;User Id=SA;Password=BlindBag@SA_2024!;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```
*(Lưu ý: Nếu bạn tùy chỉnh mật khẩu trong file `.env` ngoài root, hãy nhớ cập nhật lại mục `Password` tại đây).*

### 🚀 Khởi chạy Backend

1. Mở terminal/CMD và di chuyển vào thư mục `WebAPI`:
   ```bash
   cd Backend/BlindBag.WebAPI
   ```
2. Cài đặt lại các phụ thuộc (Packages) và khởi chạy ứng dụng:
   ```bash
   dotnet restore
   dotnet run
   ```
3. Backend API mặc định sẽ chạy ở port tuỳ chỉnh trong `launchSettings.json` (thường có `http://localhost:5252`). Truy cập đường dẫn `/swagger` để xem tài liệu các Endpoints.

---

## 🎨 3. Cài đặt và khởi chạy Frontend (ReactJS + Vite + Tailwind)

Dự án Frontend sử dụng hệ sinh thái Vite kết hợp ReactJS để cho tốc độ build cực nhanh. Phân tầng giao diện bằng Tailwind CSS.

### 📋 Yêu cầu tiên quyết
- Cài đặt **Node.js** (phiên bản LTS v18 trở lên).

### ⚙️ Cấu hình biến môi trường
File `.env` nằm tại thư mục `Frontend/` đã được thiết lập sẵn biến kết nối API tới Backend:
```env
VITE_API_BASE_URL=http://localhost:5252
```
*(Hãy thay cổng `5252` bằng cổng thực tế Backend đang chạy nếu có sự khác biệt).*

### 🚀 Khởi chạy Frontend

1. Tại terminal/CMD **mới**, di chuyển vào thư mục dự án Frontend:
   ```bash
   cd Frontend
   ```
2. Cài đặt các thư viện cần thiết (`node_modules`):
   ```bash
   npm install
   ```
3. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
4. Truy cập địa chỉ web hiển thị trên terminal (thường là `http://localhost:5173`).

---

## 🤝 4. Kiểm tra luồng tương tác thống nhất

Để hoàn thành việc tích hợp và đảm bảo Frontend có thể gọi tới Backend và Database thành công, các mục cấu hình sau đã được thiết lập sẵn:
1. **CORS (Cross-Origin Resource Sharing)** trên `Program.cs` của Backend (đã cấu hình `AllowAnyOrigin`, `AllowAnyMethod`, `AllowAnyHeader`) cho phép Frontend UI truy cập tự do.
2. Từ lúc Backend và Database khởi động ổn định, hãy kiểm tra lại giao diện Frontend. Nếu màn hình trang chủ báo trạng thái kết nối màu xanh (hiển thị Json HealthCheck hoặc các dữ liệu thành công từ API), thì **Chúc Mừng**, nền tảng và môi trường đã sẵn sàng!
