import { createEmployeeSchema } from '../../../../src/modules/app/dtos/request/employee.dto';

describe('createEmployeeSchema', () => {
	const validEmployee = {
		id_empleado: 1,
		id_restaurante: 1,
	};

	it('should validate a valid employee object', () => {
		const { error } = createEmployeeSchema.validate(validEmployee, { abortEarly: false });
		expect(error).toBeUndefined();
	});

	it('should return an error for invalid employee object. "id_empleado" should be greater equal than 0', () => {
		const invalidEmployee = {
			...validEmployee,
			id_empleado: -5,
		};

		const { error } = createEmployeeSchema.validate(invalidEmployee, { abortEarly: false });
		expect(error).toBeDefined();
		const errorMessages = error?.details.map((detail) => detail.message);
		expect(errorMessages).toContain('El campo "id_empleado" debe ser mayor a 0');
	});

	it('should return an error for invalid employee object. "id_restaurante" should be greater equal than 0', () => {
		const invalidEmployee = {
			...validEmployee,
			id_restaurante: -5,
		};

		const { error } = createEmployeeSchema.validate(invalidEmployee, { abortEarly: false });
		expect(error).toBeDefined();
		const errorMessages = error?.details.map((detail) => detail.message);
		expect(errorMessages).toContain('El campo "id_restaurante" debe ser mayor a 0');
	});

	it('should return error because "id_empleado", "id_restaurante" are required', () => {
		const invalidEmployee = {};

		const { error } = createEmployeeSchema.validate(invalidEmployee, { abortEarly: false });
		expect(error).toBeDefined();

		const errorMessages = error?.details.map((detail) => detail.message);
		expect(errorMessages).toContain('El campo "id_empleado" es requerido');
		expect(errorMessages).toContain('El campo "id_restaurante" es requerido');
	});
});
