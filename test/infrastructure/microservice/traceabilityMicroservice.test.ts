import axios from 'axios';
import { TraceabilityMicroservice } from '../../../src/modules/infrastructure/microservices/traceabilityMicroservice';
import { ITraceabilityCreate } from '../../../src/modules/domain/entities/traceability';
import { PreparationStages } from '../../../src/modules/domain/enums/preparationStages.enum';
import boom from '@hapi/boom';

jest.mock('axios');

describe('TraceabilityMicroservice', () => {
	let traceabilityMicroservice: TraceabilityMicroservice;
	const token = 'test-token';
	const expectedUrl = 'test-url';
	const expectedHeaders = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`,
	};

	beforeEach(() => {
		process.env.TRAZABILITY_MICROSERVICE_BASE_URL = 'test-url';
		traceabilityMicroservice = new TraceabilityMicroservice();
	});

	describe('createTraceability', () => {
		const trazability: ITraceabilityCreate = {
			correo_cliente: 'test-email',
			id_pedido: 1,
			id_cliente: 1,
			estado_nuevo: PreparationStages.PENDING,
			fecha: new Date(),
		};
		it('should create traceability', async () => {
			(axios.post as any).mockResolvedValueOnce({ status: 201 });

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
			(axios.post as any).mockResolvedValueOnce({ status: 500 });

			await expect(traceabilityMicroservice.createTraceability(trazability, token)).rejects.toThrow(
				boom.internal('Error al crear la trazabilidad'),
			);
		});
	});

	describe('assingOrder', () => {
		const orderId = 1;
		const traceability = {
			correo_cliente: 'test@email.com',
			id_pedido: 1,
			estado_anterior: PreparationStages.PENDING,
			estado_nuevo: PreparationStages.IN_PREPARATION,
		};
		it('should update succesfully the order in the microservice Traceability', async () => {
			(axios.put as any).mockResolvedValueOnce({ status: 200 });

			await traceabilityMicroservice.assingOrder(traceability, orderId, token);

			expect(axios.put).toHaveBeenCalledWith(
				`${expectedUrl}/empleado/asignarPedido/${orderId}`,
				traceability,
				{
					headers: expectedHeaders,
				},
			);
		});
		it('should throw an error when status is not 200', async () => {
			(axios.put as any).mockResolvedValueOnce({ status: 500 });

			await expect(
				traceabilityMicroservice.assingOrder(traceability, orderId, token),
			).rejects.toThrow(boom.internal('Error al asignar el pedido'));
		});
	});
});
