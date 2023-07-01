import { IDish } from '../../../../src/modules/domain/entities/dish';
import { DishPostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/dishPostgresql.repository';

describe('DishPostgresqlRepository', () => {
	let repository: DishPostgresqlRepository;

	beforeEach(() => {
		// Crea una instancia de la clase CategoryPostgresqlRepository antes de cada prueba
		repository = new DishPostgresqlRepository();
	});

	it('should create a new dish', async () => {
		const dishMock: Omit<IDish, 'id'> = {
			nombre: 'Ceviche',
			descripcion: 'Plato de pescado crudo marinado en aliños cítricos',
			precio: 20,
			uri_imagen:
				'https://www.midiariodecocina.com/wp-content/uploads/2016/03/ceviche-de-pescado.jpg',
			id_restaurante: 1,
			id_categoria: 1,
			activo: true,
		};

		const dish = await repository.create(dishMock);
		expect(dish).toMatchObject({
			...dishMock,
			id: expect.any(Number),
		});
	});
});
