import { IEmployee } from '../entities/employee';

export interface IEmployeeRepository {
	create(employee: IEmployee): Promise<IEmployee>;
	getEmployeeByEmployeeId(userId: number): Promise<IEmployee | null>;
}
