import { getGenres } from '@/shared/api/genre';
import { useLibraryStore } from '@/shared/store/LibraryStore';
import { Genre } from '@/shared/type/history';
import { MultiSelect } from '@/shared/ui/multi-select';
import { useQuery } from '@siberiacancode/reactuse';

export const LibraryAside = () => {
	const { setOptions, options } = useLibraryStore();
	const { data } = useQuery<Genre[]>(() => getGenres(), { initialData: [] });

	return (
		<div className='w-full'>
			<div className='flex justify-between gap-2 text-sm mb-5'>
				<div>Фильтры</div>
				<div>Очистить</div>
			</div>
			<div>
				<MultiSelect
					variant='inverted'
					placeholder='Выберите жанр'
					modalPopover={true}
					animation={0}
					options={
						data
							? data.map(d => ({ label: d.name, value: d.name }))
							: ([] as any)
					}
					onValueChange={s => {
						setOptions({
							genres: s.map(s => ({ genre: s, allow: 'true' })),
						});
					}}
					defaultValue={options.genres?.map(g => g.genre) ?? []}
				/>
			</div>
		</div>
	);
};
