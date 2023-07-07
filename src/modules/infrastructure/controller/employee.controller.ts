import { NextFunction, Request, Response } from 'express';
import { EmployeeUsecase } from '../../app/usecases/employee.controller';
import { ICreateEmployeeDTO } from '../../app/dtos/request/employee.dto';

export class EmployeeController {
	constructor(private readonly employeeUsecase: EmployeeUsecase) {}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data: ICreateEmployeeDTO = req.body;
			const newEmployee = await this.employeeUsecase.create(data);
			res.status(201).json({
				message: 'Employee created successfully',
				data: newEmployee,
			});
		} catch (error) {
			next(error);
		}
	}
}
