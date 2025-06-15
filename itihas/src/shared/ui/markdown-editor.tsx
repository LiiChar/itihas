import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/lib';
import {
	Code,
	Image,
	Link,
	ListIcon,
	ListOrderedIcon,
	LucideSendHorizonal,
	Quote,
	SeparatorHorizontal,
	Eye,
	EyeOff,
} from 'lucide-react';
import { Button } from './button';
import ReactMarkdown from 'react-markdown';

interface MarkdownEditorProps {
	value?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

const applyWrap = (
	text: string,
	selectionStart: number,
	selectionEnd: number,
	before: string,
	after: string
) => {
	const selected = text.slice(selectionStart, selectionEnd);
	const newText =
		text.slice(0, selectionStart) +
		before +
		selected +
		after +
		text.slice(selectionEnd);

	// Новый курсор — после вставленного текста с учетом before и after
	const newCursor = selectionEnd + before.length + after.length;
	return { text: newText, cursor: newCursor };
};

const applyLinePrefix = (
	text: string,
	selectionStart: number,
	selectionEnd: number,
	prefix: string
) => {
	const lines = text.slice(selectionStart, selectionEnd).split('\n');
	const updated = lines
		.map(line => {
			// Если уже есть такой префикс, не дублируем
			if (line.startsWith(prefix)) return line;
			return prefix + line;
		})
		.join('\n');

	const newText =
		text.slice(0, selectionStart) + updated + text.slice(selectionEnd);

	// Возвращаем длину добавленных символов, чтобы корректно выставить курсор
	const addedLength = prefix.length * lines.length;
	return { text: newText, addedLength };
};

const getCaretCoordinates = (
	textarea: HTMLTextAreaElement,
	position: number
) => {
	const div = document.createElement('div');
	document.body.appendChild(div);

	const style = getComputedStyle(textarea);

	div.style.position = 'absolute';
	div.style.whiteSpace = 'pre-wrap';
	div.style.visibility = 'hidden';
	div.style.font = style.font;
	div.style.padding = style.padding;
	div.style.border = style.border;
	div.style.overflow = 'auto';
	div.style.width = style.width;

	const textBefore = textarea.value
		.substring(0, position)
		.replace(/\n$/g, '\n ')
		.replace(/ /g, '\u00a0');

	div.textContent = textBefore;

	const span = document.createElement('span');
	span.textContent = textarea.value.substring(position) || '.';
	div.appendChild(span);

	const rect = span.getBoundingClientRect();
	const divRect = div.getBoundingClientRect();

	const top = rect.top - divRect.top + textarea.scrollTop;
	const left = rect.left - divRect.left + textarea.scrollLeft;

	document.body.removeChild(div);

	return { top, left };
};
export const MarkdownEditor = ({
	value: externalValue,
	onChange,
	onSubmit,
	disabled = false,
	placeholder = 'Введите комментарий (поддерживается Markdown)',
	...attr
}: MarkdownEditorProps & HTMLAttributes<HTMLTextAreaElement>) => {
	const isControlled = externalValue !== undefined && onChange !== undefined;
	const [internalValue, setInternalValue] = useState('');
	const value = isControlled ? externalValue : internalValue;

	const setValue = (newVal: string) => {
		if (isControlled) {
			onChange?.(newVal);
		} else {
			setInternalValue(newVal);
		}
	};

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showToolbar, setShowToolbar] = useState(false);
	const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
	const [showPreview, setShowPreview] = useState(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const cursorPositionRef = useRef<number | null>(null);

	useEffect(() => {
		if (!textareaRef.current) return;

		textareaRef.current.style.height = 'auto';
		textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

		if (cursorPositionRef.current !== null) {
			textareaRef.current.selectionStart = cursorPositionRef.current;
			textareaRef.current.selectionEnd = cursorPositionRef.current;
			textareaRef.current.focus();
			cursorPositionRef.current = null;
		}
	}, [value]);

	const updateToolbar = () => {
		const textarea = textareaRef.current;
		if (!textarea) return setShowToolbar(false);

		const { selectionStart, selectionEnd } = textarea;
		if (selectionStart === selectionEnd) return setShowToolbar(false);

		const coords = getCaretCoordinates(textarea, selectionStart);
		const toolbarHeight = toolbarRef.current?.offsetHeight || 40;
		setToolbarPosition({
			top: coords.top - toolbarHeight - 8,
			left: coords.left,
		});
		setShowToolbar(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.ctrlKey && e.key === 'Enter') {
			e.preventDefault();
			submitHandler();
		}
	};

	const submitHandler = () => {
		if (!onSubmit) return;
		if (!value.trim()) return setError('Комментарий не может быть пустым');

		setError(null);
		setLoading(true);
		Promise.resolve(onSubmit(value))
			.catch(() => setError('Ошибка отправки'))
			.finally(() => setLoading(false));
	};

	const handleWrapClick = (before: string, after: string = before) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;
		const result = applyWrap(
			value,
			selectionStart,
			selectionEnd,
			before,
			after
		);
		setValue(result.text);
		cursorPositionRef.current = result.cursor;
	};

