import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth/authService";

/**
 * Хук для проверки валидности токена сброса пароля
 */
export const useCheckResetPasswordToken = (token: string | null) => {
	return useQuery({
		queryKey: ["reset-password-token", token],
		queryFn: () => {
			if (!token) return Promise.reject("Токен не найден");
			return authService.resetPassword.checkResetPasswordToken(token);
		},
		enabled: !!token,
		retry: false
	});
};
