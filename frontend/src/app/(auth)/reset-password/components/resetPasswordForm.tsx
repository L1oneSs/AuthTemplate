"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useCheckResetPasswordToken } from "../../../../hooks/auth/useCheckResetPasswordToken";
import { useResetPassword } from "../../../../hooks/auth/useResetPassword";

import { ResetPasswordPageSchema } from "@/schemas/auth/resetPasswordPageSchema";

export const ResetPasswordForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("type") ? searchParams.get("token") : null;
	const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const tokenQuery = useCheckResetPasswordToken(token);
	const resetPasswordMutation = useResetPassword();

	useEffect(() => {
		if (tokenQuery.isSuccess) {
			setIsTokenValid(true);
		} else if (tokenQuery.isError) {
			setIsTokenValid(false);
		}
	}, [tokenQuery.isSuccess, tokenQuery.isError]);

	const form = useForm<z.infer<typeof ResetPasswordPageSchema>>({
		resolver: zodResolver(ResetPasswordPageSchema),
		defaultValues: {
			token: token || "",
			password: "",
			confirm_password: ""
		}
	});

	const onSubmit = (values: z.infer<typeof ResetPasswordPageSchema>) => {
		resetPasswordMutation.mutate(values);
	};

	if (tokenQuery.isPending) {
		return <div className="text-center">Проверка токена...</div>;
	}

	if (isTokenValid === false) {
		return (
			<div className="text-center">
				<div className="text-red-500 mb-4">
					Недействительный или истекший токен для сброса пароля
				</div>
				<Button
					className="bg-black text-white hover:bg-black/90 transition-all duration-300"
					onClick={() => router.push("/login")}
				>
					Вернуться на страницу входа
				</Button>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-center text-xl font-semibold mb-4">
				Создание нового пароля
			</h2>
			<p className="text-center text-sm text-muted-foreground mb-6">
				Пожалуйста, введите новый пароль для вашей учетной записи
			</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<input
						type="hidden"
						{...form.register("token")}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Новый пароль</FormLabel>
								<FormControl>
									<div className="relative">
										<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											className="pl-10"
											disabled={resetPasswordMutation.isPending}
											{...field}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-1 top-1 h-8 w-8"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
											<span className="sr-only">
												{showPassword ? "Скрыть пароль" : "Показать пароль"}
											</span>
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirm_password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Подтверждение пароля</FormLabel>
								<FormControl>
									<div className="relative">
										<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type={showConfirmPassword ? "text" : "password"}
											placeholder="••••••••"
											className="pl-10"
											disabled={resetPasswordMutation.isPending}
											{...field}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-1 top-1 h-8 w-8"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
											<span className="sr-only">
												{showConfirmPassword
													? "Скрыть пароль"
													: "Показать пароль"}
											</span>
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full bg-black text-white hover:bg-black/90 transition-all duration-300 relative overflow-hidden group"
						disabled={resetPasswordMutation.isPending}
					>
						<span className="relative z-10">
							{resetPasswordMutation.isPending
								? "Сохранение..."
								: "Сохранить новый пароль"}
						</span>
						<span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
					</Button>
				</form>
			</Form>
		</div>
	);
};
