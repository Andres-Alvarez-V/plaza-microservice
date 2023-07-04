import { IDish } from '../../../../src/modules/domain/entities/dish';
import { DishPostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/dishPostgresql.repository';
import { IUpdateDishDTO } from '../../../../src/modules/app/dtos/request/dish.dto';

describe('DishPostgresqlRepository', () => {
	let repository: DishPostgresqlRepository;
	let dishMock: IDish | null = null;

	beforeEach(() => {
		// Crea una instancia de la clase CategoryPostgresqlRepository antes de cada prueba
		repository = new DishPostgresqlRepository();
	});

	it('should create a new dish', async () => {
		const dishMockTemp: Omit<IDish, 'id'> = {
			nombre: 'Ceviche',
			descripcion: 'Plato de pescado crudo marinado en aliños cítricos',
			precio: 20,
			uri_imagen:
				'https://www.midiariodecocina.com/wp-content/uploads/2016/03/ceviche-de-pescado.jpg',
			id_restaurante: 1,
			id_categoria: 1,
			activo: true,
		};

		const dish = await repository.create(dishMockTemp);
		dishMock = dish;
		expect(dish).toMatchObject({
			...dishMockTemp,
			id: expect.any(Number),
		});
	});

	it('should update a dish', async () => {
		if (!dishMock) {
			throw new Error('dishMock is null. Cannot update dish.');
		}
		const dishMockTemp: IUpdateDishDTO = {
			precio: 30,
			descripcion: 'Plato actualizado',
		};
		const dish = await repository.update(dishMock.id, dishMockTemp);
		dishMock = {
			...dishMock,
			...dishMockTemp,
		};
		expect(dish).toMatchObject(dishMock);
	});
});
