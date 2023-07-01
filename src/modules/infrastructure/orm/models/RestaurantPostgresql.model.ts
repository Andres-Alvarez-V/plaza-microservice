import { DataTypes, Model, Sequelize } from 'sequelize';
import { IRestaurant } from '../../../domain/entities/restaurant';

export const RESTAURANT_POSTGRESQL_TABLE = 'restaurantes';
export const RestaurantPostgresqlSchema = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	direccion: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	id_propietario: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	telefono: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	urlLogo: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	nit: {
		type: DataTypes.STRING,
		allowNull: false,
	},
};

export class RestaurantPostgresql
	extends Model<IRestaurant, Omit<IRestaurant, 'id'>>
	implements IRestaurant
{
	public id!: number;
	public nombre!: string;
	public direccion!: string;
	public id_propietario!: number;
	public telefono!: string;
	public urlLogo!: string;
	public nit!: string;

	static config(sequelize: Sequelize) {
		return {
			sequelize,
			tableName: RESTAURANT_POSTGRESQL_TABLE,
			modelName: RESTAURANT_POSTGRESQL_TABLE,
			timestamps: false,
		};
	}
}
