import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('jwt_token', response.token);
      }

      // Redirect to home/dashboard
      navigate('/');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401 || error.response.status === 400) {
          setErrorMsg(error.response.data?.message || 'Email hoặc mật khẩu không chính xác.');
        } else {
          setErrorMsg('Có lỗi xảy ra, vui lòng thử lại sau.');
        }
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
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">Chào mừng trở lại</h1>
          <p className="text-gray-500 font-medium">Đăng nhập vào tài khoản BlindBag của bạn</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-sans text-gray-600 uppercase tracking-widest" htmlFor="email">
              Email
            </label>
            <input 
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className="w-full bg-white border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold font-sans text-gray-600 uppercase tracking-widest" htmlFor="password">
                Mật khẩu
              </label>
              <Link to="#" className="text-xs font-medium text-slate-700 hover:underline">Quên mật khẩu?</Link>
            </div>
            <input 
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu của bạn"
              className="w-full bg-white border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-700 text-white font-medium py-4 px-4 rounded-lg mt-2 hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : 'Đăng nhập'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Chưa có tài khoản? <Link to="/register" className="text-gray-900 font-bold hover:underline">Đăng ký tại đây</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
