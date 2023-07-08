import { App } from '../../../src/app';
import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

const app = new App().getInstance();
describe('clientRoutes', () => {
	it('should get restaurants by pagination', async () => {
		const response = await request(app)
			.get('/api/v1/cliente/restaurantes?page=1&limit=10')
			.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}`);
		expect(response.statusCode).toEqual(200);
		expect(Array.isArray(response.body.data)).toBe(true);
	});
	it('should get a error when the page is not a number', async () => {
		const response = await request(app)
			.get('/api/v1/cliente/restaurantes?page=asd&limit=10')
			.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}`);
		expect(response.statusCode).toEqual(400);
	});
	it('should get a error when the limit is not a number', async () => {
		const response = await request(app)
			.get('/api/v1/cliente/restaurantes?page=1&limit=asd')
			.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}`);
		expect(response.statusCode).toEqual(400);
	});

	it('should get a error when the token is not valid', async () => {
		const response = await request(app)
			.get('/api/v1/cliente/restaurantes?page=1&limit=10')
			.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}a`);
		expect(response.statusCode).toEqual(401);
	});
});
