import axios, { AxiosResponse } from 'axios';
import { IUserMicroservice } from '../../domain/microservices/user.microservice';
import boom from '@hapi/boom';

export class UserMicroservice implements IUserMicroservice {
	private readonly userUrl = process.env.USER_MICROSERVICE_BASE_URL as string;
	constructor() {}

	private checkResponseData(response: AxiosResponse) {
		if (response.data === null) {
			throw boom.notFound('Usuario no encontrado para el id dado');
		}
	}

	async getUserEmail(id: number) {
		const response = await axios.get(`${this.userUrl}/user?id=${id}&querySearch=email`);
		this.checkResponseData(response);

		return response.data.correo as string;
	}

	async getUserRoleId(id: number) {
		const response = await axios.get(`${this.userUrl}/user?id=${id}&querySearch=role`);
		this.checkResponseData(response);

		return response.data.id_rol as number;
	}
}
