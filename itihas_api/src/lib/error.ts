import { ReasonPhrases, getStatusCode } from 'http-status-codes';
import { Response } from 'express';

export class ErrorBoundary extends Error {
	public message: string;
	public code: ReasonPhrases;
	constructor(message: string, code: ReasonPhrases, log?: boolean) {
		super(message);
		this.message = message;
		this.code = code;
	}

	public ErrorResponse(response: Response) {
		return response.json(this.message).status(getStatusCode(this.code));
	}
}
