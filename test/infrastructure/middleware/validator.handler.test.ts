import { Request, Response, NextFunction } from 'express';
import {
	validatorRoleHandler,
	validatorSchemaHandler,
} from '../../../src/modules/infrastructure/middlewares/validator.handler';
import { createRestaurantSchema } from '../../../src/modules/app/dtos/request/restaurant.dto';
import { RoleType } from '../../../src/modules/domain/enums/role-type.enum';
import boom from '@hapi/boom';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
describe('validatorSchemaHandler', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: jest.Mock;

	beforeEach(() => {
		req = {
			...req,
			body: {
				nombre: 'RESTAURANTE',
				direccion: 'carrera 43 c',
				id_propietario: 1,
				telefono: '5551234323',
				urlLogo: 'https://bitacora.pragma.com.co/assets/img/simbolo_blanco.svg',
				nit: '12345678910',
			},
		};
		res = {};
		next = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call next without error if validation passes. It means that the validation is complete', () => {
		validatorSchemaHandler(createRestaurantSchema, 'body')(
			req as Request,
			res as Response,
			next as NextFunction,
		);

		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});

	it('should call next with error if validation fails', () => {
		const newReq = {
			...req,
			body: {
				nombre: 'string',
				direccion: 'string',
				id_propietario: null,
				telefono: 'stringstringstringstring',
				urlLogo: 'string',
				nit: 'stringstringstringstringstring',
			},
		};

		validatorSchemaHandler(createRestaurantSchema, 'body')(
			newReq as Request,
			res as Response,
			next as NextFunction,
		);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});

describe('validatorRoleHandler. If get "Un error ocurrio validando el error". Should check the other microservice is working', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: jest.Mock;

	beforeEach(() => {
		req = {
			...req,
			body: {
				id_propietario: 13, // Este usuario es de rol propietario
			},
		};
		res = {};
		next = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call next without error if validation passes. It means that the validation is complete', async () => {
		const role = RoleType.OWNER;
		await validatorRoleHandler(role)(req as Request, res as Response, next as NextFunction);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});

	it('should call next with boom.notFound if user is not found', async () => {
		const role = RoleType.OWNER;
		const newReq = {
			...req,
			body: {
				id_propietario: 100000,
			},
		};
		await validatorRoleHandler(role)(newReq as Request, res as Response, next as NextFunction);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(boom.unauthorized('Usuario no encontrado para el id dado'));
	});

	it('should call next with boom.unauthorized if user is not authorized', async () => {
		const role = RoleType.OWNER;
		const newReq = {
			...req,
			body: {
				id_propietario: 4, // Este usuario es de rol empleado. Por eso no esta autorizado
			},
		};
		await validatorRoleHandler(role)(newReq as Request, res as Response, next as NextFunction);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(
			boom.unauthorized('No tienes permisos para realizar esta acción'),
		);
	});

	it('should call next with boom.badImplementation if an error occurs during validation', async () => {
		const role = RoleType.OWNER;
		const newReq = {
			...req,
			body: {
				id_propietario: 4, // Este usuario es de rol empleado
			},
		};
		jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Error'));
		await validatorRoleHandler(role)(newReq as Request, res as Response, next as NextFunction);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(
			boom.badImplementation('Un error ocurrio validando el error'),
		);
	});
});
