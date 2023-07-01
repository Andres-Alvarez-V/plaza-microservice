import { ICategory } from '../entities/category';

export interface ICategoryRepository {
	findById(id: number): Promise<ICategory | null>;
}
