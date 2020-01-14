import { Router } from 'express';
import * as productController from './product.controller';
import { shopByID } from './../shop/shop.controller';

const routes = new Router();

routes.param('shopId', shopByID);
routes.param('productId', productController.productByID);

routes.post('/by/:shopId', productController.create);
routes.get('/by/:shopId', productController.listByShop);
routes.get('/latest', productController.listLatest);
routes.get('/related/:productId', productController.listRelated);
routes.get('/categories', productController.listCategories);
routes.get('/', productController.list);
routes.get('/:productId', productController.read);
routes.get('/image/:productId', productController.photo, productController.defaultPhoto);
routes.get('/defaultPhoto', productController.defaultPhoto);
routes.put('/:shopId/:productId', productController.update);
routes.delete('/:shopId/:productId', productController.remove);

export default routes;
