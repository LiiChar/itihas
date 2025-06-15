import { memo } from 'react';
import { HistoryPages } from '../../../shared/type/history';
import { Link } from 'react-router-dom';

export const Genres = memo(({ history }: { history: HistoryPages }) => {
	return (
		<ul className='flex gap-1 flex-wrap'>
			{history.genres.map(g => (
				<li
					className='w-min text-nowrap bg-secondary rounded-xl px-2 py-1 '
					key={g.genre.id}
				>
					<Link
						className='text-foreground no-underline hover:text-primary'
						to={`/library?genres=${g.genre.name}`}
					>
						{g.genre.name}
					</Link>
				</li>
			))}
		</ul>
	);
});
