import { Router } from 'express';
import { celebrate as validate } from 'celebrate';
import authCtrl from '@controllers/auth.controller';
import authValidation from '@validations/auth.validation';

const router = Router();

router
  .route('/signup')
  .post(
    [validate(authValidation.signupUser, { abortEarly: false })],
    authCtrl.signup
  );

router
  .route('/signin')
  .post(
    [validate(authValidation.signinUser, { abortEarly: false })],
    authCtrl.signin
  );

export default router;
