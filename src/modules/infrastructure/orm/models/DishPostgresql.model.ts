import { DataTypes, Model, Sequelize } from 'sequelize';
import { IDish } from '../../../domain/entities/dish';
import { CATEGORY_POSTGRESQL_TABLE } from './CategoryPostgresql.model';
import { RESTAURANT_POSTGRESQL_TABLE } from './RestaurantPostgresql.model';

export const DISH_POSTGRESQL_TABLE = 'platos';
export const DishPostgresqlSchema = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		required: true,
		unique: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false,
		required: true,
	},
	id_categoria: {
		type: DataTypes.INTEGER,
		allowNull: false,
		required: true,
	},
	descripcion: {
		type: DataTypes.STRING,
		allowNull: false,
		required: true,
	},
	precio: {
		type: DataTypes.INTEGER,
		allowNull: false,
		required: true,
	},
	id_restaurante: {
		type: DataTypes.INTEGER,
		allowNull: false,
		required: true,
	},
	uri_imagen: {
		type: DataTypes.STRING,
		allowNull: false,
		required: true,
	},
	activo: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		required: true,
	},
};

export class DishPostgresql extends Model<IDish, Omit<IDish, 'id'>> implements IDish {
	public id!: number;
	public nombre!: string;
	public id_categoria!: number;
	public descripcion!: string;
	public precio!: number;
	public id_restaurante!: number;
	public uri_imagen!: string;
	public activo!: boolean;

	static associate(models: any) {
		this.belongsTo(models[CATEGORY_POSTGRESQL_TABLE], {
			foreignKey: 'id_categoria',
			as: CATEGORY_POSTGRESQL_TABLE,
		});
		this.belongsTo(models[RESTAURANT_POSTGRESQL_TABLE], {
			foreignKey: 'id_restaurante',
			as: RESTAURANT_POSTGRESQL_TABLE,
		});
	}

	static config(sequelize: Sequelize) {
		return {
			sequelize,
			tableName: DISH_POSTGRESQL_TABLE,
			modelName: DISH_POSTGRESQL_TABLE,
			timestamps: false,
		};
	}
}
