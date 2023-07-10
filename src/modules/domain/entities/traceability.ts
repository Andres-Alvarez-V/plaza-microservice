import { PreparationStages } from '../enums/preparationStages.enum';

export interface ITraceability {
	_id: string;
	id_pedido: number;
	id_cliente: number;
	correo_cliente: string;
	fecha: Date;
	estado_anterior: string;
	estado_nuevo: PreparationStages;
	id_empleado: number;
	correo_empleado: string;
}

export interface ITraceabilityCreate
	extends Omit<ITraceability, '_id' | 'correo_empleado' | 'id_empleado' | 'estado_anterior'> {}
