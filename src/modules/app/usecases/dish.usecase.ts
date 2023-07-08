import boom from '@hapi/boom';
import { ICategoryRepository } from '../../domain/repositories/category.repository';
import { IDishRepository } from '../../domain/repositories/dish.repository';
import { IChangeDishStateDTO, ICreateDishDTO, IModifyDishDTO } from '../dtos/request/dish.dto';
import { IRestaurantRepository } from '../../domain/repositories/restaurant.repository';
import { IJWTPayload } from '../../domain/entities/JWTPayload';

export class DishUsecase {
	constructor(
		private readonly dishRepository: IDishRepository,
		private readonly categoryRepository: ICategoryRepository,
		private readonly restaurantRepository: IRestaurantRepository,
	) {}

	async create(dish: ICreateDishDTO, userPayload: IJWTPayload) {
		const newData = {
			...dish,
			activo: true,
		};

		const category = await this.categoryRepository.findById(dish.id_categoria);
		if (!category) {
			throw boom.notFound('Categoria no encontrada');
		}

		const restaurant = await this.restaurantRepository.findById(dish.id_restaurante);
		if (!restaurant) {
			throw boom.notFound('Restaurante no encontrado');
		}

		if (restaurant.id_propietario !== userPayload.id) {
			throw boom.unauthorized(
				'No tienes permisos para realizar esta acción. El restaurante no te pertenece',
			);
		}

		const newDish = await this.dishRepository.create(newData);

		return newDish;
	}

	async update(
		dishId: number,
		dish: IModifyDishDTO | IChangeDishStateDTO,
		userPayload: IJWTPayload,
	) {
		const dishData = await this.dishRepository.findById(dishId);
		if (!dishData) {
			throw boom.notFound('Plato no encontrado');
		}

		const restaurant = await this.restaurantRepository.findById(dishData.id_restaurante);
		if (!restaurant) {
			throw boom.notFound('Restaurante no encontrado');
		}

		if (restaurant.id_propietario !== userPayload.id) {
			throw boom.unauthorized(
				'No tienes permisos para realizar esta acción. El restaurante no te pertenece',
			);
		}

		const updatedDish = await this.dishRepository.update(dishId, dish);

		return updatedDish;
	}

	async getAllByPaginationFilterByCategory(
		page: number,
		limit: number,
		restaurantId: number,
		categories: number[] | [],
	) {
		console.log('categories', categories);
		const restaurant = await this.restaurantRepository.findById(restaurantId);
		if (!restaurant) {
			throw boom.notFound('Restaurante no encontrado');
		}

		const dishes = await this.dishRepository.getAllByPaginationFilter(
			restaurantId,
			page,
			limit,
			categories,
		);

		return dishes;
	}
}
