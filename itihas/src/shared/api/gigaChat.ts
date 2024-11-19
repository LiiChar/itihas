import { URL } from '../const/const';
import { ChatBotMessage } from '../type/chat';
import { axi } from './axios/axios';

export const sendQuestion = async (question: string) => {
	const ask = await axi.post<ChatBotMessage>(URL + '/chat', { question });
	return ask.data;
};
