import { IUpdateOrder } from '../entities/order';
import { ITraceabilityCreate } from '../entities/traceability';

export interface ITraceabilityMicroservice {
	createTraceability(traceability: ITraceabilityCreate, token: string): Promise<void>;
	assingOrder(traceability: IUpdateOrder, orderId: number, token: string): Promise<void>;
	updateStage(traceability: IUpdateOrder, orderId: number, token: string): Promise<void>;
	updateStageClient(traceability: IUpdateOrder, orderId: number, token: string): Promise<void>;
}
