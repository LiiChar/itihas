import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { useDebounceValue } from '@siberiacancode/reactuse';
import { Book, FilePenIcon, Pen } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { sendQuestion } from '@/shared/api/gigaChat';
import { clearTextQuota } from '@/shared/lib/text';

type TextareaHelperProps = {
	inputFinished?: boolean;
	corrected?: boolean;
	rewrited?: boolean;
	finished?: boolean;
} & React.HTMLAttributes<HTMLTextAreaElement>;

type Mode = 'correct' | 'rewrite' | 'finish';

export const TextareaHelper = forwardRef<
	HTMLTextAreaElement,
	TextareaHelperProps
>(({ corrected, rewrited, finished, inputFinished, ...props }, ref) => {
	const [history, setHistory] = useState<string[]>(['']);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [mode, setMode] = useState<Mode | null>(null);
	const debouncedText = useDebounceValue(history[currentIndex], 1000);
	const requestIdRef = useRef(0);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useImperativeHandle(
		ref,
		() => textareaRef.current as HTMLTextAreaElement,
		[]
	);

	const prompts = {
		correct: `
Ты — профессиональный редактор русского языка. Твоя задача — найти и исправить все грамматические, пунктуационные и стилистические ошибки в следующем тексте:

«${history[currentIndex]}»

Отформатируй ответ так:
1. Исправленный текст (без пометок и пояснений).
2. Краткий список исправлений с пояснениями (если есть ошибки).
`.trim(),

		rewrite: `
Ты — опытный копирайтер. Перепиши следующий текст так, чтобы он:
- Сохранил исходный смысл;
- Был написан более выразительно и понятно;
- Избегал повторов и лишней воды;
- Был читабельным и подходящим для публикации.

Текст:
«${history[currentIndex]}»

Ответ — только переписанный текст, без пояснений и заголовков.
`.trim(),

		finish: `
Ты — профессиональный автор художественных и деловых текстов. Продолжи следующий текст логично, в том же стиле и тоне. Убедись, что:
- Продолжение связано по смыслу;
- Использованы те же лексика и стиль;
- Объём добавленного текста — минимум одно-два предложения.

Начало текста:
«${history[currentIndex]}»

Ответ — только продолжение, без повтора начального текста и без лишних пояснений.
`.trim(),
	};

	useEffect(() => {
		if (!mode || !inputFinished || !history[currentIndex].trim()) return;
		const currentRequest = ++requestIdRef.current;

		sendQuestion(prompts[mode]).then(answer => {
			if (currentRequest !== requestIdRef.current) return;
			const cleaned = clearTextQuota(answer.choices[0].message.content);
			if (cleaned.startsWith(history[currentIndex])) {
				setHistory(prev => [...prev, cleaned]);
				setCurrentIndex(prev => prev + 1);
			}
		});
	}, [debouncedText, inputFinished]);

	const handleTextChange = (value: string) => {
		const updated = [...history];
		updated[currentIndex] = value;
		setHistory(updated);
	};

	const handleGenerate = async (type: Mode) => {
		if (!history[currentIndex].trim()) return;
		setMode(type);
		const response = await sendQuestion(prompts[type]);
		const cleaned = clearTextQuota(response.choices[0].message.content);
		setHistory(prev => [...prev, cleaned]);
		setCurrentIndex(prev => prev + 1);
	};

	const selectVersion = (index: number) => {
		setCurrentIndex(index);
	};

	return (
		<div className='flex flex-col gap-2'>
			<Textarea
				ref={textareaRef}
				value={history[currentIndex]}
				onChange={e => handleTextChange(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Tab') {
						e.preventDefault();
						if (currentIndex < history.length - 1) {
							setCurrentIndex(currentIndex + 1);
						}
					}
				}}
				className='w-full z-10 h-full'
				{...props}
			/>

			<div className='flex gap-2 justify-between'>
				{(['correct', 'rewrite', 'finish'] as const).map(type => {
					const iconMap = {
						correct: <Pen className='w-4 h-4 mr-2' />,
						rewrite: <FilePenIcon className='w-4 h-4 mr-2' />,
						finish: <Book className='w-4 h-4 mr-2' />,
					};

					const labelMap = {
						correct: 'Исправить',
						rewrite: 'Переписать',
						finish: 'Дописать',
					};

					// const active = {
					// 	corrected,
					// 	rewrited,
					// 	finished,
					// };

					return (
						<Button
							key={type}
							className='w-full'
							variant={'outline'}
							onClick={() => handleGenerate(type)}
						>
							{iconMap[type]}{' '}
							<span className='sm:inline hidden'>{labelMap[type]}</span>
						</Button>
					);
				})}
			</div>

			<div className='flex gap-1 flex-wrap items-center'>
				{history.map((_, i) => (
					<Button
						key={i}
						variant={i === currentIndex ? 'default' : 'ghost'}
						size='sm'
						onClick={() => selectVersion(i)}
					>
						{i + 1}
					</Button>
				))}
			</div>
		</div>
	);
});

TextareaHelper.displayName = 'TextareaHelper';
