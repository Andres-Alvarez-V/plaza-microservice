import { RestaurantRepository } from './orm/restaurant.repository';
import { RestaurantUsecase } from '../app/usecases/restaurant.usecase';
import { UserController } from './controller/restaurant.controllers';

const restaurantRepository = new RestaurantRepository();
const restaurantUseCase = new RestaurantUsecase(restaurantRepository);
export const userController = new UserController(restaurantUseCase);
