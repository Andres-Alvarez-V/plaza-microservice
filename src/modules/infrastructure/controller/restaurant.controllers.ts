import { HttpCode } from '../../../helpers/enums/http-code.enum';
import { NextFunction, Request, Response } from 'express';
import { RestaurantUsecase } from '../../app/usecases/restaurant.usecase';
import { IRestaurant } from '../../domain/entities/restaurant';
import { ICreateRestaurantDTO } from '../../app/dtos/request/restaurant.dto';

export class RestaurantController {
	constructor(private readonly restaurantUsecase: RestaurantUsecase) {}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data: ICreateRestaurantDTO = req.body;
			const newRestaurant: IRestaurant = await this.restaurantUsecase.create(data);
			res.status(HttpCode.CREATED).json({
				message: 'Restaurant created successfully',
				data: newRestaurant,
			});
		} catch (error) {
			next(error);
		}
	}

	async getAllByPagination(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query;
			const restaurants = await this.restaurantUsecase.getAllByPagination(
				Number(page),
				Number(limit),
			);
			res.status(HttpCode.OK).json({
				message: 'Restaurants fetched successfully',
				data: restaurants,
			});
		} catch (error) {
			next(error);
		}
	}
}
