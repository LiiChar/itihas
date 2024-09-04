import { Board } from '@/component/widget/board/Board';
import React from 'react';
import { useParams } from 'react-router-dom';

export const PageEditBoard = () => {
	const { id } = useParams();

	return (
		<div>
			<Board />
		</div>
	);
};
