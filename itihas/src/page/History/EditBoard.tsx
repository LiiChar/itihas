import { AsideHeader } from '@/component/layout/aside';
import { Board } from '@/component/widget/board/Board';
import { getHistory } from '@/shared/api/history';
import { useLayout } from '@/shared/hooks/useLayout';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { HistoryPages } from '@/shared/type/history';
import { useQuery } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const HistoryEditBoard = () => {
	const { id } = useParams();
	const addCallback = useListenerStore(state => state.addCallback);
	const [history, setHistory] = useState<null | HistoryPages>(null);
	const { data, refetch } = useQuery(() => getHistory(+id!), {
		onSuccess: data => {
			setHistory(data);
		},
	});
	useLayout({
		Header: () => <AsideHeader />,
		header: true,
		footer: false,
	});
	useEffect(() => {
		addCallback('EditHistory', () => {
			refetch();
			setHistory(data!);
		});
	}, []);
	if (!history) {
		return 'Loading';
	}
	return (
		<div className='w-full h-full'>
			<Board history={history} />
		</div>
	);
};
