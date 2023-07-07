import { IEmployee } from '../../domain/entities/employee';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository';

export class EmployeeUsecase {
	constructor(private readonly employeeRepository: IEmployeeRepository) {}

	async create(employee: IEmployee) {
		return await this.employeeRepository.create(employee);
	}
}
