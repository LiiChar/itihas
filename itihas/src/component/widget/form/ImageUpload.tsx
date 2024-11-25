import { uploadFile } from '@/shared/api/file';
import { getFullUrl } from '@/shared/lib/image';
import React, { memo, useRef, useState } from 'react';
import placeholderImage from '@/assets/placeholder.png';

export const ImageUpload = memo(
	({
		src,
		onUpload,
	}: {
		src: string;
		onUpload: (filePath: string) => void;
	}) => {
		const inputFileRef = useRef<HTMLInputElement>(null);
		const [isDragOver, setIsDragOver] = useState(false);
		const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				const formData = new FormData();
				formData.append('file', e.target.files[0]);
				const filePath = await uploadFile(formData);
				onUpload(filePath.data);
			}
		};

		const handleImageClick = () => {
			if (inputFileRef.current) inputFileRef.current.click();
		};

		const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			setIsDragOver(false);
			const droppedFiles = event.dataTransfer.files;
			console.log(droppedFiles);
			if (droppedFiles.length > 0) {
				const newFiles = Array.from(droppedFiles);

				const formData = new FormData();
				formData.append('file', newFiles[0] as any);
				const filePath = await uploadFile(formData);
				onUpload(filePath.data);
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
			>
				<div className='relative bg-white rounded-t-sm'>
					<img
						className={`w-full object-containt rounded-t-sm`}
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
