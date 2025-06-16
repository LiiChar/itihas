import { CharacterElement } from '@/component/widget/character/CharacterElement';
import { getCharacters } from '@/shared/api/character';
import { Button } from '@/shared/ui/button';
import { useQuery } from '@siberiacancode/reactuse';
import { Link } from 'react-router-dom';

export const Characters = () => {
	const { data, isLoading } = useQuery(() => getCharacters());

	if (!data) {
		return <Button loading={isLoading}>Ошибка</Button>;
	}
	return (
		<div>
			<div className='flex gap-1  flex-wrap p-2'>
				{data.map(c => (
					<Link
						className='h-36 transition-all hover:z-10 hover:scale-[1.05] w-28 flex-grow'
						to={`/characters/${c.id}`}
					>
						<CharacterElement character={c} />
					</Link>
				))}
			</div>
		</div>
	);
};
