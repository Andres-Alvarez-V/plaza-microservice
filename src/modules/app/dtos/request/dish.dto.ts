import Joi from 'joi';
import { IDish } from '../../../domain/entities/dish';

export interface ICreateDishDTO extends Omit<IDish, 'id' | 'activo'> {}

const name = Joi.string().min(3).max(100);
const categoryId = Joi.number().integer().min(1);
const description = Joi.string().min(3).max(500);
const price = Joi.number().integer().min(0);
const restaurantId = Joi.number().integer().min(1);
const imageUri = Joi.string().uri();

export const createDishSchema = Joi.object<ICreateDishDTO>({
	nombre: name.required(),
	id_categoria: categoryId.required(),
	descripcion: description.required(),
	precio: price.required(),
	id_restaurante: restaurantId.required(),
	uri_imagen: imageUri.required(),
}).options({
	messages: {
		'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres',
		'string.max': 'El campo {#label} debe tener como máximo {#limit} caracteres',
		'number.min': 'El campo {#label} debe ser mayor a {#limit}',
		'string.email': 'El campo {#label} debe ser un email válido',
		'any.required': 'El campo {#label} es requerido',
	},
});
