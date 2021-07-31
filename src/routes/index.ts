/**************************************************************************************** *
 * ******************************                    ************************************ *
 * ******************************   ALL APP ROUTES   ************************************ *
 * ******************************                    ************************************ *
 * ************************************************************************************** */

import authRoute from '@routes/auth.routes';
import userRoute from '@routes/user.routes';
import authToken from '@policies/auth.policy';
import requestsRouter from '@routes/request.routes';
import { Request, Response, Router } from 'express';

const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (_req: Request, res: Response) =>
  res.send({ check: 'tensfer server started ok' })
);

// mount auth routes
router.use('/auth', authRoute);

// authenticate all routes below
router.use(authToken);

// mount users routes
router.use('/users', userRoute);

//mount request routes
router.use('/requests', requestsRouter);

export default router;
