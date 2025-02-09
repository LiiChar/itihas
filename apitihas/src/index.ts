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

app.get('/', (req, res) => {
	res.json('Server has been started');
});
app.use('/api', express.static(path.join(__dirname, '..', 'public')));
app.use(cors({}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', route);
app.use(errorBoundaryMiddleware);

server.listen(PORT, () =>
	console.log(`Server has been started on http://localhost:${PORT}`)
);
