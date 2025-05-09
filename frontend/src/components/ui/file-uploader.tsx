"use client";

import DocumentText from "/public/icons/document-text.svg";
import Paperclip from "/public/icons/paperclip.svg";
import TrashIcon from "/public/icons/trash.svg";
import { FileTextIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import * as React from "react";
import Dropzone, {
	type DropzoneProps,
	type FileRejection
} from "react-dropzone";
import { toast } from "sonner";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useControllableState } from "@/hooks/useControllableState";

import { cn, formatBytes } from "@/lib/utils";

interface ExtendedFile extends File {
	preview: string;
	uploadedAt: Date;
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Value of the uploader.
	 * @type File[]
	 * @default undefined
	 * @example value={files}
	 */
	value?: File[];

	/**
	 * Function to be called when the value changes.
	 * @type (files: File[]) => void
	 * @default undefined
	 * @example onValueChange={(files) => setFiles(files)}
	 */
	onValueChange?: (files: File[]) => void;

	/**
	 * Function to be called when files are uploaded.
	 * @type (files: File[]) => Promise<void>
	 * @default undefined
	 * @example onUpload={(files) => uploadFiles(files)}
	 */
	onUpload?: (files: File[]) => Promise<void>;

	/**
	 * Progress of the uploaded files.
	 * @type Record<string, number> | undefined
	 * @default undefined
	 * @example progresses={{ "file1.png": 50 }}
	 */
	progresses?: Record<string, number>;

	/**
	 * Accepted file types for the uploader.
	 * @type { [key: string]: string[]}
	 * @default
	 * ```ts
	 * { "image/*": [] }
	 * ```
	 * @example accept={["image/png", "image/jpeg"]}
	 */
	accept?: DropzoneProps["accept"];

	/**
	 * Maximum file size for the uploader.
	 * @type number | undefined
	 * @default 1024 * 1024 * 2 // 2MB
	 * @example maxSize={1024 * 1024 * 2} // 2MB
	 */
	maxSize?: DropzoneProps["maxSize"];

	/**
	 * Maximum number of files for the uploader.
	 * @type number | undefined
	 * @default 1
	 * @example maxFileCount={4}
	 */
	maxFileCount?: DropzoneProps["maxFiles"];

	/**
	 * Whether the uploader should accept multiple files.
	 * @type boolean
	 * @default false
	 * @example multiple
	 */
	multiple?: boolean;

	/**
	 * Whether the uploader is disabled.
	 * @type boolean
	 * @default false
	 * @example disabled
	 */
	disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
	const {
		value: valueProp,
		onValueChange,
		onUpload,
		progresses,
		accept = {
			"image/*": []
		},
		maxSize = 1024 * 1024 * 1024,
		maxFileCount = 99,
		multiple = false,
		disabled = false,
		className,
		...dropzoneProps
	} = props;

	const [files, setFiles] = useControllableState({
		prop: valueProp,
		onChange: onValueChange
	});

	const onDrop = React.useCallback(
		(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
				toast.error("Cannot upload more than 1 file at a time");
				return;
			}

			if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
				toast.error(`Cannot upload more than ${maxFileCount} files`);
				return;
			}

			const newFiles = acceptedFiles.map(file =>
				Object.assign(file, {
					preview: URL.createObjectURL(file)
				})
			);

			const updatedFiles = files ? [...files, ...newFiles] : newFiles;

			setFiles(updatedFiles);

			if (rejectedFiles.length > 0) {
				rejectedFiles.forEach(({ file }) => {
					toast.error(`File ${file.name} was rejected`);
				});
			}

