import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select';
import { Character } from '@/shared/type/character';
import { ImageUpload } from '../form/ImageUpload';
import { useUserStore } from '@/shared/store/UserStore';
import { useHistoryStore } from '@/shared/store/HistoryStore';
import { toast } from 'sonner';
import { createCharacter } from '@/shared/api/character';

// Схема валидации для формы создания персонажа
const characterFormSchema = z.object({
	name: z.string().min(3, 'Имя слишком короткое'),
	rarity: z
		.enum([
			'handmade',
			'common',
			'uncommon',
			'rare',
			'epic',
			'legendary',
			'mythic',
			'transcendent',
		])
		.nullable(),
	image: z.string().nullable(),
	description: z.string().nullable(),
	rank: z.number().min(1, 'Ранг должен быть не менее 1'),
});

export const CreateCharacterForm = ({
	onSubmit,
	data,
}: {
	onSubmit?: (character: Character) => void;
	data?: Partial<Character>;
}) => {
	const form = useForm<z.infer<typeof characterFormSchema>>({
		resolver: zodResolver(characterFormSchema),
		defaultValues: {
			name: '',
			rarity: null,
			image: null,
			description: null,
			rank: 1,
		},
	});

	const onSubmitCreate = async (
		values: z.infer<typeof characterFormSchema>
	) => {
		const authorId = data?.authorId! ?? useUserStore.getState().user?.id;
		const historyId = data?.historyId ?? useHistoryStore.getState().history?.id;

		if (!historyId) {
			toast('Произошла ошибка при создании персонажа. Попробуйте позже');
			return;
		}

		const characterData = {
			...values,
			authorId,
			historyId,
		};

		const character = await createCharacter(characterData as any);

		if (!character) {
			toast('Произошла ошибка при создании персонажа. Попробуйте позже');
			return;
		}
		toast(`Персонаж ${character.name} успешно создан`);
		onSubmit && onSubmit(character as Character);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitCreate)} className=''>
				<div className='w-full px-2 max-h-[73vh] h-[calc(100%-46px)] overflow-y-scroll'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Имя персонажа</FormLabel>
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите имя персонажа'
										{...field}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='rarity'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Редкость</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										value={field.value ?? ''}
									>
										<SelectTrigger className='bg-background -translate-y-2'>
											<SelectValue placeholder='Выберите редкость' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='handmade'>Handmade</SelectItem>
											<SelectItem value='common'>Common</SelectItem>
											<SelectItem value='uncommon'>Uncommon</SelectItem>
											<SelectItem value='rare'>Rare</SelectItem>
											<SelectItem value='epic'>Epic</SelectItem>
											<SelectItem value='legendary'>Legendary</SelectItem>
											<SelectItem value='mythic'>Mythic</SelectItem>
											<SelectItem value='transcendent'>Transcendent</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='image'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Ссылка на изображение
								</FormLabel>
								<ImageUpload
									src={field.value ?? ''}
									onUpload={path => {
										form.setValue('image', path);
									}}
								/>
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите ссылку на изображение'
										{...field}
										value={field.value ?? ''}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
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
										placeholder='Введите описание персонажа'
										{...field}
										value={field.value ?? ''}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='rank'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Ранг</FormLabel>
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите ранг персонажа'
										type='number'
										{...field}
										onChange={e => field.onChange(parseInt(e.target.value))}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button className='mt-2 float-end' type='submit'>
							Сохранить
						</Button>
					</DialogClose>
				</DialogFooter>
			</form>
		</Form>
	);
};
