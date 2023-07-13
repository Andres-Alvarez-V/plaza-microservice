import { Router } from 'express';
import passport from 'passport';
import {
	validatorCheckRole,
	validatorPaginationParamsHandler,
	validatorSchemaHandler,
} from '../middlewares/validator.handler';
import { RoleType } from '../../domain/enums/role-type.enum';
import {
	orderVerificationCodeSchema,
	preparationStagesFilterSchema,
} from '../../app/dtos/request/order.dto';
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

router.put(
	'/asignarPedidoListo/:id_pedido',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.EMPLOYEE),
	orderController.asingOrderReady.bind(orderController),
);

router.put(
	'/asignarPedidoEntregado/:id_pedido',
	passport.authenticate('jwt', { session: false }),
	validatorCheckRole(RoleType.EMPLOYEE),
	validatorSchemaHandler(orderVerificationCodeSchema, 'body'),
	orderController.assignOrderDelivered.bind(orderController),
);

export default router;
