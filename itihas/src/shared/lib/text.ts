export const clearTextQuota = (text: string) => {
	text = text.replace(/^./, '');
	text = text.replace(/^'/, '');
	text = text.replace(/'$/, '');
	text = text.replace(/^"/, '');
	text = text.replace(/"$/, '');
	text = text.replace(/^«/, '');
	text = text.replace(/»$/, '');
	return text;
};
