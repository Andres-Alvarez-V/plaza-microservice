import { NextFunction, Request, Response } from 'express';
import { DishUsecase } from '../../app/usecases/dish.usecase';
import { IChangeDishStateDTO, ICreateDishDTO } from '../../app/dtos/request/dish.dto';
import { IJWTPayload } from '../../domain/entities/JWTPayload';

export class DishController {
	constructor(private readonly dishUsecase: DishUsecase) {}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data: ICreateDishDTO = req.body;
			const userPayload = req.user as IJWTPayload;
			const newDish = await this.dishUsecase.create(data, userPayload);
			res.status(201).json({
				message: 'Dish created successfully',
				data: newDish,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userPayload = req.user as IJWTPayload;
			const data: ICreateDishDTO = req.body;
			const updatedDish = await this.dishUsecase.update(Number(id), data, userPayload);
			res.status(200).json({
				message: 'Plato actualizado correctamente',
				data: updatedDish,
			});
		} catch (error) {
			next(error);
		}
	}

	async changeState(req: Request, res: Response, next: NextFunction) {
		try {
			const id = Number(req.params.id);
			const data: IChangeDishStateDTO = req.body;
			const userPayload = req.user as IJWTPayload;
			const updatedDish = await this.dishUsecase.update(id, data, userPayload);
			res.status(200).json({
				message: 'Estado del plato actualizado correctamente',
				data: updatedDish,
			});
		} catch (error) {
			next(error);
		}
	}
}
