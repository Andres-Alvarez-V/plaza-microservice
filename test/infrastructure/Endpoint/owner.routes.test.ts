import request from 'supertest';
import { IDish } from '../../../src/modules/domain/entities/dish';
import { App } from '../../../src/app';
import {
	IChangeDishStateDTO,
	IModifyDishDTO,
} from '../../../src/modules/app/dtos/request/dish.dto';
import dotenv from 'dotenv';
import { IEmployee } from '../../../src/modules/domain/entities/employee';

dotenv.config();
const app = new App().getInstance();
let id: number | null = null;
describe('OwnerRoutes', () => {
	describe('Create dish - POST /propietario/crearPlato', () => {
		const dishMock: Omit<IDish, 'id' | 'activo'> = {
			nombre: 'TEST DISH',
			descripcion: 'TEST',
			precio: 20,
			uri_imagen:
				'https://www.midiariodecocina.com/wp-content/uploads/2016/03/ceviche-de-pescado.jpg',
			id_restaurante: 30, // Este es el restaurante para pruebas. Le pertence al usuario 13 de tipo owner
			id_categoria: 1,
		};
		test('should create a new dish with a 201 response', async () => {
			const response = await request(app)
				.post('/api/v1/propietario/crearPlato')
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(dishMock);
			id = response.body.data.id;
			expect(response.status).toEqual(201);
		});

		test('should return a 400 response when the data is incomplete or with any wrong.', async () => {
			const tempData = { ...dishMock, id_categoria: null, uri_imagen: 'afsdfa' };
			const response = await request(app)
				.post('/api/v1/propietario/crearPlato')
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(tempData);
			expect(response.status).toEqual(400);
		});

		test('should return a 404 response when the "id_restaurante" is not found.', async () => {
			const tempData = { ...dishMock, id_restaurante: 100000 };
			const response = await request(app)
				.post('/api/v1/propietario/crearPlato')
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(tempData);
			expect(response.status).toEqual(404);
		});

		test('should return a 404 response when the "id_categoria" is not found.', async () => {
			const tempData = { ...dishMock, id_categoria: 100000 };
			const response = await request(app)
				.post('/api/v1/propietario/crearPlato')
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(tempData);
			expect(response.status).toEqual(404);
		});
	});

	describe('CreateEmployee - POST /propietario/crearEmpleado', () => {
		const employeeMock: IEmployee = {
			id_empleado: 2,
			id_restaurante: 30,
		};
		test('should create a new employee with a 201 response. If get error check that the id_empleado doesnt exist in the DB and id_restaurante exist in the restaurant db', async () => {
			const response = await request(app)
				.post('/api/v1/propietario/agregarEmpleado')
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(employeeMock);
			expect(response.status).toEqual(201);
		});

		test('should return a 400 response when the data is incomplete or with any wrong.', async () => {
			const response = await request(app)
				.post('/api/v1/propietario/agregarEmpleado')
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send({
					nombre: 'TEST EMPLOYEE',
					apellido: 'TEST',
					telefono: '+1234567890',
					direccion: 'TEST',
					rol: 'waiter',
				});
			expect(response.status).toEqual(400);
		});
	});

	describe('Update Dish - PUT /propietario/actualizarPlato', () => {
		const dishMockTemp: IModifyDishDTO = {
			precio: 30,
			descripcion: 'Plato actualizado',
		};
		it('should update a dish with a 200 response', async () => {
			if (!id) {
				throw new Error('id is null. Cannot update dish.');
			}
			const response = await request(app)
				.put(`/api/v1/propietario/actualizarPlato/${id}`)
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(dishMockTemp);
			expect(response.status).toEqual(200);
		});
		it('should return a 400 response when the data is incomplete or with any wrong.', async () => {
			if (!id) {
				throw new Error('id is null. Cannot update dish.');
			}
			const tempData = { ...dishMockTemp, precio: 'adf', temp: 'no valido' };
			const response = await request(app)
				.put(`/api/v1/propietario/actualizarPlato/${id}`)
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(tempData);
			expect(response.status).toEqual(400);
		});
	});

	describe('Update Dish State - PUT /propietario/cambiarEstadoPlato', () => {
		const dishMockTemp: IChangeDishStateDTO = {
			activo: false,
		};

		it('should update a dish state with a 200 response', async () => {
			if (!id) {
				throw new Error('id is null. Cannot update dish.');
			}
			const response = await request(app)
				.put(`/api/v1/propietario/cambiarEstadoPlato/${id}`)
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(dishMockTemp);
			expect(response.status).toEqual(200);
		});

		it('should return a 400 response when the data is incomplete or with any wrong.', async () => {
			if (!id) {
				throw new Error('id is null. Cannot update dish.');
			}
			const tempData = { ...dishMockTemp, activo: 'adf', temp: 'no valido' };
			const response = await request(app)
				.put(`/api/v1/propietario/cambiarEstadoPlato/${id}`)
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(tempData);
			expect(response.status).toEqual(400);
		});

		it('should return a 404 response when the dish is not found.', async () => {
			const response = await request(app)
				.put(`/api/v1/propietario/cambiarEstadoPlato/100000`)
				.set('Authorization', `Bearer ${process.env.JWT_OWNER_TOKEN_TEST}`)
				.send(dishMockTemp);
			expect(response.status).toEqual(404);
		});

		it('should return a 401 response when is not a valid token or the dish does not correspond to one of the owners restaurants ', async () => {
			if (!id) {
				throw new Error('id is null. Cannot update dish.');
			}
			const response = await request(app)
				.put(`/api/v1/propietario/cambiarEstadoPlato/3`)
				.set('Authorization', `Bearer ${process.env.JWT_USER_TOKEN_TEST}`)
				.send(dishMockTemp);
			expect(response.status).toEqual(401);
		});
	});
});
