import { memo } from 'react';
import { HistoryPages } from '../../../shared/type/history';
import { getFullUrl, handleImageError } from '../../../shared/lib/image';
import { Minus, Plus } from 'lucide-react';
import { updateSimilarHistoryRate } from '@/shared/api/history';
import { runListener } from '@/shared/store/ListenerStore';
import { AddSimilarModal } from './AddSimilarModal';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/shared/store/UserStore';
import { cn } from '@/shared/lib/lib';

type SimilarVariant = 'vertical' | 'horizontal';

const SimilarVariantClassName: Record<
	SimilarVariant,
	Record<string, string>
> = {
	horizontal: {
		header: 'justify-between',
		slider: 'flex gap-3 flex-wrap flex-row w-full',
		item: 'gap-2 min-w-[185px] w-auto',
		action: 'pb-8',
	},
	vertical: {
		header: '',
		slider: 'max-w-40 gap-3 flex flex-col',
		item: 'gap-2',
		action: '',
	},
};

export const Similar = memo(
	({
		history,
		variant = 'vertical',
	}: {
		history: HistoryPages;
		variant?: SimilarVariant;
	}) => {
		const style = SimilarVariantClassName[variant];
		const { user } = useUserStore();

		return (
			<section>
				<div className={`flex gap-2 items-end ${style['header']}`}>
					<h4 className='m-0 text-lg font-semibold'>Похожее</h4>
					<div className='h-[30px]'>
						<AddSimilarModal
							historyId={history.id}
							onSubmit={() => runListener('historyChange')}
						/>
					</div>
				</div>

				<div className={`${style['slider']} min-w-[185px] mt-3`}>
					{history.similarHistories.map(s => (
						<motion.div
							key={s.id + s.historyId + s.similarHistoryId}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className={`flex flex-col ${style['item']}`}
						>
							<div className='flex items-stretch gap-2 relative'>
								<Link
									to={`/history/${s.id}`}
									className='relative flex-shrink-0 shadow rounded-md overflow-hidden group'
								>
									<img
										src={getFullUrl(s.similarHistory.image)}
										onError={handleImageError}
										className={cn(
											'w-full h-full object-cover rounded-md max-w-[155px] transition-transform group-hover:scale-105',
											!user && 'max-w-[185px]'
										)}
										alt={`Похожая история ${s.similarHistory.name}`}
									/>
									<div className='absolute bottom-1 w-[calc(100%-8px)] left-1 z-10 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded'>
										{s.similarHistory.name}
									</div>
								</Link>
								{!user && (
									<div className='absolute right-1 top-2 px-1 bg-primary rounded-lg'>
										{s.similar ?? 0}
									</div>
								)}
								{user && (
									<div className='flex flex-col items-center justify-between min-h-[99px] border border-secondary rounded-md rounded-tl-none rounded-bl-none overflow-hidden'>
										<button
											onClick={() => {
												updateSimilarHistoryRate({
													rate: (s.similar ?? 0) + 1,
													similarId: s.id,
												});
												runListener('historyChange');
											}}
											className='flex flex-grow items-center justify-center w-full hover:bg-secondary px-1'
										>
											<Plus className='w-5 h-5 hover:stroke-primary' />
										</button>
										<div className='my-1 px-1 font-medium'>
											{s.similar ?? 0}
										</div>
										<button
											onClick={() => {
												updateSimilarHistoryRate({
													rate: (s.similar ?? 0) - 1,
													similarId: s.id,
												});
												runListener('historyChange');
											}}
											className='flex items-center justify-center w-full hover:bg-secondary px-1 flex-grow'
										>
											<Minus className='w-5 h-5 hover:stroke-primary' />
										</button>
									</div>
								)}
							</div>
						</motion.div>
					))}

					{history.similarHistories.length === 0 && (
						<p className='text-sm text-muted-foreground'>
							На него никто не похож
						</p>
					)}
				</div>
			</section>
		);
	}
);
