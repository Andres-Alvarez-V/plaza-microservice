import request from 'supertest';
import { IDish } from '../../../src/modules/domain/entities/dish';
import { App } from '../../../src/app';

const app = new App().getInstance();
describe('Create dish - POST /propietario/crearPlato', () => {
	const dishMock: Omit<IDish, 'id' | 'activo'> = {
		nombre: 'Ceviche',
		descripcion: 'Plato de pescado crudo marinado en aliños cítricos',
		precio: 20,
		uri_imagen:
			'https://www.midiariodecocina.com/wp-content/uploads/2016/03/ceviche-de-pescado.jpg',
		id_restaurante: 1,
		id_categoria: 1,
	};
	test('should create a new dish with a 201 response', async () => {
		const response = await request(app).post('/api/v1/propietario/crearPlato').send(dishMock);
		expect(response.status).toEqual(201);
	});

	test('should return a 400 response when the data is incomplete or with any wrong.', async () => {
		const tempData = { ...dishMock, id_categoria: null, uri_imagen: 'afsdfa' };
		const response = await request(app).post('/api/v1/propietario/crearPlato').send(tempData);
		expect(response.status).toEqual(400);
	});

	test('should return a 404 response when the "id_restaurante" is not found.', async () => {
		const tempData = { ...dishMock, id_restaurante: 100000 };
		const response = await request(app).post('/api/v1/propietario/crearPlato').send(tempData);
		expect(response.status).toEqual(404);
	});

	test('should return a 404 response when the "id_categoria" is not found.', async () => {
		const tempData = { ...dishMock, id_categoria: 100000 };
		const response = await request(app).post('/api/v1/propietario/crearPlato').send(tempData);
		expect(response.status).toEqual(404);
	});
});
