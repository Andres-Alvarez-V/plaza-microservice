import axios from 'axios';
import { ITraceabilityCreate } from '../../domain/entities/traceability';
import { ITraceabilityMicroservice } from '../../domain/microservices/traceability.microservice';

export class TraceabilityMicroservice implements ITraceabilityMicroservice {
	private readonly trazabilityUrl = process.env.TRAZABILITY_MICROSERVICE_BASE_URL as string;
	constructor() {}

	async createTraceability(trazability: ITraceabilityCreate, token: string): Promise<void> {
		const response = await axios.post(
			`${this.trazabilityUrl}/cliente/crearTrazabilidad`,
			trazability,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			},
		);
		if (response.status !== 201) {
			throw new Error('Error al crear la trazabilidad');
		}
	}
}
