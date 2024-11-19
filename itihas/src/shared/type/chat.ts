type Choice = {
	message: Message;
	index: number;
	finish_reason: string;
};

type Message = {
	content: string;
	role: string;
};

type Usage = {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
	system_tokens: number;
};

export type ChatBotMessage = {
	choices: Choice[];
	created: number;
	model: string;
	object: string;
	usage: Usage;
};
