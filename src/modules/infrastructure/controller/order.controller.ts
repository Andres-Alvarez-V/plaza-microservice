import { NextFunction, Request, Response } from 'express';
import { OrderUsecase } from '../../app/usecases/order.usecase';
import { IOrderRequest } from '../../domain/entities/order';
import { IJWTPayload } from '../../domain/entities/JWTPayload';
import { PreparationStages } from '../../domain/enums/preparationStages.enum';

export class OrderController {
	constructor(private readonly orderUsecase: OrderUsecase) {}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data: IOrderRequest = req.body;
			const userPayload = req.user as IJWTPayload;
			const token = (req.headers.authorization as string).split(' ')[1];
			const newOrder = await this.orderUsecase.create(data, userPayload, token);

			res.status(201).json({
				message: 'Order created successfully',
				data: newOrder,
			});
		} catch (error) {
			next(error);
		}
	}

	async getOrdersFilteredByStages(req: Request, res: Response, next: NextFunction) {
		try {
			const userPayload = req.user as IJWTPayload;
			const stages: PreparationStages[] = req.query.estados
				? ((req.query.estados as string).split(',') as PreparationStages[])
				: [];
			const page = req.query.page ? Number(req.query.page) : 1;
			const limit = req.query.limit ? Number(req.query.limit) : 10;
			const orders = await this.orderUsecase.getOrdersFilteredByStages(
				userPayload,
				stages,
				page,
				limit,
			);

			res.status(200).json({
				message: 'Orders fetched successfully',
				data: orders,
			});
		} catch (error) {
			next(error);
		}
	}
}
