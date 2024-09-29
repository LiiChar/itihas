import { Router } from 'express';
import { searchRouter } from './search/search.controller';

const moduleRouter = Router();

moduleRouter.use('/', searchRouter);

export { moduleRouter };
