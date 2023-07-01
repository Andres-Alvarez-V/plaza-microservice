import {
	ICreateRestaurantDTO,
	createRestaurantSchema,
} from '../../../../src/modules/app/dtos/request/restaurant.dto';

describe('createRestaurantSchema', () => {
	const validRestaurant: ICreateRestaurantDTO = {
		nombre: 'TEST',
		direccion: 'Calle Principal 123',
		id_propietario: 1,
		telefono: '+1234567890',
		urlLogo: 'https://example.com/logo.png',
		nit: '12345678',
	};

	it('should validate a valid restaurant object', () => {
		const { error } = createRestaurantSchema.validate(validRestaurant, { abortEarly: false });
		expect(error).toBeUndefined();
	});

	it('should return error because "nombre", "direccion", "id_propietario", "telefono", "urlLogo", "nit" are required', () => {
		const invalidRestaurant = {};

		const { error } = createRestaurantSchema.validate(invalidRestaurant, { abortEarly: false });
		expect(error).toBeDefined();

		const errorMessages = error?.details.map((detail) => detail.message);
		expect(errorMessages).toContain('El campo "nombre" es obligatorio');
		expect(errorMessages).toContain('El campo "direccion" es obligatorio');
		expect(errorMessages).toContain('El campo "id_propietario" es obligatorio');
		expect(errorMessages).toContain('El campo "telefono" es obligatorio');
		expect(errorMessages).toContain('El campo "urlLogo" es obligatorio');
		expect(errorMessages).toContain('El campo "nit" es obligatorio');
	});
	it('should return an error for invalid restaurant object.', () => {
		const invalidRestaurant: ICreateRestaurantDTO = {
			...validRestaurant,
			nit: 'ads',
			telefono: 'afdaffdsdfsfafdadsdfaf',
			nombre: '12342134',
		};

		const { error } = createRestaurantSchema.validate(invalidRestaurant, { abortEarly: false });
		expect(error).toBeDefined();
		const errorMessages = error?.details.map((detail) => detail.message);
		expect(errorMessages).toContain('El campo "nombre" no cumple con el formato válido');
		expect(errorMessages).toContain('El campo "telefono" no cumple con el formato válido');
		expect(errorMessages).toContain('El campo "nit" no cumple con el formato válido');
	});
});
