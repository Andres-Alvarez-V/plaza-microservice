import { Router } from 'express';
import { dishController, employeeController, orderController } from '../dependencies';
import { validatorCheckRole, validatorSchemaHandler } from '../middlewares/validator.handler';
import {
	changeDishStateSchema,
	createDishSchema,
	updateDishSchema,
} from '../../app/dtos/request/dish.dto';
import passport from 'passport';
import { RoleType } from '../../domain/enums/role-type.enum';
import { createEmployeeSchema } from '../../app/dtos/request/employee.dto';

const router = Router();

router.post(
	'/crearPlato',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.OWNER),
	validatorSchemaHandler(createDishSchema, 'body'),
	dishController.create.bind(dishController),
);

router.put(
	'/actualizarPlato/:id',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.OWNER),
	validatorSchemaHandler(updateDishSchema, 'body'),
	dishController.update.bind(dishController),
);

router.post(
	'/agregarEmpleado',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.OWNER),
	validatorSchemaHandler(createEmployeeSchema, 'body'),
	employeeController.create.bind(employeeController),
);

router.put(
	'/cambiarEstadoPlato/:id',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.OWNER),
	validatorSchemaHandler(changeDishStateSchema, 'body'),
	dishController.changeState.bind(dishController),
);

router.get(
	'/reporteEficiencia/:id_restaurante',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.OWNER),
	orderController.getEfficiencyReport.bind(orderController),
);

export default router;
