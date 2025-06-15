import { uploadFile } from '@/shared/api/file';
import { getFullUrl } from '@/shared/lib/image';
import React, { ComponentProps, memo, useRef, useState } from 'react';
import placeholderImage from '@/assets/placeholder.png';
import { cn } from '@/shared/lib/lib';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';
import { Lightbulb } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { axi } from '@/shared/api/axios/axios';

export const ImageUpload = memo(
	({
		src,
		onUpload,
		className,
		options,
		...props
	}: ComponentProps<'img'> & {
		src: string;
		onUpload?: (filePath: string) => void;
		options?: {
			generate?: boolean;
			visiblePath?: boolean;
		};
	}) => {
		const inputFileRef = useRef<HTMLInputElement>(null);
		const [generateText, setGenerateText] = useState('');
		const [isDragOver, setIsDragOver] = useState(false);
		const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				const formData = new FormData();
				formData.append('file', e.target.files[0]);
				const filePath = await uploadFile(formData);
				onUpload && onUpload(filePath.data);
			}
		};

		const handleImageClick = () => {
			if (inputFileRef.current) inputFileRef.current.click();
		};

		const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			setIsDragOver(false);
			const droppedFiles = event.dataTransfer.files;

			if (droppedFiles.length > 0) {
				const newFiles = Array.from(droppedFiles);

				const formData = new FormData();
				formData.append('file', newFiles[0] as any);
				const filePath = await uploadFile(formData);
				onUpload && onUpload(filePath.data);
			}
		};

		return (
			<div
				onClick={handleImageClick}
				style={{ cursor: 'pointer', display: 'block' }}
				onDrop={handleDrop}
				onDragOver={event => {
					event.preventDefault();
				}}
				onDragEnter={() => setIsDragOver(true)}
				onDragExit={() => setIsDragOver(false)}
				className='w-full h-full'
			>
				<div className='w-full h-full relative rounded-t-sm'>
					<img
						{...props}
						className={cn(`w-full object-contain rounded-t-sm `, className)}
						src={getFullUrl(src)}
						onError={e => {
							e.currentTarget.src = placeholderImage;
						}}
						alt=''
					/>
					{isDragOver && (
						<div className='absolute bg-black/80 w-full top-0 left-0 h-full border-6 border-secondary flex justify-center items-center'>
							Переместите изображение
						</div>
					)}
					<input
						type='file'
						ref={inputFileRef}
						onChange={handleFileChange}
						style={{ display: 'none' }}
						accept='image/*'
					/>
					{options?.generate && (
						<Popover>
							<PopoverTrigger onClick={e => e.stopPropagation()} asChild>
								<Button
									className='absolute right-1 p-0 top-2 hover:bg-transparent '
									variant='ghost'
								>
									<Lightbulb className='hover:stroke-primary' />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								onClick={e => e.stopPropagation()}
								className='w-80 z-[1000000] p-0'
							>
								<Input
									className='z-[100000000] min-h-6 px-3 py-3 w-full h-full m-0'
									autoFocus={true}
									placeholder='Введите текст для генерации'
								/>
							</PopoverContent>
						</Popover>
					)}
				</div>
				{options?.generate && (
					<>
						<Input
							value={generateText}
							onChange={e => setGenerateText(e.target.value)}
						/>

						<Button
							onClick={async () => {
								const res: any = await axi.post(
									'https://api.craiyon.com/generate',
									{
										prompt: generateText,
									}
								);
								if (inputFileRef && inputFileRef.current) {
									inputFileRef.current.src = res.images;
								}
							}}
						>
							Сгенерировать
						</Button>
					</>
				)}
			</div>
		);
	}
);
