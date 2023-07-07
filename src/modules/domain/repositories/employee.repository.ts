import { IEmployee } from '../entities/employee';

export interface IEmployeeRepository {
	create(employee: IEmployee): Promise<IEmployee>;
}
