import { getAllBattles, getBattleParticipants } from '@/shared/api/battle';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import React, { useState } from 'react';
import AddParticipantForm from './AddParticipantForm';
import BattleList from './BattleList';
import CreateBattleForm from './CreateBattleForm';
import ParticipantList from './ParticipantList';

interface Battle {
	id: number;
	name: string;
}

interface Participant {
	id: number;
	characterId: number;
	userId: number;
}

const BattleManager: React.FC = () => {
	const [battles, setBattles] = useState<Battle[]>([]);
	const [selectedBattleId, setSelectedBattleId] = useState<number | null>(null);
	const [participants, setParticipants] = useState<Participant[]>([]);

	// Загрузка списка сражений
	const loadBattles = async () => {
		try {
			const battles = await getAllBattles();
			setBattles(battles);
		} catch (error) {
			console.error('Ошибка при загрузке сражений:', error);
		}
	};

	// Загрузка участников выбранного сражения
	const loadParticipants = async (battleId: number) => {
		try {
			const participants = await getBattleParticipants(battleId);
			setParticipants(participants);
		} catch (error) {
			console.error('Ошибка при загрузке участников:', error);
		}
	};

	// Обработчик выбора сражения
	const handleSelectBattle = async (battleId: number) => {
		setSelectedBattleId(battleId);
		await loadParticipants(battleId);
	};

	// Загрузка данных при монтировании компонента
	React.useEffect(() => {
		loadBattles();
	}, []);

	return (
		<div className='p-6 space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Управление сражениями</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Форма создания сражения */}
					<CreateBattleForm onBattleCreated={loadBattles} />

					{/* Список сражений */}
					<BattleList battles={battles} onSelectBattle={handleSelectBattle} />

					{/* Форма добавления участника и список участников */}
					{selectedBattleId && (
						<>
							<AddParticipantForm
								battleId={selectedBattleId}
								onParticipantAdded={() => loadParticipants(selectedBattleId)}
							/>
							<ParticipantList participants={participants} />
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default BattleManager;
