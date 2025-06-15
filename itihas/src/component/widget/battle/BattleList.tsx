import { Button } from '@/shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import React from 'react';

interface Battle {
	id: number;
	name: string;
}

interface BattleListProps {
	battles: Battle[];
	onSelectBattle: (battleId: number) => void;
}

const 	BattleList: React.FC<BattleListProps> = ({ battles, onSelectBattle }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Список сражений</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-2'>
					{battles.map(battle => (
						<Button
							key={battle.id}
							variant='outline'
							className='w-full justify-start'
							onClick={() => onSelectBattle(battle.id)}
						>
							{battle.name} (ID: {battle.id})
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default BattleList;
