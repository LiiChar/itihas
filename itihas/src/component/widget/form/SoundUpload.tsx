import { uploadFile } from '@/shared/api/file';
import { getFullUrl } from '@/shared/lib/image';
import { PlusSquare } from 'lucide-react';
import React, { useRef } from 'react';

export const SoundUpload = ({
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

	const handleSoundClick = () => {
		if (inputFileRef.current) inputFileRef.current.click();
	};

	return (
		<div>
			{/* Изображение, которое заменяет input */}
			<div className='cursor-pointer w-full flex justify-between items-center gap-2'>
				<PlusSquare onClick={handleSoundClick} />
				<audio className='w-full' controls src={getFullUrl(src)}></audio>
			</div>

			{/* Скрытый input для выбора файла */}
			<input
				type='file'
				ref={inputFileRef}
				onChange={handleFileChange}
				style={{ display: 'none' }}
				accept='audio/*'
			/>
		</div>
	);
};
