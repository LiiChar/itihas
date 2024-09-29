import { Textarea } from '@/shared/ui/textarea';
import { useKeyPressEvent } from '@siberiacancode/reactuse';
import { LucideSendHorizonal } from 'lucide-react';
import { memo, useState } from 'react';

interface TextareaFormProps {
	onSubmit: (value: string) => void;
	defaultValue?: string;
	placeholder?: string;
}
export const TextareaForm = memo(
	({ onSubmit, placeholder, defaultValue }: TextareaFormProps) => {
		const [comment, setComment] = useState(defaultValue ?? '');
		useKeyPressEvent('Enter', window, () => {
			handleSubmitTextarea();
		});

		const handleSubmitTextarea = () => {
			setComment('');
			onSubmit(comment);
		};

		return (
			<div className='flex has-[:focus]:brightness-110 rounded-md gap-1 bg-secondary h-auto'>
				<Textarea
					onChange={e => setComment(e.target.value)}
					className='border-none focus-visible:border-none p-3 focus-visible:outline-none resize-none hover:outline-none'
					value={comment}
					placeholder={placeholder ? placeholder : 'Написать'}
				/>
				<LucideSendHorizonal
					onClick={handleSubmitTextarea}
					className='self-end mx-2  fill-primary stroke-primary my-3'
				/>
			</div>
		);
	}
);
