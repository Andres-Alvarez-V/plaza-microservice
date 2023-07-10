import { Sequelize } from 'sequelize';
import { IOrderDishRepository } from '../../../domain/repositories/order_dish.repository';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { IOrderDish } from '../../../domain/entities/order_dish';
import { ORDER_DISH_POSTGRESQL_TABLE } from '../models/Order_DishPostgresql';

export class OrderDishPostgresqlRepository implements IOrderDishRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async createOrderedDishes(orderedDishes: Required<IOrderDish>[]) {
		await this.sequelize.models[ORDER_DISH_POSTGRESQL_TABLE].bulkCreate(orderedDishes);
	}
}
