import { AsideHeader } from '@/component/layout/aside';
import { Board } from '@/component/widget/board/Board';
import { getHistory } from '@/shared/api/history';
import { useLayout } from '@/shared/hooks/useLayout';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { useQuery } from '@siberiacancode/reactuse';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const HistoryEditBoard = () => {
	const { id } = useParams();
	const addCallback = useListenerStore(state => state.addCallback);
	const { data, refetch } = useQuery(() => getHistory(+id!));
	useLayout({
		Header: () => <AsideHeader />,
		header: true,
	});
	useEffect(() => {
		addCallback('EditHistory', () => {
			console.log('a');

			refetch();
		});
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
