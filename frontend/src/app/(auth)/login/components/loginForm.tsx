"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

import { useLogin } from "../../../../hooks/auth/useLogin";
import { LoginSchema } from "../../../../schemas/auth/loginSchema";

import { SendEmailDialog } from "./sendEmailDialog";

interface LoginFormProps {
	onRegisterClick: () => void;
}

export function LoginForm({ onRegisterClick }: LoginFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const { mutateAsync, isPending } = useLogin();

	const form = useForm<LoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const onSubmit = async (data: LoginSchema) => {
		try {
			await mutateAsync(data);
			toast("Вы успешно авторизованы в системе");
			router.push("/");
		} catch (error) {
			toast("Неверный email или пароль");
		}
	};

	return (
		<div>
			<div className="text-center mb-6">
				<h1 className="text-2xl font-semibold tracking-tight">
					Вход в систему
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Введите свои данные для входа
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<div className="relative">
										<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="example@mail.com"
											className="pl-10"
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Пароль</FormLabel>
								<FormControl>
									<div className="relative">
										<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											className="pl-10"
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

					<Button
						type="submit"
						className="w-full bg-black hover:bg-black/80"
						disabled={isPending}
					>
						{isPending ? "Вход..." : "Войти"}
					</Button>
				</form>
			</Form>

			<div className="mt-6 text-center">
				<p className="text-sm text-muted-foreground">
					Еще нет аккаунта?{" "}
					<Button
						variant="link"
						className="p-0 h-auto"
						onClick={onRegisterClick}
					>
						Зарегистрироваться
					</Button>
				</p>
			</div>
			<div className="mt-4 flex justify-center">
				<SendEmailDialog />
			</div>
		</div>
	);
}
