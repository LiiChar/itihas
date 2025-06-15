import CharacterDetails from '@/component/widget/character/CharacterDetail';
import { getCharactersById } from '@/shared/api/character';
import { useQuery } from '@siberiacancode/reactuse';
import { useParams } from 'react-router-dom';

export const Character = () => {
	const { id } = useParams();

	const { data } = useQuery(() => getCharactersById(+id!));

	return <div>{data && <CharacterDetails character={data} />}</div>;
};
