import { Editor } from '@/component/widget/constructor/Editor';
import { useLayout } from '@/shared/hooks/useLayout';

export const Constructor = () => {
	useLayout({ footer: false });
	return (
		<div>
			<Editor />
		</div>
	);
};
