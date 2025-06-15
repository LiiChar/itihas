import { addParticipantToBattle } from '@/shared/api/battle';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import React, { useState } from 'react';

interface AddParticipantFormProps {
	battleId: number;
	onParticipantAdded: () => void;
}

const AddParticipantForm: React.FC<AddParticipantFormProps> = ({
	battleId,
	onParticipantAdded,
}) => {
	const [characterId, setCharacterId] = useState<number>(0);
	const [userId, setUserId] = useState<number>(0);

	const handleAddParticipant = async () => {
		if (!characterId || !userId) {
			alert('Введите ID персонажа и пользователя');
			return;
		}

		try {
			await addParticipantToBattle(battleId, characterId, userId);
			setCharacterId(0);
			setUserId(0);
			onParticipantAdded();
			alert('Участник успешно добавлен!');
		} catch (error) {
			console.error('Ошибка при добавлении участника:', error);
			alert('Не удалось добавить участника');
		}
	};

	return (
		<div className='space-y-4'>
			<h2 className='text-lg font-semibold'>Добавить участника</h2>
			<div className='flex space-x-2'>
				<Input
					type='number'
					placeholder='ID персонажа'
					value={characterId}
					onChange={e => setCharacterId(Number(e.target.value))}
				/>
				<Input
					type='number'
					placeholder='ID пользователя'
					value={userId}
					onChange={e => setUserId(Number(e.target.value))}
				/>
				<Button onClick={handleAddParticipant}>Добавить</Button>
			</div>
		</div>
	);
};

export default AddParticipantForm;
