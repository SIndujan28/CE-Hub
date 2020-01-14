import { Router } from 'express';

import * as shopController from './shop.controller';

const routes = new Router();

routes.param('shopId', shopController.shopByID);

routes.post('/by/:userId', shopController.create);
routes.get('/by/:userId', shopController.listByOwner);

routes.get('/logo/:shopId', shopController.photo, shopController.defaultPhoto);
routes.get('/defaultphoto', shopController.defaultPhoto);

routes.get('/list', shopController.list);

routes.get('/:shopId', shopController.read);
routes.put('/:shopId', shopController.update);
routes.delete('/:shopId', shopController.remove);

export default routes;

