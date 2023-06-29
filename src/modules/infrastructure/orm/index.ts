import { Restaurant, RestaurantSchema } from './Restaurant.model';
import { Sequelize } from 'sequelize';

export const setUpModels = (sequelize: Sequelize) => {
	Restaurant.init(RestaurantSchema, Restaurant.config(sequelize));
};
