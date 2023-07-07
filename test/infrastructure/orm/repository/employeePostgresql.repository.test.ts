import { IEmployee } from '../../../../src/modules/domain/entities/employee';
import { EmployeePostgresqlRepository } from '../../../../src/modules/infrastructure/orm/repository/employeePostgresql.repository';

describe('EmployeePostgresqlRepository', () => {
	let repository: EmployeePostgresqlRepository;
	// let employeeMock: IEmployee | null = null;

	beforeEach(() => {
		// Crea una instancia de la clase EmployeePostgresqlRepository antes de cada prueba
		repository = new EmployeePostgresqlRepository();
	});

	it('should create a new employee. "id_empleado" is primary key', async () => {
		const employeeMockTemp: IEmployee = {
			id_empleado: 1,
			id_restaurante: 1,
		};

		const employee = await repository.create(employeeMockTemp);
		// employeeMock = employee;
		expect(employee).toMatchObject({
			...employeeMockTemp,
		});
	});
});
