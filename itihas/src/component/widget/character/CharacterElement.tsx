import React, { HTMLProps } from 'react';
import { Card, CardContent, CardTitle } from '@/shared/ui/card';
import {
	Star,
	Zap,
	Heart,
	Shield,
	Sword,
	Skull,
	HeartCrack,
} from 'lucide-react';
import { cn } from '@/shared/lib/lib';
import { getFullUrl, handleImageError } from '@/shared/lib/image';
import { addCharacterToUser } from '@/shared/api/character';
import { useUserStore } from '@/shared/store/UserStore';
import { motion } from 'framer-motion';

interface Character {
	id: number;
	rarity:
		| 'handmade'
		| 'common'
		| 'uncommon'
		| 'rare'
		| 'epic'
		| 'legendary'
		| 'mythic'
		| 'transcendent'
		| null;
	name: string;
	image: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	historyId: number;
	rank: number;
}

interface CharacterCardProps {
	character: Character;
	variant?: 'default' | 'compact';
	className?: HTMLProps<HTMLDivElement>['className'];
	onClick?: () => void;
	isFavorite?: boolean;
	onToggleFavorite?: () => void;
}

const rarityStyles = {
	colors: {
		handmade: 'border-yellow-400 bg-yellow-100',
		common: 'border-gray-300 bg-gray-100',
		uncommon: 'border-emerald-500 bg-emerald-100',
		rare: 'border-blue-500 bg-blue-100',
		epic: 'border-purple-500 bg-purple-100',
		legendary: 'border-orange-400 bg-orange-100',
		mythic: 'border-rose-600 bg-rose-100',
		transcendent: 'border-cyan-800 bg-cyan-100',
		null: 'border-muted bg-muted',
	},
	text: {
		handmade: 'text-yellow-500',
		common: 'text-gray-800',
		uncommon: 'text-emerald-600',
		rare: 'text-blue-600',
		epic: 'text-purple-600',
		legendary: 'text-orange-500',
		mythic: 'text-rose-600',
		transcendent: 'text-cyan-800',
		null: 'text-muted-foreground',
	},
	icons: {
		handmade: <Zap className='w-5 h-5 text-yellow-500' />,
		common: <Shield className='w-5 h-5 text-gray-800' />,
		uncommon: <Sword className='w-5 h-5 text-emerald-600' />,
		rare: <Star className='w-5 h-5 text-blue-600' />,
		epic: <Skull className='w-5 h-5 text-purple-600' />,
		legendary: <Zap className='w-5 h-5 text-orange-500' />,
		mythic: <Heart className='w-5 h-5 text-rose-600' />,
		transcendent: <Zap className='w-5 h-5 text-cyan-800' />,
		null: <HeartCrack className='w-5 h-5 text-muted-foreground' />,
	},
};

export const CharacterElement: React.FC<CharacterCardProps> = ({
	character,
	variant = 'default',
	className,
	onClick,
	isFavorite = false,
	onToggleFavorite,
}) => {
	const rarity = character.rarity || 'null';
	const Icon = rarityStyles.icons[rarity];
	const { user } = useUserStore();

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.25 }}
		>
			<Card
				onClick={onClick}
				className={cn(
					`group relative overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl border-2 rounded-xl h-full`,
					rarityStyles.colors[rarity],
					className
				)}
			>
				<CardContent className='p-0 relative h-full'>
					<div className='absolute top-2 left-2 z-10 flex w-[calc(100%-1rem)] justify-between opacity-0 group-hover:opacity-100 transition-opacity'>
						<button
							onClick={e => {
								e.stopPropagation();
								onToggleFavorite?.();
							}}
							className='flex items-center justify-between w-full px-3 py-1 rounded-lg backdrop-blur-sm bg-white/80 overflow-hidden'
						>
							<span
								className={cn('text-xs font-medium', rarityStyles.text[rarity])}
							>
								{character.rank}
							</span>
							<div
								className={cn(
									'w-5 h-5',
									isFavorite
										? 'fill-destructive text-destructive'
										: rarityStyles.text[rarity]
								)}
								onClick={() =>
									user && addCharacterToUser(user.id, character.id)
								}
							>
								{Icon}
							</div>
						</button>
					</div>
					<div className='h-full w-full'>
						<img
							src={getFullUrl(character.image)}
							onError={handleImageError}
							alt={character.name}
							className='object-cover w-full h-full rounded-t-xl'
						/>
					</div>
					<CardTitle
						className={cn(
							'absolute bottom-0 left-0 w-full p-2 text-sm font-bold backdrop-blur-sm text-white bg-black/40',
							rarityStyles.text[rarity]
						)}
					>
						{character.name}
					</CardTitle>
				</CardContent>
			</Card>
		</motion.div>
	);
};
