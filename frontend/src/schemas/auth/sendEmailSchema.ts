import * as z from "zod";

export const SendEmailSchema = z.object({
	email: z.string({
		required_error: "Введите свой email!"
	})
});
