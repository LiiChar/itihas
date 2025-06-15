import { create } from 'zustand';
import { User } from '../type/user';
import { persist } from 'zustand/middleware';
import { LoginUser, RegisterUser, loginUser, registerUser } from '../api/user';

interface UserStore {
	user: User | null;
	isAuthorize: boolean;
}

interface UserStoreAction {
	isAdmin: () => boolean;
	isAdminOrCreator: (creatorId: number) => boolean;
}

export const useUserStore = create<UserStore & UserStoreAction>()(
	persist(
		(_set, get) => ({
			isAuthorize: true,
			user: null,
			isAdmin() {
				const user = get().user;
				if (!user) {
					return false;
				}
				if (user.role == 'admin') {
					return true;
				}

				return false;
			},
			isAdminOrCreator(creatorId) {
				const state = get();
				return (
					state.isAdmin() || (state.user !== null && state.user.id == creatorId)
				);
			},
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
	const response = await loginUser(login);
	if ('data' in response) {
		return useUserStore.setState({ isAuthorize: true, user: response.data });
	} else {
		throw new Error(response.error || 'Ошибка авторизации');
	}
};

export const register = async (login: RegisterUser) => {
	const response = await registerUser(login);
	if ('data' in response) {
		return useUserStore.setState({ isAuthorize: true, user: response.data });
	} else {
		throw new Error((response as any).error || 'Ошибка регистрации');
	}
};

export const deleteUser = () => {
	return useUserStore.setState({ isAuthorize: false, user: null });
};
