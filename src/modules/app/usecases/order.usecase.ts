import { IJWTPayload } from '../../domain/entities/JWTPayload';
import {
	IAverageTimePerEmployee,
	IDishChosen,
	IOrderCreate,
	IOrderRequest,
	IUpdateOrder,
} from '../../domain/entities/order';
import { ITraceabilityCreate, IUpdateTraceability } from '../../domain/entities/traceability';
import { PreparationStages } from '../../domain/enums/preparationStages.enum';
import { ITraceabilityMicroservice } from '../../domain/microservices/traceability.microservice';
import { IOrderRepository } from '../../domain/repositories/order.repository';
import { IOrderDishRepository } from '../../domain/repositories/order_dish.repository';
import { IUserMicroservice } from '../../domain/microservices/user.microservice';
import boom from '@hapi/boom';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import { ITwilioMicroservice } from '../../domain/microservices/twilio.microservice';
import { IRestaurantRepository } from '../../domain/repositories/restaurant.repository';
import { IEfficiencyReport } from '../dtos/response/order.dto';

export class OrderUsecase {
	constructor(
		private readonly orderRepository: IOrderRepository,
		private readonly traceabilityMicroservice: ITraceabilityMicroservice,
		private readonly orderDishRepository: IOrderDishRepository,
		private readonly userMicroservice: IUserMicroservice,
		private readonly employeeRepository: IEmployeeRepository,
		private readonly twilioMicroservice: ITwilioMicroservice,
		private readonly restaurantRepository: IRestaurantRepository,
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
			codigo_verificacion: null,
			tiempo_pedido: null,
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

	async assingOrder(orderId: number, jwtPayload: IJWTPayload, token: string) {
		const orderToUpdate = await this.orderRepository.getOrderById(orderId);
		if (!orderToUpdate) {
			throw boom.notFound('No se encontró el pedido');
		}
		if (orderToUpdate.estado !== PreparationStages.PENDING) {
			throw boom.conflict('El pedido no está en estado "pendiente"');
		}
		const dataToUpdate: IUpdateOrder = {
			estado: PreparationStages.IN_PREPARATION,
			id_chef: jwtPayload.id as number,
		};
		const chef = await this.employeeRepository.getEmployeeByEmployeeId(
			dataToUpdate.id_chef as number,
		);
		if (!chef) {
			throw boom.notFound('No se encontró el chef');
		}

		if (chef.id_restaurante !== orderToUpdate.id_restaurante) {
			throw boom.conflict('El chef no pertenece al restaurante del pedido');
		}

		const updatedOrder = await this.orderRepository.updateOrder(orderId, dataToUpdate);

		const chefEmail = await this.userMicroservice.getUserEmail(chef.id_empleado);
		const newTraceabilityData: IUpdateTraceability = {
			id_empleado: chef.id_empleado,
			estado_anterior: orderToUpdate.estado,
			estado_nuevo: dataToUpdate.estado as PreparationStages,
			correo_empleado: chefEmail,
		};
		await this.traceabilityMicroservice.assingOrder(newTraceabilityData, orderId, token);

		return updatedOrder;
	}

	private generateVerificationCode() {
		const codeLength = 6;
		const min = Math.pow(10, codeLength - 1);
		const max = Math.pow(10, codeLength) - 1;

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	async asingOrderReady(orderId: number, jwtPayload: IJWTPayload, token: string) {
		const orderToUpdate = await this.orderRepository.getOrderById(orderId);
		if (!orderToUpdate) {
			throw boom.notFound('No se encontró el pedido');
		}
		if (orderToUpdate.estado !== PreparationStages.IN_PREPARATION) {
			throw boom.conflict('El pedido no está en estado en "preparación"');
		}
		const employee = await this.employeeRepository.getEmployeeByEmployeeId(jwtPayload.id as number);
		if (!employee) {
			throw boom.notFound('No se encontró el empleado');
		}

		if (employee.id_restaurante !== orderToUpdate.id_restaurante) {
			throw boom.conflict('El empleado no pertenece al restaurante del pedido');
		}
		const verificationCode = this.generateVerificationCode().toString();
		const message = `Tu pedido esta listo!! Para reclamar tu pedido di el siguiente codigo al empleado del restaurante cuando te lo requiera: ${verificationCode}`;
		await this.twilioMicroservice.sendSms(message);

		const dataToUpdate: IUpdateOrder = {
			estado: PreparationStages.READY,
			codigo_verificacion: verificationCode,
		};

		const updatedOrder = await this.orderRepository.updateOrder(orderId, dataToUpdate);

		const newTraceabilityData: IUpdateTraceability = {
			estado_anterior: orderToUpdate.estado,
			estado_nuevo: dataToUpdate.estado as PreparationStages,
		};
		await this.traceabilityMicroservice.updateStage(newTraceabilityData, orderId, token);

		return updatedOrder;
	}

	async assignOrderDelivered(
		requestBody: IUpdateOrder,
		orderId: number,
		jwtPayload: IJWTPayload,
		token: string,
	) {
		const orderToUpdate = await this.orderRepository.getOrderById(orderId);
		if (!orderToUpdate) {
			throw boom.notFound('No se encontró el pedido');
		}
		if (orderToUpdate.estado !== PreparationStages.READY) {
			throw boom.conflict('El pedido no está en estado "listo"');
		}
		if (orderToUpdate.codigo_verificacion !== String(requestBody.codigo_verificacion)) {
			throw boom.forbidden(
				'El codigo de verificación no es correcto, el pedido no puede ser entregado',
			);
		}

		const employee = await this.employeeRepository.getEmployeeByEmployeeId(jwtPayload.id as number);
		if (!employee) {
			throw boom.notFound('No se encontró el empleado');
		}
		if (employee.id_restaurante !== orderToUpdate.id_restaurante) {
			throw boom.conflict('El empleado no pertenece al restaurante del pedido');
		}
		const dataToUpdate: IUpdateOrder = {
			estado: PreparationStages.DELIVERED,
			tiempo_pedido: Math.round((Date.now() - orderToUpdate.fecha.getTime()) / 1000), // SEGUNDOS
		};

		const updatedOrder = await this.orderRepository.updateOrder(orderId, dataToUpdate);

		const newTraceabilityData: IUpdateTraceability = {
			estado_anterior: orderToUpdate.estado,
			estado_nuevo: dataToUpdate.estado as PreparationStages,
		};
		await this.traceabilityMicroservice.updateStage(newTraceabilityData, orderId, token);

		return updatedOrder;
	}

	async cancelOrder(orderId: number, token: string) {
		const orderToUpdate = await this.orderRepository.getOrderById(orderId);
		if (!orderToUpdate) {
			throw boom.notFound('No se encontró el pedido');
		}
		if (orderToUpdate.estado !== PreparationStages.PENDING) {
			throw boom.conflict('Lo sentimos, tu pedido ya está en preparación y no puede cancelarse');
		}
		const dataToUpdate: IUpdateOrder = {
			estado: PreparationStages.CANCELED,
		};

		const updatedOrder = await this.orderRepository.updateOrder(orderId, dataToUpdate);
		const newTraceabilityData: IUpdateTraceability = {
			estado_anterior: orderToUpdate.estado,
			estado_nuevo: dataToUpdate.estado as PreparationStages,
		};
		await this.traceabilityMicroservice.updateStageClient(newTraceabilityData, orderId, token);

		return updatedOrder;
	}

	async getEficiencyReport(restaurantId: number, jwtPayload: IJWTPayload) {
		const restaurant = await this.restaurantRepository.findById(restaurantId);
		if (!restaurant) {
			throw boom.notFound('No se encontró el restaurante');
		}
		if (restaurant.id_propietario !== jwtPayload.id) {
			throw boom.forbidden('No tienes permisos para ver este reporte');
		}

		const timePerOrder = await this.orderRepository.getTimeTakenPerOrder(restaurantId);
		const employees = await this.employeeRepository.getEmployeesByRestaurantId(restaurantId);
		const employeesIds = employees.map((employee) => employee.id_empleado);
		const totalTimePerEmployee = await this.orderRepository.getTotalTimePerEmployee(
			restaurantId,
			employeesIds,
		);
		const averageTimePerEmployee: IAverageTimePerEmployee[] = totalTimePerEmployee.map(
			(employee) => {
				return {
					id_chef: employee.id_chef,
					tiempo_promedio_segundos: employee.total_time / employee.total_orders,
				};
			},
		);

		return {
			tiempo_por_pedido: timePerOrder,
			tiempo_promedio_por_empleado: averageTimePerEmployee,
		} as IEfficiencyReport;
	}
}
