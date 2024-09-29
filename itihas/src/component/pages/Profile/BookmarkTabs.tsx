import { memo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { UserAll } from '@/shared/type/user';
import { Link } from 'react-router-dom';
import { HistoryElement } from '../History/HistoryElement';

export const BookmarksTabs = memo(({ user }: { user: UserAll }) => {
	const [activeTab, setActiveTab] = useState(user.bookmarks[0].name);

	return (
		<Tabs value={activeTab}>
			<TabsList className='bg-transparent overflow-x-auto mb-1 w-full -ml-1 '>
				{user.bookmarks.map(b => (
					<TabsTrigger
						key={b.id}
						className={`text-foreground ${
							activeTab == b.name && 'text-primary'
						}`}
						value={b.name}
						onClick={() => setActiveTab(b.name)}
					>
						{b.name}
					</TabsTrigger>
				))}
			</TabsList>
			{user.bookmarks.map(b => (
				<TabsContent
					key={b.id + b.name}
					className='text-foreground grid sm:grid-cols-4 xl:grid-cols-7 md:grid-cols-5 lg:grid-cols-6 grid-cols-3 flex-wrap p-0 gap-3 mt-0 font-normal text-sm'
					value={b.name}
				>
					{b.histories.length == 0 && (
						<div>
							На данный момент историй в закладке {b.name}, но вы можете найти
							больше историй <Link to={'/'}>на главной странице</Link>
						</div>
					)}
					{b.histories.map(({ history: h }) => (
						<HistoryElement history={h} link={`/history/${h.id}`} />
					))}
				</TabsContent>
			))}
		</Tabs>
	);
});
