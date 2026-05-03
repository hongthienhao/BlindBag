import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold font-display text-gray-800 opacity-80">
              © 2024 BlindBag Marketplace. All rights reserved.
            </span>
            <p className="text-sm text-gray-500">Total clarity in every mystery.</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8">
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Shipping Info</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Help Center</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
