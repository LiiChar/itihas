import { LayoutInsertType } from '../../database/db';
import { Layout } from '../../entities/page/type/layout';

const LayoutContentType: Layout[] = [
	{
		id: 150,
		name: 'Диалог',
		layout: [
			{
				type: 'list',
				option: {
					list: {
						list_type: 'dialog',
						list_variable: 'dialog',
						dialog: {
							dialog_message_variable: 'message',
							dialog_name_variable: 'name',
							dialog_action_variable: 'action',
						},
					},
				},
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
