import { IDishRepository } from '../../../domain/repositories/dish.repository';
import { Sequelize } from 'sequelize';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { IDish } from '../../../domain/entities/dish';
import { DISH_POSTGRESQL_TABLE } from '../models/DishPostgresql.model';
import { IChangeDishStateDTO, IModifyDishDTO } from '../../../app/dtos/request/dish.dto';

export class DishPostgresqlRepository implements IDishRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async create(dish: Omit<IDish, 'id'>): Promise<IDish> {
		const newDish = (await this.sequelize.models[DISH_POSTGRESQL_TABLE].create(dish)).toJSON();

		return newDish as IDish;
	}

	async update(id: number, dish: IModifyDishDTO | IChangeDishStateDTO): Promise<IDish> {
		const updatedDish = (
			await this.sequelize.models[DISH_POSTGRESQL_TABLE].update(dish, {
				where: { id },
				returning: true,
			})
		)[1][0].toJSON();

		return updatedDish as IDish;
	}

	async findById(id: number): Promise<IDish | null> {
		const dish = await this.sequelize.models[DISH_POSTGRESQL_TABLE].findByPk(id);
		if (!dish) {
			return null;
		}

		return dish.toJSON() as IDish;
	}
}
