-- =============================================================================
-- init-db.sql — Khởi tạo cơ sở dữ liệu BlindBagDb
-- Chạy lần đầu khi container SQL Server khởi động
-- =============================================================================

-- =========================================================
-- 1. Tạo Database BlindBagDb (nếu chưa tồn tại)
-- =========================================================
IF NOT EXISTS (
    SELECT name FROM sys.databases WHERE name = N'BlindBagDb'
)
BEGIN
    CREATE DATABASE BlindBagDb
    COLLATE SQL_Latin1_General_CP1_CI_AS;
    PRINT '[OK] Database BlindBagDb created successfully.';
END
ELSE
BEGIN
    PRINT '[SKIP] Database BlindBagDb already exists.';
END
GO

-- =========================================================
-- 2. Sử dụng Database BlindBagDb
-- =========================================================
USE BlindBagDb;
GO

-- =========================================================
-- 3. Bảng Users — Tài khoản người dùng
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id          INT             IDENTITY(1,1)   PRIMARY KEY,
        FullName    NVARCHAR(150)   NOT NULL,
        Email       NVARCHAR(255)   NOT NULL UNIQUE,
        Password    NVARCHAR(512)   NOT NULL,         -- Stored as hashed value
        Phone       NVARCHAR(20)    NULL,
        Role        NVARCHAR(50)    NOT NULL DEFAULT 'Buyer',  -- Buyer | Seller | Admin
        IsActive    BIT             NOT NULL DEFAULT 1,
        CreatedAt   DATETIME2       NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt   DATETIME2       NULL
    );
    PRINT '[OK] Table Users created.';
END
GO

-- =========================================================
-- 4. Bảng Categories — Danh mục sản phẩm
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
BEGIN
    CREATE TABLE Categories (
        Id          INT             IDENTITY(1,1)   PRIMARY KEY,
        Name        NVARCHAR(100)   NOT NULL UNIQUE,
        Description NVARCHAR(500)   NULL,
        CreatedAt   DATETIME2       NOT NULL DEFAULT GETUTCDATE()
    );
    PRINT '[OK] Table Categories created.';
END
GO

-- =========================================================
-- 5. Bảng BlindBags — Sản phẩm túi mù
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BlindBags' AND xtype='U')
BEGIN
    CREATE TABLE BlindBags (
        Id              INT             IDENTITY(1,1)   PRIMARY KEY,
        SellerId        INT             NOT NULL,
        CategoryId      INT             NOT NULL,
        Name            NVARCHAR(200)   NOT NULL,
        Description     NVARCHAR(1000)  NULL,
        Price           DECIMAL(18,2)   NOT NULL CHECK (Price >= 0),
        StockQuantity   INT             NOT NULL DEFAULT 0 CHECK (StockQuantity >= 0),
        ImageUrl        NVARCHAR(500)   NULL,
        IsActive        BIT             NOT NULL DEFAULT 1,
        CreatedAt       DATETIME2       NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt       DATETIME2       NULL,

        CONSTRAINT FK_BlindBags_Seller      FOREIGN KEY (SellerId)   REFERENCES Users(Id),
        CONSTRAINT FK_BlindBags_Category    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
    );
    PRINT '[OK] Table BlindBags created.';
END
GO

-- =========================================================
-- 6. Bảng Orders — Đơn hàng
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' AND xtype='U')
BEGIN
    CREATE TABLE Orders (
        Id              INT             IDENTITY(1,1)   PRIMARY KEY,
        BuyerId         INT             NOT NULL,
        TotalAmount     DECIMAL(18,2)   NOT NULL CHECK (TotalAmount >= 0),
        Status          NVARCHAR(50)    NOT NULL DEFAULT 'Pending',  -- Pending | Confirmed | Shipped | Delivered | Cancelled
        ShippingAddress NVARCHAR(500)   NULL,
        Note            NVARCHAR(300)   NULL,
        CreatedAt       DATETIME2       NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt       DATETIME2       NULL,

        CONSTRAINT FK_Orders_Buyer FOREIGN KEY (BuyerId) REFERENCES Users(Id)
    );
    PRINT '[OK] Table Orders created.';
END
GO

-- =========================================================
-- 7. Bảng OrderItems — Chi tiết đơn hàng
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrderItems' AND xtype='U')
BEGIN
    CREATE TABLE OrderItems (
        Id          INT             IDENTITY(1,1)   PRIMARY KEY,
        OrderId     INT             NOT NULL,
        BlindBagId  INT             NOT NULL,
        Quantity    INT             NOT NULL CHECK (Quantity > 0),
        UnitPrice   DECIMAL(18,2)   NOT NULL CHECK (UnitPrice >= 0),

        CONSTRAINT FK_OrderItems_Order      FOREIGN KEY (OrderId)    REFERENCES Orders(Id),
        CONSTRAINT FK_OrderItems_BlindBag   FOREIGN KEY (BlindBagId) REFERENCES BlindBags(Id)
    );
    PRINT '[OK] Table OrderItems created.';
