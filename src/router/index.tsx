import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar/Navbar';
import { CartDrawer } from '../components/CartDrawer/CartDrawer';
import { ProductList } from '../pages/ProductList/ProductList';
import { ProductDetail } from '../pages/ProductDetail/ProductDetail';

function Layout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet />
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
