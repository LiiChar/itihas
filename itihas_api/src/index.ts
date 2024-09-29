import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { route } from './entities/route';
import path from 'path';
import { cookiesMiddleware } from './middleware/cookieMiddleware';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use('/api', express.static(path.join(__dirname, '..', 'public')));
app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', route);

app.listen(PORT, () =>
	console.log(`Server has been started on http://localhost:${PORT}`)
);
