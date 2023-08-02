import { Op, Sequelize, WhereOptions } from 'sequelize';
import { IOrderRepository } from '../../../domain/repositories/order.repository';
import {
	IOrder,
	IOrderCreate,
	ITimeTakenPerOrder,
	ITotalTimePerEmployee,
	IUpdateOrder,
} from '../../../domain/entities/order';
import { ORDER_POSTGRESQL_TABLE } from '../models/OrderPostgresql.model';
import { SequelizePostgresqlConnection } from '../sequelizePostgresqlConnection';
import { PreparationStages } from '../../../domain/enums/preparationStages.enum';

export class OrderPostgresqlRepository implements IOrderRepository {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = SequelizePostgresqlConnection.getInstance();
	}

	async create(order: IOrderCreate) {
		const newOrder = (await this.sequelize.models[ORDER_POSTGRESQL_TABLE].create(order)).toJSON();

		return newOrder as IOrder;
	}

	private addStageFilter(stages: PreparationStages[], whereOptions: WhereOptions<any>) {
		return stages.length > 0
			? {
					...whereOptions,
					estado: {
						[Op.in]: stages,
					},
			  }
			: whereOptions;
	}

	async getOrdersByClientIdFilteredByStages(clientId: number, stages: PreparationStages[]) {
		let whereOptions: WhereOptions<any> = { id_cliente: clientId };
		whereOptions = this.addStageFilter(stages, whereOptions);
		const orders = await this.sequelize.models[ORDER_POSTGRESQL_TABLE].findAll({
			where: whereOptions,
		});

		return orders.map((order) => order.toJSON()) as IOrder[];
	}

	async getOrdersPaginatedByRestaurantIdFilteredByStages(
		restaurantId: number,
		stages: PreparationStages[],
		page: number,
		limit: number,
	) {
		let whereOptions: WhereOptions<any> = { id_restaurante: restaurantId };
		whereOptions = this.addStageFilter(stages, whereOptions);
		console.log(whereOptions);
		const orders = await this.sequelize.models[ORDER_POSTGRESQL_TABLE].findAll({
			where: whereOptions,
			limit,
			offset: (page - 1) * limit,
		});

		return orders.map((order) => order.toJSON()) as IOrder[];
	}

	async updateOrder(orderId: number, order: IUpdateOrder) {
		const updateOrder = (
			await this.sequelize.models[ORDER_POSTGRESQL_TABLE].update(order, {
				where: { id: orderId },
				returning: true,
			})
		)[1][0].toJSON();

		return updateOrder as IOrder;
	}

	async getOrderById(orderId: number) {
		const order = await this.sequelize.models[ORDER_POSTGRESQL_TABLE].findByPk(orderId);
		if (order) {
			return order.toJSON() as IOrder;
		}

		return null;
	}

	async getTimeTakenPerOrder(restaurantId: number): Promise<ITimeTakenPerOrder[]> {
		const orders = await this.sequelize.models[ORDER_POSTGRESQL_TABLE].findAll({
			where: { id_restaurante: restaurantId, estado: PreparationStages.DELIVERED },
			attributes: [
				['id', 'id_pedido'],
				['tiempo_pedido', 'tiempo_pedido_segundos'],
			],
		});

		return orders.map((order) => order.toJSON()) as ITimeTakenPerOrder[];
	}

	async getTotalTimePerEmployee(restaurantId: number, employeeIds: number[]) {
		const response = await this.sequelize.models[ORDER_POSTGRESQL_TABLE].findAll({
			where: {
				id_restaurante: restaurantId,
				id_chef: {
					[Op.in]: employeeIds, // employeeIds es un array de los employeeId deseados
				},
				estado: PreparationStages.DELIVERED,
			},
			attributes: [
				'id_chef',
				[this.sequelize.fn('sum', this.sequelize.col('tiempo_pedido')), 'total_time'],
				[this.sequelize.fn('count', this.sequelize.col('tiempo_pedido')), 'total_orders'],
			],
			group: ['id_chef'],
		});

		return response.map((order) => order.toJSON() as ITotalTimePerEmployee);
	}
}
