import axios from 'axios';
import { TraceabilityMicroservice } from '../../../src/modules/infrastructure/microservices/traceabilityMicroservice';
import { ITraceabilityCreate } from '../../../src/modules/domain/entities/traceability';
import { PreparationStages } from '../../../src/modules/domain/enums/preparationStages.enum';

jest.mock('axios');

describe('TraceabilityMicroservice', () => {
	let traceabilityMicroservice: TraceabilityMicroservice;

	beforeEach(() => {
		traceabilityMicroservice = new TraceabilityMicroservice();
	});

	describe('createTraceability', () => {
		it('should create traceability', async () => {
			const trazability: ITraceabilityCreate = {
				correo_cliente: 'test-email',
				id_pedido: 1,
				id_cliente: 1,
				estado_nuevo: PreparationStages.PENDING,
				fecha: new Date(),
			};
			const token = 'test-token';
			const expectedUrl = 'test-url';
			const expectedHeaders = {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			};

			(axios.post as any).mockResolvedValueOnce({ status: 201 });

			process.env.TRAZABILITY_MICROSERVICE_BASE_URL = expectedUrl;

			await traceabilityMicroservice.createTraceability(trazability, token);

			expect(axios.post).toHaveBeenCalledWith(
				`${expectedUrl}/cliente/crearTrazabilidad`,
				trazability,
				{
					headers: expectedHeaders,
				},
			);
		});

		it('should throw an error when status is not 201', async () => {
			const trazability = {
				correo_cliente: 'test-email',
				id_pedido: 1,
				id_cliente: 1,
				estado_nuevo: PreparationStages.PENDING,
				fecha: new Date(),
			};
			const token = 'test-token';

			(axios.post as any).mockResolvedValueOnce({ status: 500 });

			process.env.TRAZABILITY_MICROSERVICE_BASE_URL = 'test-url';

			await expect(traceabilityMicroservice.createTraceability(trazability, token)).rejects.toThrow(
				'Error al crear la trazabilidad',
			);
		});
	});
});
