import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { CharacterAll } from '@/shared/type/character';
import { Button } from '@/shared/ui/button';
import { Heart, Swords } from 'lucide-react';
import { CharacterBattleForm } from './CharacterBattleForm';

const CharacterDetails = ({ character }: { character: CharacterAll }) => {
	const handleStartBattle = (opponentId: number) => {
		// TODO
		// Логика для начала сражения
	};

	return (
		<div className='p-4 space-y-4'>
			{/* Информация о персонаже и создателе */}
			<div className='flex gap-2 w-full justify-between'>
				<div className='w-1/3 h-full flex flex-col'>
					<h2 className='text-xl  font-semibold mt-4'>Создатель</h2>
					{character.user && (
						<div className='flex items-center space-x-4'>
							<img
								src={getFullUrl(character.user.name)}
								alt={character.user.name}
								className='w-16 h-16 rounded-full'
							/>
							<div>
								<p>{character.user.name}</p>
								<p>{character.user.description}</p>
							</div>
						</div>
					)}
					<div className='justify-self-end flex gap-2'>
						<Button>
							<CharacterBattleForm character={{ id: character.id }}>
								<Swords />
							</CharacterBattleForm>
						</Button>

						<Button>
							<Heart />
						</Button>
					</div>
				</div>
				<div className='w-1/3'>
					<img
						src={getFullUrl(character.image)}
						onError={handleImageError}
						alt={character.name}
						className='w-56 rounded-md h-72 mx-auto '
					/>
					<div className='text-2xl text-center font-bold'>{character.name}</div>
				</div>
				<div className=' w-1/3'>
					<p className='flex'>Здоровье: {character.health}</p>
					<p>Броня: {character.armor}</p>
					<p>Урон: {character.attack}</p>
					<p>Редкость: {character.rarity}</p>
					<p>Ранг: {character.rank}</p>
					<p className='mt-2'>Описание</p>
					<p>{character.description}</p>
				</div>
			</div>

			{/* Список владельцев */}
			<div className='bg-secondary/60  p-4 rounded-lg shadow'>
				<h2 className='text-xl font-semibold'>Владельцы</h2>
				<ul>
					{character.users &&
						character.users.map(user => (
							<li
								key={user.user.id}
								className='flex w-full items-center space-x-4 my-2'
							>
								<img
									src={getFullUrl(user.user.photo)}
									alt={user.user.name}
									className='w-12 h-12 rounded-full'
								/>
								<div>
									<p>{user.user.name}</p>
									<p>{user.user.description}</p>
								</div>
								<Button className='self-end justify-self-end'>
									<CharacterBattleForm
										particialIdx={[user.user.id]}
										character={{ id: character.id }}
									>
										<Swords />
									</CharacterBattleForm>
								</Button>
							</li>
						))}
				</ul>
			</div>

			{/* Сражения и результаты */}
			<div className='bg-secondary/70 p-4 rounded-lg shadow'>
				<h2 className='text-xl font-semibold'>Сражения</h2>
				<ul>
					{character.battleResults &&
						character.battleResults.map(result => (
							<li key={result.id} className='my-4'>
								<p>Сражение: {result.battle.name}</p>
								<p>Начато: {result.battle.startedAt}</p>
								<p>Завершено: {result.battle.endedAt || 'В процессе'}</p>
								<p>Участники:</p>
								<ul>
									{result.battle.participants.map(participant => (
										<li
											key={participant.id}
											className='flex items-center space-x-4 my-2'
										>
											<img
												src={getFullUrl(participant.character.image)}
												alt={participant.character.name}
												className='w-12 h-12 rounded-full'
											/>
											<div>
												<p>{participant.character.name}</p>
												<p>Владелец: {participant.user.name}</p>
											</div>
											<Button
												onClick={() => handleStartBattle(participant.user.id)}
											>
												Начать сражение
											</Button>
										</li>
									))}
								</ul>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default CharacterDetails;
