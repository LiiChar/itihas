import { Variable } from '@/component/pages/Variable/Variable';
import { getVariable } from '@/shared/api/variable';
import { Button } from '@/shared/ui/button';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/shared/ui/sheet';
import { useQuery } from '@siberiacancode/reactuse';
import type { VariableHistory as Variables } from '@/shared/type/variable';
import { ArrowLeftIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type VariableSidebarSidebar = {
	historyId: number;
	userId: number;
	children?: ReactNode;
	visible?: boolean;
};

export const VariableSidebar = ({
	children,
	historyId,
	userId,
}: VariableSidebarSidebar) => {
	const { data, isLoading } = useQuery<Variables[]>(() =>
		getVariable(historyId, userId)
	);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					loading={isLoading}
					className='fixed top-[calc(50%-20px)] z-20 left-0 p-0 bg-secondary m-0 hover:bg-primary'
				>
					{children ?? <ArrowLeftIcon />}
				</Button>
			</SheetTrigger>
			<SheetContent className='md:min-w-1/2 sm:min-w-[50%]' side={'left'}>
				<SheetTitle>Переменные</SheetTitle>
				{data && Array.isArray(data) && <Variable variable={data} />}
			</SheetContent>
		</Sheet>
	);
};
