import { Board } from '@/component/widget/board/Board';
import { useParams } from 'react-router-dom';

export const PageEditBoard = () => {
	const {} = useParams();

	return (
		<div>
			<Board />
		</div>
	);
};