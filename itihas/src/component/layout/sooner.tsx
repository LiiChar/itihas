import { useListenerStore } from '@/shared/store/ListenerStore';
import { Toaster } from '@/shared/ui/sonner';
import { useMount } from '@siberiacancode/reactuse';
import { toast } from 'sonner';

export const Sooner = () => {
	const { addCallback } = useListenerStore();
	useMount(() => {
		addCallback('toastTrigger', (data?: string) => {
			console.log('---------------');

			toast('Вы вошли в комнату');
		});
	});
	return <Toaster />;
};
