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
	authificated,
} from './user.service';
import { validateData } from '../../middleware/validationMiddleware';
import { userLoginSchema, userRegistrationSchema } from './user.scheme';
import { authificationMiddleware } from '../../middleware/authificationMiddleware';
import { roleMiddleware } from '../../middleware/roleMiddleware';
import { getPayloadByToken } from '../../lib/auth';
import { db, UserType } from '../../database/db';
import { eq } from 'drizzle-orm';
import { users } from './model/user';

const userRouter = Router();

userRouter.post('/login', validateData(userLoginSchema), loginUser);
userRouter.post(
	'/register',
	validateData(userRegistrationSchema),
	registerUser
);
userRouter.get('/authicated/:id', async (req, res) => {
	console.log(req.cookies['token']);
	const userId = req.params.id;
	// TODO fix remove
	if (userId) {
		const user = await db.query.users.findFirst({
			where: eq(users.id, +userId!),
		});
		if (user) {
			return res.json(true);
		}
	}
	const token = req.cookies['token'];
	if (!token) return res.json(false);
	const payload = getPayloadByToken<UserType>(token);
	const user = await db.query.users.findFirst({
		where: eq(users.id, payload.id),
	});
	if (!user) return res.json(false);
	res.json(true);
});
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
