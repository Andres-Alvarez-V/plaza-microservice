import { IJWTPayload } from '../../domain/entities/JWTPayload';
import { IDishChosen, IOrderCreate, IOrderRequest } from '../../domain/entities/order';
import { ITraceabilityCreate } from '../../domain/entities/traceability';
import { PreparationStages } from '../../domain/enums/preparationStages.enum';
import { ITraceabilityMicroservice } from '../../domain/microservices/traceability.microservice';
import { IOrderRepository } from '../../domain/repositories/order.repository';
import { IOrderDishRepository } from '../../domain/repositories/order_dish.repository';
import { IUserMicroservice } from '../../domain/microservices/user.microservice';
import boom from '@hapi/boom';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository';

export class OrderUsecase {
	constructor(
		private readonly orderRepository: IOrderRepository,
		private readonly traceabilityMicroservice: ITraceabilityMicroservice,
		private readonly orderDishRepository: IOrderDishRepository,
		private readonly userMicroservice: IUserMicroservice,
		private readonly employeeRepository: IEmployeeRepository,
	) {}

	async create(order: IOrderRequest, jwtPayload: IJWTPayload, token: string) {
		const activeOrder = await this.orderRepository.getOrdersByClientIdFilteredByStages(
			jwtPayload.id,
			[PreparationStages.PENDING, PreparationStages.IN_PREPARATION, PreparationStages.READY],
		);

		if (activeOrder.length !== 0) {
			throw boom.conflict('Ya tienes un pedido activo');
		}

		const newDataOrder: IOrderCreate = {
			id_cliente: jwtPayload.id,
			fecha: new Date(),
			estado: PreparationStages.PENDING,
			id_chef: null,
			id_restaurante: order.id_restaurante,
		};
		const clientEmail = await this.userMicroservice.getUserEmail(jwtPayload.id);
		const orderCreated = await this.orderRepository.create(newDataOrder);

		const orderedDishes = order.platos_escogidos.map((dish: IDishChosen) => ({
			id_pedido: orderCreated.id,
			id_plato: dish.id_plato,
			cantidad: dish.cantidad,
		}));

		await this.orderDishRepository.createOrderedDishes(orderedDishes);
		const newTraceabilityData: ITraceabilityCreate = {
			id_pedido: orderCreated.id,
			id_cliente: jwtPayload.id,
			correo_cliente: clientEmail,
			fecha: newDataOrder.fecha,
			estado_nuevo: newDataOrder.estado,
		};
		await this.traceabilityMicroservice.createTraceability(newTraceabilityData, token);

		return orderCreated;
	}

	async getOrdersFilteredByStages(
		jwtPayload: IJWTPayload,
		stages: PreparationStages[],
		page: number,
		limit: number,
	) {
		const employee = await this.employeeRepository.getEmployeeByEmployeeId(jwtPayload.id);
		if (!employee) {
			throw boom.notFound('No se encontró el empleado');
		}
		const orders = await this.orderRepository.getOrdersPaginatedByRestaurantIdFilteredByStages(
			employee.id_restaurante,
			stages,
			page,
			limit,
		);

		return orders;
	}
}
