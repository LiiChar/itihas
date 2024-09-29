import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { CharacterRelation } from '@/shared/type/character';

interface CharacterElementProps {
	character: CharacterRelation;
	link?: string;
	option?: {
		imageError?: {
			url?: string;
			cb?: () => void;
		};
		nameHeight?: number;
	};
}

export const CharacterElement = ({
	character,
	option,
}: CharacterElementProps) => {
	// TODO
	// const _rarity: Record<NonNullable<(typeof character)['rarity']>, string> = {
	// 	common: '',
	// 	epic: '',
	// 	handmade: '',
	// 	legendary: '',
	// 	uncommon: '',
	// 	mythic: '',
	// 	rare: '',
	// 	transcendent: '',
	// };
	return (
		<div>
			<img
				src={getFullUrl(character.image)}
				onError={e =>
					handleImageError(e, option?.imageError?.url, option?.imageError?.cb)
				}
				loading='lazy'
				className='object-cover rounded-t-sm w-full aspect-[3/4]'
				alt={character.name}
			/>
			<div className='px-1 overflow-hidden pb-1 pt-1 text-[70%] sm:text-[12px] md:text-[14px] lg:text-[16px]'>
				<div
					className={`${
						option?.nameHeight ? `line-clamp-${option.nameHeight}` : ''
					}`}
				>
					{character.name}
				</div>
			</div>
		</div>
	);
};
