export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'Voucher' | 'PDF' | 'Template' | 'Art' | 'Token' | 'Other';
export type ItemStatus = 'Idle' | 'Used' | 'Selling';

export interface MysteryBag {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isNew?: boolean;
  isLimited?: boolean;
  rarityDistribution: {
    rarity: Rarity;
    probability: number;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  status: ItemStatus;
  receivedAt: string;
  image?: string;
  seller?: string;
  price?: number;
}
