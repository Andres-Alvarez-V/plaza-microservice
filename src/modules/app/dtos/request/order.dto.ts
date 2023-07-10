import Joi from 'joi';
import { IDishChosen, IOrderRequest } from '../../../domain/entities/order';

const customMessages = {
	'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres',
	'string.max': 'El campo {#label} debe tener como máximo {#limit} caracteres',
	'number.min': 'El campo {#label} debe ser mayor a {#limit}',
	'string.email': 'El campo {#label} debe ser un email válido',
	'any.required': 'El campo {#label} es requerido',
	'any.unknown': 'El campo {#label} no es permitido',
	'number.base': 'El campo {#label} debe ser un número',
	'array.min': 'El campo {#label} debe contener al menos {#limit} elementos',
};

const dishId = Joi.number().integer().min(0);
const quantity = Joi.number().integer().min(1);
const restaurantId = Joi.number().integer().min(0);
const dishChosenSchema = Joi.object<IDishChosen>({
	id_plato: dishId.required(),
	cantidad: quantity.required(),
}).options({
	messages: customMessages,
});

export const orderRequestSchema = Joi.object<IOrderRequest>({
	id_restaurante: restaurantId.required(),
	platos_escogidos: Joi.array().items(dishChosenSchema).min(1).required(),
}).options({
	messages: customMessages,
});