	const handleListClick = (ordered: boolean) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;

		const prefix = ordered ? '1. ' : '- ';
		const result = applyLinePrefix(value, selectionStart, selectionEnd, prefix);
		onChange && onChange(result.text);

		const linesCount = value
			.slice(selectionStart, selectionEnd)
			.split('\n').length;
		const newCursor = selectionEnd + prefix.length * linesCount;

		cursorPositionRef.current = newCursor;
	};

	// Новая функция для заголовков (h2..h5)
	const handleHeaderClick = (level: number) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;
		const prefix = '#'.repeat(level) + ' ';

		const result = applyLinePrefix(value, selectionStart, selectionEnd, prefix);
		onChange && onChange(result.text);

		const linesCount = value
			.slice(selectionStart, selectionEnd)
			.split('\n').length;
		const newCursor = selectionEnd + prefix.length * linesCount;

		cursorPositionRef.current = newCursor;
	};

	// Перечёркивание (~~text~~)
	const handleStrikeThroughClick = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;

		const result = applyWrap(value, selectionStart, selectionEnd, '~~', '~~');
		onChange && onChange(result.text);

		cursorPositionRef.current = result.cursor;
	};

	// Ссылка ([text](url))
	const handleLinkClick = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;
		const selectedText = value.slice(selectionStart, selectionEnd);

		// Если текст выделен, используем его как текст ссылки
		if (selectedText) {
			const result = applyWrap(
				value,
				selectionStart,
				selectionEnd,
				'[',
				'](url)'
			);
			onChange && onChange(result.text);
			cursorPositionRef.current = selectionEnd + 3; // Позиционируем курсор на "url"
		} else {
			// Если текст не выделен, вставляем шаблон ссылки
			const result = applyWrap(
				value,
				selectionStart,
				selectionEnd,
				'[текст](',
				')'
			);
			onChange && onChange(result.text);
			cursorPositionRef.current = selectionStart + 1; // Позиционируем курсор на "текст"
		}
	};

	// Изображение (![alt](url))
	const handleImageClick = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;
		const selectedText = value.slice(selectionStart, selectionEnd);

		// Если текст выделен, используем его как alt текст
		if (selectedText) {
			const result = applyWrap(
				value,
				selectionStart,
				selectionEnd,
				'![',
				'](url)'
			);
			onChange && onChange(result.text);
			cursorPositionRef.current = selectionEnd + 4; // Позиционируем курсор на "url"
		} else {
			// Если текст не выделен, вставляем шаблон изображения
			const result = applyWrap(
				value,
				selectionStart,
				selectionEnd,
				'![описание](',
				')'
			);
			onChange && onChange(result.text);
			cursorPositionRef.current = selectionStart + 2; // Позиционируем курсор на "описание"
		}
	};

	// Код инлайн (`code`)
	const handleInlineCodeClick = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;
		const result = applyWrap(value, selectionStart, selectionEnd, '`', '`');
		onChange && onChange(result.text);
		cursorPositionRef.current = result.cursor;
	};

	// Блок кода (```code```)
	const handleCodeBlockClick = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;
		const result = applyWrap(
			value,
			selectionStart,
			selectionEnd,
			'```\n',
			'\n```'
		);
		onChange && onChange(result.text);
		cursorPositionRef.current = result.cursor;
	};

	// Цитата (> text)
	const handleQuoteClick = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;
		const result = applyLinePrefix(value, selectionStart, selectionEnd, '> ');
		onChange && onChange(result.text);

		const linesCount = value
			.slice(selectionStart, selectionEnd)
			.split('\n').length;
		const newCursor = selectionEnd + '> '.length * linesCount;

		cursorPositionRef.current = newCursor;
	};

	// Горизонтальная линия (---)
	const handleHorizontalLineClick = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;

		// Добавляем перенос строки перед и после, если нужно
		let prefix = '';
		let suffix = '\n';

		// Если курсор не в начале строки, добавляем перенос строки перед
		if (selectionStart > 0 && value[selectionStart - 1] !== '\n') {
			prefix = '\n';
		}

		// Если курсор не в конце текста и следующий символ не перенос строки
		if (selectionEnd < value.length && value[selectionEnd] !== '\n') {
			suffix = '\n\n';
		} else if (selectionEnd === value.length) {
			suffix = '\n';
		}

		const newText =
			value.slice(0, selectionStart) +
			prefix +
			'---' +
			suffix +
			value.slice(selectionEnd);

		onChange && onChange(newText);
		cursorPositionRef.current =
			selectionStart + prefix.length + 3 + suffix.length;
	};

	// Переключение предпросмотра
	const togglePreview = () => {
		setShowPreview(!showPreview);
	};

	return (
		<div className='relative p-1'>
			<Button
				type='button'
				variant='ghost'
				onClick={togglePreview}
				className='absolute p-1 h-6 top-1 right-1 z-50'
			>
				{showPreview ? (
					<>
						<EyeOff size={14} />
					</>
				) : (
					<>
						<Eye size={14} />
					</>
				)}
			</Button>

			{showPreview ? (
				<div className='w-full min-h-[100px] bg-secondary rounded-lg p-2 border-[1px] border-secondary text-sm overflow-auto'>
					{value ? (
						<ReactMarkdown>{value}</ReactMarkdown>
					) : (
						<span className='text-muted-foreground'>Предпросмотр Markdown</span>
					)}
				</div>
			) : (
				<div className='relative' style={{ position: 'relative' }}>
					{showToolbar && (
						<div
							ref={toolbarRef}
							style={{
								position: 'absolute',
								top: toolbarPosition.top,
								left: toolbarPosition.left,
								userSelect: 'none',
								zIndex: 10,
							}}
						>
							<div className='flex gap-1 mb-1 p-1 border-[1px] border-foreground/10 backdrop-blur-[10px] rounded-lg bg-background/30'>
								<Button
									type='button'
									variant={'ghost'}
									className='rounded-lg py-1 h-6'
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleWrapClick('**')}
								>
									<b>B</b>
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleWrapClick('*')}
								>
									<i>I</i>
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleListClick(false)}
								>
									<ListIcon size={16} />
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleListClick(true)}
								>
									<ListOrderedIcon size={16} />
								</Button>

								{/* Заголовки H2..H5 */}
								{/* <Button
									type='button'
									className='rounded-lg py-1 px-2 h-6 font-semibold text-sm'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleHeaderClick(2)}
								>
									H2
								</Button> */}
								<Button
									type='button'
									className='rounded-lg py-1 px-2 h-6 font-semibold text-sm'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleHeaderClick(3)}
								>
									H3
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 px-2 h-6 font-semibold text-sm'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleHeaderClick(4)}
								>
									H4
								</Button>
								{/* <Button
									type='button'
									className='rounded-lg py-1 px-2 h-6 font-semibold text-sm'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleHeaderClick(5)}
								>
									H5
								</Button> */}

								{/* Перечёркивание */}
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleStrikeThroughClick}
								>
									<s>abc</s>
								</Button>

								{/* Ссылка */}
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleLinkClick}
								>
									<Link size={16} />
								</Button>

								{/* Изображение */}
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleImageClick}
								>
									<Image size={16} />
								</Button>

								{/* Инлайн код */}
								{/* <Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleInlineCodeClick}
								>
									<Code size={16} />
								</Button> */}

								{/* Блок кода */}
								<Button
									type='button'
									className='rounded-lg py-1 h-6 font-mono text-xs'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleCodeBlockClick}
								>
									{'{...}'}
								</Button>

								{/* Цитата */}
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleQuoteClick}
								>
									<Quote size={16} />
								</Button>

								{/* Горизонтальная линия */}
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleHorizontalLineClick}
								>
									<SeparatorHorizontal size={16} />
								</Button>
							</div>
						</div>
					)}

					<textarea
						{...attr}
						ref={textareaRef}
						value={value}
						className={cn(
							'w-full min-h-[100px]  resize-none border-none bg-secondary/50 backdrop-blur-[10px] rounded-lg p-2 pr-5 border-[1px] border-secondary text-sm outline-secondary outline-1 focus-visible:ring-ring focus-visible:border-none',
							attr.className
						)}
						onChange={e => setValue(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={disabled}
						placeholder={placeholder}
						onMouseUp={updateToolbar}
						onKeyUp={updateToolbar}
						onBlur={() => setShowToolbar(false)}
						spellCheck={true}
						rows={1}
					></textarea>

					<button
						type='button'
						onClick={submitHandler}
						disabled={disabled || loading || !value.trim()}
						aria-label={loading ? 'Отправка...' : 'Отправить '}
						title={loading ? 'Отправка...' : 'Отправить '}
						className='absolute right-1 bottom-2 p-2 text-primary'
					>
						{loading ? (
							<svg
								className='animate-spin h-5 w-5 text-primary fill-primary! stroke-primary'
								xmlns='http://www.w3.org/2000/svg'
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
							onSubmit && <LucideSendHorizonal className='w-5 h-5' />
						)}
					</button>
				</div>
			)}

			{error && <div className='text-sm text-red-500 mt-1'>{error}</div>}
			{onSubmit && (
				<div className='text-xs text-gray-500 mt-1 block'>
					Ctrl + Enter — отправить. Поддерживается Markdown.
				</div>
			)}
		</div>
	);
};
