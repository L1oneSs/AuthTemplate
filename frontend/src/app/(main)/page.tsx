"use client";

import { motion } from "framer-motion";
import { ChevronDown, Github, Globe } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Home() {
	const [language, setLanguage] = useState<"ru" | "en" | "zh">("ru");

	const content = {
		ru: {
			greeting: "Привет!",
			description: "Это главная страница.",
			success: "Если ты всё правильно настроил и видишь меня, то ты молодец.",
			joke: "Можешь меня удалить, я не обижусь!",
			button: "Нажми меня",
			languageName: "Русский",
			buttonClicked: "Кнопка нажата!"
		},
		en: {
			greeting: "Hello!",
			description: "This is the main page.",
			success:
				"If you've set everything up correctly and can see me, well done!",
			joke: "You can delete me, I won't be offended!",
			button: "Click me",
			languageName: "English",
			buttonClicked: "Button clicked!"
		},
		zh: {
			greeting: "你好！",
			description: "这是主页。",
			success: "如果你已经正确设置并且能看到我，做得好！",
			joke: "你可以删除我，我不会生气！",
			button: "点我",
			languageName: "中文",
			buttonClicked: "按钮已点击！"
		}
	};

	const [buttonText, setButtonText] = useState<string>(
		content[language].button
	);

	const handleButtonClick = () => {
		setButtonText(content[language].buttonClicked);
		setTimeout(() => {
			setButtonText(content[language].button);
		}, 2000);
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
				className="w-full max-w-3xl"
			>
				<Card className="bg-white dark:bg-slate-900 shadow-xl border-0 overflow-hidden">
					<div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
					<CardContent className="p-8 md:p-12">
						<motion.div
							key={language} // This forces re-animation when language changes
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
								{content[language].greeting}
							</h1>

							<p className="text-lg md:text-xl text-center mb-6 dark:text-gray-300">
								{content[language].description}
							</p>

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
											className="text-cyan-500"
										/>
									</svg>
								</div>
								<div className="h-px w-16 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
							</div>

							<p className="text-gray-700 dark:text-gray-300 text-center mb-3">
								{content[language].success}
							</p>

							<p className="text-gray-500 italic text-center mb-8">
								{content[language].joke}
							</p>

							<div className="flex justify-center">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										onClick={handleButtonClick}
										className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all px-8 py-6 rounded-lg text-lg"
									>
										{buttonText}
									</Button>
								</motion.div>
							</div>
						</motion.div>
					</CardContent>
				</Card>

				<footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
					<div className="flex justify-center items-center gap-2 mb-2">
						<Github size={16} />
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
						>
							GitHub
						</a>
					</div>
					<p>© {new Date().getFullYear()} L1ones</p>
				</footer>
			</motion.div>
		</div>
	);
}
