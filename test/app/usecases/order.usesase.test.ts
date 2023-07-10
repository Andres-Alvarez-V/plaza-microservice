import { OrderUsecase } from '../../../src/modules/app/usecases/order.usecase';
import { IJWTPayload } from '../../../src/modules/domain/entities/JWTPayload';
import { IOrderRequest } from '../../../src/modules/domain/entities/order';
import { PreparationStages } from '../../../src/modules/domain/enums/preparationStages.enum';
import { RoleType } from '../../../src/modules/domain/enums/role-type.enum';
import { TraceabilityMicroservice } from '../../../src/modules/infrastructure/microservices/traceabilityMicroservice';
import { UserMicroservice } from '../../../src/modules/infrastructure/microservices/userMicroservice';
import { OrderPostgresqlRepository } from '../../../src/modules/infrastructure/orm/repository/orderPostgresql.repository';
import { OrderDishPostgresqlRepository } from '../../../src/modules/infrastructure/orm/repository/order_dishPostgresql.repository';

describe('OrderUsecase', () => {
	let orderUsecase: OrderUsecase;
	let mockOrderRepository: OrderPostgresqlRepository;
	let mockTraceabilityMicroservice: TraceabilityMicroservice;
	let mockOrderDishRepository: OrderDishPostgresqlRepository;
	let mockUserMicroservice: UserMicroservice;
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

		mockTraceabilityMicroservice = new TraceabilityMicroservice();
		mockTraceabilityMicroservice.createTraceability = jest.fn();

		mockOrderDishRepository = new OrderDishPostgresqlRepository();
		mockOrderDishRepository.createOrderedDishes = jest.fn();

		mockUserMicroservice = new UserMicroservice();
		mockUserMicroservice.getUserEmail = jest.fn();

		orderUsecase = new OrderUsecase(
			mockOrderRepository,
			mockTraceabilityMicroservice,
			mockOrderDishRepository,
			mockUserMicroservice,
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
		const result = orderUsecase.create(order, jwtPayload, token);
		await expect(result).rejects.toThrow('Ya tienes un pedido activo');
	});
});
