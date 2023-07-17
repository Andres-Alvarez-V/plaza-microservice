import { IAverageTimePerEmployee, ITimeTakenPerOrder } from '../../../domain/entities/order';

export interface IEfficiencyReport {
	tiempo_por_pedido: ITimeTakenPerOrder[];
	tiempo_promedio_por_empleado: IAverageTimePerEmployee[];
}
