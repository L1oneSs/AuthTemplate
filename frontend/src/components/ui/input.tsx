import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		if (type === "number") {
			// For number inputs, use NumericFormat directly
			return (
				<NumericFormat
					thousandSeparator=" "
					valueIsNumericString
					getInputRef={ref}
					className={cn(
						"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					// Only pass compatible props
					placeholder={props.placeholder}
					disabled={props.disabled}
					name={props.name}
					id={props.id}
					onValueChange={values => {
						// Create a synthetic event to simulate onChange
						if (props.onChange) {
							const event = {
								target: {
									name: props.name,
									value: values.value
								}
							} as React.ChangeEvent<HTMLInputElement>;
							props.onChange(event);
						}
					}}
					value={props.value as string | number | undefined}
				/>
			);
		}

		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

const TransparentInput = React.forwardRef<
	HTMLInputElement,
	InputProps & {
		label?: string;
		icon?: any;
		isBorder?: boolean;
		labelBlack?: boolean;
	}
>(
	(
		{
			className,
			type,
			label,
			icon,
			isBorder = true,
			labelBlack,
			disabled,
			onChange,
			value,
			...props
		},
		ref
	) => {
		const internalRef = React.useRef<HTMLInputElement | null>(null); // локальный реф
		const [isFilled, setIsFilled] = React.useState(false);

		// Forward реф для использования с register
		React.useImperativeHandle(
			ref,
			() => internalRef.current as HTMLInputElement
		);

		// Следим за полем через ref и устанавливаем isFilled
		React.useEffect(() => {
			if (internalRef.current?.value) {
				setIsFilled(!!internalRef.current.value); // Устанавливаем true, если значение в поле присутствует
			}
		}, []);

		// Для работы с react-hook-form и defaultValues
		React.useEffect(() => {
			// Если есть значение в props и нет значения в ref, устанавливаем значение в ref
			if (value !== undefined && internalRef.current && !internalRef.current.value) {
				// Для number типа, устанавливаем значение в ref
				if (type === "number") {
					// Эмулируем событие изменения для обновления состояния
					const event = {
						target: {
							name: props.name,
							value: value
						}
					} as React.ChangeEvent<HTMLInputElement>;
					handleInputChange(event);
				}
			}
		}, [value, type, props.name]);

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setIsFilled(!!e.target.value); // Обновляем isFilled при изменении значения

			// Вызываем пользовательский onChange, если он передан
			if (onChange) {
				onChange(e);
			}
		};

		console.log(type);

		return (
			<div
				className={cn(
					"group grid grid-flow-col items-center w-full ",
					isBorder
						? "h-11 p-[7px_10px_5px] border bg-white rounded-[10px] border-[#eeeeee] hover:border-[#dbdbdb]"
						: "border-none bg-transparent",
					disabled && "bg-[#eeeeee]",
					icon ? "grid-cols-[1fr_auto]" : "",
					className
				)}
			>
				<div className="grid grid-flow-row gap-1 w-full">
					{label && (
						<div
							className={cn(
								"h-3 text-[10px] font-normal leading-3",
								isFilled ? "text-[#bcbcbc]" : "text-black",
								labelBlack && "text-black"
							)}
						>
							{label}
						</div>
					)}
					{type === "number" ? (
						<NumericFormat
							thousandSeparator=" "
							valueIsNumericString
							getInputRef={internalRef}
							value={value as string | number | undefined}
							onValueChange={values => {
								// Update isFilled state
								setIsFilled(!!values.value);

								// Create a synthetic event to simulate onChange
								if (onChange) {
									const event = {
										target: {
											name: props.name,
											value: values.value
										}
									} as React.ChangeEvent<HTMLInputElement>;
									onChange(event);
								}
							}}
							className={cn(
								"w-full placeholder:text-[#bcbcbc] text-black text-xs font-normal bg-transparent focus:outline-none ",
								labelBlack && "text-[#bcbcbc] placeholder:text-[#bcbcbc]",
								label ? "h-4" : "h-3"
							)}
							disabled={disabled}
							placeholder={props.placeholder}
							name={props.name}
							id={props.id}
						/>
					) : (
						<input
							type={type}
							ref={internalRef} // Локальный реф
							value={value}
							onChange={handleInputChange} // обработчик изменений
							disabled={disabled}
							className={cn(
								"w-full placeholder:text-[#bcbcbc] text-black text-xs font-normal bg-transparent focus:outline-none ",
								labelBlack && "text-[#bcbcbc] placeholder:text-[#bcbcbc]",
								label ? "h-4" : "h-3"
							)}
							{...props}
						/>
					)}
				</div>
				{icon && <div className="grid justify-self-end">{icon}</div>}
			</div>
		);
	}
);
TransparentInput.displayName = "TransparentInput";

const TransparentPasswordInput = React.forwardRef<
	HTMLInputElement,
	InputProps & {
		label?: string;
		labelBlack?: boolean;
		isDisabled?: boolean;
		icon?: any;
		toggleIcon?: React.ReactNode; // иконка переключения типа пароля
	}
>(
	(
		{
			className,
			label,
			labelBlack,
			isDisabled = false,
			icon,
			toggleIcon,
			onChange,
			...props
		},
		ref
	) => {
		const [isFilled, setIsFilled] = React.useState(false);
		const [type, setType] = React.useState("password");

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setIsFilled(!!e.target.value);

			if (onChange) {
				onChange(e);
			}
		};

		const handleToggle = () => {
			setType(prev => (prev === "password" ? "text" : "password"));
		};

		return (
			<div
				className={cn(
					"group grid grid-flow-col items-center w-full h-11 p-[7px_10px_5px] bg-white rounded-[10px] border border-[#eeeeee] hover:border-[#dbdbdb]",
					isDisabled && "bg-[#f6f6f6]",
					icon ? "grid-cols-[1fr_auto]" : "",
					className
				)}
			>
				<div className="grid grid-flow-row gap-1 w-full">
					{label && (
						<div
							className={cn(
								"h-3 text-[10px] font-normal leading-3",
								isFilled ? "text-[#bcbcbc]" : "text-black",
								labelBlack && "text-black"
							)}
						>
							{label}
						</div>
					)}
					<input
						type={type}
						ref={ref}
						onChange={handleInputChange}
						className={cn(
							"w-full h-4 placeholder:text-[#bcbcbc] text-black text-xs font-normal bg-transparent focus:outline-none disabled:bg-transparent",
							labelBlack && "text-[#bcbcbc] placeholder:text-[#bcbcbc]"
						)}
						{...props}
					/>
				</div>
				<div
					className="grid justify-self-end cursor-pointer"
					onClick={handleToggle}
				>
					{toggleIcon}
				</div>
			</div>
		);
	}
);

TransparentPasswordInput.displayName = "TransparentPasswordInput";

export { Input, TransparentInput, TransparentPasswordInput };
