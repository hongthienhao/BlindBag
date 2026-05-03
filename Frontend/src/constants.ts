import type { MysteryBag, InventoryItem } from './types';

export const MYSTERY_BAGS: MysteryBag[] = [
  {
    id: 'bag-1',
    name: 'Túi Tân Thủ',
    price: 100,
    description: 'Perfect for beginners. Contains a selection of essential items to get you started on your journey.',
    image: 'https://images.unsplash.com/photo-1607344645271-6101c03dae77?auto=format&fit=crop&q=80&w=800',
    isNew: true,
    rarityDistribution: [
      { rarity: 'Common', probability: 60 },
      { rarity: 'Rare', probability: 30 },
      { rarity: 'Epic', probability: 10 },
    ],
  },
  {
    id: 'bag-2',
    name: 'Túi Chuyên Gia',
    price: 500,
    description: 'Designed for seasoned collectors. Higher chances of rare finds and exclusive limited-edition pieces.',
    image: 'https://images.unsplash.com/photo-1578357041797-151ec5071167?auto=format&fit=crop&q=80&w=800',
    rarityDistribution: [
      { rarity: 'Common', probability: 30 },
      { rarity: 'Rare', probability: 50 },
      { rarity: 'Epic', probability: 20 },
    ],
  },
  {
    id: 'bag-3',
    name: 'Túi Huyền Thoại',
    price: 2500,
    description: 'The ultimate unboxing experience. Guaranteed epic items with a chance for one-of-a-kind legendary artifacts.',
    image: 'https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&q=80&w=800',
    isLimited: true,
    rarityDistribution: [
      { rarity: 'Rare', probability: 40 },
      { rarity: 'Epic', probability: 50 },
      { rarity: 'Legendary', probability: 10 },
    ],
  },
];

export const INVENTORY: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Voucher Giảm giá 50% - Thời trang',
    type: 'Voucher',
    rarity: 'Epic',
    status: 'Idle',
    receivedAt: '2024-05-20',
  },
  {
    id: 'item-2',
    name: 'Ebook Hướng dẫn Unboxing',
    type: 'PDF',
    rarity: 'Common',
    status: 'Used',
    receivedAt: '2024-05-18',
  },
  {
    id: 'item-3',
    name: 'Mẫu Template Portfolio',
    type: 'Template',
    rarity: 'Rare',
    status: 'Idle',
    receivedAt: '2024-05-15',
  },
  {
    id: 'item-4',
    name: 'Voucher Trà sữa 0đ',
    type: 'Voucher',
    rarity: 'Common',
    status: 'Selling',
    receivedAt: '2024-05-12',
    price: 150,
  },
];

export const MARKETPLACE_ITEMS: InventoryItem[] = [
  {
    id: 'm-1',
    name: 'Voucher Highlands Coffee',
    type: 'Voucher',
    rarity: 'Common',
    status: 'Selling',
    receivedAt: '2024-05-21',
    seller: 'Alex',
    price: 150,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'm-2',
    name: 'Ebook Marketing 101',
    type: 'PDF',
    rarity: 'Rare',
    status: 'Selling',
    receivedAt: '2024-05-21',
    seller: 'Minh',
    price: 400,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'm-3',
    name: 'UI Kit Portfolio',
    type: 'Template',
    rarity: 'Epic',
    status: 'Selling',
    receivedAt: '2024-05-21',
    seller: 'Trang',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  },
];
