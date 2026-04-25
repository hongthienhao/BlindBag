# Hướng Dẫn Truy Cập Cơ Sở Dữ Liệu: BlindBagDb

Tài liệu này bao gồm các thông số và cách thức kết nối để thao tác với cơ sở dữ liệu SQL Server (đang chạy trong Docker) của dự án **BlindBag Marketplace**.

---

## 1. Thông số kết nối mặc định

Cho dù bạn kết nối bằng công cụ phần mềm nào, hệ thống đều dùng chung các thông số sau:

- **Server Name / Host:** `localhost,1433` *(Với một số IDE/Mac có thể là `localhost:1433`)*
- **Database Name:** `BlindBagDb`
- **Authentication:** `SQL Server Authentication`
- **Username:** `SA`
- **Password:** `BlindBag@SA_2024!` *(Lưu ý: Nếu bạn có sử dụng file `.env` ngoài thư mục gốc, tuân theo mật khẩu mới của bạn)*
- **Trust Server Certificate (Mã hoá):** Bật `True` (Trust / Bỏ qua cảnh báo chứng chỉ).

---

## 2. Kết nối bằng các Công Cụ Giao Diện (GUI)

Để tiện lợi và trực quan cho việc truy vấn nâng cao, bạn có thể tải và liên kết thông qua các phần mềm sau:

1. **SQL Server Management Studio (SSMS)**: Phù hợp nhất nếu bạn dùng HĐH Windows.
   - Nhập `localhost,1433` ở mục *Server name*.
   - Chọn kiểu Auth: *SQL Server Authentication*.
2. **Azure Data Studio**: Hỗ trợ tốt đa nền tảng Windows, MacOS, Linux. Tích hợp nhẹ nhàng.
   - Giao diện nhập tham số tường minh, nhớ tích vào mục `Trust server certificate`.
3. **DBeaver** / **DataGrip**: Dùng Driver `SQL Server` và điền chuỗi Host, DB tương ứng.

---

## 3. Kết nối & Xem nhanh dữ liệu bằng dòng lệnh (CMD/Bash)

Nếu bạn không muốn cài phần mềm, công cụ `sqlcmd` đã được cài sẵn ngay trong Container chứa DB.
Mở Terminal/CMD ở thư mục nguồn của project và dán lệnh sau để truy vấn trực tiếp (chạy xong sẽ hiện kết quả ngay trên Terminal):

### Xem toàn bộ cấu trúc các bảng (Tables)
```bash
docker exec blindbag_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "BlindBag@SA_2024!" -d BlindBagDb -C -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;"
```

### Xem dữ liệu Mẫu / Seed Data

**Xem danh sách Users (Sẽ thấy Admin / Seller / Buyer):**
```bash
docker exec blindbag_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "BlindBag@SA_2024!" -d BlindBagDb -C -Q "SELECT Id, FullName, Email, Role FROM Users;"
```

**Xem các túi mù đang hiện bán:**
```bash
docker exec blindbag_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "BlindBag@SA_2024!" -d BlindBagDb -C -Q "SELECT Id, Name, Price, StockQuantity FROM BlindBags;"
```

**Xem đặc điểm Tỷ lệ (Variations) rớt đồ của của Túi Mù:**
```bash
docker exec blindbag_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "BlindBag@SA_2024!" -d BlindBagDb -C -Q "SELECT Id, BlindBagId, Name, ProbabilityWeight FROM BlindBagVariations;"
```

**Kiểm tra số dư trên Ví điện tử:**
```bash
docker exec blindbag_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P "BlindBag@SA_2024!" -d BlindBagDb -C -Q "SELECT W.Id, U.FullName, W.Balance FROM Wallets W INNER JOIN Users U ON W.UserId = U.Id;"
```

> **Ghi chú riêng:** Cờ `-C` phía trong câu lệnh Shell ở trên đóng vai trò tự động tin tưởng các Chứng chỉ nội bộ (Trust Server Certificate) của container SQL 2019+ đang chạy. Đừng xóa bỏ nó để tránh lỗi Certificate.
