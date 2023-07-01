import { IDishRepository } from '../../../domain/repositories/dish.repository';
import { Sequelize } from 'sequelize';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { IDish } from '../../../domain/entities/dish';
import { DISH_POSTGRESQL_TABLE } from '../models/DishPostgresql.model';

export class DishPostgresqlRepository implements IDishRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async create(dish: Omit<IDish, 'id'>): Promise<IDish> {
		const newDish = (await this.sequelize.models[DISH_POSTGRESQL_TABLE].create(dish)).toJSON();

		return newDish as IDish;
	}
}
