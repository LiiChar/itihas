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
import { createPagePoint } from '@/shared/api/page';
import { DialogClose } from '@radix-ui/react-dialog';
import { DialogFooter } from '@/shared/ui/dialog';
import { PagePointInsert } from '@/shared/type/page';

const pageloginFormScheme = z.object({
	name: z.string(),
	action: z.string(),
});

export const CreatePointPageForm = ({ pageId }: { pageId: number }) => {
	const form = useForm<z.infer<typeof pageloginFormScheme>>({
		resolver: zodResolver(pageloginFormScheme),
		defaultValues: {
			action: '',
			name: '',
		},
	});
	function removeNullableValues<T extends object>(obj: T): T {
		return Object.fromEntries(
			Object.entries(obj).filter(
				([_, value]) => value !== null || (value !== '' && value !== undefined)
			)
		) as T;
	}
	const onSubmitCreate = async (
		values: z.infer<typeof pageloginFormScheme>
	) => {
		const data: unknown = removeNullableValues(values);
		await createPagePoint(pageId, data as unknown as PagePointInsert);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitCreate)} className=''>
				<div className='w-full px-2 max-h-[73vh] h-[calc(100%-44px)] overflow-scroll'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Название соединения
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
						name='action'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Опишите действия соединения
								</FormLabel>
								<FormControl>
									<Textarea
										className='bg-background -translate-y-2'
										placeholder='Введите название страницы'
										{...field}
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
