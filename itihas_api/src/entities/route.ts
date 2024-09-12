import { Router } from 'express';
import { userRouter } from './user/user.controller';
import { historyRouter } from './history/history.controller';
import { pageRouter } from './page/page.controller';
import { fileRouter } from './file/file.controller';

const route = Router();

route.use('/history', historyRouter);
route.use('/user', userRouter);
route.use('/page', pageRouter);
route.use('/file', fileRouter);

export { route };
