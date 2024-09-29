import { memo } from 'react';
import { HistoryPages } from '../../../shared/type/history';

const translate = {
	status: {
		announcement: 'Анонсирован',
		complete: 'Завершен',
		write: 'Выпускается',
		frozen: 'Заморожен',
	},
	type: {
		free: 'Доступная',
		paid: 'Планая',
	},
};

export const Info = memo(({ history }: { history: HistoryPages }) => {
	return (
		<div className='flex gap-3 mt-2 border-b-1 flex-wrap text-sm'>
			<div>
				<p className='text-secondary-foreground '>Страниц</p>
				<p>{history.pages.length}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Статус</p>
				<p>{translate['status'][history.status]}</p>
			</div>

			<div>
				<p className='text-secondary-foreground'>Тип истории</p>
				<p>{translate['type'][history.type]}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Рейтинг</p>
				<p>{history.rate}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Прочитано</p>
				<p>{history.views}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>Закладки</p>
				<p>{history.bookmarks.length}</p>
			</div>
			<div>
				<p className='text-secondary-foreground'>PG</p>
				<p>{history.minAge ?? 0}+</p>
			</div>
		</div>
	);
});
