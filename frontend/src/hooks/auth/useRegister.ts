import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { RegisterSchema } from "../../schemas/auth/register.schema";

import { authService } from "@/services/auth/authService";

/**
 * Хук для аутентификации
 */
export const useRegister = () => {
	return useMutation({
		mutationFn: (data: z.infer<typeof RegisterSchema>) =>
			authService.register(data),
		onSuccess: data => {
			toast.success(data?.data?.message || "Вы успешно зарегистрировались!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Произошла ошибка");
		}
	});
};
