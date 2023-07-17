import { PreparationStages } from '../enums/preparationStages.enum';

export interface IOrder {
	id: number;
	id_cliente: number;
	fecha: Date;
	estado: PreparationStages;
	id_chef: number | null;
	id_restaurante: number;
	codigo_verificacion: string | null;
	tiempo_pedido: number | null;
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

export interface IUpdateOrder extends Partial<IOrderCreate> {}

export interface ITimeTakenPerOrder {
	id_pedido: number;
	tiempo_pedido_segundos: number;
}
export interface ITotalTimePerEmployee {
	id_chef: number;
	total_time: number;
	total_orders: number;
}

export interface IAverageTimePerEmployee {
	id_chef: number;
	tiempo_promedio_segundos: number;
}
