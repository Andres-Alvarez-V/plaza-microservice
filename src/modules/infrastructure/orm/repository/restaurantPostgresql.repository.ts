import { IRestaurantRepository } from '../../../domain/repositories/restaurant.repository';
import { Sequelize } from 'sequelize';
import { IRestaurant } from '../../../domain/entities/restaurant';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { RESTAURANT_POSTGRESQL_TABLE } from '../models/RestaurantPostgresql.model';

export class RestaurantPostgresqlRepository implements IRestaurantRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async create(restaurant: Omit<IRestaurant, 'id'>): Promise<IRestaurant> {
		const newRestaurant = (
			await this.sequelize.models[RESTAURANT_POSTGRESQL_TABLE].create(restaurant)
		).toJSON();

		return newRestaurant as IRestaurant;
	}

	async findById(id: number): Promise<IRestaurant | null> {
		const restaurant = await this.sequelize.models[RESTAURANT_POSTGRESQL_TABLE].findByPk(id);
		if (!restaurant) {
			return null;
		}

		return restaurant.toJSON() as IRestaurant;
	}
}
