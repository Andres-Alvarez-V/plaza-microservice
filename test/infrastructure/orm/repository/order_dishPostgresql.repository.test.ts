import { IOrderDish } from '../../../../src/modules/domain/entities/order_dish';
import { ORDER_DISH_POSTGRESQL_TABLE } from '../../../../src/modules/infrastructure/orm/models/Order_DishPostgresql';
import { OrderDishPostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/order_dishPostgresql.repository';
import { SequelizePostgresqlConnection } from '../../../../src/modules/infrastructure/orm/sequelizePostgresqlConnection';

jest.mock('../../../../src/modules/infrastructure/orm/sequelizePostgresqlConnection');

describe('OrderDishPostgresqlRepository', () => {
	let orderDishRepository: OrderDishPostgresqlRepository;
	let sequelizeMock: any;

	beforeEach(() => {
		sequelizeMock = {
			models: {
				[ORDER_DISH_POSTGRESQL_TABLE]: {
					bulkCreate: jest.fn(),
				},
			},
		};

		(SequelizePostgresqlConnection.getInstance as any).mockReturnValue(sequelizeMock);
		orderDishRepository = new OrderDishPostgresqlRepository();
	});

	describe('createOrderedDishes', () => {
		it('should create ordered dishes', async () => {
			const orderedDishes: IOrderDish[] = [
				{
					id_pedido: 1,
					id_plato: 1,
					cantidad: 2,
				},
				{
					id_pedido: 1,
					id_plato: 2,
					cantidad: 1,
				},
			];

			await orderDishRepository.createOrderedDishes(orderedDishes);

			expect(sequelizeMock.models[ORDER_DISH_POSTGRESQL_TABLE].bulkCreate).toHaveBeenCalledWith(
				orderedDishes,
			);
		});
	});
});
