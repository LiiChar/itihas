import { Button } from '@/shared/ui/button';
import React from 'react';

interface BattleActionsProps {
	onAttack: () => void;
	onDefend: () => void;
	isPlayerTurn: boolean;
}

const BattleActions: React.FC<BattleActionsProps> = ({
	onAttack,
	onDefend,
	isPlayerTurn,
}) => {
	return (
		<div className='mt-8 space-x-4'>
			<Button onClick={onAttack} disabled={!isPlayerTurn}>
				Атаковать
			</Button>
			<Button onClick={onDefend} variant='secondary' disabled={!isPlayerTurn}>
				Защита
			</Button>
			<Button variant='secondary' disabled={!isPlayerTurn}>
				Использовать предмет
			</Button>
		</div>
	);
};

export default BattleActions;
