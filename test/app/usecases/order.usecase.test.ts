import { OrderUsecase } from '../../../src/modules/app/usecases/order.usecase';
import { IJWTPayload } from '../../../src/modules/domain/entities/JWTPayload';
import { IOrderRequest, IOrder } from '../../../src/modules/domain/entities/order';
import { IUpdateTraceability } from '../../../src/modules/domain/entities/traceability';
import { PreparationStages } from '../../../src/modules/domain/enums/preparationStages.enum';
import { RoleType } from '../../../src/modules/domain/enums/role-type.enum';
import { TraceabilityMicroservice } from '../../../src/modules/infrastructure/microservices/traceabilityMicroservice';
import { TwilioMicroservice } from '../../../src/modules/infrastructure/microservices/twillio.microservice';
import { UserMicroservice } from '../../../src/modules/infrastructure/microservices/userMicroservice';
import { EmployeePostgresqlRepository } from '../../../src/modules/infrastructure/orm/repository/employeePostgresql.repository';
import { OrderPostgresqlRepository } from '../../../src/modules/infrastructure/orm/repository/orderPostgresql.repository';
import { OrderDishPostgresqlRepository } from '../../../src/modules/infrastructure/orm/repository/order_dishPostgresql.repository';
import boom from '@hapi/boom';
import { RestaurantPostgresqlRepository } from '../../../src/modules/infrastructure/orm/repository/restaurantPostgresql.repository';

