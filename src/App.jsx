import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import { LogOut, User, ShoppingBag, Package } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white border-b border-light-gray p-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-charcoal tracking-wider">
          ECOMUS <span className="text-luxury-gold">.</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-charcoal hover:text-luxury-gold transition-colors">Home</Link>
          <Link to="/products" className="text-charcoal hover:text-luxury-gold transition-colors">Products</Link>
          
          {user ? (
            <div className="flex items-center space-x-4 pl-6 border-l border-light-gray">
              <Link to="/orders" className="text-charcoal hover:text-luxury-gold transition-colors flex items-center" title="Orders">
                <Package className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="text-charcoal hover:text-luxury-gold transition-colors relative flex items-center" title="Cart">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-luxury-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <span className="text-text-light flex items-center ml-2 border-l border-light-gray pl-4">
                <User className="w-4 h-4 mr-2" />
                {user.email.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="text-text-light hover:text-charcoal transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 pl-6 border-l border-light-gray">
              <Link to="/login" className="text-charcoal hover:text-luxury-gold transition-colors">Sign In</Link>
              <Link to="/register" className="bg-charcoal text-white px-4 py-2 rounded-md hover:bg-black transition-colors">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-background">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <div className="text-center py-20">
                    <h2 className="text-5xl font-semibold text-charcoal tracking-tight mb-6">Discover True Luxury</h2>
                    <p className="text-xl text-text-light mb-10">Exclusive collection for the modern aesthetic.</p>
                    <Link to="/products" className="bg-charcoal text-white px-8 py-4 rounded-md text-lg hover:bg-black transition-colors inline-block">
                      Shop Collection
                    </Link>
                  </div>
                } />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<h2 className="text-xl">Dashboard</h2>} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<OrderHistory />} />
                </Route>
              </Routes>
            </main>

            <footer className="bg-charcoal text-white py-12 text-center">
              <p className="text-light-gray tracking-wide">&copy; 2026 Ecomus Luxury. All rights reserved.</p>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
