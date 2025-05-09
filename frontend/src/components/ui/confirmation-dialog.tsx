import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
	open,
	title,
	description,
	onConfirm,
	onCancel,
  }: ConfirmationDialogProps) => {
	return (
	  <Dialog open={open} onOpenChange={onCancel}>
		<DialogContent className="w-[370px]">
		  <DialogHeader>
			<DialogTitle>{title}</DialogTitle>
		  </DialogHeader>
		  <p className="text-sm text-muted-foreground mb-4">{description}</p>
		  <div className="flex gap-2.5 items-center">
		 	 <Button
				variant="new"
				className="w-24s" onClick={onCancel}
			>
				Отменить
			</Button>
			<Button variant="delete" onClick={onConfirm}>
			  Подтвердить
			</Button>
		  </div>
		</DialogContent>
	  </Dialog>
	);
  };