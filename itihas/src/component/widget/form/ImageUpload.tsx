import { uploadFile } from '@/shared/api/file';
import { getFullUrl } from '@/shared/lib/image';
import React, { ComponentProps, memo, useRef, useState } from 'react';
import placeholderImage from '@/assets/placeholder.png';
import { cn } from '@/shared/lib/lib';

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
			visiblePath?: boolean;
		};
	}) => {
		const inputFileRef = useRef<HTMLInputElement>(null);
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
				</div>
			</div>
		);
	}
);
