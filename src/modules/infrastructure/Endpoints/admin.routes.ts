import { Router } from 'express';
import { validatorSchemaHandler, validatorRoleHandler } from '../middlewares/validator.handler';
import { createRestaurantSchema } from '../../app/dtos/request/restaurant.dto';
import { RoleType } from '../../domain/enums/role-type.enum';
import { restaurantController } from '../dependencies';

const router = Router();

router.post(
	'/crearRestaurante',
	validatorSchemaHandler(createRestaurantSchema, 'body'),
	validatorRoleHandler(RoleType.OWNER),
	restaurantController.create.bind(restaurantController),
);

export default router;
