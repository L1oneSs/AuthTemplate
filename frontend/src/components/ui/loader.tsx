import LogoIcon from "/public/logo.svg";
import { motion } from "framer-motion";

export default function Loader({ isLoading }: { isLoading: boolean }) {
	if (!isLoading) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
			<div className="flex items-center justify-center">
				<motion.div
					className="size-32"
					animate={{
						scale: [1, 1.1, 1],
						rotate: [0, -15, 0, 15]
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<LogoIcon className="size-32" />
				</motion.div>
			</div>
		</div>
	);
}
