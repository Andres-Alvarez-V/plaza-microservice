import { NextFunction, Request, Response } from 'express';
import { OrderUsecase } from '../../app/usecases/order.usecase';
import { IOrderRequest, IUpdateOrder } from '../../domain/entities/order';
import { IJWTPayload } from '../../domain/entities/JWTPayload';
import { PreparationStages } from '../../domain/enums/preparationStages.enum';
import boom from '@hapi/boom';

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

	async assingOrder(req: Request, res: Response, next: NextFunction) {
		try {
			const orderId = Number(req.params.id_pedido);
			if (!orderId || isNaN(orderId)) {
				throw boom.badRequest(
					'El id del pedido debe ser un número y debe esta definido en el path',
				);
			}
			const userPayload = req.user as IJWTPayload;
			const token = (req.headers.authorization as string).split(' ')[1];
			const order = await this.orderUsecase.assingOrder(orderId, userPayload, token);

			res.status(200).json({
				message: 'Order assigned successfully',
				data: order,
			});
		} catch (error) {
			next(error);
		}
	}

	async asingOrderReady(req: Request, res: Response, next: NextFunction) {
		try {
			const orderId = Number(req.params.id_pedido);
			if (!orderId || isNaN(orderId)) {
				throw boom.badRequest(
					'El id del pedido debe ser un número y debe esta definido en el path',
				);
			}
			const userPayload = req.user as IJWTPayload;
			const token = (req.headers.authorization as string).split(' ')[1];
			const order = await this.orderUsecase.asingOrderReady(orderId, userPayload, token);

			res.status(200).json({
				message: 'Order assigned successfully',
				data: order,
			});
		} catch (error) {
			next(error);
		}
	}

	async assignOrderDelivered(req: Request, res: Response, next: NextFunction) {
		try {
			const orderId = Number(req.params.id_pedido);
			if (!orderId || isNaN(orderId)) {
				throw boom.badRequest(
					'El id del pedido debe ser un número y debe esta definido en el path',
				);
			}
			const userPayload = req.user as IJWTPayload;
			const token = (req.headers.authorization as string).split(' ')[1];
			const requestBody: IUpdateOrder = req.body;
			const order = await this.orderUsecase.assignOrderDelivered(
				requestBody,
				orderId,
				userPayload,
				token,
			);

			res.status(200).json({
				message: 'Order assigned successfully',
				data: order,
			});
		} catch (error) {
			next(error);
		}
	}
}
