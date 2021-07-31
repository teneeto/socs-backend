import { Router } from 'express';
import { celebrate as validate } from 'celebrate';
import isAgent from '@middlewares/is_agent.middleware';
import requestCtrl from '@controllers/request.controller';
import requestValidation from '@validations/request.validation';

const router = Router();

router.put(
  '/:id',
  [isAgent, validate(requestValidation.updateRequest, { abortEarly: false })],
  requestCtrl.update
);

router.post(
  '/create-request',
  [isAgent, validate(requestValidation.createRequest, { abortEarly: false })],
  requestCtrl.create
)

export default router;
