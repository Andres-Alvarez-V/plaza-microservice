import { Router } from 'express';
import {
	validatorCheckRole,
	validatorPaginationParamsHandler,
} from '../middlewares/validator.handler';
import passport from 'passport';
import { RoleType } from '../../domain/enums/role-type.enum';
import { restaurantController } from '../dependencies';

const router = Router();

router.get(
	'/restaurantes',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.CLIENT),
	validatorPaginationParamsHandler,
	restaurantController.getAllByPagination.bind(restaurantController),
);

export default router;
