import { LayoutInsertType } from '../../database/db';
import { Layout } from '../../entities/page/type/layout';

const LayoutContentType: Layout[] = [
	{
		id: 150,
		userId: 1,
		name: 'Диалог',
		layout: [
			{
				type: 'list',
				content: `Говорит {=dialog.name}. 
          Сообщение {=dialog.message}`,
			},
		],
	},
];

export const LayoutContent = LayoutContentType.map<LayoutInsertType>(
	(c: any) => {
		c.layout = JSON.stringify(c.layout);
		return c;
	}
);
