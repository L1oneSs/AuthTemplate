import { z } from "zod";

import { axiosClassic } from "@/api/interceptors";

import { SendEmailSchema } from "@/schemas/auth/sendEmailSchema";

class AuthResetPasswordService {
	BASE_URL = "/auth/reset-password";

	async resetPassword(values: z.infer<typeof SendEmailSchema>) {
		const response = await axiosClassic.post(this.BASE_URL, {
			email: values.email
		});
		return response;
	}

	async checkResetPasswordToken(token: string) {
		const response = await axiosClassic.get(this.BASE_URL, {
			params: { token }
		});
		return response;
	}

	async newPassword(data: {
		token: string;
		password: string;
		confirm_password: string;
	}) {
		const response = await axiosClassic.put(this.BASE_URL, data);
		return response;
	}
}

export const authResetPasswordService = new AuthResetPasswordService();
