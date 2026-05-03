import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">Hồ sơ của tôi</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-slate-800 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-2 shadow-sm border border-gray-50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User size={40} />
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Mail size={16} />
            {user.email}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Vai trò</p>
                <p className="font-semibold text-gray-900">{user.role}</p>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm">
                <span className="font-bold text-xl">C</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Số dư Coins</p>
                <p className="font-semibold text-gray-900">1,000</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
