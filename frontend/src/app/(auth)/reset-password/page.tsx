import { Suspense } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { ResetPasswordForm } from "./components/resetPasswordForm";

export default function ResetPasswordPage() {
	return (
		<div className="flex justify-center items-center min-h-screen bg-black p-4">
			<Card className="w-full max-w-md shadow-lg bg-white border-0">
				<CardHeader className="text-center p-6">
					<h1 className="text-2xl font-semibold tracking-tight">
						Сброс пароля
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Введите новый пароль для вашей учетной записи
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<Suspense fallback={<div className="text-center">Загрузка...</div>}>
						<ResetPasswordForm />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
