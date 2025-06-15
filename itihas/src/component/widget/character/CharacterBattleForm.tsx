import { addParticipantToBattle, createBattle } from '@/shared/api/battle';
import { useUserStore } from '@/shared/store/UserStore';
import { Battle } from '@/shared/type/battle';
import { CharacterAll } from '@/shared/type/character';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import React, { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const CharacterBattleForm = ({
	children,
	character,
	particialIdx,
}: PropsWithChildren & {
	character: Partial<CharacterAll> & { id: number };
	particialIdx?: number[];
}) => {
	const navigate = useNavigate();

	return (
		<Dialog>
			<DialogTrigger className=''>{children}</DialogTrigger>
			<DialogContent>
				<form
					className='flex flex-col gap-2'
					onSubmit={async e => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						const battleName = formData.get('battleName');
						if (!battleName || typeof battleName != 'string') {
							toast('Произошла ошибка при создании сражении');
							return;
						}
						const userId = useUserStore.getState().user?.id ?? null;

						if (!userId) {
							toast('Вы должны войти, чтобы начать сражение');
							return;
						}

						const battle: null | Battle = await createBattle(battleName);

						if (battle && !battle.id) {
							toast('Что-то пошло не так при создании сражения');
							return;
						}

						await addParticipantToBattle(battle.id, character.id, userId);

						particialIdx &&
							particialIdx.forEach(async id => {
								await addParticipantToBattle(battle.id, character.id, id);
							});

						navigate(`/battle/${battle.id}`);
					}}
				>
					<Label htmlFor='battleName'>Введите название сражения</Label>
					<Input
						min='3'
						id='battleName'
						name='battleName'
						placeholder='Горажное побоище'
					/>
					<Button className='self-end' type='submit'>
						Создать
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
