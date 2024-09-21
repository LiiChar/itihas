import { HistoryPages } from '../../../shared/type/history';
import { Genres } from './Genres';
import { memo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export const Description = memo(({ history }: { history: HistoryPages }) => {
	return (
		<div>
			<div className='mb-5'>{history.description}</div>
			<div>
				<Genres history={history} />
			</div>
		</div>
	);
});

export const TabsInfo = memo(({ history }: { history: HistoryPages }) => {
	const tabs = [
		{
			value: 'Описание',
			content: <Description history={history} />,
		},
		{
			value: 'Персонажи',
			content: '1',
		},
	];
	const [activeTab, setActiveTab] = useState(tabs[0].value);

	return (
		<Tabs value={activeTab}>
			<TabsList className='bg-transparent -ml-1 text-xs'>
				{tabs.map(t => (
					<TabsTrigger
						key={t.value}
						className={`rounded-none text-foreground ${
							activeTab == t.value && 'text-accent'
						}`}
						value={t.value}
						onClick={() => setActiveTab(t.value)}
					>
						{t.value}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map(t => (
				<TabsContent
					key={t.value}
					className='text-foreground p-0 font-normal text-sm'
					value={t.value}
				>
					{t.content}
				</TabsContent>
			))}
		</Tabs>
	);
});
