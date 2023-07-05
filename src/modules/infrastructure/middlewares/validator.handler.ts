import boom from '@hapi/boom';
import { RoleType } from '../../domain/enums/role-type.enum';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { Schema } from 'joi';
import { IJWTPayload } from '../../domain/entities/JWTPayload';

export const validatorRoleHandler = (role: RoleType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const ownerID = req.body.id_propietario;
		const userMicroserviceBaseUrl = process.env.USER_MICROSERVICE_BASE_URL as string;
		let response;
		try {
			response = await axios.get(`${userMicroserviceBaseUrl}/user?id=${ownerID}&querySearch=role`);

			if (response.data === null) {
				next(boom.notFound('Usuario no encontrado para el id dado'));

				return;
			}
			if (response.data.id_rol !== role) {
				next(boom.unauthorized('No tienes permisos para realizar esta acción'));

				return;
			}
			next();
		} catch (error) {
			next(boom.badImplementation('Un error ocurrio validando el error'));
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
