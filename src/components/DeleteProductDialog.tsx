import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import type { Project } from "@/data/projectMockData";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Project | null;
  onConfirmDelete?: (productId: string) => void;
}

const DeleteProductDialog = ({ 
  open, 
  onOpenChange, 
  product, 
  onConfirmDelete 
}: DeleteProductDialogProps) => {
  const handleDelete = () => {
    if (product) {
      onConfirmDelete?.(product.id);
      toast({
        title: "Product Deleted",
        description: `Product "${product.name}" has been deleted successfully.`,
        variant: "destructive",
      });
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{product?.name}"? This action cannot be undone 
            and will remove all associated items, tests, and schedules.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
