import { getGenres } from '@/shared/api/genre';
import {
	setDefaultLibraryHistory,
	useLibraryStore,
} from '@/shared/store/LibraryStore';
import { Genre } from '@/shared/type/history';
import { Button } from '@/shared/ui/button';
import { MultiSelect } from '@/shared/ui/multi-select';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select';
import { useQuery, useMount } from '@siberiacancode/reactuse';
import { Trash2Icon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const types = ['Аниме', 'Манга', 'Ранобэ'];
const statuses = ['Завершён', 'Выпускается', 'Анонс'];
const ageRatings = ['0', '6', '12', '16', '18']; // без +, чтобы проще в URL

export const LibraryAside = () => {
	const { setOptions, options } = useLibraryStore();
	const { data } = useQuery<Genre[]>(() => getGenres(), { initialData: [] });
	const [searchParams, setSearchParams] = useSearchParams();

	// Установка фильтров из URL при монтировании
	useMount(() => {
		const genres = searchParams.get('genres')?.split(',') ?? [];
		const type = searchParams.get('type') ?? undefined;
		const status = searchParams.get('status') ?? undefined;
		const minAge = searchParams.get('minAge') ?? undefined;

		setOptions({
			genres: genres.length
				? genres.map(g => ({ genre: g, allow: 'true' }))
				: undefined,
			type,
			status,
			minAge: minAge ? parseInt(minAge) : undefined,
		});
	});

	// Хелпер для обновления URL
	const updateSearchParams = (params: Record<string, string | undefined>) => {
		const newParams = new URLSearchParams(searchParams.toString());
		for (const key in params) {
			if (params[key] !== undefined && params[key] !== '') {
				newParams.set(key, params[key]!);
			} else {
				newParams.delete(key);
			}
		}
		setSearchParams(newParams);
	};

	return (
		<div className='w-full'>
			<div className='hidden md:flex items-center justify-between gap-2 text-sm mb-2'>
				<div className='text-lg'>Фильтры</div>
				<Button
					onClick={() => {
						setDefaultLibraryHistory();
						setSearchParams({});
					}}
					variant='ghost'
					className='rounded-md'
				>
					<Trash2Icon size={18} />
				</Button>
			</div>

			<div className='space-y-3'>
				{/* Жанры */}
				<MultiSelect
					variant='inverted'
					placeholder='Выберите жанр'
					animation={0}
					options={data.map(d => ({ label: d.name, value: d.name }))}
					onValueChange={s => {
						updateSearchParams({
							genres: s.join(','),
						});
						setOptions({
							genres: s.map(g => ({ genre: g, allow: 'true' })),
						});
					}}
					defaultValue={options.genres?.map(g => g.genre) ?? []}
				/>

				{/* Тип */}
				<Select
					defaultValue={options.type}
					onValueChange={type => {
						updateSearchParams({ type });
						setOptions({ type });
					}}
				>
					<SelectTrigger className='w-full h-8 text-sm'>
						<SelectValue placeholder='Выберите тип' />
					</SelectTrigger>
					<SelectContent>
						{types.map(type => (
							<SelectItem key={type} value={type}>
								{type}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Статус */}
				<Select
					defaultValue={options.status}
					onValueChange={status => {
						updateSearchParams({ status });
						setOptions({ status });
					}}
				>
					<SelectTrigger className='w-full h-8 text-sm'>
						<SelectValue placeholder='Выберите статус' />
					</SelectTrigger>
					<SelectContent>
						{statuses.map(status => (
							<SelectItem key={status} value={status}>
								{status}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Возраст */}
				<Select
					defaultValue={options.minAge?.toString()}
					onValueChange={age => {
						updateSearchParams({ minAge: age });
						setOptions({ minAge: parseInt(age) });
					}}
				>
					<SelectTrigger className='w-full h-8 text-sm'>
						<SelectValue placeholder='Возрастной рейтинг' />
					</SelectTrigger>
					<SelectContent>
						{ageRatings.map(age => (
							<SelectItem key={age} value={age}>
								{age}+
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
