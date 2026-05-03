import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Bell, User, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold font-display tracking-tight text-gray-900">
            BlindBag
          </Link>
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
            <User size={20} />
          </button>
        </div>
      </header>
    );
  }

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Túi mù', path: '/shop' },
    { name: 'Thị trường', path: '/marketplace' },
    { name: 'Kho đồ', path: '/inventory' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-bold font-display tracking-tight text-gray-900">
            BlindBag Marketplace
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <Wallet size={16} className="text-gray-600" />
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">1000 Coins</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <ShoppingBag size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <Link to="/login">
              <button className="ml-2 bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
