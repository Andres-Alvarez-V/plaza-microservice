import axios from 'axios';
import { ITraceabilityCreate, IUpdateTraceability } from '../../domain/entities/traceability';
import { ITraceabilityMicroservice } from '../../domain/microservices/traceability.microservice';
import boom from '@hapi/boom';

export class TraceabilityMicroservice implements ITraceabilityMicroservice {
	private readonly traceabilityUrl = process.env.TRAZABILITY_MICROSERVICE_BASE_URL as string;
	constructor() {}

	async createTraceability(traceability: ITraceabilityCreate, token: string): Promise<void> {
		const response = await axios.post(
			`${this.traceabilityUrl}/cliente/crearTrazabilidad`,
			traceability,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			},
		);
		if (response.status !== 201) {
			throw boom.internal('Error al crear la trazabilidad');
		}
	}

	async assingOrder(
		traceability: IUpdateTraceability,
		orderId: number,
		token: string,
	): Promise<void> {
		const response = await axios.put(
			`${this.traceabilityUrl}/empleado/asignarPedido/${orderId}`,
			traceability,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			},
		);
		if (response.status !== 200) {
			throw boom.internal('Error al asignar el pedido');
		}
	}
}
