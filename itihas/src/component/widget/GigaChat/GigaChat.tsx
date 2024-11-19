import { sendQuestion } from '@/shared/api/gigaChat';
import { formatDate } from '@/shared/lib/time';
import { useUserStore } from '@/shared/store/UserStore';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import React, { useState } from 'react';

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
		const ask = await sendQuestion(message);
		setMessage('');

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
		<div>
			<div className='flex flex-col gap-2'>
				{messages.map(m => (
					<div
						className={`${
							m.role == 'user' ? 'self-start' : 'self-end'
						} bg-secondary p-4 rounded-sm`}
					>
						<div className={`${m.role == 'user' ? 'text-right' : 'text-left'}`}>
							<span className='mr-2 text-xl text-primary'>
								{m.role == 'user' ? (user ? user.name : 'User') : 'Bot'}
							</span>
							<span className='text-foreground/60'>{m.date}</span>
						</div>
						<div>{m.message}</div>
					</div>
				))}
			</div>
			<div className='mt-2 flex gap-2 items-end'>
				<Textarea
					placeholder='Спросите у бота'
					onInput={e => setMessage(e.currentTarget.value)}
				>
					{message}
				</Textarea>
				<Button
					className='h-full text-foreground'
					onClick={() => handleSendQuestion()}
				>
					Спросить
				</Button>
			</div>
		</div>
	);
};
