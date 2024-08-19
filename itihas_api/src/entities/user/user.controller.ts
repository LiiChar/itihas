import { Router } from 'express';
import {
	changeStatusUser,
	getFullUsers,
	getListUsers,
	getUser,
	loginUser,
	registerUser,
	removeUser,
	updateUser,
	verifyEmail,
	sendNotification,
} from './user.service';
import { validateData } from '../../middleware/validationMiddleware';
import { userLoginSchema, userRegistrationSchema } from './user.scheme';
import { authificationMiddleware } from '../../middleware/authificationMiddleware';
import { roleMiddleware } from '../../middleware/roleMiddleware';

const userRouter = Router();

userRouter.post('/login', validateData(userLoginSchema), loginUser);
userRouter.post(
	'/register',
	validateData(userRegistrationSchema),
	registerUser
);
userRouter.get('/verify', verifyEmail);
userRouter.put('/update', authificationMiddleware, updateUser);
userRouter.delete('/', authificationMiddleware, removeUser);
userRouter.get('/:id', getUser);
userRouter.get('/', getFullUsers);
userRouter.get('/list', getListUsers);
userRouter.put('/status', roleMiddleware('admin'), changeStatusUser);
userRouter.post(
	'/notification',
	authificationMiddleware,
	roleMiddleware('admin'),
	sendNotification
);

export { userRouter };
