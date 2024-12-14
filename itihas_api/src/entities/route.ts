import { Router } from 'express';
import { userRouter } from './user/user.controller';
import { historyRouter } from './history/history.controller';
import { pageRouter } from './page/page.controller';
import { fileRouter } from './file/file.controller';
import { commentRouter } from './comment/comment.controller';
import { moduleRouter } from './modules';
import { bookmarkRouter } from './bookmark/bookmark.controller';
import { genreRouter } from './genre/genre.controller';

const route = Router();

route.use('/history', historyRouter);
route.use('/genre', genreRouter);
route.use('/user', userRouter);
route.use('/page', pageRouter);
route.use('/file', fileRouter);
route.use('/comment', commentRouter);
route.use('/bookmark', bookmarkRouter);
route.use('/', moduleRouter);

export { route };
