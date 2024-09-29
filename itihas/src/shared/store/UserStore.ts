import { create } from 'zustand';
import { User } from '../type/user';
import { persist } from 'zustand/middleware';
import { LoginUser, RegisterUser, loginUser, registerUser } from '../api/user';

interface UserStore {
	user: User | null;
	isAuthorize: boolean;
}

export const useUserStore = create<UserStore>()(
	persist(
		_get => ({
			isAuthorize: true,
			user: null,
		}),
		{
			name: 'user-store',
		}
	)
);

export const setUser = (user: UserStore['user']) => {
	return useUserStore.setState({ user });
};

export const setIsAuthorize = (isAuthorize: UserStore['isAuthorize']) => {
	return useUserStore.setState({ isAuthorize });
};

export const login = async (login: LoginUser) => {
	const user = await loginUser(login);
	return useUserStore.setState({ isAuthorize: true, user: user.data });
};

export const register = async (login: RegisterUser) => {
	const user = await registerUser(login);
	return useUserStore.setState({ isAuthorize: true, user: user.data });
};

export const deleteUser = () => {
	return useUserStore.setState({ isAuthorize: false, user: null });
};
