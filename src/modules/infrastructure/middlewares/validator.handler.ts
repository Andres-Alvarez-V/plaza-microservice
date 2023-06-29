import boom from '@hapi/boom';
import { RoleType } from '../../domain/enums/role-type.enum';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { Schema } from 'joi';

export const validatorRoleHandler = (role: RoleType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const idPropietario = req.body.id_propietario;
		const userMicroserviceBaseUrl = process.env.USER_MICROSERVICE_BASE_URL as string;
		let response;
		try {
			response = await axios.get(
				`${userMicroserviceBaseUrl}/user?id=${idPropietario}&querySearch=role`,
			);

			if (response.data === null) {
				next(boom.notFound('User not found with the given id'));
			}

			if (response.data.id_rol === role) {
				next();
			} else {
				next(boom.unauthorized('No tienes permisos para realizar esta acción'));
			}
		} catch (error) {
			next(boom.badImplementation('An error occurred while validating the role'));
		}
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
