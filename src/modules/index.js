import shopRoutes from './shop/shop.routes';
import productRoutes from './product/product.routes';
import orderRoutes from './order/order.routes';

export default app => {
  app.use('/api/v1/shops', shopRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/orders', orderRoutes);
};

