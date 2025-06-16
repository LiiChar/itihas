import { Genre, History } from '@/shared/type/history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { memo, useState } from 'react';
import { create } from 'zustand';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/shared/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/ui/input';
import { ImageUpload } from '@/component/widget/form/ImageUpload';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select';
import { useMount, useQuery } from '@siberiacancode/reactuse';
import { createHistory, getLayouts } from '@/shared/api/history';
import { Layout, LayoutComponent } from '@/shared/type/layout';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { useListenerStore } from '@/shared/store/ListenerStore';
import { useUserStore } from '@/shared/store/UserStore';
import { useNavigate } from 'react-router-dom';
import { handleImageError } from '@/shared/lib/image';
import { SoundUpload } from '@/component/widget/form/SoundUpload';
import { MultiSelect } from '@/shared/ui/multi-select';
import { getGenres } from '@/shared/api/genre';

type InsertHistory = Partial<History & { pages?: number[] }>;

type HistoryStoreAction = {
	setStore: (store: InsertHistory) => void;
};

export const useHistoryCreateStore = create<
	InsertHistory & HistoryStoreAction
>()(set => ({
	setStore: (store: InsertHistory) => {
		set(() => store);
	},
}));

const createHistoryInfoFormScheme = z.object({
	name: z
		.string()
		.min(3, 'Имя слишком короткое')
		.max(25, 'Имя слишком длинное'),
	description: z.string().nullable(),
	image: z.string(),
	wallpaper: z.string().nullable(),
	sound: z.string().nullable(),
	status: z.enum(['complete', 'write', 'frozen', 'announcement']),
	genres: z.array(z.number()).nullable(),
});
const createHistoryOptionInfoFormScheme = z.object({
	minAge: z.number().min(0),
	type: z.enum(['free', 'paid']),
	globalAction: z.string().nullable(),
});

const StatusTranslate: Record<
	(typeof createHistoryInfoFormScheme)['_input']['status'],
	string
> = {
	announcement: 'Анонсировано',
	complete: 'Завершено',
	frozen: 'Завершено',
	write: 'Пишется',
};

const TypeTranslate: Record<
	(typeof createHistoryOptionInfoFormScheme)['_input']['type'],
	string
> = {
	free: 'Бесплатно',
	paid: 'Платно',
};

