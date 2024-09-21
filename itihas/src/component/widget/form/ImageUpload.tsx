import { uploadFile } from '@/shared/api/file';
import { getFullUrl } from '@/shared/lib/image';
import React, { useRef } from 'react';

export const ImageUpload = ({
	src,
	onUpload,
}: {
	src: string;
	onUpload: (filePath: string) => void;
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null);
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

	return (
		<div>
			{/* Изображение, которое заменяет input */}
			<div
				onClick={handleImageClick}
				style={{ cursor: 'pointer', display: 'inline-block' }}
			>
				<img src={getFullUrl(src)} alt='Selected' />
			</div>

			{/* Скрытый input для выбора файла */}
			<input
				type='file'
				ref={inputFileRef}
				onChange={handleFileChange}
				style={{ display: 'none' }}
				accept='image/*'
			/>
		</div>
	);
};
