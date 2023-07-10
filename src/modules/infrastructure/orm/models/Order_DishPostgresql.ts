import { DataTypes, Model, Sequelize } from 'sequelize';
import { IOrderDish } from '../../../domain/entities/order_dish';
import { ORDER_POSTGRESQL_TABLE } from './OrderPostgresql.model';
import { DISH_POSTGRESQL_TABLE } from './DishPostgresql.model';

export const ORDER_DISH_POSTGRESQL_TABLE = 'pedidos_platos';
export const OrderDishPostgresqlSchema = {
	id_pedido: {
		type: DataTypes.INTEGER,
		primaryKey: true,
	},
	id_plato: {
		type: DataTypes.INTEGER,
		primaryKey: true,
	},
	cantidad: {
		type: DataTypes.INTEGER,
		allowNull: false,
		required: true,
	},
};

export class OrderDishPostgresql extends Model<IOrderDish, IOrderDish> implements IOrderDish {
	public id_pedido!: number;
	public id_plato!: number;
	public cantidad!: number;

	static associate(models: any) {
		this.belongsTo(models[ORDER_POSTGRESQL_TABLE], {
			foreignKey: 'id_pedido',
			as: ORDER_POSTGRESQL_TABLE,
		});
		this.belongsTo(models[DISH_POSTGRESQL_TABLE], {
			foreignKey: 'id_plato',
			as: DISH_POSTGRESQL_TABLE,
		});
	}

	static config(sequelize: Sequelize) {
		return {
			sequelize,
			tableName: ORDER_DISH_POSTGRESQL_TABLE,
			modelName: ORDER_DISH_POSTGRESQL_TABLE,
			timestamps: false,
		};
	}
}
