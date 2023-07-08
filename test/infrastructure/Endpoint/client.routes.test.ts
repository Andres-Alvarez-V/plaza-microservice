import { App } from '../../../src/app';
import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

const app = new App().getInstance();
describe('clientRoutes', () => {
	describe('GET cliente/restaurantes?page={x}&limit={y}', () => {
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

	describe('GET `cliente/platos/:restaurantId?page={x}&limit={y}&categoriesId={numbers[]}`. CategoriesId is optional', () => {
		const restaurantId = 1;
		const page = 1;
		const limit = 10;
		const categoriesId = [1, 3];
		it('should get dishes by pagination with a 200 status code', async () => {
			const response = await request(app)
				.get(
					`/api/v1/cliente/platos/${restaurantId}?page=${page}&limit=${limit}&categoriesId=${categoriesId.join(
						',',
					)}`,
				)
				.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}`);
			expect(response.statusCode).toEqual(200);
		});

		it('should get a error when the page is not a number', async () => {
			const response = await request(app)
				.get(
					`/api/v1/cliente/platos/${restaurantId}?page=asd&limit=${limit}&categoriesId=${categoriesId.join(
						',',
					)}`,
				)
				.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}`);
			expect(response.statusCode).toEqual(400);
		});

		it('should get an error when the restaurant is not found', async () => {
			const response = await request(app)
				.get(
					`/api/v1/cliente/platos/${10000}?page=${page}&limit=${limit}&categoriesId=${categoriesId.join(
						',',
					)}`,
				)
				.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}`);
			expect(response.statusCode).toEqual(404);
		});

		it('should get a error when the categoriesId is not a number', async () => {
			const response = await request(app)
				.get(
					`/api/v1/cliente/platos/${restaurantId}?page=asd&limit=${limit}&categoriesId=${'1,2,3ads'}}`,
				)
				.set('Authorization', `Bearer ${process.env.JWT_CLIENT_TOKEN_TEST}`);
			expect(response.statusCode).toEqual(400);
		});
	});
});
