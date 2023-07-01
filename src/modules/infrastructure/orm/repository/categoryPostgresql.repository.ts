import { Sequelize } from 'sequelize';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { ICategoryRepository } from '../../../domain/repositories/category.repository';
import { ICategory } from '../../../domain/entities/category';
import { CATEGORY_POSTGRESQL_TABLE } from '../models/CategoryPostgresql.model';

export class CategoryPostgresqlRepository implements ICategoryRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async findById(id: number): Promise<ICategory | null> {
		const category = await this.sequelize.models[CATEGORY_POSTGRESQL_TABLE].findByPk(id);
		if (!category) {
			return null;
		}

		return category.toJSON() as ICategory;
	}
}
