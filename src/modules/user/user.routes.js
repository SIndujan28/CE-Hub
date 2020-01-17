import { Router } from 'express';

import * as userController from './user.controller';
import { requireSignin, hasAuthorization, signin, signout } from './../../services/valid.service';

const routes = new Router();

routes.param('userId', userController.userById);
routes.post('/signup', userController.signup);
routes.post('/signin', signin);
routes.get('/signout', signout);
routes.get('/list', userController.list);
routes.get('/:userId', [requireSignin], userController.read);
routes.delete('/:userId', [requireSignin, hasAuthorization], userController.remove);
routes.put('/:userId', [requireSignin, hasAuthorization], userController.update);
routes.put('/stripe_auth/:userId', [requireSignin, hasAuthorization], userController.stripe_auth, userController.update);
export default routes;

