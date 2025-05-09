import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string()
    .email({ message: "Введите корректный email адрес" })
    .min(1, { message: "Email обязателен для заполнения" }),
  password: z.string()
    .min(6, { message: "Пароль должен содержать минимум 6 символов" })
    .max(50, { message: "Пароль не должен превышать 50 символов" }),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
