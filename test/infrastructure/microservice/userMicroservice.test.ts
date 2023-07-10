import axios from 'axios';
import boom from '@hapi/boom';
import { UserMicroservice } from '../../../src/modules/infrastructure/microservices/userMicroservice';
import { fail } from 'assert';

jest.mock('axios');
jest.mock('@hapi/boom');

describe('UserMicroservice', () => {
	let userMicroservice: UserMicroservice;
	const expectedUrl = 'test-url';

	beforeEach(() => {
		process.env.USER_MICROSERVICE_BASE_URL = expectedUrl;

		userMicroservice = new UserMicroservice();
	});

	describe('getUserEmail', () => {
		it('should get user email', async () => {
			const id = 123;
			const expectedData = { correo: 'test-email' };

			(axios.get as any).mockResolvedValueOnce({ data: expectedData });

			const result = await userMicroservice.getUserEmail(id);

			expect(axios.get).toHaveBeenCalledWith(`${expectedUrl}/user?id=${id}&querySearch=email`);
			expect(result).toEqual(expectedData.correo);
		});
	});

	describe('getUserRoleId', () => {
		it('should get user role ID', async () => {
			const id = 123;
			const expectedData = { id_rol: 456 };

			(axios.get as any).mockResolvedValueOnce({ data: expectedData });

			const result = await userMicroservice.getUserRoleId(id);

			expect(axios.get).toHaveBeenCalledWith(`${expectedUrl}/user?id=${id}&querySearch=role`);
			expect(result).toEqual(expectedData.id_rol);
		});
	});
	it('should throw boom.notFound error when response data is null', async () => {
		const id = 123;
		(axios.get as any).mockResolvedValueOnce({ data: null });
		try {
			await userMicroservice.getUserRoleId(id);
			fail('Expected an error to be thrown.');
		} catch (error) {
			expect(error).toEqual(boom.notFound('Usuario no encontrado para el id dado'));
			expect(boom.notFound).toHaveBeenCalledWith('Usuario no encontrado para el id dado');
		}
	});
});
