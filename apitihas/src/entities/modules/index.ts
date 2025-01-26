import { Router } from 'express';
import { searchRouter } from './search/search.controller';
import { gigaChatRouter } from './gigiChat/gigaChat.controller';
import { variableRouter } from './variable/variable.controller';

const moduleRouter = Router();

moduleRouter.use('/', searchRouter);
moduleRouter.use('/chat', gigaChatRouter);
moduleRouter.use('/variable', variableRouter);

export { moduleRouter };
