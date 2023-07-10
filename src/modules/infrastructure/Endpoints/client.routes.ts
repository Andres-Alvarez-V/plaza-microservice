import { Router } from 'express';
import {
	validatorCheckRole,
	validatorPaginationParamsHandler,
	validatorSchemaHandler,
} from '../middlewares/validator.handler';
import passport from 'passport';
import { RoleType } from '../../domain/enums/role-type.enum';
import { dishController, orderController, restaurantController } from '../dependencies';
import { orderRequestSchema } from '../../app/dtos/request/order.dto';

const router = Router();

router.get(
	'/restaurantes',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.CLIENT),
	validatorPaginationParamsHandler,
	restaurantController.getAllByPagination.bind(restaurantController),
);

router.get(
	'/platos/:restaurantId',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.CLIENT),
	validatorPaginationParamsHandler,
	dishController.getAllByPaginationFilterByCategory.bind(dishController),
);

router.post(
	'/crearPedido',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.CLIENT),
	validatorSchemaHandler(orderRequestSchema, 'body'),
	orderController.create.bind(orderController),
);
export default router;
