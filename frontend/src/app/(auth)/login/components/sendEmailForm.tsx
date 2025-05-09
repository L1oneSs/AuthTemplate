"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { useSendEmail } from "../../../../hooks/auth/useSendEmail";

import { SendEmailSchema } from "@/schemas/auth/sendEmailSchema";

export const SendEmailForm = ({
	setIsOpen
}: {
	setIsOpen: (isOpen: boolean) => void;
}) => {
	const [success, setSuccess] = useState(false);

	const form = useForm<z.infer<typeof SendEmailSchema>>({
		resolver: zodResolver(SendEmailSchema),
		defaultValues: {
			email: ""
		}
	});

	const mutation = useSendEmail(() => {
		setSuccess(true);
		setIsOpen(false);
	});

	const onSubmit = (values: z.infer<typeof SendEmailSchema>) => {
		mutation.mutate(values);
	};

	const handleCloseSuccess = () => {
		setSuccess(false);
		setIsOpen(false);
	};

	return (
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
										{...field}
										placeholder="example@mail.com"
										className="pl-10"
										disabled={mutation.isPending}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full bg-black text-white hover:bg-black/90 transition-all duration-300 relative overflow-hidden group"
					disabled={mutation.isPending}
				>
					<span className="relative z-10">
						{mutation.isPending ? "Отправка..." : "Восстановить"}
					</span>
					<span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
				</Button>
			</form>
		</Form>
	);
};