END
GO

-- =========================================================
-- 8. Bảng Reviews — Đánh giá sản phẩm
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reviews' AND xtype='U')
BEGIN
    CREATE TABLE Reviews (
        Id          INT             IDENTITY(1,1)   PRIMARY KEY,
        BlindBagId  INT             NOT NULL,
        UserId      INT             NOT NULL,
        Rating      TINYINT         NOT NULL CHECK (Rating BETWEEN 1 AND 5),
        Comment     NVARCHAR(1000)  NULL,
        CreatedAt   DATETIME2       NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT FK_Reviews_BlindBag  FOREIGN KEY (BlindBagId)    REFERENCES BlindBags(Id),
        CONSTRAINT FK_Reviews_User      FOREIGN KEY (UserId)         REFERENCES Users(Id)
    );
    PRINT '[OK] Table Reviews created.';
END
GO

-- =========================================================
-- 9. Bảng Wallets — Ví điện tử của người dùng
-- =========================================================
-- Mỗi user có đúng 1 ví (quan hệ 1-1 với Users)
-- Balance là số dư hiện tại, luôn >= 0
-- KHÔNG cập nhật trực tiếp Balance; phải thông qua WalletTransactions
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wallets' AND xtype='U')
BEGIN
    CREATE TABLE Wallets (
        Id          INT             IDENTITY(1,1)   PRIMARY KEY,
        UserId      INT             NOT NULL UNIQUE,                         -- 1 user <-> 1 ví
        Balance     DECIMAL(18,2)   NOT NULL DEFAULT 0.00                   -- Số dư hiện tại
                                    CONSTRAINT CHK_Wallets_Balance CHECK (Balance >= 0),
        CreatedAt   DATETIME2       NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt   DATETIME2       NULL,

        CONSTRAINT FK_Wallets_User FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
    PRINT '[OK] Table Wallets created.';
END
GO

-- =========================================================
-- 10. Bảng WalletTransactions — Lịch sử giao dịch ví
-- =========================================================
-- Ghi nhận mọi thay đổi số dư: không được DELETE/UPDATE records
-- TransactionType:
--   TopUp      — Nạp tiền vào ví (qua VNPay, MoMo, chuyển khoản...)
--   Payment    — Thanh toán đơn hàng (trừ tiền khi mua)
--   Refund     — Hoàn tiền khi đơn hàng bị huỷ
--   Withdrawal — Rút tiền ra tài khoản ngân hàng (dành cho Seller)
--   Adjustment — Điều chỉnh thủ công bởi Admin
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='WalletTransactions' AND xtype='U')
BEGIN
    CREATE TABLE WalletTransactions (
        Id                  INT             IDENTITY(1,1)   PRIMARY KEY,
        WalletId            INT             NOT NULL,
        TransactionType     NVARCHAR(20)    NOT NULL        -- TopUp | Payment | Refund | Withdrawal | Adjustment
                            CONSTRAINT CHK_WalletTxn_Type CHECK (TransactionType IN ('TopUp','Payment','Refund','Withdrawal','Adjustment')),
        Amount              DECIMAL(18,2)   NOT NULL        -- Số tiền giao dịch (luôn dương)
                            CONSTRAINT CHK_WalletTxn_Amount CHECK (Amount > 0),
        BalanceBefore       DECIMAL(18,2)   NOT NULL,       -- Số dư TRƯỚC giao dịch (audit trail)
        BalanceAfter        DECIMAL(18,2)   NOT NULL,       -- Số dư SAU giao dịch  (audit trail)
        ReferenceType       NVARCHAR(50)    NULL,           -- 'Order' | 'PaymentRequest' | NULL
        ReferenceId         INT             NULL,           -- Id của Order hoặc PaymentRequest liên quan
        Description         NVARCHAR(500)   NULL,           -- Mô tả giao dịch (hiển thị cho user)
        CreatedAt           DATETIME2       NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT FK_WalletTxn_Wallet FOREIGN KEY (WalletId) REFERENCES Wallets(Id)
    );

    -- Index tăng tốc truy vấn lịch sử giao dịch theo ví
    CREATE INDEX IX_WalletTransactions_WalletId ON WalletTransactions (WalletId, CreatedAt DESC);
    PRINT '[OK] Table WalletTransactions created.';
END
GO

