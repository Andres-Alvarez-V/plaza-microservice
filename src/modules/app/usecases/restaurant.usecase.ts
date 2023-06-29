import { IRestaurantRepository } from '../../domain/repositories/restaurant.repository';
import { IRestaurant } from '../../domain/entities/restaurant';

export class RestaurantUsecase {
	constructor(private readonly restaurantRepository: IRestaurantRepository) {}

	async create(restaurant: Omit<IRestaurant, 'id'>): Promise<IRestaurant> {
		const newRestaurant = await this.restaurantRepository.create(restaurant);

		return newRestaurant;
	}
}
