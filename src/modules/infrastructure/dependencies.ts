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
import { TraceabilityMicroservice } from './microservices/traceabilityMicroservice';
import { UserMicroservice } from './microservices/userMicroservice';
import { OrderUsecase } from '../app/usecases/order.usecase';
import { OrderPostgresqlRepository } from './orm/repository/orderPostgresql.repository';
import { OrderDishPostgresqlRepository } from './orm/repository/order_dishPostgresql.repository';
import { OrderController } from './controller/order.controller';

// Repositories
const restaurantRepository = new RestaurantPostgresqlRepository();
const categoryRepository = new CategoryPostgresqlRepository();
const dishRepository = new DishPostgresqlRepository();
const employeeRepository = new EmployeePostgresqlRepository();
const orderRepository = new OrderPostgresqlRepository();
const orderDishRepository = new OrderDishPostgresqlRepository();

// Microservices
const traceabilityMicroservice = new TraceabilityMicroservice();
export const userMicroservice = new UserMicroservice();

// Usecases
const restaurantUseCase = new RestaurantUsecase(restaurantRepository);
const dishUseCase = new DishUsecase(dishRepository, categoryRepository, restaurantRepository);
const employeeUseCase = new EmployeeUsecase(employeeRepository);
const orderUseCase = new OrderUsecase(
	orderRepository,
	traceabilityMicroservice,
	orderDishRepository,
	userMicroservice,
);

// Controllers
export const restaurantController = new RestaurantController(restaurantUseCase);
export const dishController = new DishController(dishUseCase);
export const employeeController = new EmployeeController(employeeUseCase);
export const orderController = new OrderController(orderUseCase);
