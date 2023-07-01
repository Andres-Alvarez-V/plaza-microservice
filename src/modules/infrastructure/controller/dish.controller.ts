import { NextFunction, Request, Response } from 'express';
import { DishUsecase } from '../../app/usecases/dish.usecase';
import { ICreateDishDTO } from '../../app/dtos/request/dish.dto';

export class DishController {
	constructor(private readonly dishUsecase: DishUsecase) {}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data: ICreateDishDTO = req.body;
			const newDish = await this.dishUsecase.create(data);
			res.status(201).json({
				message: 'Dish created successfully',
				data: newDish,
			});
		} catch (error) {
			next(error);
		}
	}
}
