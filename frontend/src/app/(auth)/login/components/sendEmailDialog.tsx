"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";

import { SendEmailForm } from "./sendEmailForm";

export const SendEmailDialog = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger asChild>
				<Button
					variant="link"
					className="p-0 h-auto text-muted-foreground hover:text-black transition-colors"
					onClick={() => setIsOpen(true)}
				>
					Восстановить пароль
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white border-0 shadow-lg p-6 max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-black">
						Восстановить пароль
					</DialogTitle>
				</DialogHeader>
				<p className="mt-4 mb-5 text-muted-foreground text-sm">
					Введите адрес электронной почты, на который вы зарегистрировали
					аккаунт
				</p>
				<SendEmailForm setIsOpen={setIsOpen} />
			</DialogContent>
		</Dialog>
	);
};
