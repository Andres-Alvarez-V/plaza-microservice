import boom from '@hapi/boom';
import { RoleType } from '../../domain/enums/role-type.enum';
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { IJWTPayload } from '../../domain/entities/JWTPayload';
import { userMicroservice } from '../dependencies';

export const validatorRoleHandler = (role: RoleType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const ownerID = req.body.id_propietario;
		try {
			const roleId = await userMicroservice.getUserRoleId(ownerID);
			if (roleId !== role) {
				next(boom.unauthorized('No tienes permisos para realizar esta acción'));

				return;
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};

export const validatorCheckRole = (role: RoleType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (req.user && (req.user as IJWTPayload).role === role) {
			next();

			return;
		}
		next(boom.unauthorized('No tienes permisos para realizar esta acción'));
	};
};

export const validatorSchemaHandler = (schema: Schema, property: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const data = req[property as keyof typeof req];
		const { error } = schema.validate(data, { abortEarly: false });
		if (error) {
			next(boom.badRequest(error));

			return;
		}
		next();
	};
};

export const validatorPaginationParamsHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { limit, page } = req.query;
	const limitNumber = Number(limit);
	const offsetNumber = Number(page);
	if (isNaN(limitNumber) || isNaN(offsetNumber)) {
		next(boom.badRequest('Los parámetros de paginación deben ser números'));

		return;
	}
	if (limitNumber < 1 || offsetNumber < 0) {
		next(boom.badRequest('Los parámetros de paginación deben ser positivos'));

		return;
	}
	next();
};
