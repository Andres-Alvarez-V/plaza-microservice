import { IOrderDish } from '../entities/order_dish';

export interface IOrderDishRepository {
	createOrderedDishes(orderedDishes: IOrderDish[]): Promise<void>;
}
