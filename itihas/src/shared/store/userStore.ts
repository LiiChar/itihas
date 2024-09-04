import { create } from 'zustand';
import { User } from '../type/user';
import { persist } from 'zustand/middleware';

interface UserStore {
	user: User | null;
	isAuthorize: boolean;
}

export const useUserStore = create<UserStore>()(
	persist(
		(_get) => ({
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
