import { orderRequestSchema } from '../../../../src/modules/app/dtos/request/order.dto';
import { IOrderRequest } from '../../../../src/modules/domain/entities/order';

describe('orderDTO', () => {
	describe('createOrderDTO', () => {
		const validOrderSchema: IOrderRequest = {
			id_restaurante: 1,
			platos_escogidos: [
				{
					id_plato: 1,
					cantidad: 1,
				},
				{
					id_plato: 2,
					cantidad: 2,
				},
			],
		};

		it('should validate a valid order object', () => {
			const { error } = orderRequestSchema.validate(validOrderSchema, { abortEarly: false });
			expect(error).toBeUndefined();
		});

		it('should return an error for invalid order object. "id_restaurante" should be greater equal than 0', () => {
			const invalidOrderSchema: IOrderRequest = {
				...validOrderSchema,
				id_restaurante: -1,
			};
			const { error } = orderRequestSchema.validate(invalidOrderSchema, { abortEarly: false });
			expect(error).toBeDefined();
			const errorMessages = error?.details.map((detail) => detail.message);
			expect(errorMessages).toContain('El campo "id_restaurante" debe ser mayor a 0');
		});

		it('should return an error for invalid order object. "platos_escogidos" should contain at least 1 items', () => {
			const invalidOrderSchema: IOrderRequest = {
				...validOrderSchema,
				platos_escogidos: [],
			};
			const { error } = orderRequestSchema.validate(invalidOrderSchema, { abortEarly: false });
			expect(error).toBeDefined();
			const errorMessages = error?.details.map((detail) => detail.message);
			expect(errorMessages).toContain(
				'El campo "platos_escogidos" debe contener al menos 1 elementos',
			);
		});

		it('should return an error for invalid order object. The propertu "cantiodad" of "platos_escogidos" is required', () => {
			const invalidOrderSchema = {
				...validOrderSchema,
				platos_escogidos: [
					{
						id_plato: 1,
					},
				],
			};
			const { error } = orderRequestSchema.validate(invalidOrderSchema, { abortEarly: false });
			expect(error).toBeDefined();
			const errorMessages = error?.details.map((detail) => detail.message);
			expect(errorMessages).toContain('El campo "platos_escogidos[0].cantidad" es requerido');
		});
	});
});
