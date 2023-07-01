import request from 'supertest';
import { App } from '../../../src/app';

const app = new App().getInstance();
describe('Create restaurante - POST /admin/crearRestaurante', () => {
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
