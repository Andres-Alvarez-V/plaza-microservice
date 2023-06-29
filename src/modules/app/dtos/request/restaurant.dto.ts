import Joi from 'joi';
import { IRestaurant } from '../../../domain/entities/restaurant';

export interface ICreateRestaurantDTO extends Omit<IRestaurant, 'id'> {}

const name = Joi.string()
	.min(3)
	.max(254)
	.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/);
const address = Joi.string().min(3).max(254);
const ownerId = Joi.number().integer().positive();
const phone = Joi.string().pattern(/^\+?[0-9]{10,13}$/);
const logoUrl = Joi.string().uri();
const nit = Joi.string().pattern(/^[0-9]{8,100}$/);

export const createRestaurantSchema = Joi.object<ICreateRestaurantDTO>({
	nombre: name.required(),
	direccion: address.required(),
	id_propietario: ownerId.required(),
	telefono: phone.required(),
	urlLogo: logoUrl.required(),
	nit: nit.required(),
}).options({
	messages: {
		'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres',
		'string.max': 'El campo {#label} debe tener como máximo {#limit} caracteres',
		'any.required': 'El campo {#label} es obligatorio',
		'number.integer': 'El campo {#label} debe ser un número entero',
		'number.positive': 'El campo {#label} debe ser un número positivo',
		'string.pattern.base': 'El campo {#label} no cumple con el formato válido',
		'string.uri': 'El campo {#label} debe ser una URL válida',
	},
});
