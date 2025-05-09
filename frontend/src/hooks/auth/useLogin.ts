import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { LoginSchema } from "@/schemas/auth/loginSchema";
import { authService } from "@/services/auth/authService";

/**
 * Хук для аутентификации
 */
export const useLogin = () => {
	return useMutation({
		mutationFn: (data: z.infer<typeof LoginSchema>) => authService.login(data),
		onSuccess: data => {
			toast.success(data?.data?.message || "Вход в систему");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Произошла ошибка");
		}
	});
};
