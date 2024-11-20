import { sendQuestion } from '@/shared/api/gigaChat';
import { clearTextQuota } from '@/shared/lib/text';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import {
	useDebounceValue,
	useKeyboard,
	useKeyPress,
} from '@siberiacancode/reactuse';
import {
	Book,
	FilePenIcon,
	Pen,
	SendHorizonalIcon,
	SendHorizontalIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type TextareahHelperProps = {
	finished?: boolean;
	inputFinished?: boolean;
	rewrited?: boolean;
	corrected?: boolean;
	variant?: 'left' | 'right' | 'top' | 'bottom';
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaHelper = ({
	corrected,
	finished,
	rewrited,
	inputFinished,
	variant,
	...props
}: TextareahHelperProps) => {
	const [text, setText] = useState('');
	const [secondaryText, setSecondaryText] = useState('');
	const debounceValue = useDebounceValue(text, 1000);
	useEffect(() => {
		if (inputFinished && text) {
			sendQuestion(
				`У меня есть предложение в кавычках '${text}',допиши данное предложение, но начинаться оно обящано точно также как изначально и увеличение минимум на 1 слово. И верни дописаное предложение без твоих комментариев`
			).then(answer => {
				let newSecondartText = clearTextQuota(
					answer.choices[0].message.content
				);
				if (newSecondartText.slice(0, text.length) == text) {
					setSecondaryText(clearTextQuota(answer.choices[0].message.content));
				}
			});
		}
	}, [debounceValue]);
	const handleSendMessage = async () => {
		let template = `Текст - "${text}". `;
		if (corrected) {
			template += 'Исправь данный текст. ';
		} else if (rewrited) {
			template += 'Перепеши данный текст. ';
		} else if (finished) {
			template += 'Заверши данный текст. ';
		}

		const answer = await sendQuestion(template);
		setSecondaryText(answer.choices[0].message.content);
	};
	const handleInputTextarea = async (
		e: React.FormEvent<HTMLTextAreaElement>
	) => {
		setText(e.currentTarget.value);
		setSecondaryText(e.currentTarget.value);
	};
	return (
		<div>
			<div className='flex'>
				<div className='relative w-full'>
					<Textarea
						onKeyDown={e => {
							if (e.key == 'Tab') {
								e.preventDefault();
								e.stopPropagation();
								if (secondaryText == '') return;

								setText(secondaryText);
							}
						}}
						className='w-full z-20 relative'
						onInput={handleInputTextarea}
						{...props}
					>
						{text}
					</Textarea>
					<div className='absolute w-full z-10 select-none  text-sm text-foreground/70 py-2 px-3 left-[1px] top-[1px]'>
						{secondaryText}
					</div>
					<div
						className={`absolute gap-2  flex ${
							variant == 'bottom' && '-bottom-[22px] left-0 w-full'
						} ${variant == 'left' && '-left-[22px] top-0 flex-col h-full'} ${
							variant == 'right' && '-right-[22px] top-0 flex-col h-full'
						} ${variant == 'top' && '-top-[22px] left-0 w-full'}`}
					>
						<div
							className={
								'bg-background border-[1px] solid border-border p-1 cursor-pointer ' +
								`${corrected ? 'bg-primary' : ''}`
							}
						>
							<Pen className='h-4 w-4' />
						</div>
						<div
							className={
								'bg-background border-[1px] solid border-border p-1 cursor-pointer ' +
								`${finished ? 'bg-primary' : ''}`
							}
						>
							<Book className='h-4 w-4' />
						</div>
						<div
							className={
								'bg-background border-[1px] solid border-border p-1 cursor-pointer ' +
								`${rewrited ? 'bg-primary' : ''}`
							}
						>
							<FilePenIcon className='h-4 w-4' />
						</div>
					</div>
				</div>
				<Button
					onClick={handleSendMessage}
					className='flex justify-center items-center'
				>
					<SendHorizontalIcon />
				</Button>
			</div>
		</div>
	);
};
