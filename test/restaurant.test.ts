import { application } from '../src/main';
import { Application, Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { validatorSchemaHandler } from '../src/modules/infrastructure/middlewares/validator.handler';
import { createRestaurantSchema } from '../src/modules/app/dtos/request/restaurant.dto';

describe('Create restaurante', () => {
	const app: Application = application.getInstance();
	const data = {
		nombre: 'RESTAURANTE',
		direccion: 'carrera 43 c',
		id_propietario: 1,
		telefono: '5551234323',
		urlLogo: 'https://bitacora.pragma.com.co/assets/img/simbolo_blanco.svg',
		nit: '12345678910',
	};
	test('should create a new restaurant with a 201 response', async () => {
		const response = await request(app).post('/api/v1/admin/crearRestaurante').send(data);
		expect(response.status).toEqual(201);
	});

	test('should return a 400 response when the data is incomplete or with any wrong.', async () => {
		const tempData = { ...data, id_propietario: null, telefono: 'afsdfa' };
		const response = await request(app).post('/api/v1/admin/crearRestaurante').send(tempData);
		expect(response.status).toEqual(400);
	});

	test('should return a 401 response when the user is not authorized.', async () => {
		const tempData = { ...data, id_propietario: 4 };
		const response = await request(app).post('/api/v1/admin/crearRestaurante').send(tempData);
		expect(response.status).toEqual(401);
	});

	test('should return a 404 response when the user is not found.', async () => {
		const tempData = { ...data, id_propietario: 100 };
		const response = await request(app).post('/api/v1/admin/crearRestaurante').send(tempData);
		expect(response.status).toEqual(404);
	});
});

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

	// it('should call next with error if validation fails', () => {
	// 	const newReq = {
	// 		...req,
	// 		body: {
	// 			nombre: 'string',
	// 			direccion: 'string',
	// 			id_propietario: null,
	// 			telefono: 'stringstringstringstring',
	// 			urlLogo: 'string',
	// 			nit: 'stringstringstringstringstring',
	// 		},
	// 	};

	// 	validatorSchemaHandler(createRestaurantSchema, 'body')(
	// 		newReq as Request,
	// 		res as Response,
	// 		next as NextFunction,
	// 	);

	// 	expect(next).toHaveBeenCalledTimes(1);
	// 	expect(next).toHaveBeenCalledWith(boom.badRequest(expect.any(Joi.ValidationError)));
	// });
});
