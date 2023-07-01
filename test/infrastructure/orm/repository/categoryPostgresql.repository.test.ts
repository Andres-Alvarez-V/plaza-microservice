import { CategoryPostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/categoryPostgresql.repository';

describe('CategoryPostgresqlRepository', () => {
	let repository: CategoryPostgresqlRepository;

	beforeEach(() => {
		// Crea una instancia de la clase CategoryPostgresqlRepository antes de cada prueba
		repository = new CategoryPostgresqlRepository();
	});

	it('CATEGORY - It should return a category when it find by ID', async () => {
		const categoryMock = {
			id: 1,
			nombre: 'Entrada',
			descripcion: 'Platos ligeros que se sirven al comienzo de una comida para abrir el apetito',
		};

		const category = await repository.findById(1);

		expect(category).toEqual(categoryMock);
	});

	it('CATEGORY - It should return a null when find by id', async () => {
		const category = await repository.findById(10000);

		expect(category).toBeNull();
	});
});
