import {
	ICreateDishDTO,
	createDishSchema,
} from '../../../../src/modules/app/dtos/request/dish.dto';

describe('createDishSchema', () => {
	const validDish: ICreateDishDTO = {
		nombre: 'test',
		id_categoria: 1,
		descripcion: 'Delicious test',
		precio: 10,
		id_restaurante: 1,
		uri_imagen: 'https://example.com/test.jpg',
	};

	it('should validate a valid dish object', () => {
		const { error } = createDishSchema.validate(validDish, { abortEarly: false });
		expect(error).toBeUndefined();
	});

	it('should return an error for invalid dish object. "precio" should be greater equal than 0', () => {
		const invalidDish: ICreateDishDTO = {
			...validDish,
			precio: -5,
		};

		const { error } = createDishSchema.validate(invalidDish, { abortEarly: false });
		expect(error).toBeDefined();
		const errorMessages = error?.details.map((detail) => detail.message);
		expect(errorMessages).toContain('El campo "precio" debe ser mayor a 0');
	});

	it('should return error because "nombre", "id_categoria", "descripcion", "precio", "id_restaurante", "uri_imagen" are required', () => {
		const invalidDish = {};

		const { error } = createDishSchema.validate(invalidDish, { abortEarly: false });
		expect(error).toBeDefined();

		const errorMessages = error?.details.map((detail) => detail.message);
		expect(errorMessages).toContain('El campo "nombre" es requerido');
		expect(errorMessages).toContain('El campo "id_categoria" es requerido');
		expect(errorMessages).toContain('El campo "descripcion" es requerido');
		expect(errorMessages).toContain('El campo "precio" es requerido');
		expect(errorMessages).toContain('El campo "id_restaurante" es requerido');
		expect(errorMessages).toContain('El campo "uri_imagen" es requerido');
	});
});
