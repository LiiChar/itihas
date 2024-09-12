import { getFullUrl } from '@/shared/lib/image';
import { setVisibleFooter, setVisibleHeader } from '@/shared/store/LayoutStore';
import { HistoryAll, HistoryPage, HistoryPages } from '@/shared/type/history';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { useEvent, useMount } from '@siberiacancode/reactuse';
import {
	BoxSelect,
	Edit,
	Plus,
	PlusIcon,
	PlusSquare,
	Trash2,
} from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';

type Node = {
	id: number;
	page: HistoryPage;
	style?: React.HTMLAttributes<HTMLDivElement>['style'];
	relation: { nodeId: number; type: 'solid' | 'many' }[];
	position: { x: number; y: number };
};

type Point = {
	x: number;
	y: number;
};

const NODE_WIDTH = 140; // ширина ноды
const NODE_HEIGHT = 200; // высота ноды

function distance(start: Point, end: Point) {
	const dx = start.x - end.x;
	const dy = start.y - end.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function calculatePath(start: Point, end: Point) {
	const dx = end.x - start.x;
	const dy = end.y - start.y;
	const angle = Math.atan2(dy, dx); // Угол между нодами

	// Коррекция начала и конца линии
	const startOffset = {
		x: start.x + (NODE_WIDTH / 2) * Math.cos(angle),
		y: start.y + (NODE_HEIGHT / 2) * Math.sin(angle),
	};

	const endOffset = {
		x: end.x - (NODE_WIDTH / 2) * Math.cos(angle),
		y: end.y - (NODE_HEIGHT / 2) * Math.sin(angle),
	};

	// Более гибкая кривая Безье с контролем над кривизной
	const controlPoint1 = {
		x: startOffset.x + (endOffset.x - startOffset.x) / 3,
		y: startOffset.y - 100, // Контроль высоты изгиба
	};

	const controlPoint2 = {
		x: endOffset.x - (endOffset.x - startOffset.x) / 3,
		y: endOffset.y + 100,
	};

	return {
		path: `
      M ${startOffset.x},${startOffset.y}
      C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${endOffset.x},${endOffset.y}
    `,
		startOffset,
		endOffset,
	};
}

function getRelation(point: string) {
	// Используем регулярное выражение для поиска move(<значение>)
	const match = point.match(/move\(([^)]+)\)/);

	if (match) {
		const value = match[1]; // Извлекаем значение внутри скобок
		// Проверяем, является ли значение числом
		if (!isNaN(+value) && !isNaN(parseFloat(value))) {
			return Number(value); // Возвращаем числовое значение
		} else {
			return false; // Возвращаем false, если это не число
		}
	}

	return false; // Если не найдено move(), возвращаем false
}
type NodeWithDepth = Node & {
	depth: number;
	position?: Point;
	outDegree?: number;
};

