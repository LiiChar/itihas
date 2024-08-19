import { useQuery } from '@siberiacancode/reactuse';
import { useParams } from 'react-router-dom';
import { getCurrentPage, getPagesByHistoriesId } from '../shared/api/page';
import { Suspense, useState } from 'react';

export const Read = () => {
	const { id } = useParams();
	const [currentPage, setCurrentPage] = useState(0);
	const { data } = useQuery(() => getCurrentPage(+id!, currentPage));

	if (!data) {
		return 'Loading..';
	}

	return (
		<div>
			<div>
				<img src={data.image} alt='' />
			</div>
			<div>{data.content}</div>
		</div>
	);
};
