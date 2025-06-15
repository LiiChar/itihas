import BattleScreen from '@/component/widget/battle/BattleScreen';
import {
	getBattleById,
	getBattleParticipants,
	updateBattle,
} from '@/shared/api/battle';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { BattleAll, BattleParticipant } from '@/shared/type/battle';
import { Button } from '@/shared/ui/button';
import { useMount, useStep } from '@siberiacancode/reactuse';
import { Heart, Shield, Swords } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const Screen = () => {
	const { id } = useParams();
	const [battle, setBattle] = useState<BattleAll>();

	if (!id) {
		return <Button>Ошибка</Button>;
	}

	useMount(() => {
		getBattleById(+id).then(data => {
			setBattle(data);
		});
	});

	return (
		<div>
			{battle &&
				battle.status == 'started' &&
				battle.participants.length > 0 && (
					<BattleScreen battleId={+id} parcipiant={battle.participants} />
				)}
			{battle &&
				battle.status == 'finished' &&
				battle.participants.length > 0 && <div>бой отменён</div>}
			{battle &&
				battle.status == 'initialized' &&
				battle.participants.length > 0 && <ScreenPreview battle={battle} />}
		</div>
	);
};

export type TeamsParticipian = {
	team: string;
	participants: BattleParticipant[];
};

export const ScreenPreview = ({ battle }: { battle: BattleAll }) => {
	const navigate = useNavigate();
	const initTeams = (battle: BattleAll) => {
		const teamsParticipian: Record<string, BattleParticipant[]> = {};
		battle.participants.forEach((p, i) => {
			if (teamsParticipian[p?.team ?? `tema${i}`]) {
				teamsParticipian[p?.team ?? `tema${i}`].push(p);
			} else {
				teamsParticipian[p?.team ?? `tema${i}`] = [p];
			}
		});
		const teamP = Object.entries(teamsParticipian).map(([Key, value]) => ({
			team: Key,
			participants: value,
		}));
		const teamsStat = teamP.map(t => {
			let attack = 0;
			let armor = 0;
			let health = 0;
			let rank = 0;
			t.participants.forEach(p => {
				rank += p.character.rank;
				health += p.character.health;
				armor += p.character.armor;
				attack += p.character.attack;
			});
			const all = attack + armor + health + rank;
			return {
				...t,
				all,
				attack,
				armor,
				rank,
				health,
			};
		});

		const allPower = teamsStat.reduce<number>(
			(acc, val) => (acc += val.all),
			0
		);

		const teamsStats = teamsStat.map(s => {
			const a = {
				...s,
				power: (allPower / s.all) * 100,
			} as typeof s & { power: number };
			return a;
		});
		return teamsStats;
	};
	const [teams, setTeams] = useState(() => initTeams(battle));

	return (
		<div className='mx-20'>
			<div className='text-[46px]'>{battle.name}</div>
			<div>
				<div className='text-[22px]'>Команды</div>
				<div className='flex gap-[10px]'>
					{teams.map(t => (
						<div className='w-[50%] border-[1px] border-secondary p-3 rounded-sm flex flex-col gap-3'>
							<div className='bg-primary/10 p-2 text-center text-xl'>
								{t.team}
							</div>
							<div>
								<div>
									{t.participants.map(p => (
										<div className='shadow-md shadow-secondary/40 bg-secondary/40 p-2'>
											<div className='mb-1 text-lg'>{p.character.name}</div>
											<div className='flex gap-8 items-center'>
												<div className=' '>
													<img
														src={getFullUrl(p.character.image)}
														onError={handleImageError}
														alt={p.character.name}
														className='rounded-full w-9 h-9'
													/>
												</div>
												<div className='flex gap-6'>
													<div className='flex gap-2 items-center'>
														<Heart /> {p.character.health}
													</div>
													<div className='flex gap-2 items-center'>
														<Shield /> {p.character.armor}
													</div>
													<div className='flex gap-2 items-center'>
														<Swords /> {p.character.attack}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
							<div>
								Общая сила:{' '}
								<span className='bg-primary/10 p-1 rounded-sm'>{t.power!}</span>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className='flex justify-between mt-8'>
				<Button
					onClick={async () => {
						await updateBattle(battle.id, { status: 'finished' });
						setTeams(() => {
							const newBattle = { ...battle };
							newBattle.status = 'finished';
							return initTeams(newBattle);
						});
					}}
				>
					Отменить
				</Button>
				<Button
					onClick={async () => {
						await updateBattle(battle.id, { status: 'started' });
						setTeams(() => {
							const newBattle = { ...battle };
							newBattle.status = 'started';
							return initTeams(newBattle);
						});
						navigate(`/battle/${battle.id}`);
					}}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
};
