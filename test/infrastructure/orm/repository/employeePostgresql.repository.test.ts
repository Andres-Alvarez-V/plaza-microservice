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
					findAll: jest.fn().mockResolvedValue([]),
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

	describe('getEmployeesByRestaurantId', () => {
		it('should get employees by restaurant ID', async () => {
			const mockResolved = [
				{
					id_empleado: 1,
					id_restaurante: 1,
				},
				{
					id_empleado: 2,
					id_restaurante: 1,
				},
			];
			const findAllMockResolved = [
				{
					toJSON: jest.fn().mockReturnValue(mockResolved[0]),
				},
				{
					toJSON: jest.fn().mockReturnValue(mockResolved[1]),
				},
			];

			const findAllMock = sequelizeMock.models[EMPLOYEE_POSTGRESQL_TABLE].findAll;
			findAllMock.mockResolvedValue(findAllMockResolved);
			const restaurantId = 1;
			const employees = await repository.getEmployeesByRestaurantId(restaurantId);
			expect(employees).toMatchObject(mockResolved);
			expect(findAllMock).toHaveBeenCalledWith({
				where: {
					id_restaurante: restaurantId,
				},
			});
		});
	});
});
