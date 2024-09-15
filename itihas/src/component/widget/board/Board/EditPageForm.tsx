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
import { updatePage } from '@/shared/api/page';
import { runRefreshAction } from '@/shared/store/RefreshStore';
import { DialogClose } from '@radix-ui/react-dialog';
import { ImageUpload } from '../../form/ImageUpload';
import { SoundUpload } from '../../form/SoundUpload';
import { DialogFooter } from '@/shared/ui/dialog';
import { Page } from '@/shared/type/page';
import { HistoryPage } from '@/shared/type/history';

const loginFormScheme = z.object({
	name: z.string().min(3, 'Имя слишком короткое'),
	description: z.string(),
	content: z.string(),
	image: z.string().nullable(),
	wallpaper: z.string().nullable(),
	sound: z.string().nullable(),
});

export const EditPageForm = ({ page }: { page: HistoryPage }) => {
	const form = useForm<z.infer<typeof loginFormScheme>>({
		resolver: zodResolver(loginFormScheme),
		defaultValues: {
			content: page.content,
			description: page.description ?? undefined,
			image: page.image,
			name: page.name,
			sound: page.sound ?? undefined,
			wallpaper: page.wallpaper ?? undefined,
		},
	});
	function removeNullableValues<T extends object>(obj: T): T {
		return Object.fromEntries(
			Object.entries(obj).filter(([_, value]) => value !== null)
		) as T;
	}
	const onSubmitEdit = async (values: z.infer<typeof loginFormScheme>) => {
		const data: unknown = removeNullableValues(values);
		await updatePage(page.id, data as unknown as Partial<Page>);
		runRefreshAction('EditHistory');
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitEdit)} className=''>
				<div className='w-full px-2 max-h-[73vh] h-[calc(100%-46px)] overflow-scroll'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Название страницы
								</FormLabel>
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите название страницы'
										{...field}
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
										placeholder='Введите описание страницы'
										{...field}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='content'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Содержание</FormLabel>
								<FormControl>
									<Textarea
										className='bg-background -translate-y-2'
										placeholder='Введите содержание страницы'
										{...field}
									/>
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
								{field.value && (
									<ImageUpload
										src={field.value}
										onUpload={path => {
											form.setValue('image', path);
										}}
									/>
								)}
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
						name='wallpaper'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Задний фон</FormLabel>
								{field.value && (
									<ImageUpload
										src={field.value}
										onUpload={path => {
											form.setValue('image', path);
										}}
									/>
								)}
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Выберите задний фон'
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
						name='sound'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Ссылка на музыку
								</FormLabel>
								{field.value && (
									<SoundUpload
										src={field.value}
										onUpload={src => form.setValue('sound', src)}
									/>
								)}

								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите ссылку на музыку'
										{...field}
										value={field.value ?? ''}
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
