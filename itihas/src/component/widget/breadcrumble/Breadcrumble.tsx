import { getBreadcrumble } from '@/shared/store/BreadcrumbleStore';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from '@/shared/ui/breadcrumb';
import { memo } from 'react';

export const Breadcrumble = memo(() => {
	const breadcrumbles = getBreadcrumble();
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbles.map(b => (
					<BreadcrumbItem key={b.name}>
						<BreadcrumbLink href={b.path}>{b.name}</BreadcrumbLink>
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
});
