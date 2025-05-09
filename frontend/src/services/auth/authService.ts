import { z } from "zod";

import { axiosClassic, axiosWithAuth } from "@/api/interceptors";

import { authResetPasswordService } from "./authResetPasswordService";
import {
	getRefreshToken,
	removeFromStorage,
	saveTokenStorage
} from "./authTokensService";
import { IAuthResponse } from "@/interfaces/IAuth";
import { LoginSchema } from "@/schemas/auth/loginSchema";
import { RegisterSchema } from "@/schemas/auth/register.schema";

class AuthService {
	BASE_URL = "/auth";

	resetPassword = authResetPasswordService;

	async login(data: z.infer<typeof LoginSchema>) {
		const response = await axiosClassic.post(`${this.BASE_URL}/login`, data);

		if (response.data.access_token && response.data.refresh_token) {
			saveTokenStorage(response.data.access_token, response.data.refresh_token);
		}

		return response;
	}

	async register(data: z.infer<typeof RegisterSchema>) {
		// Extract fields needed for backend
		const { email, username, password } = data;

		const response = await axiosClassic.post(`${this.BASE_URL}/register`, {
			email,
			username,
			password
		});

		if (response.data.access_token && response.data.refresh_token) {
			saveTokenStorage(response.data.access_token, response.data.refresh_token);
		}

		return response;
	}

	async getNewToken() {
		const refreshToken = getRefreshToken();
		const response = await axiosClassic.post<IAuthResponse>(
			`${this.BASE_URL}/refresh`,
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`
				}
			}
		);

		if (response.data.access_token && response.data.refresh_token) {
			saveTokenStorage(response.data.access_token, response.data.refresh_token);
		}

		return response;
	}

	async logout() {
		const refreshToken = getRefreshToken();

		const response = await axiosWithAuth.post<boolean>(
			`${this.BASE_URL}/logout`,
			{
				refresh_token: refreshToken
			}
		);

		console.log(response);

		if (response.data) {
			removeFromStorage();
		}

		return response;
	}
}

export const authService = new AuthService();