describe('OrderUsecase', () => {
	const failMessage = 'Se esperaba que se lanzara una excepción';
	let orderUsecase: OrderUsecase;
	let mockOrderRepository: OrderPostgresqlRepository;
	let mockTraceabilityMicroservice: TraceabilityMicroservice;
	let mockOrderDishRepository: OrderDishPostgresqlRepository;
	let mockUserMicroservice: UserMicroservice;
	let mockEmployeeRepository: EmployeePostgresqlRepository;
	let mockTwilioMicroservice: TwilioMicroservice;
	let mockRestaurantRepository: RestaurantPostgresqlRepository;
	// Arrange
	const order: IOrderRequest = {
		id_restaurante: 123,
		platos_escogidos: [
			{
				id_plato: 1,
				cantidad: 2,
			},
			{
				id_plato: 2,
				cantidad: 1,
			},
		],
	};
	const jwtPayload: IJWTPayload = {
		id: 123,
		role: RoleType.CLIENT,
		iat: 123,
		exp: 123,
	};
	const token = 'dummyToken';
	beforeEach(() => {
		mockOrderRepository = new OrderPostgresqlRepository();
		mockOrderRepository.create = jest.fn();
		mockOrderRepository.getOrdersByClientIdFilteredByStages = jest.fn();
		mockOrderRepository.getOrdersPaginatedByRestaurantIdFilteredByStages = jest.fn();
		mockOrderRepository.getOrderById = jest.fn();
		mockOrderRepository.updateOrder = jest.fn();

		mockTraceabilityMicroservice = new TraceabilityMicroservice();
		mockTraceabilityMicroservice.createTraceability = jest.fn();
		mockTraceabilityMicroservice.assingOrder = jest.fn();
		mockTraceabilityMicroservice.updateStage = jest.fn();
		mockTraceabilityMicroservice.updateStageClient = jest.fn();

		mockOrderDishRepository = new OrderDishPostgresqlRepository();
		mockOrderDishRepository.createOrderedDishes = jest.fn();

		mockUserMicroservice = new UserMicroservice();
		mockUserMicroservice.getUserEmail = jest.fn();

		mockEmployeeRepository = new EmployeePostgresqlRepository();
		mockEmployeeRepository.getEmployeeByEmployeeId = jest.fn();

		mockTwilioMicroservice = new TwilioMicroservice();
		mockTwilioMicroservice.sendSms = jest.fn();

		mockRestaurantRepository = new RestaurantPostgresqlRepository();
		mockRestaurantRepository.findById = jest.fn();

		orderUsecase = new OrderUsecase(
			mockOrderRepository,
			mockTraceabilityMicroservice,
			mockOrderDishRepository,
			mockUserMicroservice,
			mockEmployeeRepository,
			mockTwilioMicroservice,
			mockRestaurantRepository,
		);
	});

	describe('create', () => {
		it('should create an order successfully', async () => {
			const mockCreateResolved = {
				id: 456,
				id_cliente: 123,
				fecha: new Date(),
				estado: PreparationStages.PENDING,
				id_chef: null,
				id_restaurante: 123,
			};
			// Mockear el comportamiento de los métodos y repositorios necesarios
			(mockOrderRepository.getOrdersByClientIdFilteredByStages as any).mockResolvedValue([]);
			(mockUserMicroservice.getUserEmail as any).mockResolvedValue('test@example.com');
			(mockOrderRepository.create as any).mockResolvedValue(mockCreateResolved);
			(mockOrderDishRepository.createOrderedDishes as any).mockResolvedValue();
			(mockTraceabilityMicroservice.createTraceability as any).mockResolvedValue();

			// Act
			const result = await orderUsecase.create(order, jwtPayload, token);

			// Assert
			expect(result).toEqual(mockCreateResolved);
			expect(mockOrderRepository.getOrdersByClientIdFilteredByStages).toHaveBeenCalledWith(
				jwtPayload.id,
				expect.any(Array),
			);
			expect(mockUserMicroservice.getUserEmail).toHaveBeenCalledWith(jwtPayload.id);
			expect(mockOrderRepository.create).toHaveBeenCalledWith(expect.any(Object));
			expect(mockOrderDishRepository.createOrderedDishes).toHaveBeenCalledWith(expect.any(Array));
			expect(mockTraceabilityMicroservice.createTraceability).toHaveBeenCalledWith(
				expect.any(Object),
				token,
			);
		});
		it('should throw an error if the user already has an active order', async () => {
			(mockOrderRepository.getOrdersByClientIdFilteredByStages as any).mockResolvedValue([
				{
					id: 456,
					id_cliente: 123,
					fecha: new Date(),
					estado: PreparationStages.IN_PREPARATION,
					id_chef: null,
					id_restaurante: 123,
				},
			]);

			await expect(orderUsecase.create(order, jwtPayload, token)).rejects.toThrow(
				boom.conflict('Ya tienes un pedido activo'),
			);
		});
	});

	describe('getOrdersFilteredByStages', () => {
		it('should return an array of orders', async () => {
			const mockGetOrdersFilteredByStagesResolved: IOrder[] = [
				{
					id: 11,
					id_cliente: 33,
					fecha: new Date('2023-07-10T04:01:32.465Z'),
					estado: PreparationStages.DELIVERED,
					id_chef: null,
					id_restaurante: 1,
					codigo_verificacion: null,
					tiempo_pedido: null,
				},
				{
					id: 13,
					id_cliente: 33,
					fecha: new Date('2023-07-10T22:45:15.697Z'),
					estado: PreparationStages.PENDING,
					id_chef: null,
					id_restaurante: 1,
					codigo_verificacion: null,
					tiempo_pedido: null,
				},
			];

			(
				mockOrderRepository.getOrdersPaginatedByRestaurantIdFilteredByStages as any
			).mockResolvedValue(mockGetOrdersFilteredByStagesResolved);
			(mockEmployeeRepository.getEmployeeByEmployeeId as any).mockResolvedValue({
				id_empleado: 1,
				id_restaurante: 1,
			});

			const result = await orderUsecase.getOrdersFilteredByStages(
				jwtPayload,
				[PreparationStages.PENDING],
				1,
				10,
			);

			expect(result).toEqual(mockGetOrdersFilteredByStagesResolved);
			expect(mockEmployeeRepository.getEmployeeByEmployeeId).toHaveBeenCalledWith(jwtPayload.id);
			expect(
				mockOrderRepository.getOrdersPaginatedByRestaurantIdFilteredByStages,
			).toHaveBeenCalledWith(1, [PreparationStages.PENDING], 1, 10);
		});

		it('should return an error if the user is not an employee', async () => {
			(mockEmployeeRepository.getEmployeeByEmployeeId as any).mockResolvedValue(null);
			await expect(
				orderUsecase.getOrdersFilteredByStages(jwtPayload, [PreparationStages.PENDING], 1, 10),
			).rejects.toThrow(boom.notFound('No se encontró el empleado'));
		});
	});

	describe('assingOrder', () => {
		const orderId = 1;
		const mockGetEmployeeResolved = {
			id_empleado: 123,
			id_restaurante: 1,
		};
		const mockGetOrderResolved = {
			id: 1,
			id_cliente: 1,
			fecha: new Date(),
			estado: PreparationStages.PENDING,
			id_chef: null,
			id_restaurante: 1,
		};
		const mockUserEmailResolved = 'test@email.com';
		const dataToUpdate = {
			estado: PreparationStages.IN_PREPARATION,
			id_chef: mockGetEmployeeResolved.id_empleado,
		};
		const newTraceabilityData: IUpdateTraceability = {
			id_empleado: mockGetEmployeeResolved.id_empleado,
			estado_anterior: mockGetOrderResolved.estado,
			estado_nuevo: dataToUpdate.estado,
			correo_empleado: mockUserEmailResolved,
		};

		it('should assign an order successfully', async () => {
			(mockOrderRepository.getOrderById as any).mockResolvedValue(mockGetOrderResolved);
			(mockEmployeeRepository.getEmployeeByEmployeeId as any).mockResolvedValue(
				mockGetEmployeeResolved,
			);
			(mockOrderRepository.updateOrder as any).mockResolvedValue();
			(mockUserMicroservice.getUserEmail as any).mockResolvedValue(mockUserEmailResolved);
			(mockTraceabilityMicroservice.assingOrder as any).mockResolvedValue();

			await orderUsecase.assingOrder(orderId, jwtPayload, token);
			expect(mockOrderRepository.getOrderById).toHaveBeenCalledWith(orderId);
			expect(mockEmployeeRepository.getEmployeeByEmployeeId).toHaveBeenCalledWith(jwtPayload.id);
			expect(mockOrderRepository.updateOrder).toHaveBeenCalledWith(orderId, dataToUpdate);
			expect(mockUserMicroservice.getUserEmail).toHaveBeenCalledWith(
				mockGetEmployeeResolved.id_empleado,
			);
			expect(mockTraceabilityMicroservice.assingOrder).toHaveBeenCalledWith(
				newTraceabilityData,
				orderId,
				token,
			);
		});

		it('should throw an error 404 if the order does not exist', async () => {
			(mockOrderRepository.getOrderById as any).mockResolvedValue(null);
			await expect(orderUsecase.assingOrder(orderId, jwtPayload, token)).rejects.toThrow(
				boom.notFound('No se encontró el pedido'),
			);
		});

		it('should throw an error of type conflict 409 if the order is not in a PENDING State ', async () => {
			(mockOrderRepository.getOrderById as any).mockResolvedValue({
				id: 1,
				id_cliente: 1,
				fecha: new Date(),
				estado: PreparationStages.IN_PREPARATION,
				id_chef: null,
				id_restaurante: 1,
			});
			await expect(orderUsecase.assingOrder(orderId, jwtPayload, token)).rejects.toThrow(
				boom.conflict('El pedido no está en estado "pendiente"'),
			);
		});

		it('should throw an error 404 if the employee does not exist', async () => {
			(mockOrderRepository.getOrderById as any).mockResolvedValue(mockGetOrderResolved);
			(mockEmployeeRepository.getEmployeeByEmployeeId as any).mockResolvedValue(null);
			await expect(orderUsecase.assingOrder(orderId, jwtPayload, token)).rejects.toThrow(
				boom.notFound('No se encontró el chef'),
			);
		});

		it('should throw an error if the employee is not from the same restaurant as the order', async () => {
			(mockOrderRepository.getOrderById as any).mockResolvedValue(mockGetOrderResolved);
			(mockEmployeeRepository.getEmployeeByEmployeeId as any).mockResolvedValue({
				id_empleado: 1,
				id_restaurante: 2,
			});
			await expect(orderUsecase.assingOrder(orderId, jwtPayload, token)).rejects.toThrow(
				boom.conflict('El chef no pertenece al restaurante del pedido'),
			);
		});
	});

	describe('asingOrderReady', () => {
		const orderId = 1;
		const verificationCode = '1234';

		const mockGetEmployeeResolved = {
			id_empleado: 123,
			id_restaurante: 1,
		};
		const mockGetOrderResolved = {
			id: 1,
			id_cliente: 1,
			fecha: new Date(),
			estado: PreparationStages.IN_PREPARATION,
			id_chef: 2,
			id_restaurante: 1,
			codigo_verificacion: null,
			tiempo_pedido: null,
		};
		const dataToUpdate = {
			estado: PreparationStages.READY,
			codigo_verificacion: verificationCode,
		};
		const newTraceabilityData: IUpdateTraceability = {
			estado_anterior: mockGetOrderResolved.estado,
			estado_nuevo: dataToUpdate.estado,
		};
		it('should update order and send SMS successfully', async () => {
			// Mockear los métodos y comportamientos necesarios de los repositorios y microservicios
			const getOrderByIdSpy = jest
				.spyOn(mockOrderRepository, 'getOrderById')
				.mockResolvedValue(mockGetOrderResolved);
			const getEmployeeByEmployeeIdSpy = jest
				.spyOn(mockEmployeeRepository, 'getEmployeeByEmployeeId')
				.mockResolvedValue(mockGetEmployeeResolved);
			(orderUsecase as any).generateVerificationCode = jest.fn().mockReturnValue(verificationCode);
			const sendSmsSpy = jest.spyOn(mockTwilioMicroservice, 'sendSms').mockResolvedValue();

			await orderUsecase.asingOrderReady(orderId, jwtPayload, token);

			expect(getOrderByIdSpy).toHaveBeenCalledWith(orderId);
			expect(getEmployeeByEmployeeIdSpy).toHaveBeenCalledWith(jwtPayload.id as number);
			expect(sendSmsSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					`Tu pedido esta listo!! Para reclamar tu pedido di el siguiente codigo al empleado del restaurante cuando te lo requiera: ${verificationCode}`,
				),
			);
			expect(mockOrderRepository.updateOrder).toHaveBeenCalledWith(orderId, dataToUpdate);
			expect(mockTraceabilityMicroservice.updateStage).toHaveBeenCalledWith(
				newTraceabilityData,
				orderId,
				token,
			);
		});

		it('should throw error when order not found', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue(null);
			await expect(orderUsecase.asingOrderReady(orderId, jwtPayload, token)).rejects.toThrow(
				boom.notFound('No se encontró el pedido'),
			);
		});

		it('should throw error when order is not in preparation stage', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue({
				...mockGetOrderResolved,
				estado: PreparationStages.READY,
			});

			await expect(orderUsecase.asingOrderReady(orderId, jwtPayload, token)).rejects.toThrow(
				boom.conflict('El pedido no está en estado en "preparación"'),
			);
		});

		it('should throw error when employee not found', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue(mockGetOrderResolved);
			jest.spyOn(mockEmployeeRepository, 'getEmployeeByEmployeeId').mockResolvedValue(null);
			await expect(orderUsecase.asingOrderReady(orderId, jwtPayload, token)).rejects.toThrow(
				boom.notFound('No se encontró el empleado'),
			);
		});

		it('should throw error when employee is not from the same restaurant as the order', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue(mockGetOrderResolved);
			jest.spyOn(mockEmployeeRepository, 'getEmployeeByEmployeeId').mockResolvedValue({
				id_empleado: 1,
				id_restaurante: 2,
			});

			await expect(orderUsecase.asingOrderReady(orderId, jwtPayload, token)).rejects.toThrow(
				boom.conflict('El empleado no pertenece al restaurante del pedido'),
			);
		});
	});

	describe('assignOrderDelivered', () => {
		const orderId = 1;
		const requestBody = {
			codigo_verificacion: '123456',
		};

		const mockGetEmployeeResolved = {
			id_empleado: 123,
			id_restaurante: 1,
		};
		const mockGetOrderResolved = {
			id: 1,
			id_cliente: 1,
			fecha: new Date(),
			estado: PreparationStages.READY,
			id_chef: 2,
			id_restaurante: 1,
			codigo_verificacion: '123456',
			tiempo_pedido: null,
		};
		const dataToUpdate = {
			estado: PreparationStages.DELIVERED,
			tiempo_pedido: expect.any(Number),
		};
		const newTraceabilityData: IUpdateTraceability = {
			estado_anterior: mockGetOrderResolved.estado,
			estado_nuevo: dataToUpdate.estado,
		};

		it('should update order successfully', async () => {
			const getOrderByIdSpy = jest
				.spyOn(mockOrderRepository, 'getOrderById')
				.mockResolvedValue(mockGetOrderResolved);
			const getEmployeeByEmployeeIdSpy = jest
				.spyOn(mockEmployeeRepository, 'getEmployeeByEmployeeId')
				.mockResolvedValue(mockGetEmployeeResolved);
			const updateStageSpy = jest
				.spyOn(mockTraceabilityMicroservice, 'updateStage')
				.mockResolvedValue();

			await orderUsecase.assignOrderDelivered(requestBody, orderId, jwtPayload, token);

			expect(getOrderByIdSpy).toHaveBeenCalledWith(orderId);
			expect(getEmployeeByEmployeeIdSpy).toHaveBeenCalledWith(jwtPayload.id as number);
			expect(mockOrderRepository.updateOrder).toHaveBeenCalledWith(orderId, dataToUpdate);
			expect(updateStageSpy).toHaveBeenCalledWith(newTraceabilityData, orderId, token);
		});

		it('should throw error when order not found', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue(null);

			await expect(
				orderUsecase.assignOrderDelivered(requestBody, orderId, jwtPayload, token),
			).rejects.toThrow(boom.notFound('No se encontró el pedido'));
		});

		it('should throw error when order is not in ready stage', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue({
				...mockGetOrderResolved,
				estado: PreparationStages.PENDING,
			});

			await expect(
				orderUsecase.assignOrderDelivered(requestBody, orderId, jwtPayload, token),
			).rejects.toThrow(boom.conflict('El pedido no está en estado "listo"'));
		});

		it('should throw error when the verification code dont match', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue({
				...mockGetOrderResolved,
				codigo_verificacion: '654321',
			});

			await expect(
				orderUsecase.assignOrderDelivered(requestBody, orderId, jwtPayload, token),
			).rejects.toThrow(
				boom.forbidden(
					'El codigo de verificación no es correcto, el pedido no puede ser entregado',
				),
			);
		});
	});
	describe('cancelOrder', () => {
		const orderId = 1;

		const mockGetOrderResolved = {
			id: 1,
			id_cliente: 1,
			fecha: new Date(),
			estado: PreparationStages.PENDING,
			id_chef: 2,
			id_restaurante: 1,
			codigo_verificacion: '123456',
			tiempo_pedido: null,
		};
		const updateOrderResolved = {
			id: 11,
			id_cliente: 33,
			fecha: new Date('2023-07-10T04:01:32.465Z'),
			estado: PreparationStages.DELIVERED,
			id_chef: null,
			id_restaurante: 1,
			codigo_verificacion: null,
			tiempo_pedido: null,
		};
		const dataToUpdate = {
			estado: PreparationStages.CANCELED,
		};
		const newTraceabilityData: IUpdateTraceability = {
			estado_anterior: mockGetOrderResolved.estado,
			estado_nuevo: dataToUpdate.estado,
		};

		it('should update order successfully', async () => {
			const getOrderByIdSpy = jest
				.spyOn(mockOrderRepository, 'getOrderById')
				.mockResolvedValue(mockGetOrderResolved);
			const updateOrderSpy = jest
				.spyOn(mockOrderRepository, 'updateOrder')
				.mockResolvedValue(updateOrderResolved);
			const updateStageSpy = jest
				.spyOn(mockTraceabilityMicroservice, 'updateStageClient')
				.mockResolvedValue();

			await orderUsecase.cancelOrder(orderId, token);

			expect(getOrderByIdSpy).toHaveBeenCalledWith(orderId);
			expect(updateOrderSpy).toHaveBeenCalledWith(orderId, dataToUpdate);
			expect(updateStageSpy).toHaveBeenCalledWith(newTraceabilityData, orderId, token);
		});

		it('should throw error when order not found', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue(null);

			await expect(orderUsecase.cancelOrder(orderId, token)).rejects.toThrow(
				boom.notFound('No se encontró el pedido'),
			);
		});

		it('should throw error when order is not in pending stage', async () => {
			jest.spyOn(mockOrderRepository, 'getOrderById').mockResolvedValue({
				...mockGetOrderResolved,
				estado: PreparationStages.READY,
			});

			await expect(orderUsecase.cancelOrder(orderId, token)).rejects.toThrow(
				boom.conflict('Lo sentimos, tu pedido ya está en preparación y no puede cancelarse'),
			);
		});
	});

	describe('getEficiencyReport', () => {
		jwtPayload.role = RoleType.OWNER;
		const restaurantId = 1;
		const mockGetRestaurantByIdResolved = {
			id: 1,
			nombre: 'test',
			direccion: 'test',
			id_propietario: jwtPayload.id,
			telefono: '123456789',
			urlLogo: 'test',
			nit: '12345678910',
		};

		const mockGetTimeTakenPerOrderResolved = [
			{
				id_pedido: 1,
				tiempo_pedido_segundos: 100,
			},
			{
				id_pedido: 2,
				tiempo_pedido_segundos: 200,
			},
			{
				id_pedido: 3,
				tiempo_pedido_segundos: 300,
			},
		];
		const mockGetEmployeesByRestaurantIdResolved = [
			{
				id_empleado: 1,
				id_restaurante: 1,
			},
			{
				id_empleado: 2,
				id_restaurante: 1,
			},
		];

		const mockGetTotalTimePerEmployeeResolved = [
			{
				id_chef: 1,
				total_time: 100,
				total_orders: 2,
			},
			{
				id_chef: 2,
				total_time: 200,
				total_orders: 4,
			},
		];

		const mockResolved = {
			tiempo_por_pedido: mockGetTimeTakenPerOrderResolved,
			tiempo_promedio_por_empleado: mockGetTotalTimePerEmployeeResolved.map((employee) => {
				return {
					id_chef: employee.id_chef,
					tiempo_promedio_segundos: employee.total_time / employee.total_orders,
				};
			}),
		};

		it('should return an object of type IEFFiciencyReport', async () => {
			const getRestaurantByIdSpy = jest
				.spyOn(mockRestaurantRepository, 'findById')
				.mockResolvedValue(mockGetRestaurantByIdResolved);

			const getTimeTakenPerOrderSpy = jest
				.spyOn(mockOrderRepository, 'getTimeTakenPerOrder')
				.mockResolvedValue(mockGetTimeTakenPerOrderResolved);
			const getEmployeesByRestaurantIdSpy = jest
				.spyOn(mockEmployeeRepository, 'getEmployeesByRestaurantId')
				.mockResolvedValue(mockGetEmployeesByRestaurantIdResolved);
			const getTotalTimePerEmployeeSpy = jest
				.spyOn(mockOrderRepository, 'getTotalTimePerEmployee')
				.mockResolvedValue(mockGetTotalTimePerEmployeeResolved);

			const efficiencyReport = await orderUsecase.getEficiencyReport(restaurantId, jwtPayload);

			expect(getRestaurantByIdSpy).toHaveBeenCalledWith(restaurantId);
			expect(getTimeTakenPerOrderSpy).toHaveBeenCalledWith(restaurantId);
			expect(getEmployeesByRestaurantIdSpy).toHaveBeenCalledWith(restaurantId);
			expect(getTotalTimePerEmployeeSpy).toHaveBeenCalledWith(
				restaurantId,
				mockGetEmployeesByRestaurantIdResolved.map((employee) => employee.id_empleado),
			);

			expect(efficiencyReport).toEqual(mockResolved);
		});

		it('should throw an error if the user is not the owner of the restaurant', async () => {
			const jwtPayloadTemp = {
				...jwtPayload,
				id: 321,
			};
			jest
				.spyOn(mockRestaurantRepository, 'findById')
				.mockResolvedValue(mockGetRestaurantByIdResolved);
			await expect(orderUsecase.getEficiencyReport(restaurantId, jwtPayloadTemp)).rejects.toThrow(
				boom.forbidden('No tienes permisos para ver este reporte'),
			);
		});

		it('should throw an error if the restaurant does not exist', async () => {
			jest.spyOn(mockRestaurantRepository, 'findById').mockResolvedValue(null);
			await expect(orderUsecase.getEficiencyReport(restaurantId, jwtPayload)).rejects.toThrow(
				boom.notFound('No se encontró el restaurante'),
			);
		});
	});
});