-- =========================================================
-- 11. Bảng PaymentRequests — Yêu cầu nạp tiền qua cổng thanh toán
-- =========================================================
-- Lưu trữ thông tin giao dịch với bên thứ 3 (VNPay, MoMo, ZaloPay...)
-- Status:
--   Pending   — Đã tạo yêu cầu, đang chờ user thanh toán
--   Completed — Thanh toán thành công, tiền đã vào ví
--   Failed    — Thanh toán thất bại
--   Cancelled — User huỷ hoặc hết timeout
--   Expired   — Quá thời gian cho phép
-- =========================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PaymentRequests' AND xtype='U')
BEGIN
    CREATE TABLE PaymentRequests (
        Id                      INT             IDENTITY(1,1)   PRIMARY KEY,
        WalletId                INT             NOT NULL,
        Amount                  DECIMAL(18,2)   NOT NULL
                                CONSTRAINT CHK_PayReq_Amount CHECK (Amount > 0),
        PaymentMethod           NVARCHAR(50)    NOT NULL DEFAULT 'VNPay', -- VNPay | MoMo | ZaloPay | BankTransfer
        Status                  NVARCHAR(20)    NOT NULL DEFAULT 'Pending'
                                CONSTRAINT CHK_PayReq_Status CHECK (Status IN ('Pending','Completed','Failed','Cancelled','Expired')),

        -- Thông tin từ cổng thanh toán (VNPay, MoMo...)
        ExternalTransactionId   NVARCHAR(100)   NULL,   -- Mã giao dịch phía VNPay (vnp_TxnRef)
        ExternalResponseCode    NVARCHAR(10)    NULL,   -- Mã phản hồi VNPay (vnp_ResponseCode: '00' = thành công)
        ExternalBankCode        NVARCHAR(20)    NULL,   -- Mã ngân hàng (vnp_BankCode)
        RawCallbackData         NVARCHAR(MAX)   NULL,   -- Toàn bộ dữ liệu callback (lưu để debug/reconcile)

        -- Thời gian
        CreatedAt               DATETIME2       NOT NULL DEFAULT GETUTCDATE(),
        ExpiredAt               DATETIME2       NOT NULL DEFAULT DATEADD(MINUTE, 15, GETUTCDATE()), -- Hết hạn sau 15 phút
        CompletedAt             DATETIME2       NULL,   -- Thời điểm thanh toán thành công

        -- Liên kết với WalletTransaction khi hoàn thành
        WalletTransactionId     INT             NULL,

        CONSTRAINT FK_PayReq_Wallet             FOREIGN KEY (WalletId)              REFERENCES Wallets(Id),
        CONSTRAINT FK_PayReq_WalletTransaction  FOREIGN KEY (WalletTransactionId)   REFERENCES WalletTransactions(Id)
    );

    PRINT '[OK] Table PaymentRequests created.';
END
GO

-- Index filtered yêu cầu SET QUOTED_IDENTIFIER ON riêng
SET QUOTED_IDENTIFIER ON;
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PaymentRequests_ExternalTxnId')
BEGIN
    CREATE UNIQUE INDEX IX_PaymentRequests_ExternalTxnId
        ON PaymentRequests (ExternalTransactionId)
        WHERE ExternalTransactionId IS NOT NULL;
    PRINT '[OK] Index IX_PaymentRequests_ExternalTxnId created.';
END
GO

-- =========================================================
-- 12. Seed Data — Dữ liệu mẫu cho Categories
-- =========================================================
IF NOT EXISTS (SELECT 1 FROM Categories)
BEGIN
    INSERT INTO Categories (Name, Description) VALUES
        (N'Đồ chơi & Mô hình',  N'Blind bag đồ chơi, mô hình nhân vật, figure'),
        (N'Thời trang',          N'Phụ kiện thời trang bí ẩn, vòng tay, nhẫn'),
        (N'Văn phòng phẩm',      N'Sticker, bookmark, dụng cụ học tập ngẫu nhiên'),
        (N'Mỹ phẩm & Làm đẹp',  N'Son, serum, mặt nạ và phụ kiện làm đẹp'),
        (N'Khác',                N'Các danh mục khác');
    PRINT '[OK] Seed data inserted into Categories.';
END
GO

-- =========================================================
-- 13. Seed Data — Tài khoản Admin mặc định + Ví Admin
-- =========================================================
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@blindbag.local')
BEGIN
    INSERT INTO Users (FullName, Email, Password, Role)
    VALUES (
        N'System Administrator',
        'admin@blindbag.local',
        -- NOTE: Replace this with a proper bcrypt hash before going to production!
        -- This is a placeholder hash for "Admin@123456"
        '$2a$12$placeholder_hash_replace_before_production',
        'Admin'
    );
    PRINT '[OK] Default admin account created (admin@blindbag.local).';
END
GO

-- Tạo ví cho Admin nếu chưa có
IF NOT EXISTS (
    SELECT 1 FROM Wallets W
    INNER JOIN Users U ON W.UserId = U.Id
    WHERE U.Email = 'admin@blindbag.local'
)
BEGIN
    INSERT INTO Wallets (UserId)
    SELECT Id FROM Users WHERE Email = 'admin@blindbag.local';
    PRINT '[OK] Wallet created for admin.';
END
GO

PRINT '============================================';
PRINT ' BlindBagDb initialization COMPLETED!';
PRINT ' Tables: Users, Categories, BlindBags,';
PRINT '         Orders, OrderItems, Reviews,';
PRINT '         Wallets, WalletTransactions,';
PRINT '         PaymentRequests';
PRINT '============================================';
