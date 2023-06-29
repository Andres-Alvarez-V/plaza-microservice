import { IRestaurantRepository } from '../../domain/repositories/restaurant.repository';
import { Sequelize } from 'sequelize';
import { setUpModels } from '.';
import { IRestaurant } from '../../domain/entities/restaurant';
import dotenv from 'dotenv';

dotenv.config();

export class RestaurantRepository implements IRestaurantRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = new Sequelize({
			database: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			host: 'localhost',
			port: process.env.DB_PORT as unknown as number,
			dialect: 'postgres',
		});
		setUpModels(this.sequelize);
		this.sequelize.sync();
	}

	async create(restaurant: Omit<IRestaurant, 'id'>): Promise<IRestaurant> {
		const newRestaurant = (await this.sequelize.models.restaurantes.create(restaurant)).toJSON();

		return newRestaurant as IRestaurant;
	}
}
