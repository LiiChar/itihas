import { Board } from '@/component/widget/board/Board';
import { getHistory } from '@/shared/api/history';
import { addRefreshAction } from '@/shared/store/RefreshStore';
import { useQuery } from '@siberiacancode/reactuse';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const HistoryEditBoard = () => {
	const { id } = useParams();
	const { data, refetch } = useQuery(() => getHistory(+id!));
	useEffect(() => {
		addRefreshAction('EditHistory', refetch);
	}, []);
	if (!data) {
		return 'Loading';
	}
	return (
		<div className='w-full h-full'>
			<Board history={data} />
		</div>
	);
};
