import { DataTypes, Model, Sequelize } from 'sequelize';
import { ICategory } from '../../../domain/entities/category';

export const CATEGORY_POSTGRESQL_TABLE = 'categoria';
export const CategoryPostgresqlSchema = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	descripcion: {
		type: DataTypes.STRING,
		allowNull: false,
	},
};

export class CategoryPostgresql extends Model implements ICategory {
	public id!: number;
	public nombre!: string;
	public descripcion!: string;

	static config(sequelize: Sequelize) {
		return {
			sequelize,
			tableName: CATEGORY_POSTGRESQL_TABLE,
			modelName: CATEGORY_POSTGRESQL_TABLE,
			timestamps: false,
		};
	}
}
