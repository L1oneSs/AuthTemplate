import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { ResetPasswordPageSchema } from "@/schemas/auth/resetPasswordPageSchema";
import { authService } from "@/services/auth/authService";

export function useResetPassword() {
	const router = useRouter();

	return useMutation({
		mutationKey: ["new-password"],
		mutationFn: (data: z.infer<typeof ResetPasswordPageSchema>) =>
			authService.resetPassword.newPassword({
				token: data.token,
				password: data.password,
				confirm_password: data.confirm_password
			}),
		onSuccess: data => {
			toast.success(data?.data?.message || "Пароль успешно изменен");
			router.push("/login");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Произошла ошибка");
		}
	});
}
