import { useState, memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { UserAll } from '@/shared/type/user';
import { BookmarksTabs } from './BookmarkTabs';
import { Comment } from '../History/Comment';
import { HistoryElement } from '../History/HistoryElement';
import { CharacterElement } from '../History/CharacterElement';
import { PageListElement } from '../History/PageListElement';

export const ProfileTabs = memo(({ user }: { user: UserAll }) => {
	const [activeTab, setActiveTab] = useState('bookmarks');

	return (
		<Tabs value={activeTab}>
			<TabsList className='bg-secondary p-4 overflow-x-auto overflow-y-hidden w-full mb-1'>
				<TabsTrigger
					className={`text-foreground ${
						activeTab == 'bookmarks' && 'text-primary'
					}`}
					value={'bookmarks'}
					onClick={() => setActiveTab('bookmarks')}
				>
					Закладки
				</TabsTrigger>
				{user.authorHistories.length > 0 && (
					<TabsTrigger
						className={`text-foreground ${
							activeTab == 'histories' && 'text-primary'
						}`}
						value={'histories'}
						onClick={() => setActiveTab('histories')}
					>
						Истории
					</TabsTrigger>
				)}
				{user.comments.length > 0 && (
					<TabsTrigger
						className={`text-foreground ${
							activeTab == 'comments' && 'text-primary'
						}`}
						value={'comments'}
						onClick={() => setActiveTab('comments')}
					>
						Комментарии
					</TabsTrigger>
				)}
				{user.characters.length > 0 && (
					<TabsTrigger
						className={`text-foreground ${
							activeTab == 'characters' && 'text-primary'
						}`}
						value={'characters'}
						onClick={() => setActiveTab('characters')}
					>
						Персонажи
					</TabsTrigger>
				)}
				{user.likes.length > 0 && (
					<TabsTrigger
						className={`text-foreground ${
							activeTab == 'likes' && 'text-primary'
						}`}
						value={'likes'}
						onClick={() => setActiveTab('likes')}
					>
						Понравившиеся
					</TabsTrigger>
				)}
			</TabsList>
			<TabsContent className='' value='bookmarks'>
				<div id='bookmarks' className='bg-secondary rounded-md p-2'>
					<BookmarksTabs user={user} />
				</div>
			</TabsContent>

			{user.authorHistories.length > 0 && (
				<TabsContent className='' value='histories'>
					<div
						id='histories'
						className='text-foreground grid sm:grid-cols-4 xl:grid-cols-7 md:grid-cols-5 lg:grid-cols-6 grid-cols-3 flex-wrap p-0 gap-3 mt-0 font-normal text-sm'
					>
						{user.authorHistories.map(h => (
							<HistoryElement link={`/history/${h.id}`} history={h} />
						))}
					</div>
				</TabsContent>
			)}
			{user.comments.length > 0 && (
				<TabsContent className='' value='comments'>
					<div
						id='comments'
						className='grid grid-cols-1 lg:grid-cols-2 bg-secondary rounded-md gap-4 p-4'
					>
						{user.comments.map(c => {
							const comment = Object.assign({ user: user }, c);
							return <Comment comment={comment} />;
						})}
					</div>
				</TabsContent>
			)}
			{user.characters.length > 0 && (
				<TabsContent className='' value='characters'>
					<div
						id='characters'
						className='text-foreground grid sm:grid-cols-4 xl:grid-cols-7 md:grid-cols-5 lg:grid-cols-6 grid-cols-3 flex-wrap p-0 gap-3 mt-0 font-normal text-sm'
					>
						{user.characters.map(c => (
							<CharacterElement character={c.character} />
						))}
					</div>
				</TabsContent>
			)}
			{user.likes.length > 0 && (
				<TabsContent className='' value='likes'>
					<div
						id='likes'
						className='text-foreground grid sm:grid-cols-4 xl:grid-cols-7 md:grid-cols-5 lg:grid-cols-6 grid-cols-3 flex-wrap p-0 gap-3 mt-0 font-normal text-sm'
					>
						{user.likes.map(h => (
							<PageListElement link={`/history/${h.id}`} page={h.page} />
						))}
					</div>
				</TabsContent>
			)}
		</Tabs>
	);
});
