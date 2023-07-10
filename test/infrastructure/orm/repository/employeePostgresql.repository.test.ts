import { IEmployee } from '../../../../src/modules/domain/entities/employee';
import { EMPLOYEE_POSTGRESQL_TABLE } from '../../../../src/modules/infrastructure/orm/models/EmployeePostgresql.model';
import { EmployeePostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/employeePostgresql.repository';
import { SequelizePostgresqlConnection } from '../../../../src/modules/infrastructure/orm/sequelizePostgresqlConnection';

jest.mock('../../../../src/modules/infrastructure/orm/sequelizePostgresqlConnection');
describe('EmployeePostgresqlRepository', () => {
	let repository: EmployeePostgresqlRepository;
	const employeeDataMock: IEmployee = {
		id_empleado: 1,
		id_restaurante: 1,
	};
	let sequelizeMock: any;
	beforeEach(() => {
		sequelizeMock = {
			models: {
				[EMPLOYEE_POSTGRESQL_TABLE]: {
					create: jest.fn().mockResolvedValue({
						toJSON: jest.fn().mockReturnValue({
							...employeeDataMock,
						}),
					}),
					findByPk: jest.fn().mockResolvedValue({
						toJSON: jest.fn().mockReturnValue({
							...employeeDataMock,
						}),
					}),
				},
			},
		};
		(SequelizePostgresqlConnection.getInstance as any).mockReturnValue(sequelizeMock);
		repository = new EmployeePostgresqlRepository();
	});
	describe('create', () => {
		it('should create a new employee. "id_empleado" is primary key', async () => {
			const employee = await repository.create(employeeDataMock);
			expect(employee).toMatchObject({
				...employeeDataMock,
			});
		});
	});

	describe('getEmployeeByEmployeeId', () => {
		it('should get an employee by employee ID', async () => {
			const employeeId = 1;
			const employee = await repository.getEmployeeByEmployeeId(employeeId);
			expect(employee).toMatchObject({
				...employeeDataMock,
			});
		});
	});
});
