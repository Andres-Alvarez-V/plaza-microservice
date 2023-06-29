import { Router } from 'express';
import { validatorSchemaHandler, validatorRoleHandler } from '../middlewares/validator.handler';
import { createRestaurantSchema } from '../../app/dtos/request/restaurant.dto';
import { RoleType } from '../../domain/enums/role-type.enum';
import { userController } from '../dependencies';

const router = Router();

/**
 * @openapi
 * /api/v1/admin/crearRestaurante:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create restaurant
 *     description: Create a new user restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantCreate'
 *     responses:
 *       '201':
 *         description: "Successful Response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessfulResponse'
 *       '400':
 *         description: "Missing data or with any wrong."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       '401':
 *         description: "Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 *       '404':
 *         description: "User not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailResponse'
 * components:
 *   schemas:
 *     RestaurantCreate:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *         direccion:
 *           type: string
 *         id_propietario:
 *           type: number
 *         telefono:
 *           type: string
 *         urlLogo:
 *           type: string
 *         nit:
 *           type: string
 *     SuccessfulResponse:
 *         type: object
 *         properties:
 *             message:
 *               type: string
 *               example: successful confirmation message
 *     FailResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: http status code
 *         errorMessage:
 *           type: string
 *           example: fail message
 */
router.post(
	'/crearRestaurante',
	validatorSchemaHandler(createRestaurantSchema, 'body'),
	validatorRoleHandler(RoleType.OWNER),
	userController.create.bind(userController),
);

export default router;
