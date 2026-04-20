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
-- 9. Seed Data — Dữ liệu mẫu cho Categories
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
-- 10. Seed Data — Tài khoản Admin mặc định
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

PRINT '============================================';
PRINT ' BlindBagDb initialization COMPLETED!';
PRINT '============================================';
