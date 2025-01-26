import { sendQuestion } from '@/shared/api/gigaChat';
import { formatDate } from '@/shared/lib/time';
import { useUserStore } from '@/shared/store/UserStore';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Play } from 'lucide-react';
import { useState } from 'react';

type ChatMessage = {
	role: 'user' | 'bot';
	message: string;
	date?: string;
};

export const GigaChat = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [message, setMessage] = useState<string>('');
	const { user } = useUserStore();

	const handleSendQuestion = async () => {
		setMessages(s => [
			...s,
			{
				message: message,
				role: 'user',
				date: formatDate(undefined, true),
			},
		]);
		const template =
			message +
			(messages.length > 1 && false
				? '.[Конец сообщения] Напоминаю, что предыдущие сообщения были такие. ' +
				  messages.reverse().reduce<string>((acc, m, i) => {
						if (i > 10) return acc;
						acc += `${i + 1}. ${
							m.role == 'user' ? 'Я написал' : 'Ты ответил'
						}: ${m.message}`;
						return acc;
				  }, '')
				: '');
		setMessage('');
		const ask = await sendQuestion(template);

		setMessages(s => [
			...s,
			{
				message: ask.choices[0].message.content,
				role: 'bot',
				date: formatDate(undefined, true),
			},
		]);
	};

	return (
		<div className='h-full overflow-y-auto'>
			<div className='flex flex-col   gap-2'>
				{messages.map(m => (
					<div
						className={`${
							m.role == 'user' ? 'self-end' : 'self-start'
						} bg-secondary p-2 w-fit rounded-sm`}
					>
						<div
							className={`flex gap-2 items-end ${
								m.role == 'user' ? 'text-right flex-row-reverse' : 'text-left'
							}`}
						>
							<span className=' text-xl text-primary'>
								{m.role == 'user' ? (user ? user.name : 'User') : 'Bot'}
							</span>
							<span className='text-foreground/60 text-sm'>{m.date}</span>
						</div>
						<div>{m.message}</div>
					</div>
				))}
			</div>
			<div className='mt-2 flex gap-2 items-end w-full relative '>
				<Textarea
					placeholder='Спросите у бота'
					value={message}
					onInput={e => setMessage(e.currentTarget.value)}
				></Textarea>
				<Button
					className='h-full text-foreground p-0 absolute right-1 bottom-0 hover:bg-transparent '
					variant={'ghost'}
					onClick={() => handleSendQuestion()}
				>
					<Play className='h-full hover:stroke-primary fill:stroke-primary' />
				</Button>
			</div>
		</div>
	);
};
