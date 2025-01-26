import { memo } from 'react';
import { HistoryPages } from '../../../shared/type/history';
import { getFullUrl, handleImageError } from '../../../shared/lib/image';
import { Minus, Plus } from 'lucide-react';
import { updateSimilarHistoryRate } from '@/shared/api/history';
import { runListener } from '@/shared/store/ListenerStore';
import { AddSimilarModal } from './AddSimilarModal';

export const Similar = memo(({ history }: { history: HistoryPages }) => {
	return (
		<section>
			<div className='flex items-center'>
				<h4>Похожее</h4>
				<div>
					<AddSimilarModal
						historyId={history.id}
						onSubmit={() => {
							runListener('historyChange');
						}}
					/>
				</div>
			</div>
			{history.similarHistories.map(s => (
				<div
					key={s.id + s.historyId + s.similarHistoryId}
					className='flex flex-col gap-1'
				>
					<div className='flex justify-between'>
						<div className='w-full'>
							<img
								src={getFullUrl(s.similarHistory.image)}
								onError={handleImageError}
								className='w-full max-w-36'
								alt={`Похожая история ${s.similarHistory.name}`}
							/>
							<div className='flex justify-between py-2'>
								<div>{s.similarHistory.name}</div>
							</div>
						</div>

						<div className='flex flex-col gap-1 items-center'>
							<Plus
								onClick={() => {
									updateSimilarHistoryRate({
										rate: (s.similar ?? 0) + 1,
										similarId: s.id,
									});
									runListener('historyChange');
								}}
								width={14}
								height={14}
							/>
							<div>{s.similar ?? 0}</div>
							<Minus
								onClick={() => {
									updateSimilarHistoryRate({
										rate: (s.similar ?? 0) - 1,
										similarId: s.id,
									});
									runListener('historyChange');
								}}
								width={14}
								height={14}
							/>
						</div>
					</div>
				</div>
			))}
			{history.similarHistories.length == 0 && (
				<div>На него никто не похож</div>
			)}
		</section>
	);
});
