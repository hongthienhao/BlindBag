import { User as UserIcon, Filter, SortAsc } from 'lucide-react';
import { MARKETPLACE_ITEMS } from '../constants';
import { motion } from 'motion/react';

export default function Marketplace() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">Thị trường vật phẩm</h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">Khám phá và sở hữu những vật phẩm kỹ thuật số độc đáo từ cộng đồng.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Filter size={16} />
            Lọc
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <SortAsc size={16} />
            Sắp xếp
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MARKETPLACE_ITEMS.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all duration-300 group overflow-hidden"
          >
            <div className="w-full h-56 bg-gray-50 relative overflow-hidden">
              <motion.img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
              />
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-gray-900 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-gray-100 shadow-sm">
                {item.rarity}
              </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-xl font-bold font-display text-gray-900 mb-4 line-clamp-1 group-hover:text-slate-700 transition-colors">{item.name}</h3>
              
              <div className="flex items-center gap-2 mb-8 mt-auto">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon size={12} className="text-gray-400" />
                </div>
                <span className="text-xs font-semibold text-gray-500">Người bán: <span className="text-gray-900">{item.seller}</span></span>
              </div>

              <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-50 gap-4">
                <div className="font-bold text-2xl text-slate-800">
                  {item.price} <span className="text-sm font-medium text-gray-400 tracking-tight">Coins</span>
                </div>
                <button className="bg-slate-700 text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95 flex-grow">
                  Mua
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
