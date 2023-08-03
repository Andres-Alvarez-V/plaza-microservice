import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { setUpModels } from './models';

dotenv.config();

export class SequelizePostgresqlConnection {
	private static instance: Sequelize | null = null;

	static getInstance(): Sequelize {
		if (!SequelizePostgresqlConnection.instance) {
			SequelizePostgresqlConnection.instance = new Sequelize({
				database: process.env.DB_NAME,
				username: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				host: process.env.DB_HOST,
				port: process.env.DB_PORT as unknown as number,
				dialect: 'postgres',
				logging: true,
			});
			setUpModels(SequelizePostgresqlConnection.instance);
			if (this.instance) {
				this.instance.sync();
			}
		}

		return SequelizePostgresqlConnection.instance;
	}
}
