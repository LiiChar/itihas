import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { route } from './entities/route';
import path from 'path';
import { errorBoundaryMiddleware } from './middleware/errorBoundaryMiddleware';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { runWebsocket } from './websocket/websocket';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
export const server = createServer(app);
export const socket = runWebsocket();

app.use('/api', express.static(path.join(__dirname, '..', 'public')));
app.use(
	cors({
		credentials: true,
		allowedHeaders: [
			'*',
			'Access-Control-Allow-Origin',
			'Content-type',
			'access-control-allow-headers',
			'Authification',
			'cookie',
			'referer',
			'user-agent',
			'host',
		],
		origin: 'http://localhost:5173',
		preflightContinue: true,
	})
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: '200mb' }));
app.use('/api', route);
app.use(errorBoundaryMiddleware);

server.listen(PORT, () =>
	console.log(`Server has been started on http://localhost:${PORT}`)
);

export default app;
