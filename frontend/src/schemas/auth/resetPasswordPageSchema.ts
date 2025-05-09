import * as z from "zod";

export const ResetPasswordPageSchema = z
	.object({
		token: z.string(),
		password: z
			.string()
			.min(9, { message: "Пароль должен содержать не менее 9 символов" })
			.regex(/[A-Z]/, {
				message: "Пароль должен содержать хотя бы одну заглавную букву"
			})
			.regex(/[a-z]/, {
				message: "Пароль должен содержать хотя бы одну строчную букву"
			})
			.regex(/[0-9]/, {
				message: "Пароль должен содержать хотя бы одну цифру"
			})
			.regex(/[^A-Za-z0-9]/, {
				message: "Пароль должен содержать хотя бы один специальный символ"
			})
			.regex(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, {
				message:
					"Пароль может содержать только латинские буквы, цифры и специальные символы"
			}),
		confirm_password: z.string()
	})
	.refine(data => data.password === data.confirm_password, {
		message: "Пароль и его подтверждение должны совпадать",
		path: ["confirm_password"]
	});
