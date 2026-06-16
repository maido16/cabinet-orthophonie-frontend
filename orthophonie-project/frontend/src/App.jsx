import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; // 👈 Ajout de Outlet
import ScrollToAnchor from './components/ScrollToAnchor';
import Home from './pages/Home.jsx';
import OrthophonieAITest from './pages/OrthophonieAITest.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Appointment from './pages/Appointment.jsx';
import Confirm from './pages/Confirm.jsx';
import SuperAdmin from './pages/SuperAdmin.jsx';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import FloatingCart from './components/FloatingCart';
import { Toaster } from 'react-hot-toast';
import MyAccount from './pages/MyAccount';
// ✅ AJOUTS AUTH
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
// 🛠️ CRÉATION DU LAYOUT PRINCIPAL
// Ce composant enveloppe les pages qui ont besoin de la Navbar et de la Boutique
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <ScrollToAnchor />
      <CartDrawer />
      <FloatingCart />
      <main>
        <Outlet /> {/* 👈 C'est ici que les pages (Home, Blog, etc.) vont s'injecter */}
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Le Toaster reste global pour afficher les erreurs même sur la page Login */}
          <Toaster position="bottom-center" reverseOrder={false} />
          
          <Routes>
            {/* 🛑 ROUTES SANS NAVBAR (Focus Mode) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 🟢 ROUTES AVEC NAVBAR (Enveloppées par MainLayout) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<OrthophonieAITest />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/confirm" element={<Confirm />} />
              
              {/* ROUTES BOUTIQUE */}
              <Route path="/boutique" element={<Shop />} />
              <Route path="/boutique/:id" element={<ProductDetail />} />
              
              {/* ROUTES ADMIN (à voir si tu veux la navbar classique ici) */}
              <Route path="/admin/super" element={<SuperAdmin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              <Route path="/account" element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              } />
              

            </Route>

            {/* 404 */}
            <Route path="*" element={<div>404 - Page non trouvée</div>} />
          
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;