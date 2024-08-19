import React from 'react';
import { getHistories } from '../shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { Link } from 'react-router-dom';

export const Main = () => {
	const { data, isLoading } = useQuery(() => getHistories());
	return (
		<div>
			{data?.data.map(hist => (
				<Link to={`/history/${hist.id}`}>{hist.name}</Link>
			))}
		</div>
	);
};