const calculateNodePositions = (nodes: Node[]): NodeWithDepth[] => {
	const nodesWithDepth = nodes.map(node => ({
		...node,
		depth: 0,
		outDegree: 0,
	}));
	const nodeMap = new Map<number, NodeWithDepth>();

	nodesWithDepth.forEach(node => nodeMap.set(node.id, node));

	// Определяем количество исходящих связей (outDegree) для каждого узла
	nodesWithDepth.forEach(node => {
		node.outDegree = node.relation.length;
	});

	// Определяем глубину узлов
	const calculateDepths = () => {
		const inDegree = new Map<number, number>();
		const adjacencyList = new Map<number, number[]>();

		nodesWithDepth.forEach(node => {
			inDegree.set(node.id, 0);
			adjacencyList.set(node.id, []);
		});

		nodesWithDepth.forEach(node => {
			node.relation.forEach(relation => {
				adjacencyList.get(relation.nodeId)?.push(node.id);
				inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
			});
		});

		const queue: number[] = [];
		nodesWithDepth.forEach(node => {
			if (inDegree.get(node.id) === 0) {
				queue.push(node.id);
			}
		});

		while (queue.length > 0) {
			const nodeId = queue.shift()!;
			const node = nodeMap.get(nodeId)!;
			node.relation.forEach(relation => {
				const nextNode = nodeMap.get(relation.nodeId);
				if (nextNode) {
					nextNode.depth = Math.max(nextNode.depth, node.depth + 1);
					inDegree.set(nextNode.id, inDegree.get(nextNode.id)! - 1);
					if (inDegree.get(nextNode.id) === 0) {
						queue.push(nextNode.id);
					}
				}
			});
		}
	};

	calculateDepths();

	// Размещаем узлы по горизонтали и вертикали
	const groupNodesByDepth = () => {
		const nodesByDepth = new Map<number, NodeWithDepth[]>();

		nodesWithDepth.forEach(node => {
			if (!nodesByDepth.has(node.depth)) {
				nodesByDepth.set(node.depth, []);
			}
			nodesByDepth.get(node.depth)!.push(node);
		});

		return nodesByDepth;
	};

	const placeNodes = (nodesByDepth: Map<number, NodeWithDepth[]>) => {
		const nodePositions: NodeWithDepth[] = [];
		const maxWidth = NODE_WIDTH + 20; // Расстояние между колонками

		nodesByDepth.forEach((nodesAtDepth, depth) => {
			let xOffset = 0;
			const nodeXPositions = new Map<number, number>();

			// Расставляем узлы по горизонтали с учетом группировки
			nodesAtDepth.forEach(node => {
				// Определяем позицию X для узла
				if (!nodeXPositions.has(node.id)) {
					nodeXPositions.set(node.id, xOffset);
					xOffset += maxWidth;
				}

				// Добавляем узел с вычисленной позицией
				nodePositions.push({
					...node,
					position: {
						x: nodeXPositions.get(node.id)!,
						y: depth * (NODE_HEIGHT + 20) + node.outDegree! * 60, // Расстояние между строками с учетом количества связей
					},
				});
			});
		});

		return nodePositions;
	};

	const nodesByDepth = groupNodesByDepth();
	return placeNodes(nodesByDepth);
};

const generateNodesByHistories = (pages: HistoryPage[]) => {
	const nodes: Node[] = [];
	const pos = { x: 0, y: 0 };
	pages.forEach((h, i) => {
		const relations: Node['relation'] = [];
		h.points.forEach(p => {
			const relation = getRelation(p.action);
			let type: Node['relation'][number]['type'] = 'solid';
			if (relation == false) {
				relations.push({
					nodeId: 0,
					type: type,
				});
			} else {
				relations.push({
					nodeId: relation,
					type,
				});
			}
		});

		nodes.push({
			page: h,
			id: h.id,
			position: pos,
			relation: relations,
		});
	});
	return nodes;
};

type BoardStore = {
	nodes: Node[];
};

