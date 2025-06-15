import { Textarea } from '@/shared/ui/textarea';
import { memo, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { LucideSendHorizonal } from 'lucide-react';

interface TextareaFormProps {
	onSubmit: (value: string) => void;
	onChange?: (value: string) => void;
	handleEnter?: boolean;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
}

export const TextareaForm = memo(
	({
		onSubmit,
		placeholder,
		onChange,
		value = '',
		handleEnter = false,
		disabled = false,
	}: TextareaFormProps) => {
		const textareaRef = useRef<HTMLTextAreaElement | null>(null);
		const [comment, setComment] = useState(value);
		const [loading, setLoading] = useState(false);

		// Авто-адаптация высоты textarea
		useEffect(() => {
			if (!textareaRef.current) return;
			textareaRef.current.style.height = 'auto'; // сначала сбросить высоту
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}, [comment]);

		// Обработка нажатия клавиш для отправки по Enter (без Shift)
		const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (!handleEnter) return;
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				handleSubmitTextarea();
			}
		};

		const handleSubmitTextarea = async () => {
			const trimmed = comment.trim();
			if (!trimmed) return;
			if (disabled || loading) return;

			setLoading(true);
			try {
				await onSubmit(trimmed);
				setComment('');
			} finally {
				setLoading(false);
			}
		};

		return (
			<div className='flex rounded-md gap-1 bg-secondary h-auto items-end'>
				<Textarea
					ref={textareaRef}
					onChange={e => {
						setComment(e.target.value);
						onChange && onChange(e.target.value);
					}}
					className='border-none focus-visible:ring-ring focus-visible:border-none min-h-[55px] p-3 resize-none hover:outline-none'
					value={comment}
					placeholder={placeholder ?? 'Написать'}
					onKeyDown={handleKeyDown}
					disabled={disabled || loading}
					rows={1}
				/>
				<button
					type='button'
					onClick={handleSubmitTextarea}
					disabled={disabled || loading || !comment.trim()}
					aria-label={loading ? 'Отправка...' : 'Отправить комментарий'}
					className='self-end mx-2 my-4'
					title={loading ? 'Отправка...' : 'Отправить комментарий'}
				>
					{loading ? (
						<svg
							className='animate-spin h-5 w-5 text-primary'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
						>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'
							/>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
							/>
						</svg>
					) : (
						<LucideSendHorizonal className='fill-primary stroke-primary' />
					)}
				</button>
			</div>
		);
	}
);
