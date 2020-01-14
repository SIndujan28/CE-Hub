import shopRoutes from './shop/shop.routes';
import productRoutes from './product/product.routes';

export default app => {
  app.use('/api/v1/shops', shopRoutes);
};

