import { IRestaurantRepository } from '../../domain/repositories/restaurant.repository';
import { IRestaurant } from '../../domain/entities/restaurant';
import { IRestaurantPaginatedToListResponse } from '../dtos/response/restaurant.dto';

export class RestaurantUsecase {
	constructor(private readonly restaurantRepository: IRestaurantRepository) {}

	async create(restaurant: Omit<IRestaurant, 'id'>): Promise<IRestaurant> {
		const newRestaurant = await this.restaurantRepository.create(restaurant);

		return newRestaurant;
	}

	async getAllByPagination(
		page: number,
		limit: number,
	): Promise<IRestaurantPaginatedToListResponse[]> {
		const restaurants = await this.restaurantRepository.getAllByPagination(page, limit);

		return restaurants.map((restaurant) => {
			return {
				nombre: restaurant.nombre,
				urlLogo: restaurant.urlLogo,
			} as IRestaurantPaginatedToListResponse;
		});
	}
}
