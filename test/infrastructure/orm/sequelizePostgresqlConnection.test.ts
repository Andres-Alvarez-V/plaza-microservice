import { Sequelize } from 'sequelize';
import { SequelizePostgresqlConnection } from '../../../src/modules/infrastructure/orm/sequelizePostgresqlConnection';

describe('It checks the connection to the database', () => {
	beforeEach(() => {
		// Restaura la instancia a null antes de cada prueba
		SequelizePostgresqlConnection['instance'] = null;
	});

	it('It should return an instance of Sequelize', () => {
		const sequelizeInstance = SequelizePostgresqlConnection.getInstance();

		expect(sequelizeInstance).toBeInstanceOf(Sequelize);
	});
});
