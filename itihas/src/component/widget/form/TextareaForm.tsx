import { Textarea } from '@/shared/ui/textarea';
import { useKeyPressEvent } from '@siberiacancode/reactuse';
import { LucideSendHorizonal } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

interface TextareaFormProps {
	onSubmit: (value: string) => void;
	defaultValue?: string;
	placeholder?: string;
}
export const TextareaForm = memo(
	({ onSubmit, placeholder, defaultValue }: TextareaFormProps) => {
		const textareaRef = useRef<HTMLTextAreaElement | null>(null);
		const [comment, setComment] = useState(defaultValue ?? '');
		useKeyPressEvent('Enter', window, e => {
			if (e.shiftKey) return;
			handleSubmitTextarea();
		});

		useEffect(() => {
			if (textareaRef && textareaRef.current) {
				textareaRef.current.style.height = '0px';
				const scrollHeight = textareaRef.current.scrollHeight;
				textareaRef.current.style.height = scrollHeight + 'px';
			}
		}, [comment]);

		const handleSubmitTextarea = () => {
			setComment('');
			onSubmit(comment);
		};

		return (
			<div className='flex has-[:focus]:brightness-110  rounded-md gap-1 bg-secondary h-auto'>
				<Textarea
					ref={textareaRef}
					onChange={e => setComment(e.target.value)}
					className='border-none focus-visible:border-none min-h-[55px] p-3 focus-visible:outline-none resize-none hover:outline-none'
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
