import { IRestaurant } from '../entities/restaurant';

export interface IRestaurantRepository {
	create(restaurant: Omit<IRestaurant, 'id'>): Promise<IRestaurant>;
	findById(id: number): Promise<IRestaurant | null>;
}
