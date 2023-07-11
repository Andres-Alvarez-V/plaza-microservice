import { Router } from 'express';
import passport from 'passport';
import {
	validatorCheckRole,
	validatorPaginationParamsHandler,
	validatorSchemaHandler,
} from '../middlewares/validator.handler';
import { RoleType } from '../../domain/enums/role-type.enum';
import { preparationStagesFilterSchema } from '../../app/dtos/request/order.dto';
import { orderController } from '../dependencies';

const router = Router();

router.get(
	'/pedidos',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.EMPLOYEE),
	validatorSchemaHandler(preparationStagesFilterSchema, 'query'),
	validatorPaginationParamsHandler,
	orderController.getOrdersFilteredByStages.bind(orderController),
);

router.put(
	'/asignarPedido/:id_pedido',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.EMPLOYEE),
	orderController.assingOrder.bind(orderController),
);

export default router;
