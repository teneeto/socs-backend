import { Router } from 'express';
import { celebrate as validate } from 'celebrate';
import userCtrl from '@controllers/user.controller';
import IsAdmin from '@middlewares/is_admin.middleware';
import authValidation from '@validations/auth.validation';

const router = Router();

/**
 * Router layer representing the Authorization check for app users
 * @function authToken
 * @description Authenticated routes only accessible by authenticated users
 */

router
  .route('/')
  .put(
    [validate(authValidation.updateUser, { abortEarly: false })],
    userCtrl.update
  );

/**
 * Router layer representing the Authorization check for app admins
 * @function authToken
 * @function isAdmin
 * @description Authenticated routes only accessible by admins
 */

router.use(IsAdmin);

router.route('/').get(userCtrl.getAll);

router
  .route('/:id')
  .delete(
    [validate(authValidation.deleteUser, { abortEarly: false })],
    userCtrl.delete
  );

export default router;
