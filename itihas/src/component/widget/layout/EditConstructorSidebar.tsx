import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/shared/ui/select';
import { useLayoutBuildStore } from '@/shared/store/LayoutBuildStore';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import {
	SheetTrigger,
	Sheet,
	SheetContent,
	SheetTitle,
} from '@/shared/ui/sheet';
import { Textarea } from '@/shared/ui/textarea';
import { ArrowRightIcon, Plus, Trash } from 'lucide-react';
import { ReactNode } from 'react';
import { LayoutComponents } from './Constructor';
import { LayoutComponent } from '@/shared/type/layout';
import { ImageUpload } from '../form/ImageUpload';

export type EditConstructorSidebar = {
	children?: ReactNode;
	visible?: boolean;
};

export const EditConstructorSidebar = ({
	children,
}: EditConstructorSidebar) => {
	const { selectedLayout, removeTemplate, updateTemplate, addTemplate } =
		useLayoutBuildStore();

	return (
		<>
			{selectedLayout && (
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							className='fixed top-[calc(50%-20px)] z-20 right-0 p-0 bg-secondary m-0 hover:bg-primary'
						>
							{children ?? <ArrowRightIcon />}
						</Button>
					</SheetTrigger>
					<SheetContent
						className='md:min-w-1/2 sm:min-w-[50%] overflow-auto'
						side={'right'}
					>
						<SheetTitle>
							Блок {selectedLayout.type} с идентификатором {selectedLayout.id}
						</SheetTitle>
						<div className='grid gap-4 py-4'>
							<div className='flex gap-1'>
								<Plus
									onClick={() =>
										addTemplate(selectedLayout.id, undefined, undefined, true)
									}
								/>
								<Trash onClick={() => removeTemplate(selectedLayout.id)} />
							</div>
							<Label>Тип блока</Label>
							<Select
								onValueChange={e =>
									updateTemplate(selectedLayout.id, {
										type: e as LayoutComponent['type'],
									})
								}
								value={selectedLayout.type}
							>
								<SelectTrigger>{selectedLayout.type}</SelectTrigger>
								<SelectContent>
									{Object.keys(LayoutComponents).map(c => (
										<SelectItem key={c} value={c}>
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Label>Содержание</Label>
							{selectedLayout.type == 'image' && (
								<ImageUpload
									className='max-h-28 '
									src={selectedLayout.content}
									onUpload={path => {
										updateTemplate(selectedLayout.id, { content: path });
									}}
								/>
							)}
							<Textarea
								onChange={e => {
									const content = e.currentTarget.value;
									updateTemplate(selectedLayout.id, { content });
								}}
							>
								{selectedLayout.content}
							</Textarea>
							<Label>Стили</Label>

							<Textarea
								onChange={e => {
									const style = e.currentTarget.value;
									updateTemplate(selectedLayout.id, { style });
								}}
							>
								{selectedLayout.style}
							</Textarea>
						</div>
					</SheetContent>
				</Sheet>
			)}
		</>
	);
};
