import { useEffect, useRef, useState } from 'react';
import { sendQuestion } from '@/shared/api/gigaChat';
import { formatDate } from '@/shared/lib/time';
import { useUserStore } from '@/shared/store/UserStore';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Play, Trash2 } from 'lucide-react';

type ChatMessage = {
	role: 'user' | 'bot';
	message: string;
	date?: string;
};

const STORAGE_KEY = 'gigaChatMessages';

export const GigaChat = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [message, setMessage] = useState<string>('');
	const [isInitialized, setIsInitialized] = useState(false);
	const { user } = useUserStore();
	const chatRef = useRef<HTMLDivElement | null>(null);

	// Загрузка сообщений из localStorage один раз
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					setMessages(parsed);
				}
			} catch (err) {
				console.error('Ошибка при загрузке из localStorage', err);
			}
		}
		setIsInitialized(true);
	}, []);

	// Сохраняем только после первой инициализации
	useEffect(() => {
		if (isInitialized) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
		}
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages, isInitialized]);

	const buildContext = (): string => {
		const contextMessages = messages.slice(-10); // последние 10 сообщений
		return contextMessages
			.map((m, i) => {
				const prefix = m.role === 'user' ? 'Я написал' : 'Ты ответил';
				return `${i + 1}. ${prefix}: ${m.message}`;
			})
			.join('\n');
	};

	const handleSendQuestion = async () => {
		if (!message.trim()) return;

		const userMessage: ChatMessage = {
			message,
			role: 'user',
			date: formatDate(undefined, true),
		};

		setMessages(s => [...s, userMessage]);
		setMessage('');

		const context = buildContext();
		const prompt = context
			? `${context}\n\nТекущий вопрос: ${message}`
			: message;

		try {
			const ask = await sendQuestion(prompt);

			const botMessage: ChatMessage = {
				message: ask.choices[0].message.content,
				role: 'bot',
				date: formatDate(undefined, true),
			};

			setMessages(s => [...s, botMessage]);
		} catch (error) {
			console.error('Ошибка при отправке вопроса', error);
		}
	};

	const handleClearChat = () => {
		setMessages([]);
		localStorage.removeItem(STORAGE_KEY);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendQuestion();
		}
	};

	return (
		<div className='h-full flex flex-col'>
			<div className='flex justify-between items-center mb-2'>
				<h2 className='text-xl font-bold'>GigaChat</h2>
				<Button variant='ghost' size='sm' onClick={handleClearChat}>
					<Trash2 className='w-4 h-4 mr-1' />
					Очистить чат
				</Button>
			</div>
			<div
				ref={chatRef}
				className='flex-1 overflow-y-auto flex flex-col gap-2 pb-4 h-full'
			>
				{messages.map((m, i) => (
					<div
						key={i}
						className={`${
							m.role === 'user' ? 'self-end' : 'self-start'
						} border-[1px] border-foreground/50 rounded-lg p-2 w-fit max-w-[80%]`}
					>
						<div
							className={`flex gap-2 items-end ${
								m.role === 'user' ? 'text-right flex-row-reverse' : 'text-left'
							}`}
						>
							<span className='text-xl text-primary'>
								{m.role === 'user' ? user?.name || 'Вы' : 'Бот'}
							</span>
							<span className='text-foreground/60 text-sm'>{m.date}</span>
						</div>
						<div className='whitespace-pre-line'>{m.message}</div>
					</div>
				))}
			</div>
			<div className='mt-2 flex p-[0.5px] gap-2 items-end w-full relative'>
				<Textarea
					placeholder='Спросите у бота'
					value={message}
					onInput={e => setMessage(e.currentTarget.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button
					className='h-full text-foreground p-0 absolute right-1 bottom-0 hover:bg-transparent'
					variant='ghost'
					onClick={handleSendQuestion}
				>
					<Play className='h-full hover:stroke-primary' />
				</Button>
			</div>
		</div>
	);
};
