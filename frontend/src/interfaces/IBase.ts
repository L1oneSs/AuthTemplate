import { IRole } from "./IAuth";

export interface IBase {
	deleted: boolean;
	id: number;
	created_at: string;
	updated_at: string;
}

export interface IUser extends IBase {
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	patronymic: string;
	is_active: boolean;
	last_login: string;
	roles: IRole[];
}
