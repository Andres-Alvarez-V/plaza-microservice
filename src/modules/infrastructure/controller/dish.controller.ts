import { NextFunction, Request, Response } from 'express';
import { DishUsecase } from '../../app/usecases/dish.usecase';
import { IChangeDishStateDTO, ICreateDishDTO } from '../../app/dtos/request/dish.dto';
import { IJWTPayload } from '../../domain/entities/JWTPayload';
import boom from '@hapi/boom';

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
			if (isNaN(id)) {
				throw boom.badRequest('El id del plato debe ser de tipo numero');
			}
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

	async getAllByPaginationFilterByCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const resturantId = Number(req.params.restaurantId);
			if (isNaN(resturantId)) {
				throw boom.badRequest('El id del restaurante debe ser un numero');
			}
			const { page, limit } = req.query;
			let categories: string[] | number[] | [] = req.query.categoriesId
				? (req.query.categoriesId as string).split(',')
				: [];
			categories = categories.map((category) => {
				const categoryId = Number(category);
				if (isNaN(categoryId)) {
					throw boom.badRequest('El id de la categoria debe ser un numero');
				}

				return categoryId;
			});
			const dishes = await this.dishUsecase.getAllByPaginationFilterByCategory(
				Number(page),
				Number(limit),
				resturantId,
				categories,
			);

			res.status(200).json({
				message: 'Platos obtenidos correctamente',
				data: dishes,
			});
		} catch (error) {
			next(error);
		}
	}
}
