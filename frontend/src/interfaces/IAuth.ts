import { IBase } from "./IBase";

export interface IAuthForm {
	email: string;
	password: string;
}

export interface IUser {
	id: string;
	email: string;
	phone_number: string;
	username: string;
	first_name: string;
	last_name: string;
	patronymic: string;
	avatar?: string;
}

export interface IAuthResponse {
	user: IUser;
	access_token: string;
	refresh_token: string;
}

export interface IRole extends IBase {
	name: string;
	description: string;
}


