import { IDish } from '../entities/dish';

export interface IDishRepository {
	create(dish: Omit<IDish, 'id'>): Promise<IDish>;
	update(
		id: number,
		dish: Partial<Pick<IDish, 'precio' | 'descripcion'>> | Pick<IDish, 'activo'>,
	): Promise<IDish>;
	findById(id: number): Promise<IDish | null>;
}
