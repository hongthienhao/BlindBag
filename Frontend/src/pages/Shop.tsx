import { Star } from 'lucide-react';
import { MYSTERY_BAGS } from '../constants';
import { motion } from 'motion/react';

export default function Shop() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Mystery Bags</h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">Discover what's inside. Every bag guarantees value.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MYSTERY_BAGS.map((bag, index) => (
          <motion.div
            key={bag.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
          >
            <div className="w-full h-56 bg-gray-50 relative flex items-center justify-center overflow-hidden">
              <motion.img 
                src={bag.image} 
                className="object-cover w-full h-full opacity-90 group-hover:scale-110 transition-transform duration-700" 
                alt={bag.name} 
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity" />
              
              {bag.isNew && (
                <div className="absolute top-4 right-4 bg-white px-4 py-1 rounded-full text-[10px] font-bold font-sans text-gray-900 shadow-sm uppercase tracking-widest border border-gray-100">
                  NEW ARRIVAL
                </div>
              )}
              {bag.isLimited && (
                <div className="absolute top-4 right-4 bg-slate-800 text-white px-4 py-1 rounded-full text-[10px] font-bold font-sans flex items-center gap-1 shadow-sm uppercase tracking-widest">
                  <Star size={10} fill="currentColor" /> LIMITED
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col flex-grow gap-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold font-display text-gray-900 group-hover:text-slate-700 transition-colors">{bag.name}</h3>
                <span className="text-xl font-bold text-slate-700">{bag.price} Coins</span>
              </div>
              
              <p className="text-sm text-gray-500 leading-relaxed flex-grow">{bag.description}</p>
              
              <div className="mt-2 pt-6 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">RARITY DISTRIBUTION</p>
                <div className="flex gap-2 flex-wrap">
                  {bag.rarityDistribution.map((dist) => (
                    <span 
                      key={dist.rarity} 
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        dist.rarity === 'Legendary' 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {dist.rarity}: {dist.probability}%
                    </span>
                  ))}
                </div>
              </div>

              <button className="mt-4 w-full bg-slate-700 text-white py-4 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]">
                Mua túi này
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
