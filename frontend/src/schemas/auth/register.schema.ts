import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string()
    .email({ message: "Введите корректный email адрес" })
    .min(1, { message: "Email обязателен для заполнения" }),
  username: z.string()
    .min(3, { message: "Имя пользователя должно содержать минимум 3 символа" })
    .max(30, { message: "Имя пользователя не должно превышать 30 символов" }),
  password: z.string()
    .min(6, { message: "Пароль должен содержать минимум 6 символов" })
    .max(50, { message: "Пароль не должен превышать 50 символов" }),
  confirmPassword: z.string()
    .min(1, { message: "Подтверждение пароля обязательно" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof RegisterSchema>;
