import { useState, useEffect, useMemo } from 'react';
import { AnimationControls, motion, useAnimation } from 'framer-motion'; // Импортируем framer-motion
import BattleActions from './BattleActions';
import { CharacterElement } from '../character/CharacterElement';
import { useMount } from '@siberiacancode/reactuse';
import { addBattleResult, getBattleParticipants } from '@/shared/api/battle';
import { BattleParticipant } from '@/shared/type/battle';
import { getRandomBackgroundImage } from '@/shared/lib/backgroundImage';
import { useUserStore } from '@/shared/store/UserStore';
import { Button } from '@/shared/ui/button';
import { useLayout } from '@/shared/hooks/useLayout';
import { sleep } from '@/shared/lib/promise';
import { Heart, LucideSwords, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Character } from '@/shared/type/character';

type PlayerCharacter = BattleParticipant & {
	animate?: AnimationControls;
};

export type LogResultType = {
	enemy: Character;
	player: Character;
	log: string;
	step: number;
};

const BattleScreen = ({
	parcipiant,
	battleId,
}: {
	parcipiant: BattleParticipant[];
	battleId: number;
}) => {
	const { user } = useUserStore();
	useLayout({
		footer: false,
		header: false,
	});
	const [player, setPlayer] = useState<PlayerCharacter | null>();
	const [enemy, setEnemy] = useState<PlayerCharacter | null>();
	const [battleLog, setBattleLog] = useState<LogResultType[]>([]);
	const [winner, setWinner] = useState<null | PlayerCharacter>(null);
	// const [_tems, setItems] = useState<any[]>([
	// 	{ id: 1, name: 'Зелье здоровья', effect: { health: 20 } },
	// 	{ id: 2, name: 'Зелье защиты', effect: { defense: 10 } },
	// ]);

	const controlsPlayer = useAnimation();
	const controlsEnemy = useAnimation();
	const [participants, setParticipants] = useState<PlayerCharacter[]>(() => {
		let player = parcipiant.find(parcipiant => parcipiant.userId === user!.id);
		let enemy = parcipiant.find(p => p.userId !== user!.id);

		if (!player || !enemy) {
			player = parcipiant[0];
			enemy = parcipiant[1];
		}

		setPlayer({ ...player, animate: controlsPlayer });
		setEnemy({ ...enemy, animate: controlsEnemy });
		return parcipiant;
	});

	const setLog = (log: string) => {
		if (!enemy || !player) return;
		setBattleLog(prev => {
			const lastLog = prev.at(-1);
			if (!lastLog) {
				return [
					{
						enemy: enemy.character,
						player: player.character,
						log: log,
						step: 0,
					},
				];
			}
			const battleLog = {
				enemy: enemy.character,
				player: player.character,
				log: log,
				step: lastLog.step + 1,
			};
			prev.push(battleLog);
			return [...prev];
		});
	};

	const performAttackAnimation = async (
		character: PlayerCharacter,
		direction: 'top' | 'bottom' | 'left' | 'right' = 'top'
	) => {
		const anim3 = {
			top: {
				x: 300, // Двигаемся в сторону врага
				y: -130,
				scale: 0.7,
				rotate: 30,
			},
			bottom: {
				x: -300, // Двигаемся в сторону врага
				y: 130,
				scale: 1.2,
				rotate: -30,
			},
			left: {
				x: -300, // Двигаемся в сторону врага
				rotate: -30,
			},
			right: {
				rotate: 30,

				x: +300, // Двигаемся в сторону врага
			},
		};
		if (!character.animate) return;
		// Поднимаем персонажа вверх
		await character.animate.start({
			y: -50,
			transition: { duration: 0.3 },
		});

		// Летим к врагу
		await character.animate.start({
			...anim3[direction],
			transition: { duration: 0.2 },
		});

		// Возвращаемся обратно
		await character.animate.start({
			x: 0,
			y: 0,
			rotate: 0,
			scale: 1,

			transition: { duration: 0.5 },
		});
	};

	const performDefendAnimation = async (character: PlayerCharacter) => {
		if (!character.animate) return;
		// Поднимаем персонажа вверх
		await character.animate.start({
			scale: 1.1,
			transition: { duration: 0.3 },
		});
		// Возвращаемся обратно
		await character.animate.start({
			scale: 0,
			transition: { duration: 0.2 },
		});
	};

	const backgroundImagePath = useMemo(() => {
		let path = '/image/backgrounds/bg';
		const image = getRandomBackgroundImage();
		const ext = '.png';
		if (image) {
			path += '-' + image;
		} else {
			path += '-beach';
		}
		path += ext;
		return path;
	}, []);

	useMount(() => {
		if (battleId) {
			getBattleParticipants(+battleId!).then(p => {
				setParticipants(p);
			});
		}
	});

	// const getNextPlayer = () => {
	// 	const currentParticipiantIndex = participants.findIndex(
	// 		p => p.userId === player?.userId
	// 	);
	// 	if (currentParticipiantIndex == -1) {
	// 		toast('Произошла ошибка при выборе следующего игрока');
	// 		return player;
	// 	}
	// 	const currentParticipiantNextIndex = participants.find(
	// 		p => p.userId === currentParticipiantIndex + 1
	// 	);
	// 	if (!currentParticipiantNextIndex) {
	// 		return participants[currentParticipiantIndex];
	// 	}
	// 	return currentParticipiantNextIndex;
	// };

	// Проверка окончания сражения
	useEffect(() => {
		if (player && player?.character.health <= 0) {
			if (enemy) {
				addBattleResult({
					battleId,
					result: JSON.stringify(
						participants.map(p => ({
							participantId: p.id,
							status: player.character.health > 0 ? 'win' : 'lose',
						}))
					),
					status: 'complate',
					log: JSON.stringify(battleLog),
				}).then(() => {
					setWinner(enemy);
				});
			}
		}
		if (enemy && enemy?.character.health <= 0) {
			if (player) {
				addBattleResult({
					battleId,
					status: 'complate',
					result: JSON.stringify(
						participants.map(p => ({
							participantId: p.id,
							status: player.character.health > 0 ? 'win' : 'lose',
						}))
					),
					log: JSON.stringify(battleLog),
				}).then(() => {
					setWinner(player);
				});
			}
		}
	}, [player?.character.health, enemy?.character.health]);

	// Обработчик атаки
	const handleAttack = async () => {
		if (winner || !player || !enemy || !((user?.id ?? -1) == player.userId))
			return;

		await performAttackAnimation(player, 'top');
		const damage = Math.floor(Math.random() * 20) + 10;
		const actualDamage = Math.max(0, damage - enemy.character.armor);
		enemy.character.health = Math.max(0, enemy.character.health - actualDamage);
		setLog(
			`${player.user.name} нанес ${enemy.user.name} ${actualDamage} урона!`
		);

		await sleep(1000);
		await performAttackAnimation(enemy, 'bottom');

		const enemyDamage = Math.floor(Math.random() * 15) + 5;
		const actualEnemyDamage = Math.max(0, enemyDamage - player.character.armor);
		player.character.health = Math.max(
			0,
			player.character.health - actualEnemyDamage
		);
		setLog(
			`${enemy.user.name} нанес ${player.user.name} ${actualEnemyDamage} урона!`
		);
		// const getNext = getNextPlayer();
		// if (getNext) {
		// 	setPlayer({ ...getNext, animate: controlsPlayer });
		// }
	};

	const handleDefend = async () => {
		if (winner || !player) return;

		await performDefendAnimation(player);
		player.character.armor += 10; // Увеличиваем защиту на 10
		setLog(`Вы защитились!`);

		await sleep(1000);

		if (!enemy) return;
		await performAttackAnimation(enemy, 'bottom');
		const enemyDamage = Math.floor(Math.random() * 15) + 5; // Урон врага от 5 до 20
		const actualEnemyDamage = Math.max(0, enemyDamage - player.character.armor);
		player.character.health = Math.max(
			0,
			player.character.health - actualEnemyDamage
		);
		setLog(
			`${enemy.user.name} нанес ${player.user.name} ${actualEnemyDamage} урона!`
		);
	};

	// const handleUseItem = (item: any) => {
	// 	if (winner || !player) return;

	// 	if (item.effect.health) {
	// 		player.character.health = Math.min(
	// 			100,
	// 			player.character.health + item.effect.health
	// 		);
	// 		setLog(
	// 			`${player.user.name} использовал ${item.name} и восстановил ${item.effect.health} здоровья!`
	// 		);
	// 	}
	// 	if (item.effect.defense) {
	// 		player.character.armor += item.effect.defense;
	// 		setLog(
	// 			`${player.user.name} использовал ${item.name} и увеличил защиту на ${item.effect.defense}!`
	// 		);
	// 	}

	// 	setItems(prevItems => prevItems.filter(i => i.id !== item.id));
	// };

	if (!user) {
		return <Button>Не зарегестрированы</Button>;
	}

	if (!player || !enemy) {
		return <Button>Произошла ошибка</Button>;
	}

	return (
		<div className='flex flex-col relative h-screen bg-gradient-to-b'>
			{winner && (
				<div className='absolute z-50 top-0 left-0 w-full bg-background/70 h-full flex justify-center flex-col items-center'>
					<div className='text-[86px]'>
						{winner.userId == user.id ? 'Победа' : 'Поражение'}
					</div>
					<div className='flex gap-8'>
						<Link to={`/battle/${battleId}/result`}>
							<Button>Посмотреть результаты</Button>
						</Link>
						<Link to={`/battle`}>
							<Button>Искать новый бой</Button>
						</Link>
					</div>
				</div>
			)}
			<img
				className='absolute top-0 left-0 w-full h-full object-cover'
				src={backgroundImagePath}
				onError={e => {
					e.currentTarget.src = '/image/backgrounds/bg-beach.png';
				}}
			/>
			{/* Враг */}
			{enemy && (
				<motion.div
					animate={enemy.animate}
					className='absolute left-[66%] top-[12%] h-56 w-32'
				>
					<CharacterElement character={enemy.character} />
				</motion.div>
			)}

			{/* Лог сражения */}
			<div className='w-96 flex flex-col justify-end absolute h-[calc(100%-28px)] top-8 right-2 p-2 rounded-lg mb-8'>
				{battleLog.map((log, index) => (
					<p key={index} className='text-white'>
						{log.log}
					</p>
				))}
			</div>

			{/* Игрок */}
			{player && (
				<motion.div
					animate={player.animate || {}}
					className='h-72 left-[20%] top-[35%] absolute w-48'
				>
					<div className='absolute bg-secondary flex justify-center items-center bottom-1 -left-[160px] p-2 rounded-md'>
						<div>
							<Heart className='fill-red-600  h-4  stroke-red-600' />
						</div>
						<div>{player.character.health}</div>
						<div>
							<Shield className='fill-red-600  h-4  stroke-red-600' />
						</div>
						<div>{player.character.armor}</div>
						<div>
							<LucideSwords className='fill-red-600  h-4  stroke-red-600' />
						</div>
						<div>{player.character.attack}</div>
					</div>
					<CharacterElement character={player.character} />
				</motion.div>
			)}

			{/* Действия */}
			<div className='absolute bottom-16 left-28'>
				<BattleActions
					isPlayerTurn={user.id == player.userId}
					onAttack={handleAttack}
					onDefend={handleDefend}
				/>
			</div>

			{/* Инвентарь */}
			{/* <div className='absolute bottom-0 right-0 p-4'>
				<Inventory items={items} onUseItem={handleUseItem} />
			</div> */}
		</div>
	);
};

export default BattleScreen;
