import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });

      setSuccessMsg('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMsg(error.response.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng kiểm tra lại thông tin.');
      } else {
        setErrorMsg('Lỗi kết nối đến máy chủ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-6 bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">Tạo tài khoản mới</h1>
          <p className="text-gray-500 font-medium">Tham gia BlindBag Marketplace ngay hôm nay.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
              {successMsg}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-sans text-gray-600 uppercase tracking-widest" htmlFor="fullName">
              Họ tên
            </label>
            <input 
              id="fullName"
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-sans text-gray-600 uppercase tracking-widest" htmlFor="email">
              Email
            </label>
            <input 
              id="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-sans text-gray-600 uppercase tracking-widest" htmlFor="phone">
              Số điện thoại (Tuỳ chọn)
            </label>
            <input 
              id="phone"
              type="text"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-sans text-gray-600 uppercase tracking-widest" htmlFor="password">
              Mật khẩu
            </label>
            <input 
              id="password"
              type="password"
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all"
              required
              minLength={6}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-sans text-gray-600 uppercase tracking-widest" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>
            <input 
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-700 text-white font-medium py-4 px-4 rounded-lg mt-2 hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98] uppercase tracking-widest text-xs font-bold disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : 'Đăng ký'}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Đã có tài khoản? <Link to="/login" className="text-gray-900 font-bold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
