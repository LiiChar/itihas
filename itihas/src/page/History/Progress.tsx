import { getProgressHistory } from '@/shared/api/history';
import { useQuery } from '@siberiacancode/reactuse';
import { useCallback, useState } from 'react';
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
