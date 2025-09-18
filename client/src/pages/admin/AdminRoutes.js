import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './Dashboard';
import AdminProducts from './Products';
import AdminOrders from './Orders';
import AdminCategories from './Categories';
import AdminUsers from './Users';
import AdminImages from './Images';
import TestAdmin from './TestAdmin';
import SimpleTest from './SimpleTest';
import TestSimple from './TestSimple';
import DebugAdmin from './DebugAdmin';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="images" element={<AdminImages />} />
      <Route path="test" element={<TestAdmin />} />
      <Route path="simple" element={<SimpleTest />} />
      <Route path="testsimple" element={<TestSimple />} />
      <Route path="debug" element={<DebugAdmin />} />
    </Routes>
  );
};

export default AdminRoutes;
