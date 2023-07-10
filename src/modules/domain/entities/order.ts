import { PreparationStages } from '../enums/preparationStages.enum';

export interface IOrder {
	id: number;
	id_cliente: number;
	fecha: Date;
	estado: PreparationStages;
	id_chef: number | null;
	id_restaurante: number;
}

export interface IOrderCreate extends Omit<IOrder, 'id'> {}
export interface IDishChosen {
	id_plato: number;
	cantidad: number;
}
export interface IOrderRequest {
	id_restaurante: number;
	platos_escogidos: IDishChosen[];
}
