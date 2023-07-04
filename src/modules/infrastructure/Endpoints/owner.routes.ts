import { Router } from 'express';
import { dishController } from '../dependencies';
import { validatorSchemaHandler } from '../middlewares/validator.handler';
import { createDishSchema, updateDishSchema } from '../../app/dtos/request/dish.dto';

const router = Router();

router.post(
	'/crearPlato',
	validatorSchemaHandler(createDishSchema, 'body'),
	dishController.create.bind(dishController),
);
export default router;

router.put(
	'/actualizarPlato/:id',
	validatorSchemaHandler(updateDishSchema, 'body'),
	dishController.update.bind(dishController),
);
