import { Metadata } from "next";
import { Toaster } from "sonner";

import { TanstackProvider } from "@/providers/tanstackProvider";

import "./globals.css";

export const metadata: Metadata = {
	title: "Name Your Project",
	description: "Your description here",
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body>
				<TanstackProvider>
					<Toaster />
					<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
						{children}
					</div>
				</TanstackProvider>
			</body>
		</html>
	);
}
