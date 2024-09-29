import { memo } from 'react';
import { HistoryPages } from '../../../shared/type/history';

export const Genres = memo(({ history }: { history: HistoryPages }) => {
	return (
		<ul className='flex gap-1 flex-wrap'>
			{history.genres.map(g => (
				<li
					className='w-min text-nowrap bg-secondary rounded-xl px-2 py-1 hover:text-primary'
					key={g.genre.id}
				>
					{g.genre.name}
				</li>
			))}
		</ul>
	);
});