const HistoryInfo = memo(() => {
	const form = useForm<z.infer<typeof createHistoryInfoFormScheme>>({
		resolver: zodResolver(createHistoryInfoFormScheme),
		defaultValues: {
			name: '',
			image: '',
			description: '',
			sound: '',
			status: 'announcement',
			wallpaper: '',
			genres: [],
		},
	});

	const [genres, setGenres] = useState<Genre[]>([]);

	useMount(() => {
		getGenres().then(data => {
			setGenres(data);
		});
	});
	const setStore = useHistoryCreateStore(state => state.setStore);

	useListenerStore(state => state.addCallback)('historyChangeForm', () => {
		const data: any = form.getValues();
		data.authorId = useUserStore.getState().user?.id ?? undefined;
		setStore(form.getValues());
	});

	return (
		<Form {...form}>
			<form>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Название</FormLabel>
							<FormControl>
								<Input
									className='bg-background -translate-y-2'
									placeholder='Введите название'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Описание</FormLabel>
							<FormControl>
								<Textarea
									className='bg-background -translate-y-2'
									placeholder='Введите описание'
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='image'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Изображение</FormLabel>
							<ImageUpload
								src={field.value ?? ''}
								onUpload={path => {
									form.setValue('image', path);
								}}
								className='mx-auto max-h-40 pb-2'
							/>
							<FormControl>
								<Input
									className='bg-background -translate-y-2 rounded-t-none'
									placeholder='Вставьте изображение'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='wallpaper'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Задний фон</FormLabel>
							<ImageUpload
								src={field.value ?? ''}
								onUpload={path => {
									form.setValue('wallpaper', path);
								}}
								className='mx-auto max-h-40 pb-2'
							/>
							<FormControl>
								<Input
									className='bg-background -translate-y-2'
									placeholder='Вставьте изображения заднего фона'
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='sound'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Музыка</FormLabel>
							<SoundUpload
								src={field.value ?? ''}
								onUpload={path => {
									form.setValue('sound', path);
								}}
								className='pb-3'
							/>
							<FormControl>
								<Input
									className='bg-background -translate-y-2'
									placeholder='Вставьте музыку'
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Статус</FormLabel>
							<Select
								value={StatusTranslate[field.value]}
								onValueChange={it =>
									form.setValue(
										'status',
										it as (typeof createHistoryInfoFormScheme)['_input']['status']
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Статус' />
								</SelectTrigger>
								<SelectContent>
									{['complete', 'write', 'frozen', 'announcement'].map(it => (
										<SelectItem key={it} value={it}>
											{
												StatusTranslate[
													it as (typeof createHistoryInfoFormScheme)['_input']['status']
												]
											}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='genres'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground mt-6 -mb-2'>
								Жанры
							</FormLabel>
							<MultiSelect
								variant='inverted'
								placeholder='Выберите жанры'
								modalPopover={true}
								animation={0}
								options={
									genres
										? genres.map(d => ({ label: d.name, value: d.id }))
										: ([] as any)
								}
								onValueChange={s => {
									form.setValue('genres', s as any);
								}}
								defaultValue={(field.value ?? []) as any}
							/>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
});

export const Layouts = memo(() => {
	const { data: layouts } = useQuery(getLayouts, {
		initialData: [],
		placeholderData: [],
	});
	const { setStore, layoutId } = useHistoryCreateStore();

	return (
		<section>
			<h2 className='text-center mb-4'>
				Выберите расположение блоков в истории
			</h2>
			<div className='flex-1 flex gap-4 select-none'>
				{(layouts ?? ([] as Layout[])).map(l => (
					<div
						className={`gap-3 w-1/3 flex flex-col border-2 hover:border-2 hover:border-primary/50  bg-secondary p-4 rounded-sm ${
							layoutId == l.id && 'border-primary'
						}`}
						key={l.id!}
						onClick={() => {
							setStore({ layoutId: l.id! });
						}}
					>
						{l.layout.map(c => (
							<div key={l.id! + l.name + c.type} className=''>
								{getComponent(c, l.id! ?? c.type)}
							</div>
						))}
					</div>
				))}
			</div>
		</section>
	);
});
const HistoryOptionInfo = memo(() => {
	const form = useForm<z.infer<typeof createHistoryOptionInfoFormScheme>>({
		resolver: zodResolver(createHistoryOptionInfoFormScheme),
		defaultValues: {
			globalAction: '',
			minAge: 0,
			type: 'free',
		},
	});

	const setStore = useHistoryCreateStore(state => state.setStore);

	useListenerStore(state => state.addCallback)('historyChangeForm', () => {
		setStore(form.getValues());
	});

	return (
		<Form {...form}>
			<form>
				<FormField
					control={form.control}
					name='minAge'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>
								Минимальный возраст чтения
							</FormLabel>
							<FormControl>
								<Input
									type='number'
									className='bg-background -translate-y-2'
									placeholder='Введите возраст'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='type'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>Статус</FormLabel>
							<Select
								value={TypeTranslate[field.value]}
								onValueChange={it =>
									form.setValue(
										'type',
										it as (typeof createHistoryOptionInfoFormScheme)['_input']['type']
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Статус' defaultValue={field.name} />
								</SelectTrigger>
								<SelectContent>
									{['free', 'paid'].map(it => (
										<SelectItem value={it}>
											{
												TypeTranslate[
													it as (typeof createHistoryOptionInfoFormScheme)['_input']['type']
												]
											}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='globalAction'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-foreground'>
								Инициализируюзий стрипт
							</FormLabel>
							<FormControl>
								<Textarea
									className='bg-background -translate-y-2'
									placeholder='Введите описание'
									{...field}
									value={field.value ?? ''}
								>
									{field.value ?? ''}
								</Textarea>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
});
export const CreateHistory = memo(() => {
	const tabs = [
		{
			value: 'Описание',
			content: <HistoryInfo />,
		},
		{
			value: 'Лейаут',
			content: <Layouts />,
		},
		{
			value: 'Дополнительные данные',
			content: <HistoryOptionInfo />,
		},
	];
	const [activeTab, setActiveTab] = useState(tabs[0].value);
	const runCallback = useListenerStore(state => state.runListener);
	const history = useHistoryCreateStore();
	const { user } = useUserStore();
	const navigate = useNavigate();

	return (
		<section>
			<div className='flex justify-center mt-4'>
				<Tabs value={activeTab} className='w-[min(95%,600px)]'>
					<TabsList className='bg-transparent -ml-1 text-xs flex flex-row gap-2'>
						{tabs.map((t, i) => (
							<>
								<TabsTrigger
									key={t.value}
									className={`border-[1px] aspect-square border-secondary text-foreground rounded-[50%] flex justify-center items-center ${
										activeTab == t.value && 'text-accent border-primary'
									}`}
									value={t.value}
									onClick={() => {
										runCallback('historyChangeForm');
										setActiveTab(t.value);
									}}
								>
									{i + 1}
								</TabsTrigger>
								<div
									className={`w-[min(75px,20%)] h-[1px] bg-foreground -translate-y-[1px] ${
										i == tabs.length - 1 && 'hidden'
									}`}
								></div>
							</>
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
			</div>
			<div className='flex justify-center mt-4'>
				<div className='w-[min(95%,600px)]'>
					<div className='flex justify-between'>
						<div>
							{tabs.findIndex(value => value.value == activeTab) != 0 && (
								<Button
									onClick={() => {
										setActiveTab(
											tabs[
												tabs.findIndex(value => value.value == activeTab) - 1
											].value
										);
									}}
								>
									Предыдущий
								</Button>
							)}
						</div>
						<div>
							{tabs.findIndex(value => value.value == activeTab) ==
							tabs.length - 1 ? (
								<Button
									onClick={async () => {
										const res = await createHistory(
											Object.assign(history as any, { authorId: user?.id })
										);
										if (!res) return;
										if (!res.id) return;
										navigate(`/history/${res.id}/page/edit`);
									}}
								>
									Создать
								</Button>
							) : (
								<Button
									onClick={() => {
										runCallback('historyChangeForm');
										setActiveTab(
											tabs[
												tabs.findIndex(value => value.value == activeTab) + 1
											].value
										);
									}}
								>
									Следующий
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
});

export const getComponent = (
	component: LayoutComponent,
	index: string | number
) => {
	const Component = LayoutComponents[component.type];
	return <Component c={component} key={index} />;
};

export const ContentLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='text-pretty'>
			<div className=' flex justify-center items-center aspect-[16/4] animate-pulse bg-background'>
				Содержание
			</div>
		</div>
	);
};

export const PointLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='flex aspect-[16/5] flex-col gap-2 justify-start items-start'>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3 animate-pulse bg-background'>
				Пункты выбора
			</div>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
		</div>
	);
};

export const ImageLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='relative aspect-[12/9] w-full animate-pulse bg-background  flex justify-center items-center'>
			<img
				className='absolute top-0 left-0 h-full aspect-[12/9] object-cover w-full rounded-tl-lg rounded-tr-lg'
				src={''}
				alt=''
				onError={handleImageError}
			/>
			Изображение
		</div>
	);
};

export const CustomLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const ActionLayout = ({}: { c: LayoutComponent }) => {
	return <Button>Действие</Button>;
};

export const ListLayout = ({}: { c: LayoutComponent }) => {
	return (
		<div className='flex aspect-[16/5] flex-col gap-2 justify-start items-start'>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3 animate-pulse bg-background'>
				Список
			</div>
			<div className='w-full h-1/3 animate-pulse bg-background'></div>
		</div>
	);
};

export const BlockLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const VideoLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

export const TextLayout = ({}: { c: LayoutComponent }) => {
	return 'custom';
};

const LayoutComponents: Record<LayoutComponent['type'], any> = {
	image: ImageLayout,
	points: PointLayout,
	content: ContentLayout,
	action: ActionLayout,
	list: ListLayout,
	block: BlockLayout,
	video: VideoLayout,
	text: TextLayout,
};
