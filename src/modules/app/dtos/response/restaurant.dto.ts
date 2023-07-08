import { IRestaurant } from '../../../domain/entities/restaurant';

export interface IRestaurantPaginatedToListResponse
	extends Pick<IRestaurant, 'nombre' | 'urlLogo'> {}
