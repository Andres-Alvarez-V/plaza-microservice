import Joi from 'joi';
import { IEmployee } from '../../../domain/entities/employee';

export interface ICreateEmployeeDTO extends Required<IEmployee> {}

const employeId = Joi.number().positive().required();
const restaurantId = Joi.number().positive().required();

const customMessages = {
	'any.required': 'El campo {#label} es requerido',
	'any.unknown': 'El campo {#label} no es permitido',
	'number.base': 'El campo {#label} debe ser un número',
	'number.positive': 'El campo {#label} debe ser mayor a 0',
};

export const createEmployeeSchema = Joi.object<ICreateEmployeeDTO>({
	id_empleado: employeId,
	id_restaurante: restaurantId,
}).options({
	messages: {
		...customMessages,
	},
});
