import { RestaurantUsecase } from '../app/usecases/restaurant.usecase';
import { RestaurantController } from './controller/restaurant.controllers';
import { DishPostgresqlRepository } from './orm/repository/dishPostgresql.repository';
import { DishUsecase } from '../app/usecases/dish.usecase';
import { DishController } from './controller/dish.controller';
import { CategoryPostgresqlRepository } from './orm/repository/categoryPostgresql.repository';
import { RestaurantPostgresqlRepository } from './orm/repository/restaurantPostgresql.repository';
import { EmployeePostgresqlRepository } from './orm/repository/employeePostgresql.repository';
import { EmployeeUsecase } from '../app/usecases/employee.controller';
import { EmployeeController } from './controller/employee.controller';

const restaurantRepository = new RestaurantPostgresqlRepository();
const restaurantUseCase = new RestaurantUsecase(restaurantRepository);
export const restaurantController = new RestaurantController(restaurantUseCase);

const categoryRepository = new CategoryPostgresqlRepository();

const dishRepository = new DishPostgresqlRepository();
const dishUseCase = new DishUsecase(dishRepository, categoryRepository, restaurantRepository);
export const dishController = new DishController(dishUseCase);

const employeeRepository = new EmployeePostgresqlRepository();
const employeeUseCase = new EmployeeUsecase(employeeRepository);
export const employeeController = new EmployeeController(employeeUseCase);
