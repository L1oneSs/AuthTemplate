import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { SendEmailSchema } from "@/schemas/auth/sendEmailSchema";
import { authService } from "@/services/auth/authService";

/**
 * Хук для отправки на email ссылки
 */
export const useSendEmail = (onSuccess?: () => void, onError?: () => void) => {
	return useMutation({
		mutationFn: (data: z.infer<typeof SendEmailSchema>) =>
			authService.resetPassword.resetPassword(data),
		onSuccess: data => {
			toast.success(data?.data?.message || "Проверьте почту");
			console.log(data.data.message);
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			console.log(error.response?.data?.message || "Произошла ошибка");
			toast.error(error.response?.data?.message || "Произошла ошибка");
			if (onError) onError();
		}
	});
};
