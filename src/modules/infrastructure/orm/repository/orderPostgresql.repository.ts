import { Op, Sequelize, WhereOptions } from 'sequelize';
import { IOrderRepository } from '../../../domain/repositories/order.repository';
import { IOrder, IOrderCreate } from '../../../domain/entities/order';
import { ORDER_POSTGRESQL_TABLE } from '../models/OrderPostgresql.model';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { PreparationStages } from '../../../domain/enums/preparationStages.enum';

export class OrderPostgresqlRepository implements IOrderRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async create(order: IOrderCreate) {
		const newOrder = (await this.sequelize.models[ORDER_POSTGRESQL_TABLE].create(order)).toJSON();

		return newOrder as IOrder;
	}

	async getOrdersByClientIdFilteredByStages(clientId: number, stages: PreparationStages[]) {
		let whereOptions: WhereOptions<any> = { id_cliente: clientId };
		if (stages.length > 0) {
			whereOptions = {
				...whereOptions,
				estado: {
					[Op.in]: stages,
				},
			};
		}
		const orderedDishes = await this.sequelize.models[ORDER_POSTGRESQL_TABLE].findAll({
			where: whereOptions,
		});

		return orderedDishes.map((orderedDish) => orderedDish.toJSON()) as IOrder[];
	}
}
