import { memo } from 'react';
import { HistoryPages } from '@/shared/type/history';
import { cn } from '@/shared/lib/lib';
import {
	BookText,
	Star,
	Eye,
	Bookmark,
	ShieldCheck,
	CalendarDays,
	Type,
} from 'lucide-react';
import { motion } from 'framer-motion';

const translate = {
	status: {
		announcement: 'Анонсирована',
		complete: 'Завершена',
		write: 'Выпускается',
		frozen: 'Заморожена',
	} as Record<string, string>,
	type: {
		free: 'Бесплатная',
		paid: 'Платная',
	} as Record<string, string>,
};

const IconMap = {
	pages: <BookText className='w-4 h-4 text-muted-foreground' />,
	status: <CalendarDays className='w-4 h-4 text-muted-foreground' />,
	type: <Type className='w-4 h-4 text-muted-foreground' />,
	rate: <Star className='w-4 h-4 text-yellow-500' />,
	views: <Eye className='w-4 h-4 text-blue-500' />,
	bookmarks: <Bookmark className='w-4 h-4 text-purple-500' />,
	pg: <ShieldCheck className='w-4 h-4 text-red-400' />,
};

interface InfoProps {
	history: HistoryPages;
	className?: string;
}

const tileVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.05,
			duration: 0.25,
			ease: 'easeOut',
		},
	}),
};

const Tile = ({
	label,
	value,
	index,
}: {
	label: string;
	value: React.ReactNode;
	index: number;
}) => (
	<motion.div
		custom={index}
		initial='hidden'
		animate='visible'
		variants={tileVariants}
		className='flex items-start gap-2 p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border hover:shadow-md transition-shadow duration-300'
	>
		<div className='flex flex-col'>
			<span className='text-xs text-muted-foreground'>{label}</span>
			<span className='text-sm font-semibold'>{value}</span>
		</div>
	</motion.div>
);

export const Info = memo(({ history, className }: InfoProps) => {
	const items = [
		{ label: 'Страниц', value: history.pages.length, icon: IconMap.pages },
		{
			label: 'Статус',
			value: translate.status[history.status] ?? '—',
			icon: IconMap.status,
		},
		{
			label: 'Тип',
			value: translate.type[history.type] ?? '—',
			icon: IconMap.type,
		},
		{ label: 'Рейтинг', value: history.rate ?? '—', icon: IconMap.rate },
		{ label: 'Прочитано', value: history.views ?? 0, icon: IconMap.views },
		{
			label: 'Закладки',
			value: history.bookmarks?.length ?? 0,
			icon: IconMap.bookmarks,
		},
		{ label: 'PG', value: `${history.minAge ?? 0}+`, icon: IconMap.pg },
	];

	return (
		<div className={cn('flex flex-wrap gap-2 ', className)}>
			{items.map((item, i) => (
				<Tile
					key={item.label}
					label={item.label}
					value={item.value}
					index={i}
				/>
			))}
		</div>
	);
});
