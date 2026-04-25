using BlindBag.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlindBag.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BlindBag.Domain.Entities.BlindBag> BlindBags { get; set; }
        public DbSet<BlindBagVariation> BlindBagVariations { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<WalletTransaction> WalletTransactions { get; set; }
        public DbSet<PaymentRequest> PaymentRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Password).IsRequired().HasMaxLength(512);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(50).HasDefaultValue("Buyer");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // BlindBag
            modelBuilder.Entity<BlindBag.Domain.Entities.BlindBag>(entity =>
            {
                entity.ToTable("BlindBags");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.StockQuantity).HasDefaultValue(0);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Seller)
                    .WithMany(p => p.BlindBags)
                    .HasForeignKey(d => d.SellerId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_BlindBags_Seller");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.BlindBags)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_BlindBags_Category");
            });

            // BlindBagVariation
            modelBuilder.Entity<BlindBagVariation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.ProbabilityWeight).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                entity.HasOne(d => d.BlindBag)
                    .WithMany(p => p.Variations)
                    .HasForeignKey(d => d.BlindBagId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_BlindBagVariations_BlindBag");
            });

            // Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.ShippingAddress).HasMaxLength(500);
                entity.Property(e => e.Note).HasMaxLength(300);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Buyer)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.BuyerId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Orders_Buyer");
            });

            // OrderItem
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_OrderItems_Order");

                entity.HasOne(d => d.BlindBag)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.BlindBagId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_OrderItems_BlindBag");
            });

            // Review
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Comment).HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.BlindBag)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.BlindBagId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Reviews_BlindBag");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Reviews_User");
            });

            // Wallet
            modelBuilder.Entity<Wallet>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.UserId).IsUnique();
                entity.Property(e => e.Balance).HasColumnType("decimal(18,2)").HasDefaultValue(0.00m);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.User)
                    .WithOne(p => p.Wallet)
                    .HasForeignKey<Wallet>(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Wallets_User");
            });

            // WalletTransaction
            modelBuilder.Entity<WalletTransaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.WalletId, e.CreatedAt }).IsDescending(false, true); // Create index on WalletId and CreatedAt DESC (requires EF Core 7+)
                entity.Property(e => e.TransactionType).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.BalanceBefore).HasColumnType("decimal(18,2)");
                entity.Property(e => e.BalanceAfter).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ReferenceType).HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Wallet)
                    .WithMany(p => p.WalletTransactions)
                    .HasForeignKey(d => d.WalletId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_WalletTxn_Wallet");
            });

            // PaymentRequest
            modelBuilder.Entity<PaymentRequest>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.ExternalTransactionId).IsUnique().HasFilter("[ExternalTransactionId] IS NOT NULL");
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PaymentMethod).IsRequired().HasMaxLength(50).HasDefaultValue("VNPay");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20).HasDefaultValue("Pending");
                entity.Property(e => e.ExternalTransactionId).HasMaxLength(100);
                entity.Property(e => e.ExternalResponseCode).HasMaxLength(10);
                entity.Property(e => e.ExternalBankCode).HasMaxLength(20);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Wallet)
                    .WithMany(p => p.PaymentRequests)
                    .HasForeignKey(d => d.WalletId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_PayReq_Wallet");

                entity.HasOne(d => d.WalletTransaction)
                    .WithMany(p => p.PaymentRequests)
                    .HasForeignKey(d => d.WalletTransactionId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_PayReq_WalletTransaction");
            });
        }
    }
}
