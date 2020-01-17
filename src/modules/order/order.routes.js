import { Router } from 'express';

import orderController from './order.controller';
import productController from './../product/product.controller';
import shopController from './../shop/shop.controller';

const routes = new Router();

routes.param('shopId', shopController.shopByID);
routes.param('productId', productController.productByID);
routes.param('orderId', orderController.orderByID);
routes.param('userId',);

routes.post('/:userId', productController.decreaseQuantity, orderController.create);
routes.get('/shop/:shopId', orderController.listByShop);
routes.get('/users/:userId', orderController.listByUser);
routes.get('/status_values', orderController.getStatusValues);
routes.put('/:shopId/cancel/:productId', productController.decreaseQuantity, orderController.update);
routes.put('/:orderId/charge/:userId/:shopId', orderController.update);
routes.put('/status/:shopId', orderController.update);
routes.get('/:orderId', orderController.read);

export default routes
;