export const Board = memo(({ history }: { history: HistoryPages }) => {
	const [nodes, setNodes] = useState(() =>
		calculateNodePositions(generateNodesByHistories(history.pages))
	);
	console.log(nodes);

	const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.7 });
	const [isDragging, setIsDragging] = useState(false);
	const layerRef = useRef<HTMLDivElement>(null);
	const [activeNode, setActiveNode] = useState<number | null>(null);
	const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
	useMount(() => {
		setVisibleFooter(false);
		setVisibleHeader(false);
	});

	const handleMouseDown = useEvent(
		(e: React.MouseEvent, nodeIndex: number, isViewport: boolean = false) => {
			if (isViewport) {
				setIsDragging(true);
				return;
			}
			const node = nodes[nodeIndex];
			const mouseX = (e.clientX - layerRef.current!.offsetLeft) / viewport.zoom;
			const mouseY = (e.clientY - layerRef.current!.offsetTop) / viewport.zoom;

			setOffset({
				x: mouseX - node.position.x,
				y: mouseY - node.position.y,
			});

			setActiveNode(nodeIndex);
			setIsDragging(true);
		}
	);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!activeNode && isDragging) {
			setViewport(prev => ({
				...prev,
				x: prev.x + e.movementX,
				y: prev.y + e.movementY,
			}));
			return;
		}
		if (!isDragging || activeNode === null) return;

		const mouseX = (e.clientX - layerRef.current!.offsetLeft) / viewport.zoom;
		const mouseY = (e.clientY - layerRef.current!.offsetTop) / viewport.zoom;

		setNodes(prevNodes => {
			const updatedNodes = [...prevNodes];
			updatedNodes[activeNode].position = {
				x: mouseX - offset.x,
				y: mouseY - offset.y,
			};
			return updatedNodes;
		});
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		setActiveNode(null);
	};

	useEffect(() => {
		if (!layerRef.current) {
			return;
		}

		layerRef.current.onwheel = (e: WheelEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (e.ctrlKey) {
				const speedFactor =
					(e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * 10;

				setViewport(prev => {
					const pinchDelta = -e.deltaY * speedFactor;

					return {
						...prev,
						zoom: Math.min(
							1.5,
							Math.max(0.1, prev.zoom * Math.pow(2, pinchDelta))
						),
					};
				});
			}
		};
	}, [setViewport]);

	return (
		<div
			className='overflow-hidden w-full h-screen'
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onMouseDown={e => handleMouseDown(e, 0, true)}
			ref={layerRef}
		>
			<div
				className='relative w-full h-full'
				style={{
					transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
				}}
			>
				<svg className='pointer-events-none overflow-visible fill-transparent stroke-white absolute w-full h-full origin-center z-40'>
					<defs>
						{/* Определяем маркер-стрелку для конца линии */}
						<marker
							id='arrow'
							viewBox='0 0 10 10'
							refX='10'
							refY='5'
							markerWidth='6'
							markerHeight='6'
							orient='auto-start-reverse'
						>
							<path d='M 0 0 L 10 5 L 0 10 z' fill='white' />
						</marker>
					</defs>
					<BoardRelation nodes={nodes} />
				</svg>
				<BoardNodes handleMouseDown={handleMouseDown} nodes={nodes} />
			</div>
		</div>
	);
});

export const BoardNodes = memo(
	({
		handleMouseDown,
		nodes,
	}: {
		nodes: Node[];
		handleMouseDown: (
			e: React.MouseEvent,
			nodeIndex: number,
			isViewport?: boolean
		) => void;
	}) => {
		return (
			<>
				{nodes.map((n, i) => (
					<div
						key={n.id}
						style={{
							top: n.position.y + 'px',
							left: n.position.x + 'px',
							width: NODE_WIDTH + 'px',
							height: NODE_HEIGHT + 'px',
							transform: `translate(-${NODE_WIDTH / 2}px, -${
								NODE_HEIGHT / 2
							}px)`, // Центрируем ноду
						}}
						className='absolute h-full select-none bg-secondary z-30 text-secondary-foreground rounded-md'
					>
						<BoardNode node={n} />
						<div className='flex h-7 justify-around items-center'>
							<PlusSquare width={16} className='cursor-pointer' />
							<BoxSelect
								width={20}
								className='cursor-pointer'
								onMouseDown={e => handleMouseDown(e, i)}
							/>
							<EditPage page={n.page} />
						</div>
					</div>
				))}
			</>
		);
	}
);
export const BoardNode = memo(({ node }: { node: Node }) => {
	return (
		<div className='h-[calc(100%-28px)] overflow-hidden'>
			<div>
				<img className='select-none' src={getFullUrl(node.page.image)} />
			</div>
			<div className='text-xs px-1'>{node.page.content}</div>
		</div>
	);
});

export const BoardRelation = memo(({ nodes }: { nodes: Node[] }) => {
	return (
		<>
			{nodes.map((n, i) =>
				n.relation.map(r => {
					const startNode = n;
					const endNode = nodes.find(n => n.id === r.nodeId);
					if (!endNode) return null;

					const { path, startOffset, endOffset } = calculatePath(
						startNode.position,
						endNode.position
					);

					// Отрисовка белого круга в начале линии
					const circleX = startOffset.x;
					const circleY = startOffset.y;

					return (
						<g key={crypto.randomUUID()}>
							{/* Белый круг на начале соединения */}
							<circle cx={circleX} cy={circleY} r='5' fill='white' />
							{/* Линия со стрелкой на конце */}
							<path d={path} stroke='white' markerEnd='url(#arrow)' />
						</g>
					);
				})
			)}
		</>
	);
});

