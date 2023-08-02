import boom, { Boom } from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';

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

export const ormErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof ValidationError) {
		res.status(409).json({
			statusCode: 409,
			message: error.name,
			errors: error.errors,
		});
	}
	next(error);
};

export const logErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(error);
	next(error);
};

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(500).json({
		message: error.message,
		stack: error.stack,
	});
};
