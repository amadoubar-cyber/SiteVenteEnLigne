import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AlertInterceptor from './components/AlertInterceptor';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ConstructionMaterials from './pages/ConstructionMaterials';
import ElectronicsProducts from './pages/ElectronicsProducts';
import ProductDetail from './pages/ProductDetail';
import ProductCompare from './pages/ProductCompare';
import QuoteRequest from './pages/QuoteRequest';
import QuoteSuccess from './pages/QuoteSuccess';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import TestOrdersPage from './pages/TestOrdersPage';
import VerifyEmail from './pages/VerifyEmail';
import EmailVerification from './pages/EmailVerification';
import AdminLayout from './components/Layout/AdminLayout';
import AdminDirect from './pages/admin/AdminDirect';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import StockMovement from './pages/admin/StockMovement';
import StockControl from './pages/admin/StockControl';
import TestStockControl from './pages/admin/TestStockControl';
import TestUltraSimple from './pages/admin/TestUltraSimple';
import TestDirect from './pages/admin/TestDirect';
import StockControlNoAuth from './pages/admin/StockControlNoAuth';
import TestPage from './pages/TestPage';
import TestAPI from './pages/admin/TestAPI';
import StockControlSimplePage from './pages/StockControlSimple';
import SalesManagement from './pages/admin/SalesManagement';
import CreateSale from './pages/admin/CreateSale';
import TestSales from './pages/admin/TestSales';
import QuickSalesTest from './pages/admin/QuickSalesTest';
import AdminDiagnostic from './pages/admin/AdminDiagnostic';
import CreateDebt from './pages/admin/CreateDebt';
import DebtManagement from './pages/admin/DebtManagement';
import RouteDiagnostic from './pages/admin/RouteDiagnostic';
import TestAdmin from './pages/admin/TestAdmin';
import SimpleTest from './pages/admin/SimpleTest';
import TestSimple from './pages/admin/TestSimple';
import DebugAdmin from './pages/admin/DebugAdmin';
import AdminTest from './pages/admin/AdminTest';
import AdminSimple from './pages/AdminSimple';
import AdminPage from './pages/AdminPage';
import TestLogin from './pages/TestLogin';
import TestLoginSimple from './pages/TestLoginSimple';
import AdminFinal from './pages/AdminFinal';
import AdminComplete from './pages/admin/AdminComplete';
import AdminSimpleComplete from './pages/admin/AdminSimpleComplete';
import OrderApproval from './pages/admin/OrderApproval';
import AdminAuth from './components/AdminAuth';
import AdminRedirect from './pages/AdminRedirect';
// TestAccounts supprimé pour la production
import TestButtons from './pages/TestButtons';
import TestAlerts from './pages/TestAlerts';
import TestImages from './pages/TestImages';
import ProductManagementSimple from './pages/admin/ProductManagementSimple';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NotFound from './pages/NotFound';
import DynamicDashboard from './components/DynamicDashboard';
import LocalStorageDiagnostic from './components/LocalStorageDiagnostic';
import ClientOrdersTest from './pages/ClientOrdersTest';
// import OrderValidationDebugger from './components/debug/OrderValidationDebugger';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AlertInterceptor>
            <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="construction" element={<ConstructionMaterials />} />
              <Route path="electronics" element={<ElectronicsProducts />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="compare" element={<ProductCompare />} />
              <Route path="quote-request" element={<QuoteRequest />} />
              <Route path="quote-success" element={<QuoteSuccess />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="email-verification" element={<EmailVerification />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
                  <Route path="admin-page" element={<AdminPage />} />
                  <Route path="test-login" element={<TestLogin />} />
                  <Route path="test-login-simple" element={<TestLoginSimple />} />
                  <Route path="admin-final" element={<AdminFinal />} />
                  <Route path="admin-complete" element={<AdminComplete />} />
                  <Route path="admin-simple-complete" element={<AdminSimpleComplete />} />
                  <Route path="test-buttons" element={<TestButtons />} />
                  <Route path="test-alerts" element={<TestAlerts />} />
                  <Route path="test-images" element={<TestImages />} />
                  <Route path="products-simple" element={<ProductManagementSimple />} />
                  <Route path="dashboard-dynamique" element={<DynamicDashboard />} />
                  <Route path="localstorage-diagnostic" element={<LocalStorageDiagnostic />} />
              
              {/* Protected Routes */}
              <Route path="checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="client-orders-test" element={
                <ProtectedRoute>
                  <ClientOrdersTest />
                </ProtectedRoute>
              } />
              <Route path="orders/:id" element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } />
              <Route path="test-orders" element={
                <ProtectedRoute>
                  <TestOrdersPage />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes - Outside of main Layout */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="stock" element={<StockMovement />} />
              <Route path="stock-control" element={<StockControlSimplePage />} />
              <Route path="stock-control-full" element={<StockControl />} />
              <Route path="test-stock-control" element={<TestStockControl />} />
              <Route path="sales" element={<SalesManagement />} />
              <Route path="sales/create" element={<CreateSale />} />
              <Route path="debts" element={<DebtManagement />} />
              <Route path="debts/create" element={<CreateDebt />} />
              <Route path="test-sales" element={<TestSales />} />
              <Route path="quick-sales-test" element={<QuickSalesTest />} />
              <Route path="admin-diagnostic" element={<AdminDiagnostic />} />
              <Route path="test-ultra-simple" element={<TestUltraSimple />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="test" element={<AdminTest />} />
              <Route path="simple" element={<SimpleTest />} />
              <Route path="testsimple" element={<TestSimple />} />
              <Route path="debug" element={<DebugAdmin />} />
              <Route path="diagnostic" element={<RouteDiagnostic />} />
              <Route path="orders" element={<OrderApproval />} />
              {/* <Route path="order-debug" element={<OrderValidationDebugger />} /> */}
            </Route>
            
            {/* Admin Direct - Sans protection pour test */}
            <Route path="/admin-direct" element={<AdminDirect />} />
            <Route path="/admin-simple" element={<AdminSimple />} />
            <Route path="/test-direct" element={<TestDirect />} />
            <Route path="/stock-control" element={<StockControlNoAuth />} />
            <Route path="/test-page" element={<TestPage />} />
            <Route path="/test-api" element={<TestAPI />} />
            <Route path="/stock-simple" element={<StockControlSimplePage />} />
            
            {/* Routes d'authentification admin */}
            <Route path="/admin" element={<AdminRedirect />} />
            <Route path="/admin-simple-complete" element={
              <AdminAuth>
                <AdminSimpleComplete />
              </AdminAuth>
            } />
            
            {/* Page des comptes de test */}
            {/* Route test-accounts supprimée pour la production */}
          </Routes>
            </div>
          </AlertInterceptor>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;