			if (
				onUpload &&
				updatedFiles.length > 0 &&
				updatedFiles.length <= maxFileCount
			) {
				const target =
					updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

				toast.promise(onUpload(updatedFiles), {
					loading: `Загрзука ${target}...`,
					success: () => {
						setFiles([]);
						return `${target} загрузка...`;
					},
					error: `Ошибка в загрузке ${target}`
				});
			}
		},

		[files, maxFileCount, multiple, onUpload, setFiles]
	);

	function onRemove(index: number) {
		if (!files) return;
		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);
		onValueChange?.(newFiles);
	}

	// Revoke preview url when component unmounts
	React.useEffect(() => {
		return () => {
			if (!files) return;
			files.forEach(file => {
				if (isFileWithPreview(file)) {
					URL.revokeObjectURL(file.preview);
				}
			});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

	return (
		<div className="relative grid gap-[10px] overflow-hidden">
			<Dropzone
				onDrop={onDrop}
				accept={accept}
				maxSize={maxSize}
				maxFiles={maxFileCount}
				multiple={maxFileCount > 1 || multiple}
				disabled={isDisabled}
			>
				{({ getRootProps, getInputProps, isDragActive }) => (
					<div
						{...getRootProps()}
						className={cn(
							"group relative grid h-[60px] w-full cursor-pointer border border-[#d8282f] border-dashed rounded-[14px] p-[5px] transition",
							"ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
							isDragActive && "border-destructive/50",
							isDisabled && "pointer-events-none opacity-60",
							className
						)}
						{...dropzoneProps}
					>
						<div className="bg-[#f6f6f6] rounded-[10px]">
							<input {...getInputProps()} />
							<div className="grid grid-flow-col grid-cols-[28px_1fr] p-[10px_12px] gap-x-[13px]">
								<Paperclip
									className="size-7 stroke-[#D8282F]"
									aria-hidden="true"
								/>
								<div>
									<p className="text-black text-xs font-medium leading-[14.40px] mb-1">
										Загрузить файл к задаче
									</p>
									<p className="text-[#bcbcbc] text-[9px] font-normal leading-[10.80px]">
										Только файлы формата PNG, JPG и PDF
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</Dropzone>
			{files?.length ? (
				<ScrollArea className="h-fit w-full">
					<div className="flex min-h-10 max-h-[85px] flex-col gap-[5px]">
						{files?.map((file, index) => (
							<FileCard
								key={index}
								file={file}
								onRemove={() => onRemove(index)}
								progress={progresses?.[file.name]}
							/>
						))}
					</div>
				</ScrollArea>
			) : null}
		</div>
	);
}

interface FileCardProps {
	file: File;
	onRemove: () => void;
	progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
	const getFileExtension = (type: string) => {
		if (!type) return "";
		const parts = type.split("/");
		return parts[1] ? parts[1].toUpperCase() : "";
	};

	const getFileNameWithoutExtension = (name: string) => {
		const lastDotIndex = name?.lastIndexOf(".");
		return lastDotIndex === -1 ? name : name?.substring(0, lastDotIndex);
	};

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		const day = date.getDate();
		const monthNames = [
			"янв",
			"фев",
			"мар",
			"апр",
			"май",
			"июн",
			"июл",
			"авг",
			"сен",
			"окт",
			"ноя",
			"дек"
		];
		const month = monthNames[date.getMonth()];
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	};

	return (
		<div className="relative grid grid-flow-col grid-cols-[18px_1fr_12px] gap-[11px] items-center h-10 p-[10px] bg-[#f6f6f6] rounded-[10px]">
			<DocumentText className="size-[18px] grid justify-center items-center" />
			<div>
				{progress ? (
					<Progress value={progress} />
				) : (
					<div>
						<p className="text-black text-[10px] font-medium leading-3">
							{getFileNameWithoutExtension(file.name)}
						</p>
						<div className="text-[#bcbcbc] text-[8px] font-normal leading-[9.60px]">
							Файл {getFileExtension(file.type)} -{" "}
							<span>{formatBytes(file.size)}</span> · загружен{" "}
							{formatDate(file.lastModified)}
						</div>
					</div>
				)}
			</div>
			<TrashIcon
				className="size-3 grid justify-center items-center cursor-pointer stroke-[#bcbcbc]"
				onClick={onRemove}
				aria-hidden="true"
			/>
		</div>
	);
}

function isFileWithPreview(file: File): file is File & { preview: string } {
	return "preview" in file && typeof file.preview === "string";
}

interface FilePreviewProps {
	file: File & { preview: string };
}

function FilePreview({ file }: FilePreviewProps) {
	if (file.type.startsWith("image/")) {
		return (
			<Image
				src={file.preview}
				alt={file.name}
				width={48}
				height={48}
				loading="lazy"
				className="aspect-square shrink-0 rounded-md object-cover"
			/>
		);
	}

	return (
		<FileTextIcon
			className="size-10 text-muted-foreground"
			aria-hidden="true"
		/>
	);
}
