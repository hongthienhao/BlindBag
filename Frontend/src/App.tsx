import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Inventory from './pages/Inventory';
import Marketplace from './pages/Marketplace';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
