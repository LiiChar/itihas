import { LogResultType } from '@/component/widget/battle/BattleScreen';
import { CharacterElement } from '@/component/widget/character/CharacterElement';
import { getBattleResults } from '@/shared/api/battle';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { BattleParticipant, ResultJsonType } from '@/shared/type/battle';
import { Button } from '@/shared/ui/button';
import { useQuery } from '@siberiacancode/reactuse';
import { useParams } from 'react-router-dom';

export const Results = () => {
	const { id } = useParams();
	const { data } = useQuery(() => getBattleResults(+id!));

	if (!data) {
		return <Button loading={true}></Button>;
	}

	const result = data[0];
	const log: LogResultType[] = JSON.parse(result.log);
	const participansResult: ResultJsonType[] = JSON.parse(result.result);

	const getStatusPar = (_part: BattleParticipant): ResultJsonType['status'] => {
		const finded = participansResult.find(
			r => r.participantId == result.battle.participants[0].id
		);
		if (!finded) return 'draw';
		return finded.status;
	};

	return (
		<div>
			<div>
				<div className='text-[36px] text-center  '>{result.battle.name}</div>
				<div className='flex'>
					<div
						className={`w-1/3 m-4 shadow-lg ${
							getStatusPar(result.battle.participants[0]) == 'win'
								? 'shadow-green-600'
								: 'shadow-red-600'
						}`}
					>
						<CharacterElement
							character={result.battle.participants[0].character}
						/>
					</div>
					<div className='w-1/3 m-4'></div>
					<div
						className={`w-1/3 m-4 shadow-lg ${
							getStatusPar(result.battle.participants[1]) == 'win'
								? 'shadow-green-600'
								: 'shadow-red-600'
						}`}
					>
						<CharacterElement
							character={result.battle.participants[1].character}
						/>
					</div>
				</div>
			</div>
			<div>
				{log.map(r => (
					<div className='flex'>
						<div className='rounded-full h-6 w-6'>
							<img
								onError={handleImageError}
								src={getFullUrl(r.player.image)}
								alt=''
							/>
						</div>
						<div>
							<div>{r.player.name}</div>
							<div>{r.log}</div>
						</div>
					</div>
				))}
			</div>
			;
		</div>
	);
};