export const EditPage = ({ page }: { page: HistoryPage }) => {
	return (
		<Dialog>
			<DialogTrigger>
				<Edit width={16} className='cursor-pointer' />
			</DialogTrigger>
			<DialogContent onMouseDown={e => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Изменить страницу</DialogTitle>
				</DialogHeader>
				<EditPageForm page={page} />
			</DialogContent>
		</Dialog>
	);
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { ImageUpload } from '../form/ImageUpload';
import { updatePage } from '@/shared/api/page';
import { Page } from '@/shared/type/page';
import { runRefreshAction } from '@/shared/store/RefreshStore';
import { DialogClose } from '@radix-ui/react-dialog';
import { SoundUpload } from '../form/SoundUpload';

const loginFormScheme = z.object({
	name: z.string().min(3, 'Имя слишком короткое'),
	description: z.string(),
	content: z.string(),
	image: z.string().nullable(),
	wallpaper: z.string().nullable(),
	sound: z.string().nullable(),
});

export const EditPageForm = ({ page }: { page: HistoryPage }) => {
	const form = useForm<z.infer<typeof loginFormScheme>>({
		resolver: zodResolver(loginFormScheme),
		defaultValues: {
			content: page.content,
			description: page.description ?? undefined,
			image: page.image,
			name: page.name,
			sound: page.sound ?? undefined,
			wallpaper: page.wallpaper ?? undefined,
		},
	});
	function removeNullableValues<T extends object>(obj: T): T {
		return Object.fromEntries(
			Object.entries(obj).filter(([_, value]) => value !== null)
		) as T;
	}
	const onSubmitEdit = async (values: z.infer<typeof loginFormScheme>) => {
		const data: unknown = removeNullableValues(values);
		await updatePage(page.id, data as unknown as Partial<Page>);
		runRefreshAction('EditHistory');
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitEdit)} className=''>
				<div className='w-full px-2 max-h-[73vh] h-[calc(100%-46px)] overflow-scroll'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Название страницы
								</FormLabel>
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите название страницы'
										{...field}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Описание</FormLabel>
								<FormControl>
									<Textarea
										className='bg-background -translate-y-2'
										placeholder='Введите описание страницы'
										{...field}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='content'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Содержание</FormLabel>
								<FormControl>
									<Textarea
										className='bg-background -translate-y-2'
										placeholder='Введите содержание страницы'
										{...field}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='image'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Ссылка на изображение
								</FormLabel>
								{field.value && (
									<ImageUpload
										src={field.value}
										onUpload={path => {
											form.setValue('image', path);
										}}
									/>
								)}
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите ссылку на изображение'
										{...field}
										value={field.value ?? ''}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='wallpaper'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>Задний фон</FormLabel>
								{field.value && (
									<ImageUpload
										src={field.value}
										onUpload={path => {
											form.setValue('image', path);
										}}
									/>
								)}
								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Выберите задний фон'
										{...field}
										value={field.value ?? ''}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='sound'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-foreground'>
									Ссылка на музыку
								</FormLabel>
								{field.value && (
									<SoundUpload
										src={field.value}
										onUpload={src => form.setValue('sound', src)}
									/>
								)}

								<FormControl>
									<Input
										className='bg-background -translate-y-2'
										placeholder='Введите ссылку на музыку'
										{...field}
										value={field.value ?? ''}
									/>
								</FormControl>
								<FormMessage className='-translate-y-4' />
							</FormItem>
						)}
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button className='mt-2 float-end' type='submit'>
							Сохранить
						</Button>
					</DialogClose>
				</DialogFooter>
			</form>
		</Form>
	);
};
