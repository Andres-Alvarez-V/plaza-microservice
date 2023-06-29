import boom, { Boom } from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';

export const boomErrorHandler = (
	error: Error | Boom,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (boom.isBoom(error)) {
		const { statusCode, payload } = error.output;

		return res.status(statusCode).json(payload);
	}
	next(error);
};
