import { TemplateBuilder } from '@/component/widget/layout/Constructor';
import { getHistory, updateHistoryLayouts } from '@/shared/api/history';
import { addUniqueId } from '@/shared/lib/object';
import { useLayoutBuildStore } from '@/shared/store/LayoutBuildStore';
import { useUserStore } from '@/shared/store/UserStore';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const LayoutConstructor = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	if (!user) {
		navigate('unouthorize');
		return '';
	}
	const { id } = useParams();
	const { templates } = useLayoutBuildStore();
	const [layoutId, setLayoutId] = useState<number | null>(null);
	useMount(() => {
		if (id) {
			getHistory(+id!).then(data => {
				useLayoutBuildStore.setState(() => ({
					templates: addUniqueId(data.layout.layout),
				}));
				setLayoutId(data.layoutId);
			});
		}
	});

	const tabs = [
		{
			value: 'Визальный',
			content: (
				<div className=''>
					{history && <TemplateBuilder historyId={+id!} userId={user.id} />}
				</div>
			),
		},
		{
			value: 'Текстовый',
			content: (
				<Textarea
					onChange={e =>
						useLayoutBuildStore.setState({
							templates: JSON.parse(e.target.value),
						})
					}
					className='w-full h-[calc(100vh-140px)]'
				>
					{history && JSON.stringify(templates)}
				</Textarea>
			),
		},
	];
	const [activeTab, setActiveTab] = useState(tabs[0].value);

	if (!templates) {
		return (
			<div className='content-height flex justify-center items-center'>
				<Button loading={!history}></Button>
			</div>
		);
	}

	const handleLayoutSave = async () => {
		if (layoutId == null) return;
		const newTemplates = await updateHistoryLayouts({
			layout: templates,
			id: layoutId,
		});
		useLayoutBuildStore.setState(() => ({
			templates: addUniqueId(newTemplates.layout),
		}));
	};

	return (
		<div className='content-height relative w-full h-full'>
			<Tabs value={activeTab}>
				<TabsList className='bg-transparent px-2 z-[30] relative mt-2 flex gap-3 mb-2 '>
					{tabs.map(t => (
						<TabsTrigger
							key={t.value}
							className={`rounded-none relative  ${
								activeTab === t.value
									? '!text-primary border-b-[1px] border-primary'
									: 'text-foreground'
							}`}
							value={t.value}
							onClick={() => setActiveTab(t.value)}
						>
							{t.value}
						</TabsTrigger>
					))}
					<Button
						onClick={() => handleLayoutSave()}
						className='self-end ml-auto'
					>
						Сохранить
					</Button>
				</TabsList>
				{tabs.map(t => (
					<TabsContent
						key={t.value}
						className='text-foreground p-0 font-normal text-sm'
						value={t.value}
					>
						{t.content}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};
