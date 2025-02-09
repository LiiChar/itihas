import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Main } from './page/Main';
import { History } from './page/History';
import { Read } from './page/Read';
import { PageEditBoard } from './page/Read/EditBoard';
import { HistoryEditBoard } from './page/History/EditBoard';
import { Login } from './page/auth/Login';
import { Register } from './page/auth/Register';
import { Layout } from './component/layout/Layout';
import { ProfilePage } from './page/Profile';
import { HistoryEdit } from './page/History/EditHistory';
import { CreateHistory } from './page/History/CreateHistory';
import { Constructor } from './page/Page/Constructor';
import { Catalog } from './page/Catalog';
import { VariableHistory } from './page/History/VariableHistory';
import { LayoutConstructor } from './page/History/LayoutConstructor';
import { Notfound } from './page/Notfound';
import { LayoutConstructorPage } from './page/Page/LayoutConstructor';
import { NotAuthorize } from './page/auth/NotAuthorize';
import { Chat } from './page/Chat';
import { AudioRecorderPage } from './page/Transcription';
import { Progress } from './page/History/Progress';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,

		children: [
			{
				path: '/',
				element: <Main />,
			},
			{
				path: '/chat',
				element: <Chat />,
			},
			{
				path: '/page/:id/constructor',
				element: <Constructor />,
			},
			{
				path: '/auth/login',
				element: <Login />,
			},
			{
				path: '/auth/register',
				element: <Register />,
			},
			{
				path: '/history/create',
				element: <CreateHistory />,
			},
			{
				path: '/history/:id/variables',
				element: <VariableHistory />,
			},
			{
				path: '/history/:id/edit',
				element: <HistoryEdit />,
			},
			{
				path: '/history/:id/layout',
				element: <LayoutConstructor />,
			},
			{
				path: '/history/:id',
				element: <History />,
			},
			{
				path: '/history/:id/read',
				element: <Read />,
			},
			{
				path: '/history/:id/page/edit',
				element: <HistoryEditBoard />,
			},
			{
				path: '/history/:id/progress',
				element: <Progress />,
			},
			{
				path: '/page/:id/edit',
				element: <PageEditBoard />,
			},
			{
				path: '/page/:id/layout',
				element: <LayoutConstructorPage />,
			},
			{
				path: '/profile/:id',
				element: <ProfilePage />,
			},
			{
				path: '/library',
				element: <Catalog />,
			},
			{
				path: '/unouthorize',
				element: <NotAuthorize />,
			},
			{
				path: '*',
				element: <Notfound />,
			},
		],
	},
]);

export const Router = () => {
	return <RouterProvider router={router} />;
};
