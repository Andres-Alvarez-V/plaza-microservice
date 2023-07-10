import { ITraceabilityCreate } from '../entities/traceability';

export interface ITraceabilityMicroservice {
	createTraceability(traceability: ITraceabilityCreate, token: string): Promise<void>;
}
