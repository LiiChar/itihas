import { socketListener } from '@/shared/lib/websocket/websocket';
import { addComponent, useLayoutStore } from '@/shared/store/LayoutStore';
import { useMount } from '@siberiacancode/reactuse';
import { Outlet } from 'react-router-dom';
import { Sooner } from './sooner';
import { Breadcrumble } from '../widget/breadcrumble/Breadcrumble';
import { useNotification } from '@/shared/hooks/useNotification';
import { TimeEvents } from './TimeEvents';
import { TooltipProvider } from '@/shared/ui/tooltip';
// import { AudioMenu } from '../widget/sound/AudioMenu';

export const Layout = () => {
	const { Footer, Header, Components, footerVisible, headerVisible } =
		useLayoutStore();
	useNotification();

	useMount(() => {
		addComponent(11, () => <Sooner />);
		addComponent(12, () => <Breadcrumble />);
		socketListener();
	});
	return (
		<>
			<TooltipProvider>
				{headerVisible && <Header />}
				<div className='w-full h-full relative content-height'>
					{/* TODO */}
					{/* <AudioMenu /> */}
					{Components.map(c => {
						if (!c) {
							return;
						}

						const Component = c.Component;
						return <Component key={c.id} />;
					})}
					<Outlet />
					<TimeEvents />
				</div>
				{footerVisible && <Footer />}
			</TooltipProvider>
		</>
	);
};
