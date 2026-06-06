import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar/Navbar';
import { CartDrawer } from '../components/CartDrawer/CartDrawer';

const ProductList = lazy(() => import('../pages/ProductList/ProductList').then(m => ({ default: m.ProductList })));
const ProductDetail = lazy(() => import('../pages/ProductDetail/ProductDetail').then(m => ({ default: m.ProductDetail })));

function Layout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <ProductList /> },
      { path: '/product/:id', element: <ProductDetail /> },
    ],
  },
]);
