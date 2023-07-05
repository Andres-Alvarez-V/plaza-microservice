import { IRestaurant } from '../../../../src/modules/domain/entities/restaurant';
import { RestaurantPostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/restaurantPostgresql.repository';

describe('RestaurantPostgresqlRepository', () => {
	let restaurantRepository: RestaurantPostgresqlRepository;
	let restaurantMockCreated: IRestaurant | null = null;

	beforeEach(() => {
		restaurantRepository = new RestaurantPostgresqlRepository();
	});

	it('should create a new restaurant', async () => {
		const restaurantMock: Omit<IRestaurant, 'id'> = {
			nombre: 'TEST RESTAURANT',
			direccion: 'TEST',
			id_propietario: 2,
			telefono: '123456789',
			urlLogo: 'https://www.google.com',
			nit: '123456789',
		};

		restaurantMockCreated = await restaurantRepository.create(restaurantMock);
		expect(restaurantMockCreated).toMatchObject({
			...restaurantMock,
			id: expect.any(Number),
		});
	});

	it('should return a restaurant when it find by id', async () => {
		const restaurant = await restaurantRepository.findById(restaurantMockCreated?.id as number);
		expect(restaurant).toEqual(restaurantMockCreated);
	});
});
