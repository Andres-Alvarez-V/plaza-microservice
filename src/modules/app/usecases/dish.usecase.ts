import boom from '@hapi/boom';
import { ICategoryRepository } from '../../domain/repositories/category.repository';
import { IDishRepository } from '../../domain/repositories/dish.repository';
import { ICreateDishDTO } from '../dtos/request/dish.dto';
import { IRestaurantRepository } from '../../domain/repositories/restaurant.repository';

export class DishUsecase {
	constructor(
		private readonly dishRepository: IDishRepository,
		private readonly categoryRepository: ICategoryRepository,
		private readonly restaurantRepository: IRestaurantRepository,
	) {}

	async create(dish: ICreateDishDTO) {
		const newData = {
			...dish,
			activo: true,
		};

		const category = await this.categoryRepository.findById(dish.id_categoria);
		if (!category) {
			throw boom.notFound('Category not found');
		}

		const restaurant = await this.restaurantRepository.findById(dish.id_restaurante);
		if (!restaurant) {
			throw boom.notFound('Restaurant not found');
		}

		const newDish = await this.dishRepository.create(newData);

		return newDish;
	}
}
