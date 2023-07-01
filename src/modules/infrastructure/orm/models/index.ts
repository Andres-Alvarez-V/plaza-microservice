import { CategoryPostgresql, CategoryPostgresqlSchema } from './CategoryPostgresql.model';
import { DishPostgresql, DishPostgresqlSchema } from './DishPostgresql.model';
import { RestaurantPostgresql, RestaurantPostgresqlSchema } from './RestaurantPostgresql.model';
import { Sequelize } from 'sequelize';

export const setUpModels = (sequelize: Sequelize) => {
	RestaurantPostgresql.init(RestaurantPostgresqlSchema, RestaurantPostgresql.config(sequelize));
	DishPostgresql.init(DishPostgresqlSchema, DishPostgresql.config(sequelize));
	CategoryPostgresql.init(CategoryPostgresqlSchema, CategoryPostgresql.config(sequelize));
	DishPostgresql.associate(sequelize.models);
};
