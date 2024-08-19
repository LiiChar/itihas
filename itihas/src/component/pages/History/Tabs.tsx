import {
	Tabs as TabsList,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
} from '@material-tailwind/react';
import { HistoryPages } from '../../../shared/type/history';
import { Info } from './Info';
import { Genres } from './Genres';
import { memo, useState } from 'react';

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

export const Tabs = memo(({ history }: { history: HistoryPages }) => {
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
		<TabsList value={activeTab}>
			<TabsHeader
				indicatorProps={{
					className:
						'bg-gray-transparent shadow-none border-b-2 rounded-none border-primary',
				}}
				className='bg-transparent mb-4 -translate-x-3 max-w-28 text-xs'
			>
				{tabs.map(t => (
					<Tab
						key={t.value}
						className={`rounded-none text-foreground ${
							activeTab == t.value && 'text-accent'
						}`}
						value={t.value}
						onClick={() => setActiveTab(t.value)}
					>
						{t.value}
					</Tab>
				))}
			</TabsHeader>
			<TabsBody className='p-0'>
				{tabs.map(t => (
					<TabPanel
						key={t.value}
						className='text-foreground p-0 font-normal text-sm'
						value={t.value}
					>
						{t.content}
					</TabPanel>
				))}
			</TabsBody>
		</TabsList>
	);
});
