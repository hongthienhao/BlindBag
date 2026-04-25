using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BlindBag.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlindBag.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Nếu đã có User hoặc Category thì không cần seed để tránh trùng lặp
            if (await context.Users.AnyAsync() || await context.Categories.AnyAsync())
            {
                return;
            }

            // Dummy Hash
            string dummyHash = "$2a$11$G7kQx4XJ18A.L2I9w.V/5.1q9G8zM3h3Vj9aW9qO2kRq1zNj7QzW6"; // Tượng trưng cho password giả định

            // 1. Tạo Users & Wallets
            var admin = new User { FullName = "Admin User", Email = "admin@blindbag.local", Role = "Admin", Password = dummyHash };
            var seller = new User { FullName = "Phú Lê Seller", Email = "seller@blindbag.local", Role = "Seller", Password = dummyHash };
            var buyer = new User { FullName = "Nguyễn Văn Mua", Email = "buyer@blindbag.local", Role = "Buyer", Password = dummyHash };

            await context.Users.AddRangeAsync(admin, seller, buyer);
            await context.SaveChangesAsync();

            var adminWallet = new Wallet { UserId = admin.Id, Balance = 0 };
            var sellerWallet = new Wallet { UserId = seller.Id, Balance = 1000000 };
            var buyerWallet = new Wallet { UserId = buyer.Id, Balance = 1000000 };
            
            await context.Wallets.AddRangeAsync(adminWallet, sellerWallet, buyerWallet);

            // 2. Tạo Categories
            var catToys = new Category { Name = "Đồ chơi & Mô hình", Description = "Blind bag đồ chơi, mô hình nhân vật, figure" };
            var catFashion = new Category { Name = "Thời trang", Description = "Phụ kiện thời trang bí ẩn, vòng tay, nhẫn" };
            var catStationery = new Category { Name = "Văn phòng phẩm", Description = "Sticker, bookmark, dụng cụ học tập ngẫu nhiên" };
            var catBeauty = new Category { Name = "Mỹ phẩm & Làm đẹp", Description = "Son, serum, mặt nạ và phụ kiện làm đẹp" };

            await context.Categories.AddRangeAsync(catToys, catFashion, catStationery, catBeauty);
            await context.SaveChangesAsync();

            // 3. Tạo BlindBags & Variations
            var bag1 = new Domain.Entities.BlindBag
            {
                SellerId = seller.Id,
                CategoryId = catToys.Id,
                Name = "Túi mù Mô hình Labubu Series 1",
                Description = "Mô hình siêu hot dạng túi mù, mở ra là bất ngờ!",
                Price = 50000,
                StockQuantity = 100,
                Variations = new List<BlindBagVariation>
                {
                    new BlindBagVariation { Name = "Labubu Thường (Xanh)", ProbabilityWeight = 80 },
                    new BlindBagVariation { Name = "Labubu Đặc biệt (Hồng)", ProbabilityWeight = 15 },
                    new BlindBagVariation { Name = "Labubu SECRET (Vàng kim)", ProbabilityWeight = 5 }
                }
            };

            var bag2 = new Domain.Entities.BlindBag
            {
                SellerId = seller.Id,
                CategoryId = catStationery.Id,
                Name = "Túi mù Văn phòng phẩm Kawaii",
                Description = "Gồm nhiều món đồ dùng học tập dễ thương.",
                Price = 15000,
                StockQuantity = 200,
                Variations = new List<BlindBagVariation>
                {
                    new BlindBagVariation { Name = "Bút bi ngẫu nhiên", ProbabilityWeight = 90 },
                    new BlindBagVariation { Name = "Sổ tay giới hạn", ProbabilityWeight = 10 }
                }
            };

            await context.BlindBags.AddRangeAsync(bag1, bag2);
            await context.SaveChangesAsync();
        }
    }
}
