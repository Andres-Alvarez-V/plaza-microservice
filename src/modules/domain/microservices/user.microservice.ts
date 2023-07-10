export interface IUserMicroservice {
	getUserEmail(id: number): Promise<string>;
	getUserRoleId(id: number): Promise<number>;
}
