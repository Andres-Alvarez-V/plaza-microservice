import { Sequelize } from 'sequelize';
import { IEmployeeRepository } from '../../../domain/repositories/employee.repository';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { IEmployee } from '../../../domain/entities/employee';
import { EMPLOYEE_POSTGRESQL_TABLE } from '../models/EmployeePostgresql.model';
import { ICreateEmployeeDTO } from '../../../app/dtos/request/employee.dto';

export class EmployeePostgresqlRepository implements IEmployeeRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async create(employee: ICreateEmployeeDTO): Promise<IEmployee> {
		const newEmployee = (
			await this.sequelize.models[EMPLOYEE_POSTGRESQL_TABLE].create(employee)
		).toJSON();

		return newEmployee as IEmployee;
	}
}
