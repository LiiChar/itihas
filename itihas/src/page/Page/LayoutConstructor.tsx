import { TemplateBuilder } from '@/component/widget/layout/Constructor';
import { getHistory } from '@/shared/api/history';
import { getPage, updatePageLayouts } from '@/shared/api/page';
import { addUniqueId } from '@/shared/lib/object';
import { useLayoutBuildStore } from '@/shared/store/LayoutBuildStore';
import { Button } from '@/shared/ui/button';
import { FormattedText } from '@/shared/ui/formatted-text';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui/tooltip';
import { useUserStore } from '@/shared/store/UserStore';

export const LayoutConstructorPage = () => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	if (!user) {
		navigate('unouthorize');
		return '';
	}
	const { id } = useParams();
	const { templates } = useLayoutBuildStore();
	const [layoutId, setLayoutId] = useState<number | null>(null);
	const [historyId, setHistoryId] = useState<null | number>(null);

	useMount(() => {
		if (id) {
			getPage(+id!).then(async data => {
				let layout = data.layout;
				setHistoryId(data.historyId);
				if (!layout) {
					layout = (await getHistory(+data.historyId!)).layout;
				}
				if (layout) {
					useLayoutBuildStore.setState(() => ({
						templates: addUniqueId(layout.layout),
					}));
					setLayoutId(layout.id as number);
				} else {
				}
			});
		}
	});

	const tabs = [
		{
			value: 'Визальный',
			content: (
				<div className='h-full'>
					{history && historyId && (
						<TemplateBuilder historyId={historyId} userId={user.id} />
					)}
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
		const newTemplates = await updatePageLayouts(
			{
				layout: templates,
				id: layoutId!,
			},
			+id!
		);
		if (typeof newTemplates == 'string') return;
		useLayoutBuildStore.setState(() => ({
			templates: addUniqueId(newTemplates.layout),
		}));
	};

	return (
		<div className='content-height relative w-full h-full'>
			<Tabs value={activeTab} className='h-full'>
				<TabsList className='bg-transparent px-2 z-[30] relative mt-2 flex gap-3 mb-2 '>
					<Button
						variant={'secondary'}
						onClick={() => navigate(-1)}
						className='self-start	 mr-auto'
					>
						Вернуться
					</Button>
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
					<div className='mt-2 relative group flex items-center justify-center h-full whitespace-pre-line self-end ml-auto'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className='' />
								</TooltipTrigger>
								<TooltipContent className='bg-secondary/70 text-foreground'>
									<div className='hidden group-hover:block abs'>
										<FormattedText
											text={`type:
						| 'image'
						| 'points'
						| 'content'
						| 'block'
						| 'list'
						| 'video'
						| 'action'
						| 'text';
					align?: ('center' | 'left' | 'right' | 'bottom' | 'top')[];
					content: string;
					elementStyle?: string;
					visible?: boolean;
					style?: string;
					children?: LayoutComponent[];
					variables?: LayoutContentVariable[];`}
										/>
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<Button onClick={() => handleLayoutSave()}>Сохранить</Button>
				</TabsList>
				{tabs.map(t => (
					<TabsContent
						key={t.value}
						className='text-foreground h-full p-0 font-normal text-sm'
						value={t.value}
					>
						{t.content}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};
