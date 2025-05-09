"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, FolderX, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function NotFound() {
	const [language, setLanguage] = useState<"ru" | "en" | "zh">("ru");

	const texts = {
		ru: {
			title: "404",
			heading: "Страница не найдена",
			description:
				"Похоже, страница, которую вы ищете, не существует или была перемещена.",
			backButton: "Вернуться на главную"
		},
		en: {
			title: "404",
			heading: "Page Not Found",
			description:
				"It looks like the page you're looking for doesn't exist or has been moved.",
			backButton: "Return to Home"
		},
		zh: {
			title: "404",
			heading: "页面未找到",
			description: "您要查找的页面似乎不存在或已被移动。",
			backButton: "返回主页"
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
			<div className="absolute top-4 right-4 sm:top-8 sm:right-8">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="flex items-center gap-2"
						>
							<Globe className="h-4 w-4" />
							{language === "ru"
								? "Русский"
								: language === "en"
									? "English"
									: "中文"}
							<ChevronDown className="h-3 w-3 opacity-50" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setLanguage("ru")}>
							RU Русский
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setLanguage("en")}>
							EN English
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setLanguage("zh")}>
							CN 中文
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-2xl"
			>
				<Card className="bg-white dark:bg-slate-900 shadow-xl border-0 overflow-hidden">
					<div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
					<CardContent className="p-8 md:p-12">
						<motion.div
							key={language} // Заставляет перезапускать анимацию при смене языка
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col items-center"
						>
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.5 }}
								className="mb-6 text-red-500 dark:text-red-400"
							>
								<FolderX size={86} />
							</motion.div>

							<h1 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
								{texts[language].title}
							</h1>

							<h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
								{texts[language].heading}
							</h2>

							<div className="flex items-center justify-center mb-8">
								<div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"></div>
								<div className="px-3">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
											fill="currentColor"
											className="text-red-500"
										/>
									</svg>
								</div>
								<div className="h-px w-16 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
							</div>

							<p className="text-gray-700 dark:text-gray-300 text-center mb-8 max-w-md">
								{texts[language].description}
							</p>

							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									asChild
									className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 transition-all px-8 py-6 rounded-lg text-lg gap-2"
								>
									<Link href="/">
										<ArrowLeft size={20} />
										{texts[language].backButton}
									</Link>
								</Button>
							</motion.div>
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
