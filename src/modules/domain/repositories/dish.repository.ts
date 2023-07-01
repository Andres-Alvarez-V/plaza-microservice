import { IDish } from '../entities/dish';

export interface IDishRepository {
	create(dish: Omit<IDish, 'id'>): Promise<IDish>;
}
