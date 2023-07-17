import { DataTypes, Model, Sequelize } from 'sequelize';
import { IOrder } from '../../../domain/entities/order';
import { PreparationStages } from '../../../domain/enums/preparationStages.enum';

export const ORDER_POSTGRESQL_TABLE = 'pedidos';
export const OrderPostgresqlSchema = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		required: true,
		unique: true,
	},
	id_cliente: {
		type: DataTypes.INTEGER,
		allowNull: false,
		required: true,
	},
	fecha: {
		type: DataTypes.DATE,
		allowNull: false,
		required: true,
	},
	estado: {
		type: DataTypes.STRING,
		allowNull: false,
		required: true,
	},
	id_chef: {
		type: DataTypes.INTEGER,
		allowNull: true,
		required: false,
	},
	id_restaurante: {
		type: DataTypes.INTEGER,
		allowNull: false,
		required: true,
	},
	codigo_verificacion: {
		type: DataTypes.STRING,
		allowNull: true,
		required: false,
	},
	tiempo_pedido: {
		type: DataTypes.BIGINT,
		allowNull: true,
		required: false,
	},
};

export class OrderPostgresql extends Model<IOrder, Omit<IOrder, 'id'>> implements IOrder {
	public id!: number;
	public id_cliente!: number;
	public fecha!: Date;
	public estado!: PreparationStages;
	public id_chef!: number;
	public id_restaurante!: number;
	public codigo_verificacion!: string;
	public tiempo_pedido!: number;

	static config(sequelize: Sequelize) {
		return {
			sequelize,
			tableName: ORDER_POSTGRESQL_TABLE,
			modelName: ORDER_POSTGRESQL_TABLE,
			timestamps: false,
		};
	}
}
