import { useBreadcrumbleStore } from '@/shared/store/BreadcrumbleStore';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from '@/shared/ui/breadcrumb';
import { memo } from 'react';
import { Link } from 'react-router-dom';

export const Breadcrumble = memo(() => {
	const breadcrumbles = useBreadcrumbleStore(
		state => [] as typeof state.breadcrumblePath
	);
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbles.map(b => (
					<BreadcrumbItem key={b.name}>
						<BreadcrumbLink>
							<Link to={b.path}>{b.name}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
});
