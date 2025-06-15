import React, { useState } from 'react';
import {
	DndContext,
	useDraggable,
	useDroppable,
	DragEndEvent,
	DragOverlay,
	DragOverEvent,
} from '@dnd-kit/core';
import { LayoutComponent } from '@/shared/type/layout';
import {
	findObjectById,
	findObjectByIdWithPath,
	swapElementsByPaths,
} from '@/shared/lib/object';
import { Button } from '@/shared/ui/button';
import { PlusCircle } from 'lucide-react';
import {
	DroppableLayoutTemplate,
	useLayoutBuildStore,
	DroppableLayout,
} from '@/shared/store/LayoutBuildStore';
import { ImageUpload } from '../form/ImageUpload';
import { EditConstructorSidebar } from './EditConstructorSidebar';
import { VariableSidebar } from './VariableSidebar';
import { parseInlineStyle } from '@/shared/lib/style';

type DroppableProps = {
	children?: React.ReactNode;
} & DroppableLayoutTemplate;

const DraggableBlock = ({ template }: DroppableProps) => {
	const { isResizing } = useLayoutBuildStore();
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: 'drag' + template.id,
		data: {
			template,
		},
		disabled: isResizing,
	});
	// useBlockResize<HTMLDivElement>(
	// 	node as any,
	// 	{
	// 		resizable: !isDragging,
	// 	},
	// 	isResize => {
	// 		setIsResizing(isResize);
	// 	}
	// );

	return (
		<div
			ref={el => {
				setNodeRef(el);
			}}
			{...listeners}
			{...attributes}
			className={`w-full h-full relative after:w-full after:h-full after:absolute after:top-0 after:left-0 after:border-2 after:border-dashed after:border-white after:cursor-move  rounded shadow-md ${
				isDragging ? 'opacity-50' : 'opacity-100'
			}`}
		>
			{template.children ? (
				<DroppableArea template={template} />
			) : (
				getComponent(template)
			)}
		</div>
	);
};

// Компонент дроппируемой области
const DroppableArea = ({ template }: DroppableProps) => {
	const { addTemplate } = useLayoutBuildStore();

	if (!template) {
		return '';
	}

	const { setNodeRef } = useDroppable({
		id: 'area' + template.id,
		data: { template },
	});

	return (
		<div ref={setNodeRef} className='flex relative flex-wrap h-full w-full'>
			{template.children ? (
				Array.isArray(template.children) ? (
					template.children.map(t => (
						<DraggableBlock
							key={'id' in t ? (t.id as any) : ''}
							template={t as DroppableLayout}
						/>
					))
				) : (
					<DraggableBlock template={template.children as DroppableLayout} />
				)
			) : (
				<DraggableBlock template={template} />
			)}
			<div className='absolute left-1/2 top-0'>
				<PlusCircle
					className='w-4 h-4'
					onClick={() => addTemplate(template.id, 'top')}
				/>
			</div>
			<div className='absolute left-1/2 bottom-0'>
				<PlusCircle
					className='w-4 h-4'
					onClick={() => addTemplate(template.id, 'bottom')}
				/>
			</div>
		</div>
	);
};

