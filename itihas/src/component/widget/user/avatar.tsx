import { User } from '@/shared/type/user';
import { HTMLProps } from 'react';
import { Avatar as Ava, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { getFullUrl } from '@/shared/lib/image';

type Avatar = {
	className?: HTMLProps<HTMLElement>['className'];
	user: User;
};

export const Avatar = ({ className, user }: Avatar) => {
	return (
		<Ava className={className}>
			<AvatarImage
				alt={`Фотография пользователя ${user.name}`}
				src={getFullUrl(user.photo)}
			/>
			<AvatarFallback>{user.name}</AvatarFallback>
		</Ava>
	);
};
