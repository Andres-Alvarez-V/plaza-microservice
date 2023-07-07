import { DataTypes, Model, Sequelize } from 'sequelize';
import { IEmployee } from '../../../domain/entities/employee';
import { RESTAURANT_POSTGRESQL_TABLE } from './RestaurantPostgresql.model';

export const EMPLOYEE_POSTGRESQL_TABLE = 'empleados';
export const EmployeePostgresqlSchema = {
	id_empleado: {
		type: DataTypes.INTEGER,
		primaryKey: true,
	},
	id_restaurante: {
		type: DataTypes.INTEGER,
		allowNull: false,
		require: true,
	},
};

export class EmployeePostgresql extends Model<IEmployee, IEmployee> implements IEmployee {
	public id_empleado!: number;
	public id_restaurante!: number;

	static associate(models: any) {
		this.belongsTo(models[RESTAURANT_POSTGRESQL_TABLE], {
			foreignKey: 'id_restaurante',
			as: RESTAURANT_POSTGRESQL_TABLE,
		});
	}

	static config(sequelize: Sequelize) {
		return {
			sequelize,
			tableName: EMPLOYEE_POSTGRESQL_TABLE,
			modelName: EMPLOYEE_POSTGRESQL_TABLE,
			timestamps: false,
		};
	}
}
