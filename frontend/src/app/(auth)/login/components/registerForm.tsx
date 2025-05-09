"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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

import { useRegister } from "../../../../hooks/auth/useRegister";
import { RegisterSchema } from "../../../../schemas/auth/register.schema";

interface RegisterFormProps {
	onLoginClick: () => void;
}

export function RegisterForm({ onLoginClick }: RegisterFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { mutateAsync, isPending } = useRegister();

	const form = useForm<RegisterSchema>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: ""
		},
		mode: "onChange"
	});

	const onSubmit = async (data: RegisterSchema) => {
		try {
			await mutateAsync(data);
			toast("Вы успешно зарегистрированы в системе");
			onLoginClick(); 
		} catch (error: any) {
			toast("Произошла ошибка при регистрации");
		}
	};

	return (
		<div>
			<div className="text-center mb-6">
				<h1 className="text-2xl font-semibold tracking-tight">Регистрация</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Создайте новую учетную запись
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя пользователя</FormLabel>
								<FormControl>
									<div className="relative">
										<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="username"
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

					<FormField
						control={form.control}
						name="confirmPassword"
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
											onPaste={e => {
												e.preventDefault();
												toast(
													"Вставка текста в поле подтверждения пароля запрещена"
												);
												return false;
											}}
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
						className="w-full bg-black hover:bg-black/80"
						disabled={isPending}
					>
						{isPending ? "Регистрация..." : "Зарегистрироваться"}
					</Button>
				</form>
			</Form>

			<div className="mt-6 text-center">
				<p className="text-sm text-muted-foreground">
					Уже есть аккаунт?{" "}
					<Button
						variant="link"
						className="p-0 h-auto"
						onClick={onLoginClick}
					>
						Войти
					</Button>
				</p>
			</div>
		</div>
	);
}
