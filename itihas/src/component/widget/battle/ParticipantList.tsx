import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import React from 'react';

interface Participant {
	id: number;
	characterId: number;
	userId: number;
}

interface ParticipantListProps {
	participants: Participant[];
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Участники сражения</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-2'>
					{participants.map(participant => (
						<div key={participant.id} className='p-2 border rounded'>
							<p>Персонаж: {participant.characterId}</p>
							<p>Пользователь: {participant.userId}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default ParticipantList;
