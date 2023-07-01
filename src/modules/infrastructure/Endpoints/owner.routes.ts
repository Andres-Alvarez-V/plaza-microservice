import { Router } from 'express';
import { dishController } from '../dependencies';
import { validatorSchemaHandler } from '../middlewares/validator.handler';
import { createDishSchema } from '../../app/dtos/request/dish.dto';

const router = Router();

router.post(
	'/crearPlato',
	validatorSchemaHandler(createDishSchema, 'body'),
	dishController.create.bind(dishController),
);
export default router;
