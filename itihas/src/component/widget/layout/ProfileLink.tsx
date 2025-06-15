'use client';

import { useUserStore } from '@/shared/store/UserStore';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type ProfileLinkProps = React.HTMLAttributes<HTMLAnchorElement> &
	PropsWithChildren;

export const ProfileLink = ({ children, ...attr }: ProfileLinkProps) => {
	const { user } = useUserStore();

	return (
		<>
			{user && (
				<Link to={`/profile/${user.id}`} {...attr}>
					{children}
				</Link>
			)}
		</>
	);
};
