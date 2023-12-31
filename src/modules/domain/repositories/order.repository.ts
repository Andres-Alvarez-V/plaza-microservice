import {
	IOrder,
	IOrderCreate,
	ITimeTakenPerOrder,
	ITotalTimePerEmployee,
	IUpdateOrder,
} from '../entities/order';
import { PreparationStages } from '../enums/preparationStages.enum';

export interface IOrderRepository {
	create(order: IOrderCreate): Promise<IOrder>;
	getOrderById(orderId: number): Promise<IOrder | null>;
	getOrdersByClientIdFilteredByStages(
		clientId: number,
		stages: PreparationStages[],
	): Promise<IOrder[]>;
	getOrdersPaginatedByRestaurantIdFilteredByStages(
		restaurantId: number,
		stages: PreparationStages[],
		page: number,
		limit: number,
	): Promise<IOrder[]>;
	updateOrder(orderId: number, order: IUpdateOrder): Promise<IOrder>;
	getTimeTakenPerOrder(restaurantId: number): Promise<ITimeTakenPerOrder[]>;
	getTotalTimePerEmployee(
		restaurantId: number,
		employeeIds: number[],
	): Promise<ITotalTimePerEmployee[]>;
}