// Основной компонент шаблона
export const TemplateBuilder = ({
	historyId,
	userId,
}: {
	historyId: number;
	userId: number;
}) => {
	const { templates, setTemplate, setSelectedLayout } = useLayoutBuildStore();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [_overId, setOverId] = useState<string | null>(null);

	const handleDragStart = (event: DragEndEvent) => {
		setActiveId(`${event.active.id}`);
		if (event.active.data.current) {
			setSelectedLayout(event.active.data.current.template);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;
		if (over.id == active.id) return;
		const prevElement = findObjectByIdWithPath(
			templates,
			`_${(active.id as string).split('_')[1]}`
		);
		const newElement = findObjectByIdWithPath(
			templates,
			`_${(over.id as string).split('_')[1]}`
		);
		if (!prevElement || !newElement) return;
		if (prevElement.path !== newElement.path) {
			const newTempates = swapElementsByPaths(
				prevElement.path as string[],
				newElement.path as string[],
				templates
			);

			setTemplate(newTempates);
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		setOverId(`${event.over?.id!}`);
	};

	return (
		<DndContext
			onDragOver={handleDragOver}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className='select-none max-h-[100vh-60px] h-full space-y-4 flex justify-center items-center flex-col'>
				<div className='sm:w-full overflow-auto sm:mt-0 my-4 md:w-[clamp(200px,45%,500px)] flex flex-col gap-2 mx-4  px-2 pt-2 pb-2 bg-secondary rounded-lg  '>
					{templates.map(b => (
						<DroppableArea template={b} />
					))}
				</div>
			</div>
			<DragOverlay dropAnimation={null}>
				{activeId
					? getComponent(
							findObjectById(templates, `_${activeId.split('_')[1]}`)!
					  )
					: null}
			</DragOverlay>
			<VariableSidebar historyId={historyId} userId={userId} />
			<EditConstructorSidebar />
		</DndContext>
	);
};

export const getComponent = (component: LayoutComponent) => {
	if (!component) return '';
	const Component = LayoutComponents[component.type];
	if (!Component) return '';
	return <Component c={component} />;
};

export const ContentLayout = ({ c }: { c: LayoutComponent }) => {
	return (
		<div
			style={parseInlineStyle(c.style ?? '')}
			className='text-pretty w-full h-full flex justify-center items-center aspect-[16/4]  bg-background'
		>
			{c.content}
		</div>
	);
};

export const PointLayout = ({ c }: { c: LayoutComponent }) => {
	return (
		<div
			style={parseInlineStyle(c.style ?? '')}
			className='flex aspect-[16/5] flex-col gap-2 justify-start items-start w-full h-full'
		>
			<div className='w-full h-1/3  bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3  bg-background'>
				Пункты выбора
			</div>
			<div className='w-full h-1/3  bg-background'></div>
		</div>
	);
};

export const ImageLayout = ({ c }: { c: LayoutComponent }) => {
	return (
		<div
			style={parseInlineStyle(c.style ?? '')}
			className=' relative aspect-[12/9] w-full  bg-background  flex justify-center items-center  h-full p-2'
		>
			<ImageUpload
				className='absolute top-0 z-50 left-0 h-full aspect-[12/9] object-cover w-full rounded-tl-lg rounded-tr-lg'
				options={{ visiblePath: false }}
				src={c.content}
			/>
		</div>
	);
};

export const CustomLayout = ({ c }: { c: LayoutComponent }) => {
	return <div style={parseInlineStyle(c.style ?? '')}>Неизвестный</div>;
};

export const ActionLayout = ({ c }: { c: LayoutComponent }) => {
	return (
		<Button style={parseInlineStyle(c.style ?? '')} className=' w-full h-full'>
			{c.option?.action?.title ?? 'Кнопка'}
		</Button>
	);
};

export const ListLayout = ({ c }: { c: LayoutComponent }) => {
	return (
		<div
			style={parseInlineStyle(c.style ?? '')}
			className=' w-full h-full flex aspect-[16/5] flex-col gap-2 justify-start items-start'
		>
			<div className='w-full h-1/3  bg-background'></div>
			<div className='flex justify-center items-center w-full h-1/3  bg-background'>
				Список
			</div>
			<div className='w-full h-1/3  bg-background'></div>
		</div>
	);
};

export const BlockLayout = ({ c }: { c: LayoutComponent }) => {
	return (
		<div
			style={parseInlineStyle(c.style ?? '')}
			className='w-full h-full flex gap-2 p-3'
		>
			{c.children && c.children.map(b => <DroppableArea template={b as any} />)}
			{!c.children && 'Блок'}
		</div>
	);
};

export const VideoLayout = ({ c }: { c: LayoutComponent }) => {
	return <div style={parseInlineStyle(c.style ?? '')}>видео</div>;
};

export const TextLayout = ({ c }: { c: LayoutComponent }) => {
	return (
		<p style={parseInlineStyle(c.style ?? '')} className='p-2'>
			{c.content}
		</p>
	);
};

export const LayoutComponents: Record<string, any> = {
	image: ImageLayout,
	points: PointLayout,
	content: ContentLayout,
	action: ActionLayout,
	list: ListLayout,
	block: BlockLayout,
	video: VideoLayout,
	text: TextLayout,
};
