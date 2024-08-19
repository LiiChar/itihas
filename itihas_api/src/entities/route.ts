import { Router } from 'express';
import { userRouter } from './user/user.controller';
import { historyRouter } from './history/history.controller';
import { pageRouter } from './page/page.controller';

const route = Router();

route.use('/history', historyRouter);
route.use('/user', userRouter);
route.use('/page', pageRouter);

export { route };
