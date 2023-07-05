import { Router } from 'express';
import { dishController } from '../dependencies';
import { validatorCheckRole, validatorSchemaHandler } from '../middlewares/validator.handler';
import { createDishSchema, updateDishSchema } from '../../app/dtos/request/dish.dto';
import passport from 'passport';
import { RoleType } from '../../domain/enums/role-type.enum';

const router = Router();

router.post(
	'/crearPlato',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.OWNER),
	validatorSchemaHandler(createDishSchema, 'body'),
	dishController.create.bind(dishController),
);
export default router;

router.put(
	'/actualizarPlato/:id',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.OWNER),
	validatorSchemaHandler(updateDishSchema, 'body'),
	dishController.update.bind(dishController),
);
