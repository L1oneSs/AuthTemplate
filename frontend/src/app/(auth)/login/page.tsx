"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "./components/form";

export default function LoginPage() {
	return (
		<div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardContent className="p-6">
					<Form />
				</CardContent>
			</Card>
		</div>
	);
}
