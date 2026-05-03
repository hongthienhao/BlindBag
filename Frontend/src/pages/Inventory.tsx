import { Search, Calendar, Ticket, FileText, Layout, BookOpen, X } from 'lucide-react';
import { INVENTORY } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import type { InventoryItem } from '../types';

const ICON_MAP = {
  'Voucher': <Ticket size={24} />,
  'PDF': <FileText size={24} />,
  'Template': <Layout size={24} />,
  'Art': <Layout size={24} />,
  'Token': <Layout size={24} />,
  'Other': <BookOpen size={24} />,
};

type FilterType = 'Tất cả' | 'Chưa dùng' | 'Đã dùng' | 'Đang bán';

export default function Inventory() {
  const [filter, setFilter] = useState<FilterType>('Tất cả');
  const [sellingItem, setSellingItem] = useState<InventoryItem | null>(null);

  const filters: FilterType[] = ['Tất cả', 'Chưa dùng', 'Đã dùng', 'Đang bán'];

  const filteredItems = INVENTORY.filter(item => {
    if (filter === 'Tất cả') return true;
    if (filter === 'Chưa dùng') return item.status === 'Idle';
    if (filter === 'Đã dùng') return item.status === 'Used';
    if (filter === 'Đang bán') return item.status === 'Selling';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">Kho đồ của tôi</h1>
          <p className="text-lg text-gray-500 leading-relaxed">Quản lý và sử dụng các vật phẩm bạn đã nhận được.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm vật phẩm..."
            className="w-full pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm border ${
              filter === f 
                ? 'bg-slate-700 text-white border-transparent' 
                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                item.status === 'Used' ? 'opacity-70 grayscale' : ''
              }`}
            >
              <div className="h-44 bg-gray-50 relative flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    item.rarity === 'Epic' ? 'bg-purple-50 text-purple-700' :
                    item.rarity === 'Rare' ? 'bg-blue-50 text-blue-700' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {item.rarity}
                  </span>
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-900 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {item.type}
                  </span>
                </div>
                
                <div className="text-slate-400 group-hover:scale-110 group-hover:text-slate-600 transition-all duration-300">
                  {ICON_MAP[item.type as keyof typeof ICON_MAP] || <BookOpen size={48} />}
                </div>
                
                {/* Decorative gradients */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 ${
                  item.rarity === 'Epic' ? 'bg-purple-400' : 'bg-slate-400'
                }`} />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold font-display text-gray-900 mb-2 leading-snug">{item.name}</h3>
                
                <div className="flex justify-between items-center mt-2 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <Calendar size={14} />
                    {item.receivedAt}
                  </div>
                  <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                    item.status === 'Idle' ? 'bg-slate-50 text-slate-700' :
                    item.status === 'Selling' ? 'bg-amber-50 text-amber-700' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {item.status === 'Idle' ? 'Chưa dùng' : 
                     item.status === 'Selling' ? 'Đang bán' : 'Đã dùng'}
                  </span>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex gap-3">
                  {item.status === 'Idle' && (
                    <>
                      <button className="flex-1 bg-slate-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
                        Sử dụng
                      </button>
                      <button 
                        onClick={() => setSellingItem(item)}
                        className="flex-1 bg-white text-gray-700 border border-gray-100 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all"
                      >
                        Đăng bán
                      </button>
                    </>
                  )}
                  {item.status === 'Used' && (
                    <button className="flex-1 bg-gray-50 text-gray-400 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed">
                      Đã dùng
                    </button>
                  )}
                  {item.status === 'Selling' && (
                    <button className="flex-1 bg-white text-rose-500 border border-rose-100 py-2.5 rounded-lg text-sm font-bold hover:bg-rose-50 transition-all">
                      Hủy đăng bán
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selling Modal */}
      <AnimatePresence>
        {sellingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSellingItem(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold font-display text-gray-900">Đăng bán vật phẩm</h2>
                <button onClick={() => setSellingItem(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 flex flex-col gap-8">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400">
                    {ICON_MAP[sellingItem.type as keyof typeof ICON_MAP] || <BookOpen size={24} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">VẬT PHẨM ĐÃ CHỌN</p>
                    <p className="font-bold text-gray-900">{sellingItem.name}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-gray-900" htmlFor="price">Giá bán</label>
                  <div className="relative">
                     <input 
                      id="price"
                      type="number" 
                      placeholder="Nhập giá coins"
                      className="w-full pl-6 pr-16 py-4 bg-white border border-gray-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-50 transition-all"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">Coins</div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Phí thị trường: 5%</p>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setSellingItem(null)}
                  className="px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-white transition-all border border-transparent hover:border-gray-100"
                >
                  Hủy
                </button>
                <button className="px-8 py-3 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md active:scale-95">
                  Xác nhận đăng bán
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
