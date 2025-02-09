import { getProgressHistory } from '@/shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	ReactFlow,
	Background,
	Controls,
	Node,
	Edge,
	applyNodeChanges,
	applyEdgeChanges,
	NodeChange,
	EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Block {
	id: number;
	name: string;
	nextId?: number | null;
	prevId?: number | null;
	type: 'start' | 'end' | null;
}

interface BlockComponentProps {
	blocks: Block[];
}

const BlockComponent: React.FC<BlockComponentProps> = ({ blocks }) => {
	// Находим начальный и конечный блоки
	const startBlock = blocks.find(block => block.type === 'start');
	const endBlock = blocks.find(block => block.type === 'end');

	if (!startBlock || !endBlock) {
		return <div>Start or end block not found</div>;
	}

	// Функция для отрисовки блоков и связей
	const renderBlocks = () => {
		const renderedBlocks: JSX.Element[] = [];
		let currentBlock: Block | undefined = startBlock;

		while (currentBlock) {
			// Отрисовываем блок
			renderedBlocks.push(
				<div
					key={currentBlock.id}
					style={{
						border: '1px solid black',
						padding: '10px',
						margin: '10px',
						width: '100px',
						textAlign: 'center',
					}}
				>
					{currentBlock.name}
				</div>
			);

			// Отрисовываем стрелку, если есть следующий блок
			if (currentBlock.nextId) {
				renderedBlocks.push(
					<div key={`arrow-${currentBlock.id}`} style={{ textAlign: 'center' }}>
						↓
					</div>
				);
			}

			// Переходим к следующему блоку
			currentBlock = blocks.find(block => block.id === currentBlock?.nextId);
		}

		return renderedBlocks;
	};

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			{renderBlocks()}
		</div>
	);
};

export const Progress = () => {
	const { historyId } = useParams();

	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	useQuery(
		() => getProgressHistory({ historyId: historyId ? +historyId : undefined }),
		{
			onSuccess(data) {
				let i = -50;
				setNodes(() => {
					return (
						data?.map((v): Node => {
							const data = Object.assign(v, { label: v.name });
							i += 200;
							return {
								id: `${v.id}`,
								data: data,
								position: { x: i, y: 0 },
								draggable: true,
							};
						}) ?? []
					);
				});

				setEdges(() => {
					return (
						data?.map((v): Edge => {
							const data = Object.assign(v, { label: v.name });
							return {
								id: `${v.pageId}-${v.nextPageId}`,
								data: data,
								source: `${v.pageId}`,
								target: `${v.nextPageId}`,
							};
						}) ?? []
					);
				});
			},
		}
	);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
		[]
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
		[]
	);

	return (
		<div className=' h-[500px]'>
			<ReactFlow
				nodes={nodes}
				onNodesChange={onNodesChange}
				edges={edges}
				onEdgesChange={onEdgesChange}
				fitView
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	);
};
