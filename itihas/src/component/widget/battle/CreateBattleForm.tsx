import { createBattle } from '@/shared/api/battle';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import React, { useState } from 'react';

interface CreateBattleFormProps {
	onBattleCreated: () => void;
}

const CreateBattleForm: React.FC<CreateBattleFormProps> = ({
	onBattleCreated,
}) => {
	const [battleName, setBattleName] = useState<string>('');

	const handleCreateBattle = async () => {
		if (!battleName) {
			alert('Введите название сражения');
			return;
		}

		try {
			await createBattle(battleName);
			setBattleName('');
			onBattleCreated();
			alert('Сражение успешно создано!');
		} catch (error) {
			console.error('Ошибка при создании сражения:', error);
			alert('Не удалось создать сражение');
		}
	};

	return (
		<div className='space-y-4'>
			<h2 className='text-lg font-semibold'>Создать сражение</h2>
			<div className='flex space-x-2'>
				<Input
					type='text'
					placeholder='Название сражения'
					value={battleName}
					onChange={e => setBattleName(e.target.value)}
				/>
				<Button onClick={handleCreateBattle}>Создать</Button>
			</div>
		</div>
	);
};

export default CreateBattleForm;
