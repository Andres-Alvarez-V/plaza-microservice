import { Op } from 'sequelize';
import { IOrder, IOrderCreate, IUpdateOrder } from '../../../../src/modules/domain/entities/order';
import { PreparationStages } from '../../../../src/modules/domain/enums/preparationStages.enum';
import { ORDER_POSTGRESQL_TABLE } from '../../../../src/modules/infrastructure/orm/models/OrderPostgresql.model';
import { OrderPostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/orderPostgresql.repository';
import { SequelizePostgresqlConnection } from '../../../../src/modules/infrastructure/orm/sequelizePostgresqlConnection';

jest.mock('../../../../src/modules/infrastructure/orm/sequelizePostgresqlConnection');

describe('OrderPostgresqlRepository', () => {
	let orderRepository: OrderPostgresqlRepository;
	const orderId = 123;
	const clientId = 12;
	const orderDataMock: IOrderCreate = {
		id_cliente: clientId,
		fecha: new Date(),
		estado: PreparationStages.PENDING,
		id_chef: 1,
		id_restaurante: 1,
		codigo_verificacion: null,
	};
	const orderDataUpdatedMock: IUpdateOrder = {
		...orderDataMock,
		estado: PreparationStages.IN_PREPARATION,
		id_chef: 13,
	};
	let sequelizeMock: any;

	beforeEach(() => {
		sequelizeMock = {
			models: {
				[ORDER_POSTGRESQL_TABLE]: {
					create: jest.fn().mockResolvedValue({
						toJSON: jest.fn().mockReturnValue({
							...orderDataMock,
							id: orderId,
						}),
					}),
					findAll: jest.fn().mockResolvedValue([]),
					update: jest.fn().mockResolvedValue([]),
				},
			},
		};
		(SequelizePostgresqlConnection.getInstance as any).mockReturnValue(sequelizeMock);
		orderRepository = new OrderPostgresqlRepository();
	});

	describe('create', () => {
		it('should create a new order', async () => {
			const createdOrder = await orderRepository.create(orderDataMock);

			expect(createdOrder).toEqual({
				...orderDataMock,
				id: orderId,
			});
			expect(sequelizeMock.models[ORDER_POSTGRESQL_TABLE].create).toHaveBeenCalledWith(
				orderDataMock,
			);
		});
	});

	describe('getOrdersByClientIdFilteredByStages', () => {
		it('should get orders by client ID and filter by stages', async () => {
			const stages = [PreparationStages.DELIVERED, PreparationStages.IN_PREPARATION];

			const expectedWhereOptions = {
				id_cliente: clientId,
				estado: {
					[Op.in]: stages,
				},
			};

			const expectedOrders: IOrder[] = [];

			const findAllMock = sequelizeMock.models[ORDER_POSTGRESQL_TABLE].findAll;
			findAllMock.mockResolvedValue(expectedOrders);

			const result = await orderRepository.getOrdersByClientIdFilteredByStages(clientId, stages);

			expect(findAllMock).toHaveBeenCalledWith({ where: expectedWhereOptions });
			expect(result).toEqual(expectedOrders);
		});

		it('should get orders by client ID without filtering stages if stages array is empty', async () => {
			const stages: PreparationStages[] = [];

			const expectedWhereOptions = {
				id_cliente: clientId,
			};

			const expectedOrders: IOrder[] = [];

			const findAllMock = sequelizeMock.models[ORDER_POSTGRESQL_TABLE].findAll;
			findAllMock.mockResolvedValue(expectedOrders);

			const result = await orderRepository.getOrdersByClientIdFilteredByStages(clientId, stages);

			expect(findAllMock).toHaveBeenCalledWith({ where: expectedWhereOptions });
			expect(result).toEqual(expectedOrders);
		});
	});

	describe('getOrdersPaginatedByRestaurantIdFilteredByStages', () => {
		it('should get orders by restaurant ID and filter by stages', async () => {
			const restaurantId = 123;
			const stages = [PreparationStages.DELIVERED, PreparationStages.IN_PREPARATION];
			const page = 1;
			const limit = 10;

			const expectedWhereOptions = {
				id_restaurante: restaurantId,
				estado: {
					[Op.in]: stages,
				},
			};

			const expectedOrders: IOrder[] = [];

			const findAllMock = sequelizeMock.models[ORDER_POSTGRESQL_TABLE].findAll;
			findAllMock.mockResolvedValue(expectedOrders);

			const result = await orderRepository.getOrdersPaginatedByRestaurantIdFilteredByStages(
				restaurantId,
				stages,
				page,
				limit,
			);

			expect(findAllMock).toHaveBeenCalledWith({
				where: expectedWhereOptions,
				limit,
				offset: (page - 1) * limit,
			});
			expect(result).toEqual(expectedOrders);
		});

		it('should get orders by restaurant ID without filtering stages if stages array is empty', async () => {
			const restaurantId = 123;
			const stages: PreparationStages[] = [];
			const page = 1;
			const limit = 10;

			const expectedWhereOptions = {
				id_restaurante: restaurantId,
			};

			const expectedOrders: IOrder[] = [];

			const findAllMock = sequelizeMock.models[ORDER_POSTGRESQL_TABLE].findAll;
			findAllMock.mockResolvedValue(expectedOrders);

			const result = await orderRepository.getOrdersPaginatedByRestaurantIdFilteredByStages(
				restaurantId,
				stages,
				page,
				limit,
			);

			expect(findAllMock).toHaveBeenCalledWith({
				where: expectedWhereOptions,
				limit,
				offset: (page - 1) * limit,
			});
			expect(result).toEqual(expectedOrders);
		});
	});

	describe('updateOrder', () => {
		it('should update an order', async () => {
			const order: IUpdateOrder = {
				estado: PreparationStages.IN_PREPARATION,
				id_chef: orderDataMock.id_chef,
			};

			const updateMock = sequelizeMock.models[ORDER_POSTGRESQL_TABLE].update;
			updateMock.mockResolvedValue([
				1,
				[
					{
						toJSON: jest.fn().mockReturnValue({ ...orderDataUpdatedMock, id: orderId }),
					},
				],
			]);

			const result = await orderRepository.updateOrder(orderId, order);

			expect(updateMock).toHaveBeenCalledWith(order, {
				where: { id: orderId },
				returning: true,
			});
			expect(result).toEqual({
				...orderDataUpdatedMock,
				id: orderId,
			});
		});
	});
});
