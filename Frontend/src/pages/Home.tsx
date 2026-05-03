import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Custom Lucide Icon for Box (Inventory)
const BoxIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Hero Section */}
        <div className="md:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col justify-center min-h-[400px]">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-6"
          >
            {user ? `Chào mừng ${user.fullName.split(' ')[0]} trở lại!` : 'Khám phá sự bí ẩn'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-lg mb-8 leading-relaxed"
          >
            Mở hộp các vật phẩm độc quyền, phiên bản giới hạn. Tin tưởng vào sự bí ẩn, xác nhận trên blockchain.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Link to="/shop">
              <button className="bg-slate-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-all shadow-sm inline-flex items-center gap-2 group">
                Khám phá thị trường
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Featured Drop Card */}
        <div className="md:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" />
          <motion.div 
            className="relative z-10 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner border border-gray-100 p-4">
               <div className="relative">
                  <BoxIcon size={48} className="text-slate-700" />
                  <motion.div 
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 blur-xl bg-blue-400/20 rounded-full"
                  />
               </div>
            </div>
            <h3 className="text-xl font-bold font-display text-gray-900 mb-2">Vật phẩm nổi bật</h3>
            <p className="text-sm text-gray-500 font-medium">Series Alpha - Còn lại 24h</p>
          </motion.div>
          
          {/* Subtle background image or pattern */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-100 rounded-full blur-3xl opacity-50" />
        </div>
      </div>
    </div>
  );
}
