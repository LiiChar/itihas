import { TemplateBuilder } from '@/component/widget/layout/Constructor';
import { getHistory } from '@/shared/api/history';
import { HistoryPages } from '@/shared/type/history';
import { Button } from '@/shared/ui/button';
import { useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const LayoutConstructor = () => {
	const { id } = useParams();
	const [history, setHistory] = useState<HistoryPages | null>(null);
	useMount(() => {
		if (id) {
			getHistory(+id!).then(data => {
				setHistory(data);
			});
		}
	});
	if (!history) {
		return <Button loading={!history}></Button>;
	}
	return (
		<div className='content-height w-full h-full'>
			<TemplateBuilder templatesProps={history.layout.layout} />
		</div>
	);
};
