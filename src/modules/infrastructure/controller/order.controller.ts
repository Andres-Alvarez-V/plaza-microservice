import { NextFunction, Request, Response } from 'express';
import { OrderUsecase } from '../../app/usecases/order.usecase';
import { IOrderRequest } from '../../domain/entities/order';
import { IJWTPayload } from '../../domain/entities/JWTPayload';

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
}
