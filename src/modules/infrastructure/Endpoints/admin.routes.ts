import { Router } from 'express';
import {
	validatorSchemaHandler,
	validatorRoleHandler,
	validatorCheckRole,
} from '../middlewares/validator.handler';
import { createRestaurantSchema } from '../../app/dtos/request/restaurant.dto';
import { RoleType } from '../../domain/enums/role-type.enum';
import { restaurantController } from '../dependencies';
import passport from 'passport';

const router = Router();

router.post(
	'/crearRestaurante',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.ADMIN),
	validatorSchemaHandler(createRestaurantSchema, 'body'),
	validatorRoleHandler(RoleType.OWNER),
	restaurantController.create.bind(restaurantController),
);

export default router;
