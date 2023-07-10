import { IOrder, IOrderCreate } from '../entities/order';
import { PreparationStages } from '../enums/preparationStages.enum';

export interface IOrderRepository {
	create(order: IOrderCreate): Promise<IOrder>;
	getOrdersByClientIdFilteredByStages(
		clientId: number,
		stages: PreparationStages[],
	): Promise<IOrder[]>;
}
